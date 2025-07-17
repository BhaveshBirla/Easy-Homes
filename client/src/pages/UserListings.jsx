import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function UserListings() {
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          return;
        }

        setListings(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };

    fetchListings();
  }, [currentUser._id]);

  const handleDelete = async (listingId) => {
    const confirm = window.confirm("Are you sure you want to delete this listing?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.error('Failed to delete listing');
        return;
      }
      setListings((prev) => prev.filter((item) => item._id !== listingId));
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-700 mt-10">Failed to load listings.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">Your Listings</h1>
      {listings.length === 0 ? (
        <p className="text-center text-gray-600">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-200 relative"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.name}
                  className="h-48 w-full object-cover rounded mb-3"
                />
                <h2 className="text-xl font-semibold truncate">{listing.name}</h2>
                <p className="text-slate-600 mt-1 truncate">
                  {listing.description || 'No description'}
                </p>
              </Link>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
                <Link
                  to={`/update-listing/${listing._id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
