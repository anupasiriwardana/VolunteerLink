import { set } from 'mongoose';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RecruiterProfile() {
  const location = useLocation(); // Access URL search params
  const navigate = useNavigate();
  const [recruiter, setRecruiter] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState(null); // Independent or Organization details
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState(null);

  const urlParams = new URLSearchParams(location.search);
  const recruiterId = urlParams.get('id');

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const response = await fetch(`/api/admin/users/recruiters/${recruiterId}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        }
        setRecruiter(data.recruiter);
        if (data.recruiter.organizationOrIndependent === 'Independent') {
          setAdditionalDetails(data.recruiterDetails);
        } else if (data.recruiter.organizationOrIndependent === 'Organization-representer') {
          setAdditionalDetails({
            organization: data.organization,
            roleWithinOrganization: data.roleWithinOrganization,
          });
        }
        setEmail(data.recruiter.email);
      } catch (error) {
        setError(data.error || 'Error: could not fetch recruiter data');
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterData();
  }, [formSuccess]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/users/recruiters/${recruiterId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setDeleteStatus(data.error || 'Error: Could not delete recruiter profile');
      } else {
        navigate("/admin?tab=recruiters&section=recruiters");
      }
    } catch (error) {
      setDeleteStatus('Error: Could not complete delete request');
    } finally {
      clearMessages();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (email && !password) {
      setFormError("Error: A new password is required.");
      clearMessages();
      return;
    }
    if(!email && !password){
      setFormError("Error: Email and password are required.");
      clearMessages();
      return;
    }
    if(!email && password){
      setFormError("Error: Email field is required");
      clearMessages();
      return;
    }
    try {
      const response = await fetch(`/api/admin/users/recruiters/${recruiterId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error);
        setPassword('');
      } else {
        setEmail(email);
        setPassword('');
        setFormSuccess('Recruiter Profile updated successfully!');
      }
    } catch (error) {
      setFormError("Error: Could not update recruiter profile.");
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

  const handleGoBack = () => {
    navigate("/admin?tab=recruiters&section=recruiters");
  };

  if (error) {
    return (
      <div flex justify-between>
        <div className="text-red-500">{error}</div>
        <div className="flex justify-start">
          <button
            onClick={handleDelete}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete Recruiter
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
    <div className="flex flex-col md:flex-row bg-white p-6 rounded shadow-md">
      <div className="flex-1 mb-6 md:mb-0 md:mr-6">
        <h1 className="text-3xl font-bold mb-1">{recruiter.firstName} {recruiter.lastName}</h1>
        <p><strong>Recruiter Type:</strong> {recruiter.organizationOrIndependent}</p>
        <div className="mt-5 mb-6">
          <h2 className="text-2xl font-semibold text-[#1aac83] mb-3">Contact Information</h2>
          <p><strong>Email:</strong> {recruiter.email}</p>
          {additionalDetails.phoneNo && <p><strong>Phone Number:</strong> {additionalDetails.phoneNo}</p>}
          {additionalDetails.roleWithinOrganization && <p><strong>Role Within Organization:</strong> {additionalDetails.roleWithinOrganization}</p>}
        </div>
        {recruiter.organizationOrIndependent === 'Independent' && additionalDetails && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#1aac83] mb-3">Recruiter Information</h2>
            <p><strong>NIC:</strong> {additionalDetails.nicNo}</p>
            <p><strong>City:</strong> {additionalDetails.city}</p>
            <p><strong>Country:</strong> {additionalDetails.country}</p>
            <p><strong>Address:</strong> {additionalDetails.address}</p>
            {additionalDetails.linkedInProfile && <p><strong>LinkedIn Profile:</strong> {additionalDetails.linkedInProfile}</p>}
            {additionalDetails.website && <p><strong>Website:</strong> {additionalDetails.website}</p>}
            <p><strong>Bio:</strong> {additionalDetails.bio}</p>
            <p><strong>Services:</strong> {additionalDetails.services}</p>
          </div>
        )}
        {recruiter.organizationOrIndependent === 'Organization-representer' && additionalDetails && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#1aac83] mb-3">Organization Details</h2>
            <p><strong>Organization Name:</strong> {additionalDetails.organization.name}</p>
            <p><strong>Organization Type:</strong> {additionalDetails.organization.type}</p>
            <p><strong>Description:</strong> {additionalDetails.organization.description}</p>
            <p><strong>City:</strong> {additionalDetails.organization.city}</p>
            <p><strong>Country:</strong> {additionalDetails.organization.country}</p>
            <p><strong>Address:</strong> {additionalDetails.organization.address}</p>
            <p><strong>Email:</strong> {additionalDetails.organization.email}</p>
            <p><strong>Website:</strong> {additionalDetails.organization.website}</p>
          </div>
        )}
        <div className='flex justify-between'>
        <div className="flex justify-start">
          <button
            onClick={handleDelete}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete Recruiter
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

      <div className="md:w-1/3 bg-gray-100 p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-[#1aac83] mb-4">Update Recruiter</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1aac83]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1aac83]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#1aac83] text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Update Recruiter
            </button>
          </div>
          {formError && <p className="text-red-500 mt-4">{formError}</p>}
          {formSuccess && <p className="text-green-500 mt-4">{formSuccess}</p>}
        </form>
      </div>
    </div>
  );
}

         
