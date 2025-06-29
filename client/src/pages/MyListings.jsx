import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function MyListings() {
  const { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/user/listings/${currentUser._id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success === false) {
          setError(data.message || 'Error fetching listings');
          setUserListings([]);
        } else {
          setUserListings(data);
        }
      } catch (err) {
        setError('Error fetching listings');
        setUserListings([]);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser && currentUser._id) fetchListings();
    else setLoading(false);
  }, [currentUser]);

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message || 'Error deleting listing');
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (err) {
      setError('Error deleting listing');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-700">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-center text-2xl font-semibold mb-6">Your Listings</h1>
      {userListings.length === 0 ? (
        <p className="text-center text-slate-700">No listings found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
