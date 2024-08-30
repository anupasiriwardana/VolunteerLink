import {Link, useNavigate} from 'react-router-dom';
import {Button, Label, TextInput, Alert, Spinner, Radio} from 'flowbite-react';
import { useState } from 'react';
import logo from '../assets/logo.png';

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //getting the data from the form
  const handleChange = (e) => {
    if (e.target.type === 'radio') {
      setFormData({ ...formData, organizationOrIndependent: e.target.id });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    }  
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault(); //to prevent default refreshing of the page upon submission
      //if the user leaves something empty, set the error
    if(!formData.firstName || !formData.lastName || !formData.email || !formData.password || !(!formData.independant || !formData.organization) ){
      return setErrorMessage('Please fill out all fields');
    }

    try{
      setLoading(true); //loading state starts when the signup try starts
      setErrorMessage(null);  //to clean up the error message from a previous attempt
      //to submit the form
      const res = await fetch('/api/recruiter/signup',{ 
        method: 'POST',
        headers: {'Content-Type': 'application/json'},  
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        return setErrorMessage(data.error); //eg: when the email already exists
      }
      setLoading(false);
      if(res.ok){
        navigate('/sign-in');
      }
    }catch (error){
      setErrorMessage(error.message); //eg: a network issue on the client side
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20 '>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-10">
        {/* for the left side ⬇️*/}
        <div className='flex-1'>
          <Link to="/" className=' text-4xl font-bold dark:text-white'>
          <div className='flex'>
            <img src={logo} alt="Logo" className="h-8 w-auto mr-2" />VolunteerLink
          </div>
          </Link>
          <p className="mt-5 text-xl text-start">
            VolunteerLink is the best platform for you to find 
            the right volunteers that match your project goals and ideals.
          </p>
        </div>
        {/* for the right side ⬇️*/}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='md: flex justify-evenly gap-4'>
              <div>
                <Label value='Enter first name'/>
                <TextInput type='text' placeholder='First name' id='firstName'  onChange={handleChange}/>
              </div>
              <div>
                <Label value='your Last name'/>
                <TextInput type='text' placeholder='Last name' id='lastName'  onChange={handleChange}/>
              </div>
            </div>
            <div>
              <Label value='your email'/>
              <TextInput type='email' placeholder='name@company.com' id='email'  onChange={handleChange}/>
            </div>
            <div>
              <Label value='your password'/>
              <TextInput type='password' placeholder='password' id='password'  onChange={handleChange}/>
            </div>
            <div className='flex justify-around items-center'>
              <Radio name='recruiterType' id='independent' className='mr-3 p-2' onChange={handleChange}/><Label value=" I'm an Independent Recruiter"/>
              <Radio name='recruiterType' id='organization' className='mr-3 p-2' onChange={handleChange}/><Label value=" I represent an Organization"/>
            </div>
            {/* shows a loading effect after clicking. During the loading mode(loading=true), button will be disabled.*/}
            <Button className="bg-green-500" type='submit' >
            {
                loading ? (
                  <>
                    <Spinner size='sm'/>
                    <span>Loading...</span>
                  </>
                ) : 'Sign Up'
              }
            </Button>
          </form>
          {errorMessage && (
              <Alert className='mt-5' color='failure'>{errorMessage}</Alert>
            )}
        </div>
      </div>
    </div>
  )
}