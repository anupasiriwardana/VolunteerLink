import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Importing components
import AdminDashSidebar from '../Components/AdminDashSidebar';
import AdminDashProfile from '../Components/AdminDashProfile';
import AdminDashProjects from '../Components/AdminDashProjects';
import AdminDashRecruiters from '../Components/AdminDashRecruiters';
import AdminDashVolunteers from '../Components/AdminDashVolunteers';

export default function Dashboard() {

  const location = useLocation(); // Initialize useLocation
  const [tab, setTab] = useState('');
  
  // Each time we come to this page, we get its tab
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // URLSearchParams returns parameters
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl) { // If the tab from the URL is not null, do
      setTab(tabFromUrl)
    }
  }, [location.search]) // This useEffect renders every time location.search updates

  return (
    <div className='min-h-screen bg-[#f1f1f1] flex flex-col md:flex-row w-full'> {/* Set width to full */}
      <div className='md:w-64'> {/* Fixed width for the sidebar */}
        {/* Sidebar */}
        <AdminDashSidebar/>
      </div>
      <div className='flex-1 p-4'> {/* Flex-grow to occupy remaining space */}
        {/* Conditional rendering based on tab */}
        {tab === 'profile' && <AdminDashProfile/>} {/* DashProfile is only visible when we're in the profile tab */}
        {tab === 'recruiters' && <AdminDashRecruiters/>} {/* DashRecruiters is only visible when we're in the recruiters tab */}
        {tab === 'volunteers' && <AdminDashVolunteers/>} {/* DashVolunteers is only visible when we're in the volunteers tab */}
        {tab === 'projects' && <AdminDashProjects/>} {/* DashProjects is only visible when we're in the projects tab */}
      </div>
    </div>
  )
}

