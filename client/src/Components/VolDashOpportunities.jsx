import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function VolunteerDashOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch('/api/volunteer/opportunities');

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }

        setOpportunities(data);
        setFilteredOpportunities(data);
      } catch (error) {
        setError(data.error || "Error: Could not fetch opportunities.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = opportunities.filter(opportunity =>
      opportunity.title.toLowerCase().includes(query) ||
      opportunity.description.toLowerCase().includes(query)
    );
    setFilteredOpportunities(filtered);
  };

  if (loading) {
    return <div className="text-center text-lg text-[#1aac83] m-auto">Loading...</div>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500 m-auto">{error}</p>;
  }

  return (
    <div className="p-4 md:p-6 w-full">
      <h2 className="text-2xl font-bold mb-6 text-[#333333]">Volunteer Opportunities</h2>

      <div className="mb-6 w-full">
        <input type="text" value={searchQuery} onChange={handleSearch} placeholder="Search Opportunities..."
          className="w-2/4 mx-auto p-2 border border-gray-300 rounded-md focus:ring-[#1aac83] focus:border-[#1aac83]"
        />
      </div>

      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <div className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2 text-[#1aac83]">{opportunity.title}</h3>
              <p className="text-gray-600 mb-4">{opportunity.description.substring(0, 100)}...</p>
              <Link
                to={`/volunteer?tab=opportunities&section=details&id=${opportunity._id}`}
                className="text-[#1aac83] font-semibold hover:underline"
              >
                View Project
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-[#333333] mx-auto">No projects found.</p>
      )}
    </div>
  );
}
