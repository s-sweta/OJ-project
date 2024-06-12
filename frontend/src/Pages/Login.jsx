import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../CSS/login.css'

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000",
          {},
          { withCredentials: true }
        );
        if (response.data.success) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log(error.response.data.message);
        navigate("/login");
      }
    };
    verifyCookie();
  }, []);
  
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const validateForm = (data) => {
    const errors = {};
    if (!data.email.trim()) {
      errors.email = "Email is required";
    }
    if (!data.password.trim()) {
      errors.password = "Password is required";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(inputValue);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:5000/login",
          { ...inputValue },
          { withCredentials: true }
        );
        const { success, message } = response.data;
        if (success) {
          setInputValue({
            email: "",
            password: "",
          });
          navigate("/dashboard");
        } else {
          setInputValue({
            email: "",
            password: "",
          });
          setSubmitError("Login error");
          console.log("Login error");
        }
      } catch (error) {
        setInputValue({
          email: "",
          password: "",
        });
        setSubmitError(error.response.data.message);
        console.log(error.response.data.message);
      }
    } else {
      setInputValue({
        email: "",
        password: "",
      });
      setSubmitError("Login submission failed");
      console.log("Login submission failed");
    }
  };

  return (
    <>
      <div className="logForm-container">
        <h2 className="logForm-title">Login Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="logForm-group">
            <label className="logForm-label" htmlFor="email">
              Email:
            </label>
            <input
              className="logForm-input"
              type="email"
              name="email"
              value={email}
              placeholder="Enter your Email"
              onChange={handleOnChange}
            />
            {errors.email && (
              <span className="logError-message">{errors.email}</span>
            )}
          </div>
          <div className="logForm-group">
            <label className="logForm-label" htmlFor="password">
              Password:
            </label>
            <input
              className="logForm-input"
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
            {errors.password && (
              <span className="logError-message">{errors.password}</span>
            )}
          </div>
          <button className="logSubmit-button" type="submit">
            Submit
          </button>
          <div className="logForm-links">
            <span>
              Don't have an Account? <Link to="/register">Register</Link>
            </span>
            <span>
              Forgot your password? <Link to="/forgot-password">Reset Password</Link>
            </span>
          </div>
          {submitError && <span className="logError-message">{submitError}</span>}
        </form>
      </div>
    </>
  );
};

export default Login;
