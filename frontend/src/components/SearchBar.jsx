import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import PropTypes from 'prop-types' // Add prop-types package
import { useLocation } from 'react-router-dom'

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
    const [visible, setVisible] = useState(false)
    const  location = useLocation();

    useEffect(()=>{
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else {
            setVisible(false)
        }
    },[location])

    if (!showSearch || !visible) return null

    return (
        <div className='border-t border-b bg-gray-50 text-center'>
            <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='flex-1 outline-none bg-inherit text-sm'
                    type="text"
                    placeholder='Search products...'
                    aria-label="Search products"
                />
                <button 
                    type="submit"
                    aria-label="Search"
                    className="focus:outline-none"
                >
                    <img className='w-4' src={assets.search_icon} alt="Search icon" />
                </button>
            </div>
            <button
                onClick={() => setShowSearch(false)}
                aria-label="Close search"
                className="inline p-2 focus:outline-none"
            >
                <img className='w-3' src={assets.cross_icon} alt="Close search" />
            </button>
        </div>
    )
}

// Add prop type validation
SearchBar.propTypes = {
    search: PropTypes.string,
    setSearch: PropTypes.func,
    showSearch: PropTypes.bool,
    setShowSearch: PropTypes.func
}

export default SearchBar