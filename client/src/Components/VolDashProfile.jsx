import { Alert, Button, Label, Modal, Select, Textarea, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'

//For delete user functionality
import { HiOutlineExclamationCircle } from "react-icons/hi";


export default function DashProfile() {

    const [ showModal, setShowModal ] = useState(false);

    return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col border border-gray-500 rounded-2xl p-4'>
          <div>
            <div className='sm:flex justify-between mb-5'>
              <div>
                <Label value='First name'/>
                <TextInput type='text' id='fname' placeholder='First Name'/>
              </div>
              <div>
                <Label value='Last name'/>
                <TextInput type='text' id='lname' placeholder='Last Name'/>
              </div>
            </div>
            <div className='sm:flex justify-between mb-5'>
              <div>
                <Label value='Contact'/>
                <TextInput type='text' id='contact' placeholder='Contact'/>
              </div>
              <div>
                <Label value='Country'/>
                <TextInput type='text' id='country' placeholder='Country'/>
              </div>
            </div>
            <div className='sm:flex justify-between mb-5'>
              <div>
                <Label value='Date of Birth'/>
                <TextInput type='date' id='dob' placeholder='Date of Birth'/>
              </div>
              <div>
                <Label value='Gender'/>
                <Select>
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </Select>
              </div>
            </div>
            <div className='mb-5'>
              <Label value='Skills & Experience'/>
              <Textarea/>
            </div>
            <div className='mb-5'>
              <Label value='Email'/>
              <TextInput type='email' id='email' placeholder='email'/>
            </div>
            <div className='mb-5'>
              <Label value='Password'/>
              <TextInput type='password' id='password' placeholder='Password'/>  
            </div>  
          </div>    
          <Button type='submit' className='bg-green-500 mt-7'>Update</Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span onClick={()=>setShowModal(true)} className='cursor-pointer'>Delete Account</span>
            <span  className='cursor-pointer'>Sign Out</span>
        </div>
        <Modal show={showModal} onClose={ ()=>setShowModal(false) } popup size='md'>
            <Modal.Header />
            <Modal.Body>
                <div className='text-center'>
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 darl:text-gray-200 mb-4 mx-auto'/>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
                    <div className='flex justify-center gap-4'>
                        <Button color='failure'>Yes, I'm sure</Button>
                        <Button color='gray'onClick={ ()=> setShowModal(false) }>No, Cancel</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

//test