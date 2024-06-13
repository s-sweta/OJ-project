import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../CSS/forgotPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
    if (name === "newPassword") setNewPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        '/changePassword',
        { email, username, password, newPassword },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      navigate("/login");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="resetPassword-container">
      <h2 className="resetPassword-title">Change Password</h2>
      <form onSubmit={handleSubmit}>
      <div className="resetPassword-group">
          <label className="resetPassword-label" htmlFor="username">
            Username:
          </label>
          <input
            className="resetPassword-input"
            type="text"
            name="username"
            value={username}
            placeholder="Enter your Username"
            onChange={handleOnChange}
          />
        </div>
        <div className="resetPassword-group">
          <label className="resetPassword-label" htmlFor="email">
            Email:
          </label>
          <input
            className="resetPassword-input"
            type="email"
            name="email"
            value={email}
            placeholder="Enter your Email"
            onChange={handleOnChange}
          />
        </div>
        
        <div className="resetPassword-group">
          <label className="resetPassword-label" htmlFor="password">
            Current Password:
          </label>
          <input
            className="resetPassword-input"
            type="password"
            name="password"
            value={password}
            placeholder="Enter your Current Password"
            onChange={handleOnChange}
          />
        </div>
        <div className="resetPassword-group">
          <label className="resetPassword-label" htmlFor="newPassword">
            New Password:
          </label>
          <input
            className="resetPassword-input"
            type="password"
            name="newPassword"
            value={newPassword}
            placeholder="Enter your New Password"
            onChange={handleOnChange}
          />
        </div>
        <button className="resetPassword-button" type="submit">
          Submit
        </button>
        {message && <span className="resetPassword-message">{message}</span>}
        {error && <span className="resetPassword-error">{error}</span>}
      </form>
    </div>
  );
};

export default ResetPassword;
