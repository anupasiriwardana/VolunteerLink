import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiUser, HiArrowSmRight, HiDocumentText, HiFolderAdd, HiFolderOpen } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function DashSidebar() {

    const location = useLocation(); //initialize useLocation
    const [tab, setTab] = useState('');
    const { currentUser } = useSelector(state => state.user);
    
    //evach time we come to this page, we get irs tab⬇️
    useEffect( ()=> {
      const urlParams = new URLSearchParams(location.search); //URLSearchParams returns parameters
      const tabFromUrl = urlParams.get('tab');
      if(tabFromUrl){ //if the tab from the url is not null, do⬇️
        setTab(tabFromUrl)
      }
    }, [location.search]) //this useEffect renders every time location.search updates
    
    console.log(currentUser.userType)

  return (
    <Sidebar className='w-full md:w-56 '>
        <Sidebar.Items >
            <Sidebar.ItemGroup className='flex flex-col gap-1 bg-slate-300 p-3 '>
                
                {currentUser.userType === 'independent-recruiter' ? (
                    <Link to='/rec-dashboard?tab=ind-rec-profile'>  {/* when profile is clicked, navigate to profile tab */}
                    {/* active only when in the profile tab ⬇️ */}
                    <Sidebar.Item active={ tab === 'ind-rec-profile' } icon={HiUser} as='div' className='mt-3'>
                        Profile
                    </Sidebar.Item>
                    </Link> )   :   (
                    <Link to='/rec-dashboard?tab=org-rec-profile'>  {/* when profile is clicked, navigate to profile tab */}
                    {/* active only when in the profile tab ⬇️ */}
                    <Sidebar.Item active={ tab === 'org-rec-profile' } icon={HiUser} as='div' className='mt-3'>
                        Profile
                    </Sidebar.Item>
                    </Link> )
                }

                <Link to='/rec-dashboard?tab=create-projects'>
                <Sidebar.Item active={ tab === 'create-projects'} icon={HiFolderAdd} as='div'>
                    Create Project
                </Sidebar.Item>
                </Link>
                <Link to='/rec-dashboard?tab=view-projects&section=projects'>
                <Sidebar.Item active={ tab === 'view-projects'} icon={HiFolderOpen} as='div'>
                    View Projects
                </Sidebar.Item>
                </Link>
                <Link to='/rec-dashboard?tab=applications&section=applications'>
                <Sidebar.Item active={ tab === 'applications'} icon={HiDocumentText} as='div'>
                    View Applications
                </Sidebar.Item>
                </Link>
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer'>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
