//To make dashboard private

import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function VolPrivateRoute() {

  const {currentUser} = useSelector(state => state.user);
  
  return (
    (currentUser && currentUser.userType === 'volunteer') ? 
      <Outlet/> : <Navigate to='sign-in'/>
  )
}
