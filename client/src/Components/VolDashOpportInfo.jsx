import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function OpportunityProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState(null); // Independent recruite or organization details
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statementOfInterest, setStatementOfInterest] = useState('');
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [volunteerId, setVolunteerId ] = useState(null);
  const {currentUser} = useSelector(state => state.user);

  const urlParams = new URLSearchParams(location.search);
  const opportunityId = urlParams.get('id');

  useEffect(() => {
    setVolunteerId(currentUser.user._id); //setinng volunteerId by getting it from react-redux use selector


    const fetchOpportunityData = async () => {
      try {
        const response = await fetch(`/api/volunteer/opportunities/${opportunityId}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        } else {
          setOpportunity(data);
          if (data.recruiterId) {
            await fetchRecruiterData(data.recruiterId);
          }
        }
      } catch (error) {
        setError('Error: Could not fetch opportunity data');
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
          if (data.recruiter.organizationOrIndependent === 'Independent') {
            setAdditionalDetails(data.recruiterDetails);
          } else if (data.recruiter.organizationOrIndependent === 'Organization-representer') {
            setAdditionalDetails({
              organization: data.organization,
              roleWithinOrganization: data.roleWithinOrganization,
            });
          }
        }
      } catch (error) {
        setError(data.error ||'Error: Could not fetch recruiter data');
      }
    };

    fetchOpportunityData();
  }, []);

  const handleGoBack = () => {
    navigate('/volunteer?tab=opportunities&section=opportunities');
  };

  const clearMessages = () => {
    setTimeout(() => {
      setFormError(null);
      setFormSuccess(null);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    try {
        const response = await fetch(`/api/volunteer/opportunities/${opportunityId}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            volunteerId,
            statementOfInterest,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            setFormError(data.error || 'Error: Could not submit application.');
        } else {
            setFormSuccess('Application submitted successfully!');
            setStatementOfInterest('');
        }
    } catch (error) {
      setFormError(data.error || 'Error: Could not complete the application request.');
    }finally {
        clearMessages();
    }
  };

  if (error) {
    return (
      <div>
        <div className="text-red-500">{error}</div>
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
    <div className="flex flex-row bg-gray-50 p-6 rounded shadow-md m-10 w-full">
      <div className="w-2/4 mb-6 pl-5 pr-5">
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
        <div className="flex justify-end">
          <button
            onClick={handleGoBack}
            className="mr-10 px-4 text-[#1aac83] hover:text-green-700 font-semibold"
          >
            &larr; Go Back
          </button>
        </div>
      </div>
      <div className="w-1/3 mb-6 pl-5 pr-5 border-l border-gray-300">
        <h2 className="text-2xl text-center font-semibold text-[#1aac83] mb-3">Project Owner</h2>
        
        {!recruiter && (<p className="text-red-500">Recruiter details not available</p>)}
        {recruiter.organizationOrIndependent === 'Independent' && additionalDetails && (
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-[gray] mb-3 mt-8">Recruiter Details</h2>
            <p>{recruiter.firstName} {recruiter.lastName}</p>
            <p>{recruiter.email}</p>
            <p> {additionalDetails.city},{additionalDetails.country}</p>
            <p className='mt-3'><strong>Recruiter Bio : </strong><br/> {additionalDetails.bio}</p>
            <p className='mt-3'><strong>Services :</strong><br/> {additionalDetails.services}</p>
            {additionalDetails.linkedInProfile && <p className='mt-3'><strong>LinkedIn Profile :</strong><br/> {additionalDetails.linkedInProfile}</p>}
            {additionalDetails.website && <p className='mt-3'><strong>Website :</strong> <br/>{additionalDetails.website}</p>}
          </div>
        )}
        {recruiter.organizationOrIndependent === 'Organization-representer' && additionalDetails && (
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-[gray] mb-3 mt-8">Organization Details</h2>
            <p> {additionalDetails.organization.name}</p>
            <p> {additionalDetails.organization.type}</p>
            <p>{additionalDetails.organization.city}, {additionalDetails.organization.country}</p>
            <p>{additionalDetails.organization.address}</p>
            <p>{additionalDetails.organization.email}</p>
            <p>{additionalDetails.organization.website}</p>
            <p className='mt-5'><strong>Description :</strong> <br/>{additionalDetails.organization.description}</p>
          </div>
        )}
      
      </div>
      <div className="w-1/3 mb-6 pl-6 border-l border-gray-300">
        <h2 className="text-2xl font-semibold text-[#1aac83] mb-3">Apply to this Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="statementOfInterest" className="block text-sm font-medium text-[#333333]">
              Statement of Interest
            </label>
            <textarea
              id="statementOfInterest"
              name="statementOfInterest"
              value={statementOfInterest}
              onChange={(e) => setStatementOfInterest(e.target.value)}
              placeholder='Tell us what you find interesting about this opportunity or any past volunteer experiences that relate to this project! What makes you want to be a part of it?'
              rows="16"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1aac83] focus:border-[#1aac83]"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-[#1aac83] text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
          >
            Submit Application
          </button>
          {formError && <p className="text-red-500">{formError}</p>}
          {formSuccess && <p className="text-green-500">{formSuccess}</p>}
        </form>
      </div>
    </div>
  );
}
