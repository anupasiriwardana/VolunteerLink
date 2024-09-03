import { Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function DashProfile() {
  const [adminData, setAdminData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    if (currentUser) {
      const fetchAdminData = async () => {
        try {
          const response = await fetch(`/api/admin/profile/${currentUser.user._id}`);
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error);
          }
          setAdminData({ email: data.email, password: '', confirmPassword: '' });
        } catch (error) {
          setError("Error: Could not retrieve admin profile.");
          clearMessages();
        } finally {
          setLoading(false);
        }
      };
      fetchAdminData();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAdminData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (adminData.password !== adminData.confirmPassword) {
      setError("Error: Passwords do not match.");
      clearMessages();
      return;
    }
    if(adminData.email && !adminData.password){
      setError("Error: A new password is required.");
      clearMessages();
      return;
    }
    if(!adminData.email && !adminData.password){
      setError("Error: Email and password is required.");
      clearMessages();
      return;
    }
    if(!adminData.email && adminData.password){
      setError("Error: Email is required.");
      clearMessages();
      return;
    }
    try {
      const response = await fetch(`/api/admin/profile/${currentUser.user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: adminData.email, password: adminData.password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      }else{
        setAdminData({ ...adminData, password: '', confirmPassword: '' });
        setFormSuccess('Profile updated successfully!');
      }
    } catch (error) {
      setError(data.error || "Error: Could not update admin profile.");
    } finally {
      clearMessages();
    }
  };

  const clearMessages = () => {
    setTimeout(() => {
      setError(null);
      setFormSuccess(null);
    }, 3000);
  };

  if (loading) {
    return <p className="text-center text-lg text-[#1aac83]">Loading...</p>;
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl text-[#333333]'>Update Your Profile</h1>
      <form className='flex flex-col border border-gray-300 rounded-2xl p-4 bg-white' onSubmit={handleSubmit}>
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
          <Label value='Set New Password' />
          <TextInput
            type='password'
            id='password'
            value={adminData.password}
            onChange={handleChange}
            placeholder='Enter new password'
            className='text-[#333333]'
          />
        </div>
        <div className='mb-5'>
          <Label value='Confirm New Password' />
          <TextInput
            type='password'
            id='confirmPassword'
            value={adminData.confirmPassword}
            onChange={handleChange}
            placeholder='Confirm new password'
            className='text-[#333333]'
          />
        </div>
        <button className='m-7 text-white bg-[#1aac83] hover:bg-[#148b6a] rounded-md p-2 flex items-center justify-center'>
          Update
        </button>
      </form>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {formSuccess && <p className="text-green-500 text-center mt-4">{formSuccess}</p>}
    </div>
  );
}

//a button to delete account and confirmation dialog block that asks to delete the account
{/* <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
      </div> */}
{/* <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
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
      </Modal> */}
