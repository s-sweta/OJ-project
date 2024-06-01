import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const loginUser = async (userData) => {
        try {
            const response = await axios.post('/login', userData);
            setUser(response.data);
            toast.success('Login Successful!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('Login Failed');
        }
    };

    const logout = async () => {
        try {
            await axios.get('/logout');
            setUser(null);
            toast.success('Logged out successfully');
            navigate('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Logout Failed');
        }
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
