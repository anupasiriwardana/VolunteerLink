import { Label, TextInput, Select, Modal, Textarea, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSignOut from '../hooks/useSignOutHook';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from "react-icons/hi";

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
  const signOut = useSignOut(); //after profile deletion
  const navigate = useNavigate(); //to redirect after profile deletion
  const [showModal, setShowModal] = useState(false);

  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
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
        if (data.volunteerDetails) {
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
  }, [currentUser.user._id,form1Success, form2Success]);

  const handleVolunteerChange = (e) => {
    const { id, value } = e.target;
    setVolunteerData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleVolunteerDetailsChange = (e) => {
    const { id, value } = e.target;
    setVolunteerDetails((prevDetails) => ({ ...prevDetails, [id]: value }));
  };

  const handleVolunteerDetailsUpdate = async (e) => {
    e.preventDefault();
    if(!volunteerDetails.phoneNo || !volunteerDetails.nic || !volunteerDetails.dob || !volunteerDetails.city || 
      !volunteerDetails.country || !volunteerDetails.address || !volunteerDetails.gender || 
      !volunteerDetails.bio || !volunteerDetails.skills) {
          setForm1Error('Please fill out all the fields.');
          clearMessages();
          return;
      }
    try {
      const response = await fetch(`/api/volunteer/profile/${currentUser.user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(volunteerDetails),
      });
      const data = await response.json();
      if (!response.ok) {
        setForm1Error(data.error);
      } else {
        setForm1Success('Profile updated successfully!');
        setVolunteerDetails({ ...volunteerDetails });
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
    if (!volunteerData.email || !volunteerData.firstName || !volunteerData.lastName) {
      setForm2Error("First Name, Last Name, and Email fields can not be empty.");
      clearMessages();
      return;
    }
    if (!volunteerData.email && volunteerData.password) {
      setForm2Error("Please fill out the email field");
      clearMessages();
      return;
    }

    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(volunteerData.email))){
      setForm2Error('Invalid email address');
      return;
    }
    try {
      const response = await fetch(`/api/volunteer/profile/${currentUser.user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(volunteerData),
      });
      const data = await response.json();
      if (!response.ok) {
        setForm2Error(data.error);
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
    let volunteerId = currentUser.user._id;
    signOut();
    navigate('/sign-in');
    try {
      const response = await fetch(`/api/admin/users/volunteers/${volunteerId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(error);
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
    return <p className="text-center text-lg text-[#1aac83] m-auto">Loading...</p>;
  }

  return (
    <div className="m-10 p-3 w-full grid grid-cols-1 md:grid-cols-2  gap-6">
      {error && <p className="text-red-500 text-center m-8">{error}</p>}
      <div className='flex justify-center ml-8'>
        <form className="w-full max-w-lg border border-gray-300 rounded-2xl p-6 bg-white mx-auto">
          <h1 className="my-6 text-center font-semibold text-2xl text-[#1aac83]">Update Your Personal Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
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
            <div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
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
            <div>
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

          <div className="mb-6">
            <Label value="Address" />
            <Textarea
              type="text"
              id="address"
              value={volunteerDetails.address}
              onChange={handleVolunteerDetailsChange}
              placeholder="Address"
              rows={2}
              className="text-[#333333]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label value="Date of Birth" />
              <TextInput
                type="date"
                id="dob"
                value={volunteerDetails.dob}
                onChange={handleVolunteerDetailsChange}
                className="text-[#333333]"
              />
            </div>
            <div>
              <Label value="Gender" />
              <Select
                id="gender"
                value={volunteerDetails.gender}
                onChange={handleVolunteerDetailsChange}
                className="text-[#333333]"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer Not to Say">Prefer Not to Say</option>
              </Select>
            </div>
          </div>

          <div className="mb-6">
            <Label value="Bio" />
            <Textarea
              type="text"
              id="bio"
              value={volunteerDetails.bio}
              onChange={handleVolunteerDetailsChange}
              placeholder="Tell us about yourself, your past volunteering experiences!"
              rows={4}
              className="text-[#333333]"
            />
          </div>

          <div className="mb-6">
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

          <div className="flex items-center justify-center">
            <button
              className="w-1/2 md:w-1/4 text-white bg-[#1aac83] hover:bg-[#148b6a] rounded-md p-2"
              onClick={handleVolunteerDetailsUpdate}
            >
              Update
            </button>
          </div>

          {form1Success && <p className="text-green-500 text-center mt-4">{form1Success}</p>}
          {form1Error && <p className="text-red-500 text-center mt-4">{form1Error}</p>}
        </form>
      </div>
      <div className='flex justify-center h-min'>
        <form className=" w-4/5 border border-gray-300 rounded-2xl p-4 bg-white">
          <h1 className="my-7 text-center font-semibold text-2xl text-[#1aac83]">Update Your Profile</h1>
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
                className="text-[#333333]"
              />
            </div>
          </div>
          <div className="mb-5 mr-5 ml-5">
            <Label value="Email" />
            <TextInput
              type="email"
              id="email"
              value={volunteerData.email}
              onChange={handleVolunteerChange}
              className="text-[#333333]"
            />
          </div>
          <div className="mb-5 mr-5 ml-5">
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
          <div className="mb-5 mr-5 ml-5">
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
          <div className='flex justify-between mt-10 mr-5 ml-5 mb-5'>
            <button
              onClick={handleVolunteerSubmit}
              className="text-white bg-[#1aac83] hover:bg-[#148b6a] rounded-md p-2">
              Update
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
              className="text-white bg-red-500 hover:bg-red-600 rounded-md p-2"
            >
              Delete Account
            </button>
          </div>
          {form2Success && <p className="text-green-500 text-center mt-4">{form2Success}</p>}
          {form2Error && <p className="text-red-500 text-center mt-4">{form2Error}</p>}
        </form>
      </div>
      <Modal show={showModal} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 darl:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDelete}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

