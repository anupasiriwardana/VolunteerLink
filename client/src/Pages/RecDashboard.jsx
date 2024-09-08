import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import RecDashSidebar from '../Components/RecDashSidebar';
import RecDashIndRecProfile from '../Components/RecDashIndRecProfile';
import RecDashOrgRecProfile from '../Components/RecDashOrgRecProfile';
import RecDashViewProject from '../Components/RecDashViewProject';
import RecDashCreateProject from '../Components/RecDashCreateProject';
import RecDashApplications from '../Components/RecDashApplications';
import RecDashProjectInfo from '../Components/RecDashProjectInfo';
import RecDashApplicationInfo from '../Components/RecDashApplicationInfo';
import { useSelector } from 'react-redux';
import { Button } from 'flowbite-react';

export default function Dashboard() {

  let link;
  const location = useLocation(); //initialize useLocation
  const [tab, setTab] = useState('');
  const [urlSection, setUrlSection] = useState(null);
  const { currentUser } = useSelector(state => state.user);
  const [ indRecDetailsExist, setIndRecDetailsExist ] = useState(false);
  const [ orgRecDetailsExist, setOrgRecDetailsExist ] = useState(false);
  const navigate = useNavigate();

  
  //evach time we come to this page, we get irs tab⬇️
  useEffect( ()=> {
    const urlParams = new URLSearchParams(location.search); //URLSearchParams returns parameters
    const tabFromUrl = urlParams.get('tab');
    const sectionFromUrl = urlParams.get('section');
    if(tabFromUrl){ //if the tab from the url is not null, do⬇️
      setTab(tabFromUrl)
    }
    if (sectionFromUrl) {
      setUrlSection(sectionFromUrl);
    }

    const fetchRecDetails = async () => {
      try {
        const res = await fetch(`/api/recruiter/profile/${currentUser.user._id}`);
        const data = await res.json();
        if (res.ok) {
          if(data.recruiterId){
            setIndRecDetailsExist(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    if ( currentUser.userType === 'independent-recruiter'){
      fetchRecDetails();
    }

    const fetchOrganization = async () => {
      try {
        const res = await fetch(`/api/recruiter/organization/${currentUser.user._id}`)  //here we add the query userId cuz that's wha we wanna search. 
        const data = await res.json()
        if (res.ok) {
          console.log(data);
          if(data._id){
            setOrgRecDetailsExist(true);
          }
          console.log('orgRec: ',orgRecDetailsExist);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    if ( currentUser.userType === 'organization-recruiter'){
      fetchOrganization();
    }
  }, [location.search, currentUser, indRecDetailsExist, orgRecDetailsExist]) //this useEffect renders every time location.search updates

  const showWelcomeMessage = () => {
    if(orgRecDetailsExist || indRecDetailsExist){
      return(
      <div className='flex flex-grow flex-col h-100vh justify-center items-center text-5xl gap-10' 
      style={{
        backgroundImage: 'url(https://yorkinternational.yorku.ca/files/2020/07/BackgroundImage-copy-1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <h1 className='text-white font-bold text-8xl'>Welcome Recruiter!</h1>
      </div>
      );
    } else {
      return(
      <div className='flex flex-grow flex-col h-100vh justify-center items-center text-5xl gap-10'
      style={{
        backgroundImage: 'url(https://yorkinternational.yorku.ca/files/2020/07/BackgroundImage-copy-1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <h1 className='text-white font-bold text-5xl'>Welcome Newcomer, excited to be here? <br/> Finish setting up your profile to continue.</h1>
      <Link to={currentUser.userType === 'organization-recruiter'
        ? '/rec-dashboard?tab=org-rec-profile'
        : '/rec-dashboard?tab=ind-rec-profile'
      }>
        <Button className="bg-green-500 mt-5" size='xl'>Proceed</Button>
      </Link>
    </div>
    );
    }
  }


  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <RecDashSidebar/>
      </div>
      
      { (tab === '') && showWelcomeMessage() }

      {/*profile... */}
      { tab === 'ind-rec-profile' && <RecDashIndRecProfile/> } {/* DashProfile is only visible when we're in the profile tab */}
      { tab === 'org-rec-profile' && <RecDashOrgRecProfile/> } {/* DashProfile is only visible when we're in the profile tab*/}
      
      { tab === 'view-projects' && urlSection == 'projects' && <RecDashViewProject/> } {/* DashPosts is only visible when we're in the posts tab */}
      { tab === 'view-projects' && urlSection == 'projectdetails' && <RecDashProjectInfo/> } {/* DashPosts is only visible when we're in the posts tab */}
      
      
      { tab === 'create-projects' && <RecDashCreateProject/> } {/* DashPosts is only visible when we're in the posts tab */}
      
      { tab === 'applications' && urlSection == 'applications' &&<RecDashApplications/> } {/* DashPosts is only visible when we're in the posts tab */}
      { tab === 'applications' && urlSection == 'info' &&<RecDashApplicationInfo/> } {/* DashPosts is only visible when we're in the posts tab */}
    </div>
  )
}
