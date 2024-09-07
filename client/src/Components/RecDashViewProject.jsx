import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RecDashViewProject() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {currentUser} = useSelector(state => state.user);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch(`/api/recruiter/opportunities/${currentUser.user._id}`);
        
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }

        setOpportunities(data);
      } catch (error) {
        setError(data.error || "Error: Could not fetch opportunities.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) {
    return <div className="text-center text-lg text-[#1aac83]">Loading...</div>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  return (
    <div className="p-4 md:p-6 w-3/4 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#333333] text-center">My Volunteer Projects</h2>
      {opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity._id}
              className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-[#1aac83]">{opportunity.title}</h3>
              <p className="text-gray-600 mb-4">{opportunity.description.substring(0, 100)}...</p>
              <Link
                to={`/rec-dashboard?tab=view-projects&section=projectdetails&id=${opportunity._id}`}
                className="text-[#1aac83] font-semibold hover:underline"
              >
                View Project
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-[#333333]">No volunteer projects found.</p>
      )}
    </div>
  );
}
