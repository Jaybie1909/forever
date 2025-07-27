import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem';
import Title from './Title'; // Added missing import

const MAX_BESTSELLERS = 5; // Define constant for magic number

const BestSeller = () => {
    const { products = [] } = useContext(ShopContext); // Default empty array
    const [bestSeller, setBestSeller] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (products.length > 0) {
            const bestProducts = products
                .filter(item => item.bestseller) // Verify property exists
                .slice(0, MAX_BESTSELLERS);
            setBestSeller(bestProducts);
            setIsLoading(false);
        }
    }, [products]); // Added dependency

    if (isLoading) return <div className="text-center py-20">Loading...</div>;
    if (!bestSeller.length) return <div className="text-center py-20">No best sellers found</div>;

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={'SELLERS'}/>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, voluptatum.
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {bestSeller.map((item) => (
                    <ProductItem 
                        key={item._id}
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

export default BestSeller;