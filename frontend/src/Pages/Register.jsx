import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const { name, username, email, password } = inputValue;
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const validateForm = (data, cnfpas) => {
    const errors = {};
    if (!data.name.trim()) {
      errors.name = " Name is required";
    }
    if (!data.username.trim()) {
      errors.username = "user Name is required";
    }
    
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (!cnfpas.trim()) {
      errors.confPass = "Cofirm Password is required";
    } else if (cnfpas !== data.password) {
      errors.confPass = "Passwords do not match";
    }
    return errors;
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };
  const handleOnChange1 = (e) => {
    const { name, value } = e.target;
    setConfirmPassword(value);
    
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(inputValue, confirmPassword);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:5000/register",
          {
            ...inputValue,
          },
          { withCredentials: true }
        );
        const { success, message } = response.data;
  
        if (success) {
          setInputValue({
            name: "",
            username: "",
            email: "",
            password: "",
          });
          navigate("/");
        }
        
        console.log(response);
      } catch (error) {
        // setInputValue({
        //   name: "",
        //   username: "",
        //   email: "",
        //   password: "",
        // });
        // setConfirmPassword("");
        setSubmitError(error.response.data.message);
        console.log(error.response.data.message);
      }
    } else {
      // setInputValue({
      //   name: "",
      //   username: "",
      //   email: "",
      //   password: "",
      // });
      // setConfirmPassword("");
      setSubmitError("form submission failed");
      console.log("form submission failed");
    }
  };
  

  return (
    <>
      <div className="sigForm-container">
        <h2 className="sigForm-title">Signup Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="sigForm-group">
            <label className="sigForm-label" htmlFor="name">
               Name:
            </label>
            <input
              className="sigForm-input"
              type="text"
              name="name"
              value={name}
              placeholder="Enter your  Name"
              onChange={handleOnChange}
            />
            {errors.name && (
              <span className="sigError-message">{errors.name}</span>
            )}
          </div>
          <div className="sigForm-group">
            <label className="sigForm-label" htmlFor="username">
              user Name:
            </label>
            <input
              className="sigForm-input"
              type="text"
              name="username"
              value={username}
              placeholder="Enter your user Name"
              onChange={handleOnChange}
            />
            {errors.username && (
              <span className="sigError-message">{errors.username}</span>
            )}
          </div>
          
          <div className="sigForm-group">
            <label className="sigForm-label" htmlFor="email">
              Email:
            </label>
            <input
              className="sigForm-input"
              type="email"
              name="email"
              value={email}
              placeholder="Enter your Email"
              onChange={handleOnChange}
            />
            {errors.email && (
              <span className="sigError-message">{errors.email}</span>
            )}
          </div>
          <div className="sigForm-group">
            <label className="sigForm-label" htmlFor="password">
              Password:
            </label>
            <input
              className="sigForm-input"
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
            {errors.password && (
              <span className="sigError-message">{errors.password}</span>
            )}
          </div>
          <div className="sigForm-group">
            <label className="sigForm-label" htmlFor="confirmPassword">
              Confirm Password:
            </label>
            <input
              className="sigForm-input"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Enter the same password"
              onChange={handleOnChange1}
            />
            {errors.confPass && (
              <span className="sigError-message">{errors.confPass}</span>
            )}
          </div>
          <button className="sigSubmit-button" type="submit">
            Submit
          </button>
          <span>
            &nbsp; Already have an account? <Link to={"/login"}>Login</Link>
          </span>
          {submitError && <span className="sigError-message">{submitError}</span>}
        </form>
      </div>
    </>
  );
};

export default Signup;
