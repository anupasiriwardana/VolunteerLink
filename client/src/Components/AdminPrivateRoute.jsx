//To make dashboard private
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function AdminPrivateRoute() {

  const {currentUser} = useSelector(state => state.user);
  
  return (
    (currentUser && currentUser.userType === 'admin') ? 
      <Outlet/> : <Navigate to='sign-in'/>
  )
}