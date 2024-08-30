import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiUser, HiArrowSmRight, HiFolder } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';

export default function DashSidebar() {

    const location = useLocation(); //initialize useLocation
    const [tab, setTab] = useState('');
    
    //evach time we come to this page, we get irs tab⬇️
    useEffect( ()=> {
      const urlParams = new URLSearchParams(location.search); //URLSearchParams returns parameters
      const tabFromUrl = urlParams.get('tab');
      if(tabFromUrl){ //if the tab from the url is not null, do⬇️
        setTab(tabFromUrl)
      }
    }, [location.search]) //this useEffect renders every time location.search updates  

  return (
    <Sidebar className='w-full md:w-56 '>
        <Sidebar.Items >
            <Sidebar.ItemGroup className='flex flex-col gap-1 bg-slate-300 p-3 '>
                <Link to='/vol-dashboard?tab=profile'>  {/* when profile is clicked, navigate to profile tab */}
                {/* active only when in the profile tab ⬇️ */}
                <Sidebar.Item active={ tab === 'profile'} icon={HiUser} as='div' className='mt-3'>
                    Profile
                </Sidebar.Item>
                </Link>
                <Link to='/vol-dashboard?tab=projects'>
                <Sidebar.Item active={ tab === 'projects'} icon={HiFolder} as='div'>
                    My Projects
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
