import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Register'
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './pages/Dashboard'
import ProblemList from './pages/ProblemList'
import EditProblem from './pages/UpdateProblem'
import AddProblem from './pages/AddProblem'
import ProblemPage from './pages/problem'
import axios from 'axios'
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast'



axios.defaults.baseURL =import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true;


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Toaster position='bottom-left' toastOptions={{duration: 2000}} />
      <Routes>
        <Route path ='/' element={<Home/>} />
        <Route path ='/login' element={<Login/>} />
        <Route path ='/loggedIn' element={<Dashboard/>} />
        <Route path ='/register' element={<Signup/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path ='/dashboard' element={<Dashboard/>} />
        <Route path ='/problems' element={<ProblemList/>} />
        <Route path="/problems/:id" element={<EditProblem />} />
        <Route path="/addProblem" element={<AddProblem />} />
        <Route path="/problem/:id" element={<ProblemPage/>}/>
      </Routes>
    </AuthProvider>
  )
}

export default App

