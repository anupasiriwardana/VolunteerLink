import volunteerImage from "../assets/Volunteer.jpg";
import { Link } from 'react-router-dom';

export default function FindOpportunities() {
  return (
    <div className="min-h-screen flex flex-col font-karla">
      <header
        className="py-8 text-center font-dmserif"
        style={{
          backgroundImage:
            "linear-gradient(0deg, 	rgb(255, 255, 255), rgb(255, 255, 255), rgb(193, 225, 193))",
        }}
      >
        <h1 className="text-4xl font-bold">Join Us as a Volunteer</h1>
        <p className="mt-4 text-xl font-karla">
          Make a difference in your community by volunteering with us.
        </p>
      </header>

      <main>
        <section className="relative">
          <div className="relative">
            <img
              src={volunteerImage}
              alt="Volunteers"
              className="w-full h-auto object-cover"
              style={{
                height: "400px",
              }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-5xl font-bold text-white">
                About Our Cause
              </h2>
              <p className="text-white text-2xl text-center font-semibold px-6 mt-4">
                We are dedicated to connecting individuals and organizations through volunteerism. Our mission is to create impactful volunteer opportunities that empower communities and bring positive change. Volunteers like you are crucial in helping us achieve our goals and positively impact our community.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-center py-10">
            Why Volunteer with Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow rounded-lg text-center transform hover:scale-110 transition duration-300">
              <h3 className="text-xl font-bold mb-2">Make a Difference</h3>
              <p className="text-gray-600">
                Your time and effort can have a real impact on the lives of
                those in need.
              </p>
            </div>
            <div className="bg-white p-6 shadow rounded-lg text-center transform hover:scale-110 transition duration-300">
              <h3 className="text-xl font-bold mb-2">Learn New Skills</h3>
              <p className="text-gray-600">
                Volunteering provides an opportunity to develop new skills and
                gain valuable experience.
              </p>
            </div>
            <div className="bg-white p-6 shadow rounded-lg text-center transform hover:scale-110 transition duration-300">
              <h3 className="text-xl font-bold mb-2">Connect with Others</h3>
              <p className="text-gray-600">
                Meet like-minded people and build lasting relationships through
                your volunteer work.
              </p>
            </div>
          </div>
        </section>
      </main>

      <div className=' m-10 text-center flex flex-col items-center justify-even flex-grow'>
        
        <div className="p-8 flex flex-row items-center jusify-around flex-grow gap-20 border border-gray-600">
          <h1  className='font-karla text-3xl -mr-16'>Get Started On Your Journey</h1>
          <div>
            <Link to='/vol-sign-up'>
              <button className='bg-green-500 p-3 rounded text-white hover:bg-green-600'>
                Sign Up as a Volunteer
              </button>
            </Link>
          </div>
        </div>

        <br /><br />
        
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mt-10 mb-10 justify-around items-center border border-gray-600">
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
      </div>
    </div>
  );
}
