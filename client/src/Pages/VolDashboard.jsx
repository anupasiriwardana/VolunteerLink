import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

//importinng components
import VolDashSidebar from '../Components/VolDashSidebar';
import VolDashProfile from '../Components/VolDashProfile';
import VolDashOpportunities from '../Components/VolDashOpportunities';
import VolDashMyProjects from '../Components/VolDashMyProjects'

export default function Dashboard() {

  const navigate = useNavigate();
  const location = useLocation(); //initialize useLocation
  const [tab, setTab] = useState('');
  const [urlSection, setUrlSection] = useState(null);
  
  //evach time we come to this page, we get irs tab⬇️
  useEffect( ()=> {
    const urlParams = new URLSearchParams(location.search); //URLSearchParams returns parameters
    const tabFromUrl = urlParams.get('tab');
    const sectionFromUrl = urlParams.get('section');
    if(tabFromUrl){ //if the tab from the url is not null, do⬇️
      setTab(tabFromUrl)
    }
    if(sectionFromUrl){
      setUrlSection(sectionFromUrl);
    }
    if(!tabFromUrl){
      //eg : when url is just /volunteer, means no tab value, so we'll set starting page to the tab find oprtunites
      navigate('/volunteer?tab=opportunities&section=opportunities');
    }
  }, [location.search]) //this useEffect renders every time location.search updates

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <VolDashSidebar/>
      </div>
      { tab === 'profile' && <VolDashProfile/>} 

      {tab === 'opportunities' && urlSection == 'opportunities' && <VolDashOpportunities/>}
      {/* {tab === 'opportunities' && urlSection == 'details' && <RecruiterProfile/>} */}

      {tab === 'appliedprojects' && urlSection == 'projects' && <VolDashMyProjects/>}
      {/* {tab === 'appliedprojects' && urlSection == 'myapplication' && <RecruiterProfile/>} */}
    </div>
  )
}
