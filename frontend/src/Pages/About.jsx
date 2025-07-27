import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Welcome to Forever, your go-to destination for trendy, affordable fashion! We believe style should be accessible to everyone, which is why we curate a diverse collection of clothing, accessories, and footwear for men and women. Our mission is to inspire confidence through fashion while prioritizing quality, sustainability, and exceptional customer service.</p>
          <p>Founded in 2020, we're passionate about blending the latest trends with timeless classics. Whether you're dressing up or keeping it casual, we've got you covered. Shop with us for a seamless, stylish experience—because fashion is for everyone!</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>"Empowering your style with affordable, trendy fashion—delivered fast, sustainably, and joyfully. Shop confidently, look effortlessly."</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className=' text-gray-600'>Rigorous testing for flawless style and durability. Guaranteed.</p>
        </div>
        
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className=' text-gray-600'>Shop anytime, anywhere—fast shipping, easy returns, seamless experience</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className=' text-gray-600'>Always here for you—personalized, prompt, and hassle-free support.</p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About
