import { Alert, Button, Label, Modal, Select, Textarea, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../Redux/user/userSlice';
import { persistor } from '../Redux/store.js'

//For delete user functionality
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function RecDashIndRecProfile() {

    const [ showModal, setShowModal ] = useState(false);
    const { currentUser} = useSelector(state => state.user);
    const [ profileForm, setProfileForm ] = useState({});
    const [ independentForm, setIndependentForm ] = useState({});
    const [ fetchedDetails, setFetchedDetails ] = useState({});
    const [ activitySuccess , setActivitySuccess ] = useState(null);
    const [ activityError, setactivityError ] = useState(null);
    const completeProfile = { ...profileForm, ...independentForm };
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // console.log(completeProfile)

    // console.log(currentUser);

    const handleProfileChange = (e) => {
      setProfileForm({...profileForm, [e.target.id]: e.target.value})
    }
    const handleIndependantChange = (e) => {
      setIndependentForm({...independentForm, [e.target.id]: e.target.value})
    }
    //console.log(independentForm)

    const handleUpdateRecruiter = async (e) => {
      e.preventDefault();
      setactivityError(null);
      setActivitySuccess(null);
      if(Object.keys(completeProfile).length === 0){  //to check uf profileData object is empty
        setactivityError('No changes made');
        return;
      }
      try {
        //dispatch(updateStart());
        const res = await fetch(`/api/recruiter/profile/${currentUser.user._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(completeProfile),
        });
        const data = await res.json();
        console.log(data);
        if(!res.ok){
          // dispatch(updateFailure(data.message));
          setactivityError(data.error);
        }else{
          // dispatch(updateSuccess(data));
          setActivitySuccess("Profile Updated successfully");
        }
      } catch (error) {
        // dispatch(updateFailure(error.message));
        setactivityError(data.error);
      }
    }

    const handleSaveIndRecDetails = async (e) => {
      e.preventDefault();
      if(Object.keys(independentForm).length === 0){ 
        setactivityError('Such empty :(');
        return;
      }
      try {
        const res = await fetch(`/api/recruiter/profile/${currentUser.user._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(independentForm),
        });
        const data = await res.json();
        console.log(data);
        if(!res.ok){
          setactivityError('Error when saving independent recruiter details')
        }else{
          setActivitySuccess("Details Saved successfully");
        }
      } catch (error) {
        setactivityError(error.message);
      }
    }

    useEffect ( () => {
      const fetchIndeRecDetails = async () => {
        try {
          const res = await fetch(`/api/recruiter/profile/${currentUser.user._id}`);
          const data = await res.json();
          if(res.ok){
            setFetchedDetails(data)
            console.log(fetchedDetails)
          }
        } catch (error) {
          console.log(error);
        }
      }
     fetchIndeRecDetails();
    }, [currentUser])

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
        if(res.ok){
          setActivitySuccess("Profile Deleted successfully");
          navigate('/');
        }else{
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

    return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col border border-gray-500 rounded-2xl p-4'>
          <div>
            <div className='sm:flex justify-between mb-5'>
              <div>
                <Label value='First name'/>
                <TextInput type='text' id='fname' defaultValue={fetchedDetails.firstName} onChange={handleProfileChange}/>
              </div>
              <div>
                <Label value='Last name'/>
                <TextInput type='text' id='lname' defaultValue={fetchedDetails.lastName} onChange={handleProfileChange}/>
              </div>
            </div>
            <div className='sm:flex justify-between mb-5'>
              <div>
                <Label value='City'/>
                <TextInput type='text' id='city' defaultValue={fetchedDetails.city} onChange={handleIndependantChange}/>
              </div>
              <div>
                <Label value='Country'/>
                <TextInput type='text' id='country' defaultValue={fetchedDetails.country} onChange={handleIndependantChange}/>
              </div>
            </div>
            <div>
                <Label value='Address'/>
                <Textarea id='address' defaultValue={fetchedDetails.address} onChange={handleIndependantChange}/>
              </div>
            <div>
                <Label value='Contact'/>
                <TextInput type='text' id='phoneNo' defaultValue={fetchedDetails.phoneNo} onChange={handleIndependantChange}/>
              </div>
              <div>
                <Label value='NIC'/>
                <TextInput type='text' id='nicNo' defaultValue={fetchedDetails.nicNo} onChange={handleIndependantChange}/>
              </div>
            <div className='mb-5'>
              <Label value='Bio'/>
              <Textarea id='bio' defaultValue={fetchedDetails.bio} onChange={handleIndependantChange} placeholder='Tell us About your self!'/>
            </div>
            <div className='mb-5'>
              <Label value='LinkedIn Profile'/>
              <TextInput type='text' id='linkedInProfile' defaultValue={fetchedDetails.linkedInProfile} onChange={handleIndependantChange}/>
            </div>
            <div className='mb-5'>
              <Label value='Personal Website'/>
              <TextInput type='text' id='website' defaultValue={fetchedDetails.website} onChange={handleIndependantChange}/>
            </div>
            <div className='mb-5'>
              <Label value='Services'/>
              <Textarea id='services' defaultValue={fetchedDetails.services} onChange={handleIndependantChange} placeholder='Tell us About your past Volunteering Projects!'/>
            </div>
            <div className='mb-5'>
              <Label value='Email'/>
              <TextInput type='email' id='email' defaultValue={fetchedDetails.email} onChange={handleProfileChange}/>
            </div>
            <div className='mb-5'>
              <Label value='Password'/>
              <TextInput type='password' id='password' defaultValue={fetchedDetails.password} onChange={handleProfileChange}/>  
            </div>  
          </div>    

          {(!fetchedDetails.recruiterId) && <Button type='submit' className='bg-green-500 mt-7' onClick={handleSaveIndRecDetails}>Save Independent Recruiter Details</Button>}
          { ( !(!fetchedDetails.recruiterId) ) && <Button type='submit' className='bg-green-500 mt-7' onClick={handleUpdateRecruiter}>Update Profile</Button>  }
          
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span onClick={()=>setShowModal(true)} className='cursor-pointer'>Delete Account</span>
            <span  className='cursor-pointer' onClick={handleRecruiterSignout}>Sign Out</span>
        </div>

        { activitySuccess && (<Alert color='success' className='mt-5'>{activitySuccess}</Alert>) }
        { activityError && (<Alert color='failure' className='mt-5'>{activityError}</Alert>) }

        <Modal show={showModal} onClose={ ()=>setShowModal(false) } popup size='md'>
            <Modal.Header />
            <Modal.Body>
                <div className='text-center'>
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 darl:text-gray-200 mb-4 mx-auto'/>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
                    <div className='flex justify-center gap-4'>
                        <Button color='failure' onClick={handleRecruiterDelete}>Yes, I'm sure</Button>
                        <Button color='gray'onClick={ ()=> setShowModal(false) }>No, Cancel</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}
