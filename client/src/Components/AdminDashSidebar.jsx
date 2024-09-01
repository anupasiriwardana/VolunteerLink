import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiUser, HiArrowSmRight, HiDocumentText, HiFolderAdd, HiFolderOpen } from 'react-icons/hi';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import useSignOut from '../hooks/useSignOutHook';

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
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-2'>
                    <Link to='/admin?tab=recruiters&section=recruiters'>
                        <Sidebar.Item 
                            active={tab === 'recruiters'} 
                            icon={HiFolderAdd} 
                            as='div' 
                            className={`${
                                tab === 'recruiters' ? 'text-gray bg-gray-300' : ''
                            } rounded-md p-2 pl-4 `}
                        >
                            Recruiters
                        </Sidebar.Item>
                    </Link>
                    <Link to='/admin?tab=volunteers&section=volunteers'>
                        <Sidebar.Item 
                            active={tab === 'volunteers'} 
                            icon={HiFolderOpen} 
                            as='div' 
                            className={`${
                                tab === 'volunteers' ? 'text-gray bg-gray-300' : ''
                            } rounded-md p-2 pl-4`}
                        >
                            Volunteers
                        </Sidebar.Item>
                    </Link>
                    <Link to='/admin?tab=projects'>
                        <Sidebar.Item 
                            active={tab === 'projects'} 
                            icon={HiDocumentText} 
                            as='div' 
                            className={`${
                                tab === 'projects' ? 'text-gray bg-gray-300' : ''
                            } rounded-md p-2 pl-4`}
                        >
                            Projects
                        </Sidebar.Item>
                    </Link>
                    <Link to='/admin?tab=profile'>
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

