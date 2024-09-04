import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RecDashProjectInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);

  const urlParams = new URLSearchParams(location.search);
  const opportunityId = urlParams.get('id');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: '',
    skillsRequired: '',
    virtualOrInPerson: '',
    location: '',
    startDate: '',
    endDate: '',
    applicationDeadline: '',
    orientationTraining: ''
  });

  useEffect(() => {
    const fetchOpportunityData = async () => {
      try {
        const response = await fetch(`/api/recruiter/opportunity/${opportunityId}`);
        const data = await response.json();
        if (!response.ok) {
            setError(data.error);
        } else {
          setOpportunity(data);
          setFormData({
            title: data.title,
            description: data.description,
            categories: data.categories,
            skillsRequired: data.skillsRequired,
            virtualOrInPerson: data.virtualOrInPerson,
            location: data.location || '',
            startDate: data.startDate,
            endDate: data.endDate,
            applicationDeadline: data.applicationDeadline,
            orientationTraining: data.orientationTraining || ''
          });
        }
      } catch (error) {
        setError('Error: Could not fetch opportunity data');
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunityData();
  }, [opportunityId, formSuccess]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    try {
      const response = await fetch(`/api/recruiter/opportunities/${opportunityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error || 'Error: Could not update the opportunity.');
      } else {
        setFormSuccess('Opportunity updated successfully!');
      }
    } catch (error) {
      setFormError('Error: Could not complete update request.');
    } finally {
      clearMessages();
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/recruiter/opportunities/${opportunityId}`, {
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
        navigate("/rec-dashboard?tab=view-projects&section=projects");
      }
    } catch (error) {
      setDeleteStatus('Error: Could not complete delete request');
    } finally {
      clearMessages();
    }
  };
  

  const clearMessages = () => {
    setTimeout(() => {
      setFormError(null);
      setFormSuccess(null);
      setDeleteStatus(null);
    }, 3000);
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
    <div className="flex flex-row bg-gray-50 p-6 rounded shadow-md m-10 w-full">
      <div className="w-2/4 pr-6">
        <h1 className="text-3xl font-bold mb-6">{opportunity.title}</h1>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#1aac83] mb-3">Project Details</h2>
          <p><strong>Description:</strong> {opportunity.description}</p>
          <p><strong>Categories:</strong> {opportunity.categories}</p>
            <p><strong>Skills Required:</strong> {opportunity.skillsRequired}</p>
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
        <div className='flex justify-between'>
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
      </div>
      <div className="w-2/4 pl-6 border-l border-gray-300">
        <h2 className="text-2xl font-semibold text-[#1aac83] mb-3">Update Project Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1aac83] focus:border-[#1aac83]"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            rows="3"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1aac83] focus:border-[#1aac83]"
            required
          ></textarea>
          <input
            type="text"
            name="categories"
            value={formData.categories}
            onChange={handleInputChange}
            placeholder="Categories"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1aac83] focus:border-[#1aac83]"
            required
          />
          <input
            type="text"
            name="skillsRequired"
            value={formData.skillsRequired}
            onChange={handleInputChange}
            placeholder="Skills Required"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1aac83] focus:border-[#1aac83]"
          />
          <select
            name="virtualOrInPerson"
            value={formData.virtualOrInPerson}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1aac83] focus:border-[#1aac83]"
            required
          >
            <option value="Virtual">Virtual</option>
            <option value="In-Person">In-Person</option>
          </select>
          {formData.virtualOrInPerson === 'In-Person' && (
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1aac83] focus:border-[#1aac83]"
              required
            />
          )}
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1aac83] focus:border-[#1aac83]"
            required
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1aac83] focus:border-[#1aac83]"
            required
          />
          <input
            type="date"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1aac83] focus:border-[#1aac83]"
            required
          />
          <textarea
            name="orientationTraining"
            value={formData.orientationTraining}
            onChange={handleInputChange}
            placeholder="Orientation & Training (optional)"
            rows="3"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1aac83] focus:border-[#1aac83]"
          ></textarea>
          {formError && <p className="text-red-500">{formError}</p>}
          {formSuccess && <p className="text-green-500">{formSuccess}</p>}
          <button
            type="submit"
            className="w-full bg-[#1aac83] text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Update Opportunity
          </button>
        </form>
      </div>
    </div>
  );
}

