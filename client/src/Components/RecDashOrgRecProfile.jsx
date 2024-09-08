import { Alert, Button, Label, Modal, Textarea, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../Redux/user/userSlice';
import { persistor } from '../Redux/store.js'

//For delete user functionality
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function RecDashOrgRecProfile() {

  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useSelector(state => state.user)
  const [profileForm, setProfileForm] = useState({});
  const [orgForm, setOrgForm] = useState({});
  const [fetchedDetails, setFetchedDetails] = useState({});
  const [organizationDetails, setOrganizationDetails] = useState({});
  const [activitySuccess, setActivitySuccess] = useState(null);
  const [activityError, setactivityError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orgDetailsPresent, setOrgDetailsPresent] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [roleWithinOrg, setRoleWithinOrg] = useState('');


  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.id]: e.target.value });
  }
  const handleOrgChange = (e) => {
    setOrgForm({ ...orgForm, [e.target.id]: e.target.value });
    if(e.target.id == 'roleWithinOrganization'){
      setRoleWithinOrg(e.target.value)
    }
  }

  const handleSearchOrg = async (e) => {
    //setOrgForm({...orgForm, name: e.target.value});
    const orgInputVal = e.target.value;
    try {
      const res = await fetch('/api/recruiter/organizations');
      const data = await res.json();
      if (res.ok) {
        if(orgInputVal != ''){ //means search fiels is not an empty
          const matchingOrganizations = data.filter(org => org.name.toLowerCase().includes(orgInputVal.toLowerCase()));
          setOrganizations(matchingOrganizations);
        }else{
          setOrganizations([]); //makes the dropdown goes away when search field is empty
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleOrgSelection = (org) => {
    setOrganizationDetails(org);
    setOrganizations([]); //this makes drop down menu goes away -> since organization array is empty
    setOrgForm({
      ...orgForm,
      orgId : org._id,
      name: org.name,
      roleWithinOrganization: roleWithinOrg,
      type: org.type,
      website: org.website,
      email: org.email,
      city: org.city,
      country: org.country,
      address: org.address,
      description: org.description
    })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setactivityError(null);
    setActivitySuccess(null);
    if (Object.keys(profileForm).length === 0) {  //to check uf profileData object is empty
      setactivityError('No changes made');
      return;
    }
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email))){
      setactivityError('Invalid email address');
      return;
    }
    try {
      console.log(currentUser.user._id);
      console.log(profileForm)
      const res = await fetch(`/api/recruiter/profile/${currentUser.user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        //getting the error response from the api-> through data.error
        setactivityError(data.error);
      } else {
        setActivitySuccess("Profile Updated successfully");
      }
    } catch (error) {
      setactivityError(data.error);
    } finally {
      clearMessages();
    }
  }

  useEffect(() => {
    const fetchRecDetails = async () => {
      try {
        const res = await fetch(`/api/recruiter/profile/${currentUser.user._id}`);
        const data = await res.json();
        if (res.ok) {
          setFetchedDetails(data)
          await fetchOrganization();
        }
      } catch (error) {
        console.log(error);
      }
    }

    const fetchOrganization = async () => {
      try {
        const res = await fetch(`/api/recruiter/organization/${currentUser.user._id}`)  //here we add the query userId cuz that's wha we wanna search. 
        const data = await res.json()
        if (res.ok) {
          setOrganizationDetails(data);
          setOrgDetailsPresent(true);
        } else {
          setOrgDetailsPresent(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    
    fetchRecDetails(); //Since async can't directly be used for useEffect(), we define a createPosts() function and call it inside the useEffect()
    
  }, [currentUser, activitySuccess]);

  const handleCreateOrg = async (e) => {
    e.preventDefault();
      if (Object.keys(orgForm).length === 0) {
        setactivityError('All fields are required');
        return;
      }
      if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orgForm.email))){
        setactivityError('Invalid company email address');
        return;
      }
      if(!orgForm.roleWithinOrganization){
        setactivityError('Please set your role within the organization');
        return;
      }
      try {
        const res = await fetch(`/api/recruiter/organization/${currentUser.user._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orgForm),
        });
        const data = await res.json();
        console.log(data);
        if (!res.ok) {
          setactivityError(data.error || 'Error when creating organization')
        } else {
          setActivitySuccess("Organization details saved successfully");
        }
      } catch (error) {
        setactivityError(error.message);
      } finally {
        clearMessages();
      }
    }

  const handleUpdateOrg = async (e) => {
    e.preventDefault();
      if (Object.keys(orgForm).length === 0) {
        setactivityError('No changes made');
        return;
      }
      if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orgForm.email))){
        setactivityError('Invalid company email address');
        return;
      }
      if(orgForm.roleWithinOrganization === ''){
        setactivityError('Please set your role within the organization');
        return;
      }
      try {
        const res = await fetch(`/api/recruiter/organization/${currentUser.user._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orgForm),
        });
        const data = await res.json();
        if (!res.ok) {
          setactivityError('Organization details update failed');
        } else {
          setActivitySuccess('Organization details update successful')
        }
      } catch (error) {
        setactivityError(error);
      } finally {
        clearMessages();
      }
  }

  const handleRecruiterDelete = async (e) => {
    e.preventDefault();
    dispatch(signOut());   // Clear Redux state
    persistor.purge();   // Purge persisted state
    localStorage.clear();   // Clear local storage
    try {
      const res = await fetch(`/api/recruiter/profile/${currentUser.user._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setActivitySuccess("Profile Deleted successfully");
        navigate('/');
      } else {
        setactivityError('Error when deleting recruiter details')
        console.log('Error when deleting recruiter details')
      }
    } catch (error) {
      setactivityError(error);
    }
  }

  const handleRecruiterSignout = async (e) => {
    e.preventDefault();
    dispatch(signOut());   // Clear Redux state
    persistor.purge();   // Purge persisted state
    localStorage.clear();   // Clear local storage
    setActivitySuccess('Signed out successfully');
  }

  const clearMessages = () => {
    setTimeout(() => {
      setactivityError(null);
      setActivitySuccess(null);
    }, 3000)
  }


  return (
    <div className='min-w-80vw mx-auto p-3 '>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col' >
        <div className=' flex flex-col md:flex-row gap-5 h-min'>
          <div className='flex flex-col gap-5 border border-gray-500 rounded-2xl p-4'>
            <div className='sm:flex justify-between mb-5 gap-5'>
              <div>
                <Label value='First name' />
                <TextInput type='text' id='fname' required defaultValue={fetchedDetails.firstName} onChange={handleProfileChange} />
              </div>
              <div>
                <Label value='Last name' />
                <TextInput type='text' id='lname' required defaultValue={fetchedDetails.lastName} onChange={handleProfileChange} />
              </div>
            </div>
            <div className='sm:flex justify-between mb-5'>
              <div className=''>
                <Label value='Email' />
                <TextInput type='email' id='email' required defaultValue={fetchedDetails.email} onChange={handleProfileChange} />
              </div>
              <div className=''>

                <Label value='Set new Password' />
                <TextInput type='password' id='password' required placeholder='Enter a new password' onChange={handleProfileChange} />

              </div>
            </div>
            <Button type='submit' className='bg-green-500 block mx-auto' onClick={handleUpdateProfile}>Update profile</Button>
          </div>
          <div className=' border border-gray-500 rounded-2xl p-4'>
            {!orgDetailsPresent && (
              <div className='mb-5'>
                <Label value='Search Organization' />
                <TextInput type='text' id='name' placeholder='Enter your organization name' onChange={handleSearchOrg} />
                {/* dropdown of organization names */}
                {organizations.length > 0 && (
                  <ul className='bg-white border rounded-lg shadow-lg'>
                    {organizations.map(org => (
                      <li className='p-2 cursor-pointer hover:bg-gray-100' onClick={() => handleOrgSelection(org)}>
                        {org.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <div className='sm:flex justify-between gap-5 '>
              <div className='mb-5'>
                <Label value='Organization Name' />
                <TextInput type='text' id='name' required defaultValue={organizationDetails.name} onChange={handleOrgChange} />
              </div>
              <div>
                <Label value='Role Within the Organization' />
                <TextInput type='text' id='roleWithinOrganization' required defaultValue={organizationDetails.roleWithinOrganization} onChange={handleOrgChange} />
              </div>
            </div>
            <div className='sm:flex justify-between gap-5 '>
              <div className='mb-5'>
                <Label value='Organization Type' />
                <TextInput type='text' id='type' defaultValue={organizationDetails.type} onChange={handleOrgChange} />
              </div>
              <div>
                <Label value='Organization Website' />
                <TextInput type='text' id='website' defaultValue={organizationDetails.website} onChange={handleOrgChange} />
              </div>
            </div>
            <div className='mb-5'>
              <Label value='Email' />
              <TextInput type='text' required id='email' defaultValue={organizationDetails.email} onChange={handleOrgChange} />
            </div>
            <div className='sm:flex justify-between gap-5 '>
              <div className='mb-5'>
                <Label value='City' />
                <TextInput type='text' id='city' defaultValue={organizationDetails.city} onChange={handleOrgChange} />
              </div>
              <div>
                <Label value='Country' />
                <TextInput type='text' required id='country' defaultValue={organizationDetails.country} onChange={handleOrgChange} />
              </div>
            </div>
            <div className='mb-5'>
              <Label value='Address' />
              <TextInput type='text' id='address' defaultValue={organizationDetails.address} onChange={handleOrgChange} />
            </div>
            <div className='mb-5'>
              <Label value='Organization Description' />
              <Textarea id='description' required rows={4} defaultValue={organizationDetails.description} onChange={handleOrgChange} />
            </div>
            {orgDetailsPresent && (<Button type='submit' className='bg-green-500 mt-5 block mx-auto' onClick={handleUpdateOrg}>Update organization</Button>)}
            {!orgDetailsPresent && (<Button type='submit' className='bg-green-500 mt-5 block mx-auto' onClick={handleCreateOrg}>Save organization</Button>)}
          </div>
        </div>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer' onClick={handleRecruiterSignout}>Sign Out</span>
      </div>

      {activitySuccess && (<Alert color='success' className='mt-5'>{activitySuccess}</Alert>)}
      {activityError && (<Alert color='failure' className='mt-5'>{activityError}</Alert>)}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 darl:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleRecruiterDelete}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
