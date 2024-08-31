import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import PrivateRoute from './Components/PrivateRoute';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import VolSignUp from './Pages/VolSignUp';
import RecSignUp from './Pages/RecSignUp';
import VolDashboard from './Pages/VolDashboard';
import RecDashboard from './Pages/RecDashboard';
import RecDashCreateProject from './Components/RecDashCreateProject';
import AdminDashboard from './Pages/AdminDashboard';

// Importing admin dashboard components
import AdminDashProfile from './Components/AdminDashProfile';
import AdminDashProjects from './Components/AdminDashProjects';
import AdminDashRecruiters from './Components/AdminDashRecruiters';
import AdminDashVolunteers from './Components/AdminDashVolunteers';

function AppContent() {
  const location = useLocation();

  // Exclude the header for admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        {/* All the pages within the website are implemented below */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/vol-sign-up" element={<VolSignUp />} />
        <Route path="/rec-sign-up" element={<RecSignUp />} />
        <Route path="/vol-dashboard" element={<VolDashboard />} />
        <Route path="/rec-dashboard" element={<RecDashboard />} />
        <Route path="/rec-dashCreateProject" element={<RecDashCreateProject />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/recruiters" element={<AdminDashRecruiters />} />
        <Route path="/admin/volunteers" element={<AdminDashVolunteers />} />
        <Route path="/admin/volunteerprojects" element={<AdminDashProjects />} />
        <Route path="/admin/profile" element={<AdminDashProfile />} />

        {/* Dashboards should be accessed through a private route upon sign-in */}
        {/* <Route element={<PrivateRoute/>}> */}
        {/* </Route> */}
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
