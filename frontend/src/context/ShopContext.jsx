import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext({
  products: [],
  currency: "$",
  delivery_fee: 0,
  search: "",
  setSearch: () => {},
  showSearch: false,
  setShowSearch: () => {},
  cartItems: {},
  addToCart: () => {},
  setCartItems: () => {},
  getCartCount: () => 0,
  updateQuantity: () => {},
  getCartAmount: () => 0,
  navigate: () => {},
  backendUrl: "",
  token: "",
  setToken: () => {},
});

const ShopContextProvider = ({ children }) => {
  const [currency] = useState("$");
  const [delivery_fee] = useState(10);
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (token) {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login to add to cart.");
        return;
      }

      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { userId, itemId, size },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const productId in cartItems) {
      const product = products.find((p) => p._id === productId);

      if (!product) continue; // Skip if product not found

      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];

        if (quantity > 0) {
          totalAmount += product.price * quantity;
        }
      }
    }

    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      // 🔧 Disable cache to prevent 304 Not Modified
      const response = await axios.get(
        `${backendUrl}/api/product?page=1&limit=1000`
      );

      // 🔍 Log for debugging
      console.log("API response:", response);
      console.log("API response data:", response.data);

      // ✅ Handle the success response
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Product fetch error:", error.message);
      toast.error("Failed to load products");
    }
  };

  const getUserCart = async (authToken) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!token && savedToken) {
      setToken(savedToken);
      getUserCart(savedToken);
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

// PropTypes validation
ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
