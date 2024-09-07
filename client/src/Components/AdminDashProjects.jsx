import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch('/api/admin/opportunities');
        
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }

        setOpportunities(data);
      } catch (error) {
        setError("Error: Could not fetch opportunities.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) {
    return <p className="text-center text-lg text-[#1aac83]">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#333333]">Volunteer Projects</h2>
      {opportunities.length > 0 ? (
        <table className="w-full table-auto bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-[#1aac83] text-white">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity) => (
              <tr key={opportunity._id} className="border-b">
                <td className="px-4 py-2">{opportunity.title}</td>
                <td className="px-4 py-2">{opportunity.description.substring(0, 50)}...</td>
                <td className="px-4 py-2">
                  <Link to={`/admin?tab=projects&section=projectinfo&id=${opportunity._id}`} className="text-[#1aac83] hover:underline">
                    View Project
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-lg text-[#333333]">No volunteer projects found.</p>
      )}
    </div>
  );
}
