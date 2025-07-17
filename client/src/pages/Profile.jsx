import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
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
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => setFileUploadError(true),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) return dispatch(updateUserFailure(data.message));
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) return dispatch(deleteUserFailure(data.message));
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) return dispatch(deleteUserFailure(data.message));
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  // const handleShowListings = async () => {
  //   try {
  //     setShowListingsError(false);
  //     const res = await fetch(`/api/user/listings/${currentUser._id}`);
  //     const data = await res.json();
  //     if (data.success === false) return setShowListingsError(true);
  //     setUserListings(data);
  //   } catch (err) {
  //     setShowListingsError(true);
  //   }
  // };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) return;
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className='p-6 max-w-2xl mx-auto bg-white shadow-xl rounded-lg mt-10'>
      <h1 className='text-4xl font-bold text-center text-indigo-700 mb-8'>My Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
        <div className='flex justify-center'>
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt='profile'
            className='rounded-full h-28 w-28 object-cover cursor-pointer border-4 border-indigo-400 hover:opacity-90 transition'
          />
        </div>
        <p className='text-sm text-center'>
          {fileUploadError ? (
            <span className='text-red-600'>Error: Upload image &lt; 2MB</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-gray-600'>Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className='text-green-600'>Image uploaded successfully!</span>
          ) : ''}
        </p>
        <input type='text' placeholder='Username' defaultValue={currentUser.username} id='username' className='border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300' onChange={handleChange} />
        <input type='email' placeholder='Email' id='email' defaultValue={currentUser.email} className='border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300' onChange={handleChange} />
        <input type='password' placeholder='Password' onChange={handleChange} id='password' className='border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300' />
        <button disabled={loading} className='bg-indigo-600 text-white rounded-lg p-3 uppercase font-semibold hover:bg-indigo-700 transition disabled:opacity-70'>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
        <Link to='/create-listing' className='text-center bg-green-600 text-white p-3 rounded-lg uppercase font-semibold hover:bg-green-700 transition'>
          Create New Listing
        </Link>
      </form>
      <div className='flex justify-between mt-6'>
        <span onClick={handleDeleteUser} className='text-red-600 cursor-pointer font-medium hover:underline'>Delete Account</span>
        <span onClick={handleSignOut} className='text-gray-600 cursor-pointer font-medium hover:underline'>Sign Out</span>
      </div>

      {error && <p className='text-red-600 mt-4 text-center'>{error}</p>}
      {updateSuccess && <p className='text-green-600 mt-4 text-center'>Profile updated successfully!</p>}

      <Link
        to="/my-listings"
        className="bg-green-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95 block mt-4"
      >
        Show Listings
      </Link>



      {showListingsError && <p className='text-red-600 mt-4 text-center'>Failed to fetch listings</p>}

      {userListings.length > 0 && (
        <div className='mt-10'>
          <h2 className='text-2xl font-bold text-center mb-4 text-gray-800'>Your Listings</h2>
          <div className='grid gap-4'>
            {userListings.map((listing) => (
              <div key={listing._id} className='flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition'>
                <Link to={`/listing/${listing._id}`} className='flex items-center gap-4'>
                  <img src={listing.imageUrls[0]} alt='listing' className='w-20 h-20 object-cover rounded-md' />
                  <p className='font-semibold text-gray-700 truncate w-40'>{listing.name}</p>
                </Link>
                <div className='flex flex-col gap-1 items-end'>
                  <button onClick={() => handleListingDelete(listing._id)} className='text-red-600 font-medium hover:underline'>Delete</button>
                  <Link to={`/update-listing/${listing._id}`} className='text-green-600 font-medium hover:underline'>Edit</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
