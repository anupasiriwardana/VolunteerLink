import { useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';

// Importing components
import AdminDashSidebar from '../Components/AdminDashSidebar';
import AdminDashProfile from '../Components/AdminDashProfile';
import AdminDashProjects from '../Components/AdminDashProjects';
import AdminDashRecruiters from '../Components/AdminDashRecruiters';
import AdminDashVolunteers from '../Components/AdminDashVolunteers';
import VolunteerProfile from '../Components/AdminDashVolunteerProfile';
import RecruiterProfile from '../Components/AdminDashRecruiterProfile';

export default function Dashboard() {

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
        
        {tab === 'projects' && <AdminDashProjects/>}
      </div>
    </div>
  )
}
