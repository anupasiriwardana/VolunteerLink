import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OpportunityProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState(null);

  const urlParams = new URLSearchParams(location.search);
  const opportunityId = urlParams.get('id');

  useEffect(() => {
    const fetchOpportunityData = async () => {
      try {
        const response = await fetch(`/api/admin/opportunities/${opportunityId}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        } else {
          setOpportunity(data);
          if(data.recruiterId){
            await fetchRecruiterData(data.recruiterId);
          }
        }
      } catch (error) {
        setError(data.error || 'Error: Could not fetch opportunity data');
      } finally {
        setLoading(false);
      }
    };

    const fetchRecruiterData = async (recruiterId) => {
      try {
        const response = await fetch(`/api/admin/users/recruiters/${recruiterId}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        } else {
          setRecruiter(data.recruiter);
        }
      } catch (error) {
        setError(data.error ||'Error: Could not fetch recruiter data');
      }
    };

    fetchOpportunityData();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/opportunities/${opportunityId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ opportunityId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setDeleteStatus(data.error || 'Error: Could not delete opportunity');
      } else {
        navigate("/admin?tab=projects&section=projects");
      }
    } catch (error) {
      setDeleteStatus('Error: Could not complete delete request');
    } finally {
      clearMessages();
    }
  };

  const clearMessages = () => {
    setTimeout(() => {
      setDeleteStatus(null);
    }, 3000);
  };

  const handleGoBack = () => {
    navigate("/admin?tab=projects&section=projects");
  };

  if (error) {
    return (
      <div>
        <div className="text-red-500">{error}</div>
        <div className="flex justify-start">
          <button
            onClick={handleDelete}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete Opportunity
          </button>
          {deleteStatus && <div className="text-red-500">{deleteStatus}</div>}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleGoBack}
            className="mr-10 px-4 text-[#1aac83] hover:text-green-700 font-semibold"
          >
            &larr; Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center text-lg text-[#1aac83]">Loading...</p>;
  }

  return (
    <div className="flex flex-row bg-white p-6 rounded shadow-md">
      <div className="w-3/4 mb-6">
        <h1 className="text-3xl font-bold mb-6">{opportunity.title}</h1>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#1aac83] mb-3">Project Details</h2>
          <p><strong>Description:</strong> {opportunity.description}</p>
          <p><strong>Categories:</strong> {opportunity.categories.join(', ')}</p>
          {opportunity.skillsRequired.length > 0 && (
            <p><strong>Skills Required:</strong> {opportunity.skillsRequired.join(', ')}</p>
          )}
          <p><strong>Project Type:</strong> {opportunity.virtualOrInPerson}</p>
          {opportunity.virtualOrInPerson === 'In-Person' && (
            <p><strong>Location:</strong> {opportunity.location}</p>
          )}
          <p><strong>Start Date:</strong> {new Date(opportunity.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(opportunity.endDate).toLocaleDateString()}</p>
          <p><strong>Application Deadline:</strong> {new Date(opportunity.applicationDeadline).toLocaleDateString()}</p>
          {opportunity.orientationTraining && (
            <p><strong>Orientation & Training:</strong> {opportunity.orientationTraining}</p>
          )}
        </div>
        <div className="flex justify-start">
          <button
            onClick={handleDelete}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete Opportunity
          </button>
          {deleteStatus && <div className="text-red-500">{deleteStatus}</div>}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleGoBack}
            className="mr-10 px-4 text-[#1aac83] hover:text-green-700 font-semibold"
          >
            &larr; Go Back
          </button>
        </div>
      </div>
      <div className="w-1/4 mb-6 pl-6 border-l border-gray-300">
        <h2 className="text-2xl font-semibold text-[#1aac83] mb-3">Project Owner</h2>
        {recruiter ? (
          <div>
            <p><strong>Name:</strong> {recruiter.firstName} {recruiter.lastName}</p>
            <p><strong>Email:</strong> {recruiter.email}</p>
            <p><strong>Type:</strong> {recruiter.organizationOrIndependent}</p>
          </div>
        ) : (
          <p className="text-red-500">Recruiter details not available</p>
        )}
      </div>
    </div>
  );
}
