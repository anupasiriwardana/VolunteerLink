import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import VolDashSidebar from '../Components/VolDashSidebar';
import VolDashProfile from '../Components/VolDashProfile';
import VolDashProjects from '../Components/VolDashProjects';

export default function Dashboard() {

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
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <VolDashSidebar/>
      </div>
      {/* profile... */}
      {tab === 'profile' && <VolDashProfile/>} {/* DashProfile is only visible when we're in the profile tab */}
      { tab === 'projects' && <VolDashProjects/> } {/* DashPosts is only visible when we're in the posts tab */}
    </div>
  )
}
