import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUser } from '../../context/userContext';

export default function Login() {
    const { loginUser } = useUser();
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser(data);
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('Login Failed');
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <label>Email</label>
                <input
                    type='email'
                    placeholder='Enter your email'
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                <label>Password</label>
                <input
                    type='password'
                    placeholder='Password'
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                />
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}
