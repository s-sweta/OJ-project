// context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  isLogged: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isLogged: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isLogged: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    axios.get('/loggedIn', { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          dispatch({ type: 'LOGIN', payload: response.data.user });
        }
      })
      .catch(error => {
        console.error('Error getting user:', error);
      });
  }, []);

  const logout = () => {
    axios.get('/logout', { withCredentials: true })
      .then(() => {
        dispatch({ type: 'LOGOUT' });
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <AuthContext.Provider value={{ ...state, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
