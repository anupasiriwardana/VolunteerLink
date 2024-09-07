import React from 'react'
import recruitvol_1 from '../assets/recruitvol_1.jpg'
import { Link } from 'react-router-dom'

export default function RecruitVolunteers(){
  return (
    <div className='font-karla'>
      {/* section one, header */}

      <div className="relative w-full">
        <img src={recruitvol_1} alt="About Image" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="absolute inset-0 flex items-center justify-center z-10 text-white p-4 columns-2">
          <div className="text-center px-20">
            <h1 className=" text-5xl px-70 font-dmserif">Recruit Volunteers</h1>
            <p className='font-karla'>Find opportunities, recruit volunteers, and more.</p>
          </div>
        </div>
      </div>


      {/* section two, disc */}
      <div className='lg:px-64 m-10'>
        <br/>
        <h1 className='font-dmserif text-4xl'>Find qualified volunteers for your project!</h1><br/>
          <p className='font-karla'>
            Finding the right volunteers for your project is crucial to its success. At VolunteerLink, we make it easy for you to connect with qualified, passionate individuals who are eager to contribute their skills and time to your cause. Whether you need a large team for a community event or specialized volunteers for a long-term initiative, our platform allows you to reach out to a diverse pool of candidates ready to make a difference.   
          </p>
      </div>

      {/* section three, sign up */}
      <div className='lg:px-64 m-10 text-center'>

          <div className='border border-gray-600 p-8 gap-5 flex flex-row items-center justify-around flex-grow'>
            <h1 className='font-karla text-3xl -mr-16'>Get Started On Your Journey</h1>
            <div>
              <Link to='/rec-sign-up'>
                <button className='bg-green-500 p-3 rounded text-white hover:bg-green-600'>
                  Sign Up as a Recruiter
                </button>
              </Link>
            </div>
          </div>
        <br/><br/>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 items-center border border-gray-600 mt-10 mb-10">
          <div className="p-4">
            <h1 className='font-karla text-3xl -mr-16'>
              Already on VolunteerLink?
            </h1>
          </div>
          <div className="p-4 -ml-32 mt-3">
            <Link to="/sign-in">
              <button className='bg-green-500 p-3 rounded text-white hover:bg-green-600'>
                Sign In
              </button>
            </Link>
          </div>
        </div>


       

        <br/>

        

      </div>
        
    </div>
  )
}