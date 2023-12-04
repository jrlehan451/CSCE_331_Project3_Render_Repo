import React, { useState, useEffect } from "react";
import axios from "axios";
import './Login.css'
// import './LoginHC.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showForm, setShowLoginForm] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await axios.get(
          "https://thealley.onrender.com/login_jsx"
        );
        const jsonVals = await response.data;
        console.log("Working");
        console.log(jsonVals.data.employees);
        setEmployees(jsonVals.data.employees.rows);
      } catch (err) {
        console.log("ERROR");
        console.error(err.message);
      }
    };

    getEmployees();
  }, []);

  const authenticateUser = () => {
    for (const employee of employees) {
      if (employee.first_name === username && employee.password === password) {
        // Navigate to another page or perform an action upon successful authentication
        console.log('Authentication successful!');
        var currLocation = window.location.href;
        if(employee.first_name === "customer" && employee.last_name === "profile"){
            window.location.href = currLocation + "customer";
        }
        else if(employee.is_manager){
            window.location.href = currLocation + "manager";
        }
        else{
            window.location.href = currLocation + "DrinkOptions";
        }
        return;
      }
    }

    alert('Authentication failed. Please try again.');
  };

  const showLoginForm = () => {
    setShowLoginForm(!showForm);
  };

  const highContrastMode = () => {
    const body = document.querySelector('body');
    if (body.classList.contains("contrast")) {
      body.classList.remove("contrast");
      sessionStorage.setItem("high_contrast_mode", false);
    } else {
      body.classList.add("contrast");
      sessionStorage.setItem("high_contrast_mode", true);
    }
  }

  const loadCurrentMode = () => {
    if (sessionStorage.getItem("high_contrast_mode") == true) {
      const body = document.querySelector('body');
      if (body.classList.contains("contrast") == false) {
        body.classList.add("contrast");
      }
    } else {
      const body = document.querySelector('body');
      body.classList.remove("contrast");
    }
  }

  return (
    <div onLoad={() => loadCurrentMode()}>
      <button onClick={highContrastMode}>test</button>
      <h1 className="loginTitle">The Alley</h1>
      <div className="button-panel">
        <div className="top-button">
          <button className="large-button" onClick={showLoginForm} style={{ display: showForm ? 'none' : 'block' }}>Login</button>
          <div className="login-form" style={{ display: showForm ? 'block' : 'none' }}>
            <input type="text" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button className="x-button" onClick={showLoginForm}>X</button>
            <button className="login-button" onClick={authenticateUser}>Login</button>
          </div>
        </div>
        <div className="lower-button">
          <button className="large-button" onClick={() => {window.location.href += "Menu" }}>View Menu</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
