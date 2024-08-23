import React from 'react';
import home_1 from '../assets/home_1.jpg';

export default function Home() {
  return (
    <div>

{/* section one */}
      <div className="relative w-full h-screen">
        <img src={home_1} alt="Home Image" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="absolute inset-0 flex items-center justify-center z-10 text-white p-4 columns-2">
          <div className="text-center px-20">
            <h1 className=" text-5xl px-70 font-karla font-extrabold">MAKE A DIFFERENCE.<br/> Start volunteering close to home.</h1><br/>
            <p className='font-karla'>Find opportunities, recruit volunteers, and more.</p>
          </div>
        </div>
      </div>

{/* section two */}
        <div className="relative inset-0 grid grid-cols-1 md:grid-cols-2 gap-10 p-24 font-karla z-10">
          <div className="text-left text-black">
            <h2 className="text-5xl mb-2 font-dmserif font-thin">Why start <br/>volunteering?</h2>
            <div className="h-6 border-t border-pink-800 mx-4"></div>

            <br/>
            <p className='text-gray-700'>
              Volunteering offers a unique opportunity to make a tangible difference in your community and in the lives of others. It's more than just giving your time; it's about creating meaningful connections, learning new skills, and gaining a sense of purpose. Whether you're passionate about a specific cause or simply want to contribute to the greater good, volunteering allows you to take an active role in shaping a better world.
            </p>
          </div>

          <div className="text-left text-black m-9">
            <div className=' bg-green-200 p-4'>
              Develop new skills and gain valuable experience.
            </div>

            <div className="h-6 border-l border-gray-300 mx-4"></div>

            <div className=' bg-green-200 p-4'>
              Build a strong network with like-minded individuals.
            </div>

            <div className="h-6 border-l border-gray-300 mx-4"></div>

            <div className=' bg-green-200 p-4'>
              Contribute to meaningful causes and make a real impact.
            </div>

            <div className="h-6 border-l border-gray-300 mx-4"></div>

            <div className=' bg-green-200 p-4'>
              Experience personal growth and a sense of fulfillment.
            </div>

            <button className='bg-customGreen hover:bg-green-700 p-3 rounded-md'>
              Get started as a volunteer
            </button>
          </div>



        </div>
      
{/* section three */}
        <div className="relative inset-0 grid grid-cols-1 md:grid-cols-2 gap-10 p-24 font-karla z-10">
          <div className="text-left text-black">
            <h2 className="text-5xl mb-2 font-dmserif font-thin">Looking <br/> for volunteers?</h2>
            <div className="h-6 border-t border-pink-800 mx-4"></div>

            <br/>
            <p className='text-gray-700'>
            Finding the right volunteers can be a game-changer for your organization. Volunteers bring passion, energy, and fresh perspectives that can help drive your mission forward. By engaging volunteers, you not only expand your workforce but also create a community of advocates who are deeply invested in your cause. <br/><br/>Whether you're running a small nonprofit, a large organization or an individual, having a strong volunteer base can amplify your impact and help you achieve your goals more effectively.
</p>
          </div>

          <div className="text-left text-black m-9">
            <div className=' bg-green-200 p-4'>
              Develop new skills and gain valuable experience.
            </div>

            <div className="h-6 border-l border-gray-300 mx-4"></div>

            <div className=' bg-green-200 p-4'>
              Build a strong network with like-minded individuals.
            </div>

            <div className="h-6 border-l border-gray-300 mx-4"></div>

            <div className=' bg-green-200 p-4'>
              Contribute to meaningful causes and make a real impact.
            </div>

            <div className="h-6 border-l border-gray-300 mx-4"></div>

            <div className=' bg-green-200 p-4'>
              Experience personal growth and a sense of fulfillment.
            </div>

            <button className='bg-customGreen hover:bg-green-700 p-3 rounded-md'>
              Get started as a volunteer
            </button>
          </div>



        </div>


    </div>
  );
}
