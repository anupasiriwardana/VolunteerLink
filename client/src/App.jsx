import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import VolPrivateRoute from './Components/VolPrivateRoute';
import RecPrivateRoute from './Components/RecPrivateRoute';
import AdminPrivateRoute from './Components/AdminPrivateRoute';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import VolSignUp from './Pages/VolSignUp';
import RecSignUp from './Pages/RecSignUp';
import VolDashboard from './Pages/VolDashboard';
import RecDashboard from './Pages/RecDashboard';
import AdminDashboard from './Pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  // List of private routes
  const privateRoutes = [
    '/volunteer',
    '/rec-dashboard',
    '/admin',
  ];

  // Check if the current route is a private route
  const isPrivateRoute = privateRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!isPrivateRoute && <Header />} {/* Render Header only if it's not a private route */}
      <Routes>
        {/* all the pages within the website are implemented below */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/vol-sign-up" element={<VolSignUp />} />
        <Route path="/rec-sign-up" element={<RecSignUp />} />
        <Route element={<VolPrivateRoute />} >
          <Route path="/volunteer" element={<VolDashboard />} />
        </Route>
        <Route element={<RecPrivateRoute />} >
          <Route path="/rec-dashboard" element={<RecDashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />} >
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}
