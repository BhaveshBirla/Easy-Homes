import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
// import Cloudinary upload handled via REST API (no import needed)
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  // Debug: log currentUser to see if avatar updates
  console.log('Redux currentUser:', currentUser);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // Cloudinary upload handled via unsigned preset, see .env for config

  useEffect(() => {
    if (file) {
      handleFileUpload(file).catch(error => {
        console.error('Error in file upload effect:', error);
      });
    }
  }, [file]);

  const handleFileUpload = async (file) => {
  try {
    setFileUploadError(false);

    // Check file size (max 2MB)
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setFileUploadError('File size should be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFileUploadError('Please upload an image file');
      return;
    }

    // Prepare form data for Cloudinary
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data,
    });

    const result = await res.json();
    if (result.secure_url) {
      setFormData(prev => ({ ...prev, avatar: result.secure_url }));
      setFileUploadError(false);
      return result.secure_url;
    } else {
      setFileUploadError('Failed to upload image to Cloudinary.');
      return;
    }
  } catch (error) {
    setFileUploadError('An error occurred during file upload. Please try again.');
    throw error;
  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // Always ensure avatar is set
    if (!formData.avatar) {
      setFormData(prev => ({ ...prev, avatar: currentUser.avatar }));
    }
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      // Debug: log the data being sent
      console.log('Submitting profile update:', formData);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      // Clear formData.avatar so image preview uses updated Redux state
      setFormData(prev => ({ ...prev, avatar: undefined }));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 relative">
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="relative">
              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar || currentUser.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                alt="profile"
                className="rounded-full h-28 w-28 object-cover border-4 border-white shadow-lg ring-4 ring-green-200 cursor-pointer transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                }}
              />
              {filePerc > 0 && filePerc < 100 && (
                <div className="absolute bottom-0 left-0 right-0 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full transition-all duration-300"
                    style={{ width: `${filePerc}%` }}
                  ></div>
                </div>
              )}
            </div>
            <input
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFilePerc(0);
                  setFile(e.target.files[0]);
                }
              }}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="absolute -bottom-2 -right-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md transition-all duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {filePerc > 0 && filePerc < 100 ? `${filePerc}%` : 'Change'}
            </button>
            {fileUploadError && (
              <p className="text-red-500 text-xs mt-1 text-center">{fileUploadError}</p>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-4 text-slate-700">Hello, {currentUser.username}!</h2>
          <p className="text-slate-500">Update your profile details below</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-slate-600 font-medium">Username</label>
            <input
              type="text"
              placeholder="username"
              defaultValue={currentUser.username}
              id="username"
              className="border-2 border-slate-200 focus:border-green-400 p-3 rounded-lg focus:outline-none transition"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-slate-600 font-medium">Email</label>
            <input
              type="email"
              placeholder="email"
              id="email"
              defaultValue={currentUser.email}
              className="border-2 border-slate-200 focus:border-green-400 p-3 rounded-lg focus:outline-none transition"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-slate-600 font-medium">Password</label>
            <input
              type="password"
              placeholder="password"
              onChange={handleChange}
              id="password"
              className="border-2 border-slate-200 focus:border-green-400 p-3 rounded-lg focus:outline-none transition"
            />
          </div>
          {fileUploadError && (
            <p className="text-sm text-red-700 text-center">
              Error Image upload (image must be less than 2 mb)
            </p>
          )}
          {filePerc > 0 && filePerc < 100 && (
            <p className="text-sm text-slate-700 text-center">Uploading {filePerc}%</p>
          )}
          {filePerc === 100 && (
            <p className="text-sm text-green-700 text-center">Image successfully uploaded!</p>
          )}
          <button
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg p-3 uppercase font-semibold hover:opacity-95 disabled:opacity-80 shadow-md transition"
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
          <Link
            className="bg-gradient-to-r from-slate-700 to-slate-900 text-white p-3 rounded-lg uppercase text-center font-semibold hover:opacity-95 shadow-md transition"
            to={'/create-listing'}
          >
            Create Listing
          </Link>
        </form>
        <div className="flex justify-between mt-7">
          <span
            onClick={handleDeleteUser}
            className="text-red-600 cursor-pointer font-semibold hover:underline"
          >
            Delete account
          </span>
          <span onClick={handleSignOut} className="text-red-600 cursor-pointer font-semibold hover:underline">
            Sign out
          </span>
        </div>
        <p className="text-red-700 mt-5 text-center">{error ? error : ''}</p>
        <p className="text-green-700 mt-2 text-center">
          {updateSuccess ? 'User is updated successfully!' : ''}
        </p>
        <Link to="/my-listings" className="block mt-6">
          <button className="w-full bg-green-100 text-green-800 font-bold py-3 rounded-xl shadow hover:bg-green-200 transition">Show Listings</button>
        </Link>
      </div>
    </div>
  );
}
