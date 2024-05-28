import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProblemList from './pages/ProblemList'
import EditProblem from './pages/UpdateProblem'
import AddProblem from './pages/AddProblem'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import {UserContextProvider} from '../context/userContext'


axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Navbar />
      <Toaster position='bottom-left' toastOptions={{duration: 2000}} />
      <Routes>
        <Route path ='/' element={<Home/>} />
        <Route path ='/login' element={<Login/>} />
        <Route path ='/register' element={<Register/>} />
        <Route path ='/dashboard' element={<Dashboard/>} />
        <Route path ='/problems' element={<ProblemList/>} />
        <Route path="/problems/:id" element={<EditProblem />} />
        <Route path="/addProblem" element={<AddProblem />} />

      </Routes>
    </UserContextProvider>
  )
}

export default App
