import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function VolDashAppliedProjects() {
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector(state => state.user);
  const [volunteerId, setVolunteerId] = useState(currentUser.user._id); // set volunteerId from currentUser got from react redux use selector

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/volunteer/applications/${volunteerId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }else{
          setApplications(data);
          await fetchOpportunities();
        }
      } catch (error) {
        setError(error.message || "Error: Could not fetch applications.");
      } finally {
        setLoading(false);
      }
    };
    const fetchOpportunities = async () => {
      try{
        const response = await fetch('/api/volunteer/opportunities');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        setOpportunities(data);
      }catch(error){
        setError(error.message || "Error: Could not fetch opportunities.");
      }
    };

    if (volunteerId) {
      fetchApplications();
    }
  }, [volunteerId]);

  if (loading) {
    return <div className="text-center text-lg text-[#1aac83]">Loading...</div>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  return (
    <div className="w-3/4 p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#333333]">Applied Projects</h2>
      {applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((application) => (
            <div className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              {opportunities
                .filter((opportunity) => opportunity._id === application.opportunityId)
                .map((opportunity) => (
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1aac83]">{opportunity.title}</h3>
                    <p className="text-gray-600 mb-4">{opportunity.description.substring(0, 100)}...</p>
                  </div>
                ))}
              <p><strong>Application Status:</strong> {application.status}</p>
              <p><strong>Submitted At:</strong> {new Date(application.applicationDate).toLocaleDateString()}</p>
              <div className='flex justify-between mt-5'>
                <Link
                  to={`/volunteer?tab=appliedprojects&section=projectinfo&id=${application.opportunityId}`}
                  className="text-[#1aac83] font-semibold hover:underline justify-start"
                >
                  View Project
                </Link>
                <Link
                  to={`/volunteer?tab=appliedprojects&section=myapplication&id=${application._id}`}
                  className="text-[#1aac83] font-semibold hover:underline justify-end"
                >
                  View Application
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-[#333333]">No Applied Volunteer projects found.</p>
      )}
    </div>
  );
}
