import {useContext} from 'react';
import {Link} from 'react-router-dom'
import '../CSS/dashboard.css'


export default function Dashboard() {
    
  return (
    <div className='container'>
      <h1>Dashboard</h1>
      
      <Link to = '/addProblem'>Add Problem </Link>
    </div>
  );
}
