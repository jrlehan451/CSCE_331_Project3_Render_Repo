import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./Login.css";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../components/SpeechUtils";

/**
 * @description This component uses OAL Authentication to log users into the web application and redirect them to the correct view.
 * @component Login
 * @returns login component
 */
const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowLoginForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [weather, setWeather] = useState(null);
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);

  const { isHoverEnabled, handleToggleHover } = props;
  const [isHoverEnabledState, setIsHoverEnabled] = useState(false);

  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
    //handleToggleHover();
  };

  const handleGridCellHover = (params) => {
    console.log("igredient handleGridCellHover is called!");

    if (isHoverEnabled) {
      console.log("isHoverEnabled is false");

      const cellContent = params.value.toString();
      console.log("Cell Content:", cellContent);

      // Call the handleHover function to initiate text-to-speech
      handleTableFieldSpeech(cellContent);
      //handleTableFieldSpeech("This is a test");
    }
  };

  /**
   * @description uses API call to retreive weather information and display it on the home page
   * @function getWeather
   */
  useEffect(() => {
    const getWeather = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude: " + latitude);
            console.log("Longitude: " + longitude);

            fetchWeatherData(latitude, longitude);
          },
          function (error) {
            console.error("Error getting location: " + error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const response = await axios.get("https://thealley.onrender.com/weather", {
          params: {
            latitude,
            longitude,
          },
        });
        const jsonVals = await response.data;
        console.log("[Success] Received Weather Data");
        console.log(jsonVals.data.data);
        setWeather(jsonVals.data.data);
      } catch (err) {
        console.log("[ERROR] Retrieving Weather Data");
        console.error(err.message);
      }
    };

    getWeather();
  }, []);

  /**
   * @description uses a server side API call to get informtion about all the employees and corresponding login information
   * @function getEmployees
   */
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await axios.get(
          "https://thealley.onrender.com/login_jsx"
        );
        const jsonVals = await response.data;
        console.log("[Success] Received Employees");
        console.log(jsonVals.data.employees);
        setEmployees(jsonVals.data.employees.rows);
      } catch (err) {
        console.log("[ERROR] Retrieving Employees");
        console.error(err.message);
      }
    };

    if (user) {
      console.log("authenticated");
      console.log(user.name);
      setIsLoading(true);
      getEmployees();
    }
  }, [isAuthenticated]);

  /**
   * @description determines if the user is authenticated or not
   * @function isAuthenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      authenticateUser();
    }
  }, [employees]);

  /**
   * @description logs in an authenticated user
   * @function login
   */
  function login() {
    if (isAuthenticated) {
      logout();
    }
    loginWithRedirect();
  }

  /**
   * @description redirects authenticated users to the correct view of the web application based on their credentials
   * @function authenticateUser
   * @returns redirect of an authenticated user to the appropriate view
   */
  const authenticateUser = () => {
    for (const employee of employees) {
      if (employee.first_name === user.name) {
        console.log("Authentication successful!");
        var currLocation = window.location.href;
        if (
          employee.first_name === "customer" &&
          employee.last_name === "profile"
        ) {
          localStorage.setItem("Role", "Customer");
          window.location.href = currLocation + "customer";
        } else if (employee.is_manager) {
          localStorage.setItem("Role", "Manager");
          window.location.href = currLocation + "manager";
        } else {
          localStorage.setItem("Role", "Cashier");
          window.location.href = currLocation + "DrinkOptions";
        }
        return;
      }
    }

    alert("Authentication failed. Please try again.");
  };

  /**
   * @description displays the login form to the user to enter their credentials
   * @function showLoginForm
   */
  const showLoginForm = () => {
    setShowLoginForm(!showForm);
  };

  /**
   * @description gets the associated weather image based on the current weather information
   * @function getWeatherImage
   */
  const getWeatherImage = () => {
    var image;
    switch (weather.weather[0].main) {
      case "Rain":
        image = "rain";
        break;
      case "Snow":
        image = "snow";
        break;
      case "Thunderstorm":
        image = "thunderstorm";
        break;
      case "Drizzle":
        image = "drizzle";
        break;
      case "Clouds":
        image = "cloudy";
        break;
      default:
        image = "sunny";
        break;
    }
    return "/weather/" + image + ".png";
  };

  function capitalizeName(name, delimiter) {
    const words = name.split(delimiter);

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");
  }

  return (
    <div>
      {isLoading ? (
        <div
          className="loading-screen"
          isHoverEnabled={isHoverEnabled}
          handleToggleHover={handleToggleHover}
        >
          Loading...
        </div>
      ) : (
        <>
          <div
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            <h1 className="loginTitle">The Alley</h1>
          </div>

          <div className="weather-panel">
            {weather && (
              <div className="weather-panel">
                <div className="left-panel">
                  <img src={getWeatherImage()} alt="" />
                </div>
                <div className="right-panel">
                  <div className="top-right-panel">
                    <h1 className="city-weather-text">
                      {weather.name} {Number(weather.main.temp).toFixed(0)}°F
                    </h1>
                  </div>
                  <div className="bottom-right-panel">
                    <p className="weather-description-text">
                      {capitalizeName(weather.weather[0].description, " ")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {weather && (
            <div className="weather-panel">
              <div
                className="left-panel"
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
              >
                <img src={getWeatherImage()} alt="" />
              </div>
              <div className="right-panel">
                <div className="top-right-panel">
                  <h1
                    className="city-weather-text"
                    onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                    onMouseOut={handleMouseOut}
                  >
                    {weather.name} {Number(weather.main.temp).toFixed(0)}°F
                  </h1>
                </div>
                <div className="bottom-right-panel">
                  <p
                    className="weather-description-text"
                    onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                    onMouseOut={handleMouseOut}
                  >
                    {capitalizeName(weather.weather[0].description, " ")}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="button-panel">
            <div className="top-button">
              <button
                className="large-button"
                onClick={login}
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
                style={{ display: showForm ? "none" : "block" }}
              >
                Login
              </button>
              <div
                className="login-form"
                style={{ display: showForm ? "block" : "none" }}
              >
                <input
                  type="text"
                  value={username}
                  placeholder="Username"
                  onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                  onMouseOut={handleMouseOut}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="x-button"
                  onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                  onMouseOut={handleMouseOut}
                  onClick={showLoginForm}
                >
                  X
                </button>
                <button
                  className="login-button"
                  onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                  onMouseOut={handleMouseOut}
                  onClick={authenticateUser}
                >
                  Login
                </button>
              </div>
            </div>
            <div className="lower-button">
              <button
                className="large-button"
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
                onClick={() => {
                  window.location.href += "Menu";
                }}
              >
                View Menu
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
