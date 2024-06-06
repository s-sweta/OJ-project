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
import ProblemPage from './pages/problem'
import SubmitCode from './pages/SubmitCode' // Import the component for submitting code
import { UserProvider } from '../context/userContext'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserProvider>
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
        <Route path="/problem/:id" element={<ProblemPage/>}/>
        <Route path="/submit/:problemId" element={<SubmitCode />} />
      </Routes>
    </UserProvider>
  )
}

export default App

