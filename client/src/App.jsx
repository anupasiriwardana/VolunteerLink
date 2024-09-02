import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Components/Header'
import Footer from './Components/Footer'
import PrivateRoute from './Components/PrivateRoute'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Dashboard from './Pages/Dashboard'
import About from './Pages/About'
import FindOppotunities from './Pages/FindOppotunities'
import RecruitVolunteers from './Pages/RecruitVolunteers'

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        {/* all the pages within the website are implemented below */}
        <Route path="/" element={<Home/>}/>
        <Route path="/about"  element = {<About/>}/> 
        <Route path="/sign-in" element={<SignIn/>}/> 
        <Route path="/sign-up" element={<SignUp/>}/> 
        <Route path='/find-oppotunities'  element={<FindOppotunities/>}/> 
        <Route path='/recruit-volunteers' element={<RecruitVolunteers/>}/> 
        <Route element={PrivateRoute}>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter> 
  )
}
