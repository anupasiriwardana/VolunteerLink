import { Button, Label, Modal, Select, Textarea, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const [adminData, setAdminData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    contact: '',
    country: '',
    dob: '',
    gender: '',
    skills: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adminId } = useParams();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`/api/admin/profile/${adminId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        setAdminData(data);
      } catch (error) {
        setError("Error: Could not retrieve admin profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [adminId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAdminData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/profile/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setAdminData(data);
      alert('Profile updated successfully!');
    } catch (error) {
      setError("Error: Could not update admin profile.");
    }
  };

  if (loading) {
    return <p className="text-center text-lg text-[#1aac83]">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl text-[#333333]'>Profile</h1>
      <form className='flex flex-col border border-gray-300 rounded-2xl p-4 bg-[#f1f1f1]' onSubmit={handleSubmit}>
        <div className='sm:flex justify-between mb-5'>
          <div>
            <Label value='First name' />
            <TextInput
              type='text'
              id='firstName'
              value={adminData.firstName}
              onChange={handleChange}
              placeholder='First Name'
              className='text-[#333333]'
            />
          </div>
          <div>
            <Label value='Last name' />
            <TextInput
              type='text'
              id='lastName'
              value={adminData.lastName}
              onChange={handleChange}
              placeholder='Last Name'
              className='text-[#333333]'
            />
          </div>
        </div>
        <div className='sm:flex justify-between mb-5'>
          <div>
            <Label value='Contact' />
            <TextInput
              type='text'
              id='contact'
              value={adminData.contact}
              onChange={handleChange}
              placeholder='Contact'
              className='text-[#333333]'
            />
          </div>
          <div>
            <Label value='Country' />
            <TextInput
              type='text'
              id='country'
              value={adminData.country}
              onChange={handleChange}
              placeholder='Country'
              className='text-[#333333]'
            />
          </div>
        </div>
        <div className='sm:flex justify-between mb-5'>
          <div>
            <Label value='Date of Birth' />
            <TextInput
              type='date'
              id='dob'
              value={adminData.dob}
              onChange={handleChange}
              placeholder='Date of Birth'
              className='text-[#333333]'
            />
          </div>
          <div>
            <Label value='Gender' />
            <Select id='gender' value={adminData.gender} onChange={handleChange} className='text-[#333333]'>
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </Select>
          </div>
        </div>
        <div className='mb-5'>
          <Label value='Skills & Experience' />
          <Textarea
            id='skills'
            value={adminData.skills}
            onChange={handleChange}
            placeholder='Skills & Experience'
            className='text-[#333333]'
          />
        </div>
        <div className='mb-5'>
          <Label value='Email' />
          <TextInput
            type='email'
            id='email'
            value={adminData.email}
            onChange={handleChange}
            placeholder='Email'
            className='text-[#333333]'
          />
        </div>
        <div className='mb-5'>
          <Label value='Password' />
          <TextInput
            type='password'
            id='password'
            value={adminData.password}
            onChange={handleChange}
            placeholder='Password'
            className='text-[#333333]'
          />
        </div>
        <Button type='submit' className='bg-[#1aac83] mt-7'>Update</Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure'>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
