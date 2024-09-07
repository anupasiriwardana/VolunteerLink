import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function VolunteerProfile() {
  const location = useLocation(); // Access URL search params
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [volunteerDetails, setVolunteerDetails] = useState(null);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState(null);

  const urlParams = new URLSearchParams(location.search);
  const volunteerId = urlParams.get('id');

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        const response = await fetch(`/api/admin/users/volunteers/${volunteerId}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        }
        setVolunteer(data.volunteer);
        setVolunteerDetails(data.volunteerDetails);
        setEmail(data.volunteer.email);
      } catch (error) {
        setError(data.error || 'Error : could not fetch volunteer data ');
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerData();
  }, [formSuccess]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/users/volunteers/${volunteerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setDeleteStatus(data.error || 'Error : Could not delete Volunteer profile');
      } else {
        navigate("/admin?tab=volunteers&section=volunteers");
      }
    } catch (error) {
      setDeleteStatus('Error : Could not complete delete request');
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
      const response = await fetch(`/api/admin/users/volunteers/${volunteerId}`, {
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
        setFormSuccess('Volunteer Profile updated successfully!');
      }
    } catch (error) {
      setFormError("Error: Could not update volunteer profile.");
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
    navigate("/admin?tab=volunteers&section=volunteers");
  };

  if (error) {
    return <div>
      <div className="text-red-500">{error}</div>
      <div className='flex justify-between'>
        <div class="flex justify-start">
          <button
            onClick={handleDelete}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete Volunteer
          </button>
          {deleteStatus && (<div className="text-red-500">{deleteStatus}</div>)}
        </div>
        <div class="flex justify-end">
          <button
            onClick={handleGoBack}
            className="mr-10 px-4 text-[#1aac83] hover:text-green-700 font-semibold"
          >
            &larr; Go Back
          </button>
        </div>
      </div>
    </div>;
  }

  if (loading) {
    return <p className="text-center text-lg text-[#1aac83]">Loading...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row bg-white p-6 rounded shadow-md">
      <div className="flex-1 mb-6 md:mb-0 md:mr-6">
        <h1 className="text-3xl font-bold mb-6">{volunteer.firstName} {volunteer.lastName}</h1>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#1aac83] mb-3">Contact Information</h2>
          <p><strong>Email:</strong> {volunteer.email}</p>
          <p><strong>Phone Number:</strong> {volunteerDetails.phoneNo}</p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#1aac83] mb-3">Personal Details</h2>
          <p><strong>NIC:</strong> {volunteerDetails.nic}</p>
          <p><strong>City:</strong> {volunteerDetails.city}</p>
          <p><strong>Country:</strong> {volunteerDetails.country}</p>
          <p><strong>Address:</strong> {volunteerDetails.address}</p>
          <p><strong>Date of Birth:</strong> {new Date(volunteerDetails.dob).toLocaleDateString()}</p>
          <p><strong>Gender:</strong> {volunteerDetails.gender}</p>
          {volunteerDetails.bio && <p><strong>Bio:</strong> {volunteerDetails.bio}</p>}
        </div>
        {volunteerDetails.skills && volunteerDetails.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#1aac83] mb-3">Skills</h2>
            <ul className="list-disc list-inside">
              {volunteerDetails.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
        <div className='flex justify-between'>
          <div class="flex justify-start">
            <button
              onClick={handleDelete}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Delete Volunteer
            </button>
            {deleteStatus && (<div className="text-red-500">{deleteStatus}</div>)}
          </div>
          <div class="flex justify-end">
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
        <h2 className="text-2xl font-semibold text-[#1aac83] mb-4">Update Volunteer</h2>
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
              placeholder='Enter new password'
            />
          </div>
          <button
            type="submit"
            className="bg-[#1aac83] text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Update Volunteer
          </button>
        </form>
        {formError && <p className="text-red-500 text-center mt-4">{formError}</p>}
        {formSuccess && <p className="text-green-500 text-center mt-4">{formSuccess}</p>}
      </div>
    </div>
  );
}
