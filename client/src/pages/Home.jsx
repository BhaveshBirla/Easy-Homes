import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div className='bg-slate-50'>
      {/* Hero Section */}
      <div className='flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-24 max-w-6xl mx-auto text-center'>
        <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight'>
          Find your next <span className='text-indigo-600'>perfect</span>
          <br /> place with ease
        </h1>
        <p className='text-slate-600 text-base sm:text-lg'>
          Easy Homes is your one-stop platform to explore, rent, or buy your dream property.
          <br className='hidden sm:inline' />
          From cozy apartments to luxurious villas, we’ve got you covered.
        </p>
        <Link
          to='/search'
          className='inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition'
        >
          Let’s get started
        </Link>
      </div>

      {/* Swiper Section */}
      <div className='max-w-6xl mx-auto px-4 mb-20'>
        {offerListings.length > 0 && (
          <Swiper navigation className='rounded-lg overflow-hidden shadow-md'>
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  className='h-[400px] sm:h-[500px] w-full'
                  style={{
                    background: `url(${listing.imageUrls[0]}) center center / cover no-repeat`,
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Listings Section */}
      <div className='max-w-6xl mx-auto px-4 space-y-24'>
        {/* Offers */}
        {offerListings.length > 0 && (
          <section>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-semibold text-slate-700'>Recent Offers</h2>
              <Link to='/search?offer=true' className='text-sm text-indigo-600 hover:underline'>
                Show more offers
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Rentals */}
        {rentListings.length > 0 && (
          <section>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-semibold text-slate-700'>Places for Rent</h2>
              <Link to='/search?type=rent' className='text-sm text-indigo-600 hover:underline'>
                Show more rentals
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Sales */}
        {saleListings.length > 0 && (
          <section>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-semibold text-slate-700'>Places for Sale</h2>
              <Link to='/search?type=sale' className='text-sm text-indigo-600 hover:underline'>
                Show more sales
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-24 bg-slate-900 text-slate-100 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-2 text-green-400">Easy Homes</h3>
            <p className="text-sm text-slate-400">
              Your perfect home is just a click away. Find, rent, or sell properties with ease.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li><a href="#" className="hover:text-green-400 transition">Home</a></li>
              <li><a href="/about" className="hover:text-green-400 transition">About Us</a></li>
              <li><a href="/search" className="hover:text-green-400 transition">Listings</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact or Socials */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Connect with Us</h4>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="hover:text-blue-400 transition">
                {/* Facebook */}
                <svg className="w-5 h-5 fill-current text-slate-300 hover:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H8v-2.88h2.5V9.75c0-2.45 1.47-3.8 3.7-3.8 1.07 0 2.2.19 2.2.19v2.42H15.9c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.88h-2.34v6.99A10 10 0 0 0 22 12z" />
                </svg>
              </a>
              <a href="#" className="hover:text-sky-400 transition">
                {/* Twitter */}
                <svg className="w-5 h-5 fill-current text-slate-300 hover:text-sky-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M8 19c7.5 0 11.6-6.2 11.6-11.6 0-.2 0-.4 0-.6A8.3 8.3 0 0 0 22 4.3a8.2 8.2 0 0 1-2.4.7 4.1 4.1 0 0 0 1.8-2.3c-.8.5-1.7.9-2.7 1.1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3 3.6a4.1 4.1 0 0 0 1.3 5.5 4.1 4.1 0 0 1-1.8-.5v.1a4.1 4.1 0 0 0 3.3 4 4.1 4.1 0 0 1-1.8.1 4.1 4.1 0 0 0 3.8 2.8A8.3 8.3 0 0 1 2 17.6a11.7 11.7 0 0 0 6 1.8" />
                </svg>
              </a>
              <a href="#" className="hover:text-pink-500 transition">
                {/* Instagram */}
                <svg className="w-5 h-5 fill-current text-slate-300 hover:text-pink-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zm5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Easy Homes. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
