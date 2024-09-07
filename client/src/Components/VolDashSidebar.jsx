import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiUser, HiArrowSmRight, HiFolderAdd } from 'react-icons/hi';
import { PiPersonArmsSpreadFill } from "react-icons/pi";
import { RiPhoneFindLine } from "react-icons/ri";
import { Link, useLocation,useNavigate } from 'react-router-dom';
import useSignOut from '../hooks/useSignOutHook';
import logo from '../assets/logo.png';

export default function DashSidebar() {

    const location = useLocation(); // Initialize useLocation
    const navigate = useNavigate();
    const signOut = useSignOut();
    const [tab, setTab] = useState('');
    
    // Each time we come to this page, we get its tab
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search); // URLSearchParams returns parameters
      const tabFromUrl = urlParams.get('tab');
      if (tabFromUrl) { // If the tab from the URL is not null, do
        setTab(tabFromUrl);
      }
    }, [location.search]); // This useEffect renders every time location.search updates  

    const handleSignOut = () => {
        signOut(); // calling custom hook to clear local storage and update redux state
        navigate('/sign-in'); 
    };
    return (
        <Sidebar className='w-full md:w-56'>
            <div>
                <Link to="/" className="text-black text-3xl font-bold font-dmserif">
                    <div className="flex items-center mt-4 mb-10">
                        <img src={logo} alt="Logo" className="h-8 w-auto mr-2" />
                        <p className="text-xl">VolunteerLink</p>
                    </div>
                </Link>
            </div>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-2'>
                    <Link to='/volunteer?tab=opportunities&section=opportunities'>
                        <Sidebar.Item 
                            active={tab === 'opportunities'} 
                            icon={RiPhoneFindLine} 
                            as='div' 
                            className={`${
                                tab === 'opportunities' ? 'text-gray bg-gray-300' : ''
                            } rounded-md p-2 pl-4 `}
                        >
                            Find Opportunities
                        </Sidebar.Item>
                    </Link>
                    <Link to='/volunteer?tab=appliedprojects&section=projects'>
                        <Sidebar.Item 
                            active={tab === 'projects'} 
                            icon={HiFolderAdd} 
                            as='div' 
                            className={`${
                                tab === 'appliedprojects' ? 'text-gray bg-gray-300' : ''
                            } rounded-md p-2 pl-4`}
                        >
                            Applied Projects
                        </Sidebar.Item>
                    </Link>
                    <Link to='/volunteer?tab=profile'>
                        <Sidebar.Item 
                            active={tab === 'profile'} 
                            icon={HiUser} 
                            as='div' 
                            className={`mt-3 ${
                                tab === 'profile' ? 'text-gray bg-gray-300' : ''
                            } rounded-md p-2 pl-4`}
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <button 
                        className='m-7 text-white bg-[#1aac83] hover:bg-[#148b6a] rounded-md p-2 flex items-center justify-center'
                        onClick={handleSignOut} 
                    >
                        <HiArrowSmRight className='mr-2' />
                        Sign Out
                    </button>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

