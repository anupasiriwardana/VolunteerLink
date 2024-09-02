import { Label, TextInput, Select, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSignOut from '../hooks/useSignOutHook';
import {useNavigate } from 'react-router-dom';

export default function VolunteerProfile() {
  const [volunteerData, setVolunteerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [volunteerDetails, setVolunteerDetails] = useState({
    phoneNo: '',
    nic: '',
    city: '',
    country: '',
    address: '',
    dob: '',
    gender: '',
    bio: '',
    skills: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form1Success, setForm1Success] = useState(null);
  const [form2Success, setForm2Success] = useState(null);
  const [form1Error, setForm1Error] = useState(null);
  const [form2Error, setForm2Error] = useState(null);
  const [volunteerDetailsPresent, setVolunteerDetailsPresent] = useState(false);
  const signOut = useSignOut(); //after profile deletion
  const navigate = useNavigate(); //to redirect after profile deletion

  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    if (currentUser) {
      const fetchVolunteerData = async () => {
        try {
          const response = await fetch(`/api/volunteer/profile/${currentUser.user._id}`);
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error);
          }
          setVolunteerData({ 
            firstName: data.volunteer.firstName,
            lastName: data.volunteer.lastName,
            email: data.volunteer.email, 
            password: '', 
            confirmPassword: '' 
          });
          if(data.volunteerDetails){
            setVolunteerDetailsPresent(true);
            setVolunteerDetails({
              phoneNo: data.volunteerDetails.phoneNo,
              nic: data.volunteerDetails.nic,
              city: data.volunteerDetails.city,
              country: data.volunteerDetails.country,
              address: data.volunteerDetails.address,
              dob: data.volunteerDetails.dob,
              gender: data.volunteerDetails.gender,
              bio: data.volunteerDetails.bio,
              skills: data.volunteerDetails.skills
            });
          }
        } catch (error) {
          setError(data.error || "Error: Could not retrieve volunteer profile.");
          clearMessages();
        } finally {
          setLoading(false);
        }
      };
      fetchVolunteerData();
    }
  }, [form1Success]);

  const handleVolunteerChange = (e) => {
    const { id, value } = e.target;
    setVolunteerData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleVolunteerDetailsChange = (e) => {
    const { id, value } = e.target;
    setVolunteerDetails((prevDetails) => ({ ...prevDetails, [id]: value }));
  };

  const handleVolunteerDetailsSubmit = async (e) => {
    try {
      const response = await fetch(`/api/volunteer/profile/${currentUser.user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(volunteerDetails),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      } else {
        setForm1Success('Volunteer details saved successfully!');
      }
    } catch (error) {
      setForm1Error(data.error || "Error: Could not complete ssave requet.");
    } finally {
      clearMessages();
    }
  };

  const handleVolunteerDetailsUpdate = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/volunteer/profile/${currentUser.user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...volunteerData, 
          ...volunteerDetails 
      }), 
      });
      const data = await response.json();
      if (!response.ok) {
        setForm1Error(data.error);
      } else {
        setForm1Success('Profile updated successfully!');
        setVolunteerDetails({ ...volunteerDetails});
      }
    } catch (error) {
      setForm1Error(data.error || "Error: Could not complete update request.");
    } finally {
      clearMessages();
    }
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    if (volunteerData.password !== volunteerData.confirmPassword) {
      setForm2Error("Error: Passwords do not match.");
      clearMessages();
      return;
    }
    if (volunteerData.email && !volunteerData.password) {
      setForm2Error("Error: A new password is required.");
      clearMessages();
      return;
    }
    try {
      const response = await fetch(`/api/volunteer/profile/${currentUser.user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: volunteerData.email, password: volunteerData.password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      } else {
        setForm2Success('Profile updated successfully!');
        setVolunteerData({ ...volunteerData, password: '', confirmPassword: '' });
      }
    } catch (error) {
      setForm2Error(data.error || "Error: Could not complete update request.");
    } finally {
      clearMessages();
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/users/volunteers/${currentUser.user._id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }else{
        signOut(); // calling custom hook to clear local storage and update redux state
        navigate('/sign-in');
      }
    } catch (error) {
      setForm2Error(data.error || "Could not complete delete request");
    } finally {
      clearMessages();
    }
  };

  const clearMessages = () => {
    setTimeout(() => {
      setError(null);
      setForm1Success(null);
      setForm2Success(null);
      setForm1Error(null);
      setForm2Error(null);
    }, 3000);
  };

  if (loading) {
    return <p className="text-center text-lg text-[#1aac83]">Loading...</p>;
  }

  return (
    <div className="m-10 p-3 w-full">
      {error && <p className="text-red-500 text-center m-8">{error}</p>}
      <h1 className="my-7 text-center font-semibold text-3xl text-[#333333]">Update Your Profile</h1>
      <div className='flex justify-center'>
        <form className="w-2/4 border border-gray-300 rounded-2xl p-4 bg-white mr-2">
          <div className='flex justify-center'>
            <div className="mb-5 mr-5">
              <Label value="First Name" />
              <TextInput
                type="text"
                id="firstName"
                value={volunteerData.firstName}
                onChange={handleVolunteerChange}
                className="text-[#333333]"
              />
            </div>
            <div className="mb-5 ml-5">
              <Label value="Last Name" />
              <TextInput
                type="text"
                id="lastName"
                value={volunteerData.lastName}
                onChange={handleVolunteerChange}
                placeholder="Phone Number"
                className="text-[#333333]"
              />
            </div>
          </div>
          <div className='flex justify-center'>
            <div className="mb-5 mr-5">
              <Label value="Phone Number" />
              <TextInput
                type="text"
                id="phoneNo"
                value={volunteerDetails.phoneNo}
                onChange={handleVolunteerDetailsChange}
                placeholder="Phone Number"
                className="text-[#333333]"
              />
            </div>
            <div className="mb-5 ml-5">
              <Label value="NIC" />
              <TextInput
                type="text"
                id="nic"
                value={volunteerDetails.nic}
                onChange={handleVolunteerDetailsChange}
                placeholder="NIC"
                className="text-[#333333]"
              />
            </div>
          </div>
          <div className='flex justify-center'>
            <div className="mb-5 mr-5">
              <Label value="City" />
              <TextInput
                type="text"
                id="city"
                value={volunteerDetails.city}
                onChange={handleVolunteerDetailsChange}
                placeholder="City"
                className="text-[#333333]"
              />
            </div>
            <div className="mb-5 ml-5">
              <Label value="Country" />
              <TextInput
                type="text"
                id="country"
                value={volunteerDetails.country}
                onChange={handleVolunteerDetailsChange}
                placeholder="Country"
                className="text-[#333333]"
              />
            </div>
          </div>
          <div className='flex justify-center'>
            <div className="mb-5 w-3/4">
              <Label value="Address" />
              <TextInput
                type="text"
                id="address"
                value={volunteerDetails.address}
                onChange={handleVolunteerDetailsChange}
                placeholder="Address"
                className="text-[#333333]"
              />
            </div>
          </div>
          <div className='flex justify-center'>
            <div className="mb-5 mr-5">
              <Label value="Date of Birth" />
              <TextInput
                type="date"
                id="dob"
                value={volunteerDetails.dob}
                onChange={handleVolunteerDetailsChange}
                className="text-[#333333]"
              />
            </div>
            <div className="mb-5 ml-3">
              <Label value="Gender" />
              <Select
                id="gender"
                value={volunteerDetails.gender}
                onChange={handleVolunteerDetailsChange}
                className="text-[#333333]"
              >
                <option value="" disabled>Select Gender</option> {/* Placeholder option */}
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer Not to Say">Prefer Not to Say</option>
              </Select>
            </div>
          </div>
          <div className='flex justify-center'>
            <div className="mb-5 w-3/4">
              <Label value="Bio" />
              <Textarea
                type="text"
                id="bio"
                value={volunteerDetails.bio}
                onChange={handleVolunteerDetailsChange}
                placeholder="Tell us about your self, your past volunteering experiences!"
                rows={4}
                className="text-[#333333]"
              />
            </div>
          </div>
          <div className='flex justify-center'>
            <div className="mb-5 w-3/4">
              <Label value="Skills" />
              <TextInput
                type="text"
                id="skills"
                value={volunteerDetails.skills}
                onChange={handleVolunteerDetailsChange}
                placeholder="Teaching, Music, Art"
                className="text-[#333333]"
              />
            </div>
          </div>
          <div className='flex items-center justify-center'>
            {!volunteerDetailsPresent && (
              <button className="w-1/4 m-7 text-white bg-[#1aac83] hover:bg-[#148b6a] rounded-md p-2" 
                onClick={handleVolunteerDetailsSubmit}>
                  Save Details
              </button>)}
            {volunteerDetailsPresent && (
              <button className="w-1/4 m-7 text-white bg-[#1aac83] hover:bg-[#148b6a] rounded-md p-2"
                onClick={handleVolunteerDetailsUpdate}>
                  Update
              </button>
            )}
          </div>
          {form1Success && <p className="text-green-500 text-center mt-4">{form1Success}</p>}
          {form1Error && <p className="text-red-500 text-center mt-4">{form1Error}</p>}
        </form>
      </div>
      <div className='flex justify-center mt-10'>
        <form className="h-50 w-1/4 border border-gray-300 rounded-2xl p-4 bg-white ml-2">
          <div className="mb-5">
            <Label value="Email" />
            <TextInput
              type="email"
              id="email"
              value={volunteerData.email}
              onChange={handleVolunteerChange}
              placeholder="Email"
              className="text-[#333333]"
            />
          </div>
          <div className="mb-5">
            <Label value="Set New Password" />
            <TextInput
              type="password"
              id="password"
              value={volunteerData.password}
              onChange={handleVolunteerChange}
              placeholder="Enter new password"
              className="text-[#333333]"
            />
          </div>
          <div className="mb-5">
            <Label value="Confirm New Password" />
            <TextInput
              type="password"
              id="confirmPassword"
              value={volunteerData.confirmPassword}
              onChange={handleVolunteerChange}
              placeholder="Confirm new password"
              className="text-[#333333]"
            />
          </div>
          <div className='flex justify-between mt-10'>
            <button
              onClick={handleVolunteerSubmit}
              className="text-white bg-[#1aac83] hover:bg-[#148b6a] rounded-md p-2">
              Update
            </button>
            <button
              onClick={handleDelete}
              className="text-white bg-red-500 hover:bg-red-600 rounded-md p-2"
            >
              Delete Account
            </button>
          </div>
          {form2Success && <p className="text-green-500 text-center mt-4">{form2Success}</p>}
          {form2Error && <p className="text-red-500 text-center mt-4">{form2Error}</p>}
        </form>
      </div>
    </div>
  );
}

