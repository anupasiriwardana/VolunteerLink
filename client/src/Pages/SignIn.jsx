import {Link, useNavigate} from 'react-router-dom';
import {Button, Label, TextInput, Alert, Spinner} from 'flowbite-react';
import { useState } from 'react';
import logo from '../assets/logo.png';
import { useDispatch }  from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})  
  }

  const handleSubmit = async (e) => {
    return ('')
  }

  return (
    <div className='min-h-screen mt-20 '>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-16 ">
        {/* for the left side ⬇️*/}
        <div className='flex flex-col items-center gap-3 mb-5'>
          <h1 className='text-4xl font-bold '>Welcome To</h1>
          <Link to="/" className=' text-4xl font-bold dark:text-white '>
          <div className='flex items-center'>
          <img src={logo} alt="Logo" className="h-8 w-auto mr-2" />VolunteerLink
          </div>
          </Link>
        </div>
        {/* for the right side ⬇️*/}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='enter your email'/>
              <TextInput type='email' placeholder='name@company.com' id='email' onChange={handleChange}/>
            </div>
            <div>
              <Label value='enter your password'/>
              <TextInput type='password' placeholder='password' id='password' onChange={handleChange}/>
            </div>
            <Button className="bg-green-500 mt-5" type='submit' >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}