import {useContext} from 'react';
import {Link} from 'react-router-dom'
import { UserContext } from '../../context/userContext';

export default function Dashboard() {
    const {user} = useContext(UserContext)
  return (
    <div>
      <h1>Dashboard</h1>
      {!!user && (<h2>Hi {user.name}</h2>)}
      <Link to = '/addProblem'>Add Problem </Link>
    </div>
  );
}
