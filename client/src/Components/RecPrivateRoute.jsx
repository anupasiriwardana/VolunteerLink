//To make dashboard private

import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function RecPrivateRoute() {

  const {currentUser} = useSelector(state => state.user);
  
  return (
    (currentUser && (currentUser.userType === 'organization-recruiter' || currentUser.userType === 'independent-recruiter')) ? 
      <Outlet /> : <Navigate to='sign-in'/>
  )
}
