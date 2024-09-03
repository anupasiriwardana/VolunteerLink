import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import RecDashSidebar from '../Components/RecDashSidebar';
import RecDashIndRecProfile from '../Components/RecDashIndRecProfile';
import RecDashOrgRecProfile from '../Components/RecDashOrgRecProfile';
import RecDashViewProject from '../Components/RecDashViewProject';
import RecDashCreateProject from '../Components/RecDashCreateProject';
import RecDashApplications from '../Components/RecDashApplications';
import { useSelector } from 'react-redux';

export default function Dashboard() {

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

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <RecDashSidebar/>
      </div>
      {/* profile... */}
      { tab === 'ind-rec-profile' && <RecDashIndRecProfile/>} {/* DashProfile is only visible when we're in the profile tab */}
      { tab === 'org-rec-profile' && <RecDashOrgRecProfile/>} {/* DashProfile is only visible when we're in the profile tab */}
      { tab === 'view-projects' && <RecDashViewProject/> } {/* DashPosts is only visible when we're in the posts tab */}
      { tab === 'create-projects' && <RecDashCreateProject/> } {/* DashPosts is only visible when we're in the posts tab */}
      { tab === 'applications' && <RecDashApplications/> } {/* DashPosts is only visible when we're in the posts tab */}
    </div>
  )
}
