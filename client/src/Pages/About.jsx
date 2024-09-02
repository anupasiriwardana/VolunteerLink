import React from 'react'
import about_1 from '../assets/about_1.jpg'

export default function About() {
  return (
    <div className='font-karla text-slate-700'>
        {/* section one */}
        <div className="relative w-full">
        <img src={about_1} alt="About Image" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="absolute inset-0 flex items-center justify-center z-10 text-white p-4 columns-2">
          <div className="text-center px-20">
            <h1 className=" text-5xl px-70 font-dmserif">About VolunteerLink</h1>
            <p className='font-karla'>Find opportunities, recruit volunteers, and more.</p>
          </div>
        </div>
      </div>

      {/* section two: about us */}
        <div className='lg:px-64 m-10'>
            <p className='font-karla'>At VolunteerLink, our mission is to bridge the gap between passionate individuals eager to make a difference and organizations in need of their talents. We believe that by connecting volunteers with meaningful opportunities, we can create stronger, more resilient communities. Our platform is designed to empower both volunteers and recruiters, ensuring that everyone has access to the resources they need to make a lasting impact.</p>
        </div>

      {/* section three:grid */}

        <div className='lg:px-32 m-10 text-center'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>

            <div className='bg-green-100 p-10'>
              <h1 className='font-dmserif text-xl'>
                Bridge the gap
              </h1>
              <br/>
              <p>
                VolunteerSite connects passionate individuals with meaningful volunteer opportunities, creating stronger, more resilient communities.
              </p>
            </div>

            <div className='bg-green-100 p-10'>
              <h1 className='font-dmserif text-xl'>
                Support growth
              </h1>
              <br/>
              <p>
                We empower volunteers to develop new skills and help organizations thrive through the energy and dedication of committed individuals.
              </p>
            </div>

            <div className='bg-green-100 p-10'>
              <h1 className='font-dmserif text-xl'>
                Foster Engagement
              </h1>
              <br/>
              <p>
                Our platform promotes social good by matching volunteers with organizations that share their values, encouraging active community participation.
              </p>
            </div>

          </div>
        </div>

      {/* section four: disc */}
        <div className='lg:px-64 m-10'>
            <p>
            VolunteerLink provides a user-friendly platform where volunteers can easily search for opportunities that match their skills, interests, and availability. Our platform allows organizations to post volunteer roles, reach a wide audience, and find the right candidates quickly and efficiently. We offer tools and resources that support both volunteers and recruiters, ensuring that everyone involved in the process has a positive, impactful experience. Whether you're looking to give back, gain experience, or find passionate individuals to support your cause, VolunteerLink is here to help you make a difference.            </p>
        </div>
    </div>
  )
}
