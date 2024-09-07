import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Avatar } from 'flowbite-react'
import { useSelector } from 'react-redux';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useSelector( state => state.user)

    let link;
    if (currentUser) {
      switch (currentUser.userType) {
        case 'volunteer':
          link = 'volunteer';
          break;
        case 'organization-recruiter':
          link = 'rec-dashboard';
          break;
        case 'independent-recruiter':
          link = 'rec-dashboard';
          break;
        case 'admin' :
          link = 'admin';
          break;
      }
    }

  return (
    <nav className="bg-white py-4 w-full font-karla"> {/* Set width to full */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Use container class for centering */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-8 w-auto mr-2" />
            <Link to="/" className="text-black text-3xl font-bold font-dmserif">
              VolunteerLink
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/findOpportunities" className="text-gray-700 hover:text-customGreen px-3 py-2 rounded-md text-sm font-medium">
                Find Opportunities
              </Link>

              <Link to="/recruitVolunteers" className="text-gray-700 hover:text-customGreen px-3 py-2 rounded-md text-sm font-medium">
                Recruit Volunteers
              </Link>

              <div className="h-6 border-l border-gray-300 mx-4"></div>

              <Link to="/about" className="text-gray-700 hover:text-customGreen px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              
              { !currentUser ? (
                <button className='bg-green-500 hover:bg-green-700 p-3 shadow-md hover:shadow-lg transition-shadow duration-300'>
                <Link to="/sign-in" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
              </button>
              ) : (
                <Link to={link}>
                  <Avatar rounded/>
                </Link>
              )
            }

            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/vol-sign-up" className="text-gray-700 hover:text-customGreen block px-3 py-2 rounded-md text-base font-medium">
              Find Opportunities
            </Link>
            <Link to="/rec-sign-up" className="text-gray-700 hover:text-customGreen block px-3 py-2 rounded-md text-base font-medium">
              Recruit Volunteers
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-customGreen block px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            { !currentUser ? (
              <Link to="/sign-in" className="text-gray-700 hover:text-customGreen block px-3 py-2 rounded-md text-base font-medium">
              Sign In
            </Link>
            ) : (
              <Link to={link}>
                <Avatar rounded/>
              </Link>
            )
          }
          </div>
        </div>
      )}
    </nav>
  );
};
