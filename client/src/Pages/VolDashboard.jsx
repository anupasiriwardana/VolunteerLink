import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import React from 'react';

//importinng components
import VolDashSidebar from '../Components/VolDashSidebar';
import VolDashProfile from '../Components/VolDashProfile';
import VolDashOpportunities from '../Components/VolDashOpportunities';
import VolDashAppliedProjects from '../Components/VolDashAppliedProjects'
import VoldDashOpportInfo from '../Components/VolDashOpportInfo';
import VolDashApplication from '../Components/VolDashApplicatioin';
import GetVolunteerInfo from '../Components/VolDashVolunteerInfo';

export default function Dashboard() {

  const navigate = useNavigate();
  const location = useLocation(); //initialize useLocation
  const [tab, setTab] = useState('');
  const [urlSection, setUrlSection] = useState(null);
  const [volunteerDetailsPresent, setVolunteerDetailsPresent] = useState(false);
  const { currentUser } = useSelector(state => state.user);
  const [loading, setLoading] = useState(true);

  //evach time we come to this page, we get irs tab⬇️
  useEffect(() => {
    if (!currentUser) {
      return;//if no current user no need to fetch or redirect
    }
    const urlParams = new URLSearchParams(location.search); //URLSearchParams returns parameters
    const tabFromUrl = urlParams.get('tab');
    const sectionFromUrl = urlParams.get('section');
    if (tabFromUrl) { //if the tab from the url is not null, do⬇️
      setTab(tabFromUrl)
    }
    if (sectionFromUrl) {
      setUrlSection(sectionFromUrl);
    }

    //checking if volunteerDetails present and redirecting them to save volunteerInfo first if not, if present redirect to opport tab
    const fetchVolunteerData = async () => {
      try {
        const response = await fetch(`/api/volunteer/profile/${currentUser.user._id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        } else {
          if (data.volunteerDetails) {
            setVolunteerDetailsPresent(true);
            if(location.pathname == "/volunteer" && !location.search){ //ensuring no query parameters
              //when url is just /volunteer -> redirect to opportunities tab ->why just /volunteer -> see signin.jsx-> that's how we hv set up after signin
              navigate('/volunteer?tab=opportunities&section=opportunities');
            }
          }else{//volunteer details are not present-> so we gotta get them 1st
            navigate('/volunteer?tab=volunteerinfo');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchVolunteerData();
  }, [location.search, volunteerDetailsPresent,tab, navigate, currentUser]) //this useEffect renders every time location.search updates

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>

      {/* sidebar is not needed in initial volunteer data get and present only if volunteerdetails are presnet*/}
      {
        tab != 'volunteerinfo' && volunteerDetailsPresent && (
          <div className='md:w-56'>
            <VolDashSidebar />
          </div>)
      }
      {tab === 'volunteerinfo' && !volunteerDetailsPresent && <GetVolunteerInfo />}
      {tab === 'profile' && <VolDashProfile />}

      {tab === 'opportunities' && urlSection == 'opportunities' && <VolDashOpportunities />}
      {tab === 'opportunities' && urlSection == 'details' && <VoldDashOpportInfo />}

      {tab === 'appliedprojects' && urlSection == 'projects' && <VolDashAppliedProjects />}
      {tab === 'appliedprojects' && urlSection == 'projectinfo' && <VoldDashOpportInfo />}
      {tab === 'appliedprojects' && urlSection == 'myapplication' && <VolDashApplication />}
    </div>
  )
}
