import {Link, useNavigate} from 'react-router-dom';
import {Button, Label, TextInput, Alert, Spinner} from 'flowbite-react';
import { useState } from 'react';
import logo from '../assets/logo.png';
import { useDispatch, useSelector }  from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../Redux/user/userSlice';

export default function SignIn() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})  
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.email || !formData.password){
      return dispatch(signInFailure('Please fill out all fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(signInFailure(data.error));
      }
      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
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
              Signin
            </Button>
          </form>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                 {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}