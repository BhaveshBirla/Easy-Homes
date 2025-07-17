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
      <footer className='mt-24 bg-slate-800 text-slate-100 py-10 px-4'>
        <div className='max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between'>
          <div className='text-center sm:text-left'>
            <h3 className='text-lg font-semibold'>Easy Homes</h3>
            <p className='text-sm text-slate-400'>Your perfect home is just a click away.</p>
          </div>
          <div className='mt-4 sm:mt-0 text-sm text-slate-400'>
            &copy; {new Date().getFullYear()} Easy Homes. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
