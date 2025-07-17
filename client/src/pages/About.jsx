import React from 'react';

export default function About() {
  return (
    <div className='bg-gradient-to-b from-white via-slate-50 to-slate-100 min-h-screen py-20 px-4'>
      <div className='max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-12 transition-all duration-300'>
        <h1 className='text-4xl sm:text-5xl font-extrabold text-slate-800 mb-6 text-center'>
          About <span className='text-indigo-600'>Easy Homes</span>
        </h1>

        <p className='mb-6 text-lg leading-relaxed text-slate-700 text-justify'>
          Welcome to <span className='font-semibold text-slate-900'>Easy Homes</span>, your trusted online platform for renting, selling, and discovering residential properties. Our mission is to simplify the entire real estate experience by connecting homeowners and property seekers through a fast, reliable, and user-friendly interface.
        </p>

        <p className='mb-6 text-lg leading-relaxed text-slate-700 text-justify'>
          Whether you want to rent out your home, sell a property, or find a new place to live, Easy Homes provides a one-stop solution tailored to your needs. Our platform allows users to create listings with detailed descriptions, images, pricing, and location filters—making it easier than ever to reach the right audience.
        </p>

        <p className='mb-6 text-lg leading-relaxed text-slate-700 text-justify'>
          At <span className='font-semibold text-slate-900'>EasyHomes</span>, we believe in <span className='text-indigo-600 font-medium'>transparency</span>, <span className='text-indigo-600 font-medium'>convenience</span>, and <span className='text-indigo-600 font-medium'>trust</span>. That's why we offer features like verified listings, responsive design, search by location or price, and real-time updates. No more dealing with middlemen or outdated listings—our platform empowers users to make informed decisions with confidence.
        </p>

        <p className='mb-6 text-lg leading-relaxed text-slate-700 text-justify'>
          We cater to a wide range of users including families, working professionals, students, and property investors. Whether you're looking for a cozy apartment, a spacious villa, or a budget-friendly rental, Easy Homes helps you explore the best options based on your preferences.
        </p>

        <p className='text-lg leading-relaxed text-slate-700 text-justify'>
          Our vision is to make real estate transactions as <span className='font-semibold text-slate-900'>simple</span>, <span className='font-semibold text-slate-900'>safe</span>, and <span className='font-semibold text-slate-900'>seamless</span> as possible. With Easy Homes, finding or listing a home is no longer a complicated process—it's just a few clicks away.
        </p>
      </div>
    </div>
  );
}
