import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-white shadow-md sticky top-0 z-50'>
      <div className='flex justify-between items-center max-w-7xl mx-auto px-4 py-3'>
        <Link to='/'>
          <h1 className='font-extrabold text-lg sm:text-2xl flex items-center gap-1'>
            <span className='text-indigo-600'>Easy</span>
            <span className='text-slate-800'>Homes</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className='bg-gray-100 px-3 py-2 rounded-full flex items-center shadow-sm border focus-within:ring-2 focus-within:ring-indigo-300 transition'
        >
          <input
            type='text'
            placeholder='Search homes...'
            className='bg-transparent focus:outline-none w-28 sm:w-64 text-sm sm:text-base text-slate-700 placeholder-slate-500'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit'>
            <FaSearch className='text-indigo-600 text-lg hover:scale-110 transition-transform' />
          </button>
        </form>

        <ul className='flex items-center gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:text-indigo-600 font-medium transition'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:text-indigo-600 font-medium transition'>
              About
            </li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-8 w-8 object-cover border-2 border-indigo-500 shadow-sm hover:scale-105 transition'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className='text-slate-700 hover:text-indigo-600 font-semibold transition'>
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
