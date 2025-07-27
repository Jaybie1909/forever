import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem'; // Make sure to import

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (products?.length > 0) {
            setLatestProducts(products.slice(0, 10));
            setIsLoading(false);
        }
    }, [products]); // Added products to dependency array

    if (isLoading) return <div className="text-center py-20">Loading...</div>;
    if (!latestProducts.length) return <div className="text-center py-20">No products found</div>;

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'LATEST'} text2={'COLLECTIONS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus voluptates voluptatem itaque praesentium sunt. Mollitia.
                </p>
            </div>

            {/* Rendering Products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {latestProducts.map((item) => (
                    <ProductItem 
                        key={item._id} // Use unique ID instead of index
                        id={item._id} 
                        image={item.image} 
                        name={item.name} 
                        price={item.price} 
                    />
                ))}
            </div>
        </div>
    )
}

export default LatestCollection