import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RecDashApplications() {
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector(state => state.user);
  const [volunteerId, setVolunteerId] = useState(currentUser.user._id); // set volunteerId from currentUser got from react redux use selector

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/recruiter/applications/${volunteerId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }else{
          setApplications(data);
          await fetchOpportunities();
        }
      } catch (error) {
        setError(data.error || "Error: Could not fetch applications.");
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
      <h2 className="text-2xl font-bold mb-6 text-[#333333]">Project Applications</h2>
      {applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((application) => (
            <div className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              {opportunities
                .filter((opportunity) => opportunity._id === application.opportunityId)
                .map((opportunity) => (
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1aac83]"><span className='text-gray-600 text-lg'>Project Name - </span>{opportunity.title}</h3>
                    <p><strong>Statement:</strong></p><p className="text-gray-600 mb-2">{application.statementOfInterest.substring(0, 100)}...</p>
                  </div>
                ))}
              <p><strong>Application Status:</strong> {application.status}</p>
              <p><strong>Submitted At:</strong> {new Date(application.applicationDate).toLocaleDateString()}</p>
              <div className='flex justify-between mt-5'>
                <Link
                  to={`/rec-dashboard?tab=view-projects&section=projectdetails&id=${application.opportunityId}`}
                  className="text-[#1aac83] font-semibold hover:underline justify-start"
                >
                  View Project
                </Link>
                <Link
                  to={`/rec-dashboard?tab=applications&section=info&id=${application._id}`}
                  className="text-[#1aac83] font-semibold hover:underline justify-end"
                >
                  View Application
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-[#333333]">No Applications Yet.....</p>
      )}
    </div>
  );
}
