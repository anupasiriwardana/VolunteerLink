import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Components/Header'
import Footer from './Components/Footer'
import VolPrivateRoute from './Components/VolPrivateRoute'
import RecPrivateRoute from './Components/RecPrivateRoute'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import VolSignUp from './Pages/VolSignUp'
import RecSignUp from './Pages/RecSignUp'
import VolDashboard from './Pages/VolDashboard'
import RecDashboard from './Pages/RecDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        {/* all the pages within the website are implemented below */}
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/vol-sign-up" element={<VolSignUp/>}/>
        <Route path="/rec-sign-up" element={<RecSignUp/>}/>
        <Route element={<VolPrivateRoute/>} >
          <Route path="/vol-dashboard" element={<VolDashboard/>}/>
        </Route>
        <Route element={<RecPrivateRoute/>} >
          <Route path="/rec-dashboard" element={<RecDashboard/>}/>
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
