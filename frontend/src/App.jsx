import './App.css'
import {Routes, Route} from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import Home from '../src/Pages/Home'
import Register from './Pages/Register';
import Login from './Pages/Login';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path = '/' element={<Home />} />
        <Route path = '/register' element={<Register />} />
        <Route path = '/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
