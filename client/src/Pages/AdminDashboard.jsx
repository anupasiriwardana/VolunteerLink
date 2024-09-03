import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Importing components
import AdminDashSidebar from '../Components/AdminDashSidebar';
import AdminDashProfile from '../Components/AdminDashProfile';
import AdminDashProjects from '../Components/AdminDashProjects';
import AdminDashRecruiters from '../Components/AdminDashRecruiters';
import AdminDashVolunteers from '../Components/AdminDashVolunteers';
import VolunteerProfile from '../Components/AdminDashVolunteerProfile';
import RecruiterProfile from '../Components/AdminDashRecruiterProfile';
import ProjectInfo from '../Components/AdminDashProjectInfo';

export default function Dashboard() {

  const navigate = useNavigate();
  const location = useLocation(); // Access URL search params
  const [tab, setTab] = useState('');
  const [urlSection, setUrlSection] = useState(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    const sectionFromUrl = urlParams.get('section');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    if(sectionFromUrl){
      setUrlSection(sectionFromUrl);
    }
    if(!tabFromUrl){
      //eg : when url is just /admin, means no tab value, so we'll set starting page to the tab recruiters
      navigate('/admin?tab=recruiters&section=recruiters');
    }
  }, [location.search]); // Update when location.search or location.pathname updates

  return (
    <div className='min-h-screen bg-[#f1f1f1] flex flex-col md:flex-row w-full'> 
      <div className='md:w-64'>
        <AdminDashSidebar/>
      </div>
      <div className='flex-1 p-4'> 
        {tab === 'profile' && <AdminDashProfile/>} 
        
        {tab === 'recruiters' && urlSection == 'recruiters' && <AdminDashRecruiters/>}
        {tab === 'recruiters' && urlSection == 'recruiterprofile' && <RecruiterProfile/>}
        
        {tab === 'volunteers' && urlSection == 'volunteers' && <AdminDashVolunteers/>}
        {tab === 'volunteers' && urlSection == 'volunteerprofile' && <VolunteerProfile/>}
        
        {tab === 'projects' && urlSection =='projects' && <AdminDashProjects/>}
        {tab === 'projects' && urlSection == 'projectinfo' && <ProjectInfo/>}
      </div>
    </div>
  )
}
