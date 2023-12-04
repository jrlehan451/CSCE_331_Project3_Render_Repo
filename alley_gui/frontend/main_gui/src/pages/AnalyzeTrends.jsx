import React, { useState, useEffect } from "react";
import axios from "axios";
import TrendTable from "../components/TrendTable";
import HomeButton from "./images/HomeButton.png";
import arrow from "./images/back_arrow.png";
import "./AnalyzeTrends.css";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../components/SpeechUtils";
import TextToSpeech from "../components/TextToSpeech";

const AnalyzeTrends = () => {
  const [selectedTrend, setSelectedTrend] = useState("Excess Report");
  const [startTimestamp, setStartTimestamp] = useState("");
  const [endTimestamp, setEndTimestamp] = useState(getCurrentDate());
  const [number, setNumber] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [table2Data, setTable2Data] = useState([]);
  const [isExcessReport, setIsExcessReport] = useState(true);

  const [isHoverEnabled, setIsHoverEnabled] = useState(false);
  const toggleHover = () => {
    setIsHoverEnabled((prevIsHoverEnabled) => !prevIsHoverEnabled);
  };
  const handleGridCellHover = (params) => {
    console.log("handleGridCellHover is called!");

    if (isHoverEnabled) {
      console.log("isHoverEnabled is false");

      const cellContent = params.value.toString();
      console.log("Cell Content:", cellContent);

      // Call the handleHover function to initiate text-to-speech
      handleTableFieldSpeech(cellContent);
      //handleTableFieldSpeech("This is a test");
    }
  };

  useEffect(() => {
    if (selectedTrend === "Excess Report") {
      setIsExcessReport(true);
      setEndTimestamp(getCurrentDate());
    } else {
      setIsExcessReport(false);
      setEndTimestamp("");
    }
    setStartTimestamp("");
    setNumber(1);
    setTableData([]);
    setTable2Data([]);
  }, [selectedTrend]);

  const generateTrend = async () => {
    let valid = true;

    if (selectedTrend !== "Restock Report") {
      if (!isValidDateTimeFormat(startTimestamp)) {
        alert(
          "Starting timestamp is not valid. Please enter in the format \n(YYYY-MM-DD HH:MM:SS)"
        );
        valid = false;
      }
    }

    if (
      selectedTrend !== "Restock Report" &&
      selectedTrend !== "Excess Report"
    ) {
      if (!isValidDateTimeFormat(endTimestamp)) {
        alert(
          "End timestamp is not valid. Please enter in the format \n(YYYY-MM-DD HH:MM:SS)"
        );
        valid = false;
      }
    }

    if (valid) {
      try {
        let response;
        // Use the selectedTrend to dynamically construct the API endpoint
        response = await axios.get(
          `http://localhost:4000/${removeSpaces(selectedTrend)}`,
          {
            params: {
              startTimestamp,
              endTimestamp,
              number,
            },
          }
        );
        // if(valid){
        //   try {
        //     let response;
        //     // Use the selectedTrend to dynamically construct the API endpoint
        //     response = await axios.get(`https://thealley.onrender.com/${removeSpaces(selectedTrend)}`, {
        //       params: {
        //         startTimestamp,
        //         endTimestamp,
        //         number,
        //       },
        //     }
        //   );

        const jsonVals = await response.data;
        console.log("Data received:", jsonVals.data.inventory);
        setTableData(jsonVals.data.inventory.rows);
        if (selectedTrend === "Sales Report") {
          console.log("Data received:", jsonVals.data.addons);
          setTable2Data(jsonVals.data.addons.rows);
        }
      } catch (error) {
        console.error("Error generating trend:", error.message);
      }
    }
  };

  function isValidDateTimeFormat(inputString) {
    const dateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    return dateTimePattern.test(inputString);
  }

  function removeSpaces(trendName) {
    const words = trendName.split(" ");
    return words.join("");
  }

  const returnHome = () => {
    window.location.href = "/";
  };

  const returnToManager = () => {
    var currLocation = window.location.href;
    window.location.href = currLocation.replace("AnalyzeTrends", "Manager");
  };

  function getCurrentDate() {
    const currentDate = new Date();
    const utcFormat = currentDate.toISOString();
    const formattedDate = utcFormat.slice(0, 19).replace("T", " ");
    return formattedDate;
  }

    function isValidDateTimeFormat(inputString) {
      const dateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      return dateTimePattern.test(inputString);
    };

    function removeSpaces(trendName){
      const words = trendName.split(' ');
      return words.join('');
    };

    function getCurrentDate() {
      const currentDate = new Date();
      const utcFormat = currentDate.toISOString();
      const formattedDate = utcFormat.slice(0, 19).replace('T', ' ');
      return formattedDate;
    };

    const highContrastMode = () => {
      const body = document.querySelector('body');
      if (body.classList.contains("contrast")) {
        body.classList.remove("contrast");
        document.body.style.backgroundColor = '#ffefe2';
        sessionStorage.setItem("high_contrast_mode", false);
      } else {
        body.classList.add("contrast");
        document.body.style.backgroundColor = 'black';
        sessionStorage.setItem("high_contrast_mode", true);
      }
    }

    const loadCurrentMode = () => {
      if (sessionStorage.getItem("high_contrast_mode")) {
        const body = document.querySelector('body');
        if (body.classList.contains("contrast") == false) {
          body.classList.add("contrast");
          document.body.style.backgroundColor = 'black';
        }
      } else {
        const body = document.querySelector('body');
        body.classList.remove("contrast");
        document.body.style.backgroundColor = '#ffefe2';
      }
    }

    return (
      <div>
      <div onLoad={() => loadCurrentMode()}>
        <button onClick={highContrastMode}>test</button>
        <h1 className="trendsTitle">Analyze Trends</h1>
        <button className="home-button" onClick={returnHome}> 
            <img src={HomeButton} alt="home" />
        </button>
        <button className="backButton" onClick={returnToManager}>
            <img src={arrow} alt="arrow" />
        </button>

        {selectedTrend === "Menu Item Popularity Analysis" && (
          <div className="number-input-section">
            <label htmlFor="number">Number:</label>
            <input
              type="number"
              id="number"
              placeholder="Enter a number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              min="1"
            />
          </div>
        )}
      </div>

      <div className="timestamp-section">
        {selectedTrend !== "Restock Report" && (
          <div className="start-timestamp-section">
            <label
              htmlFor="start-timestamp"
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              Start Time:
            </label>
            <input
              type="text"
              id="start-timestamp"
              placeholder="YYYY:MM:DD HH:MM:SS"
              value={startTimestamp}
              onChange={(e) => setStartTimestamp(e.target.value)}
            />
          </div>
        )}

        {selectedTrend !== "Restock Report" && (
          <div className="end-timestamp-section">
            <label
              htmlFor="end-timestamp"
              onMouseOver={(e) => handleHover(e, isHoverEnabled)}
              onMouseOut={handleMouseOut}
            >
              End Time:
            </label>
            <input
              type="text"
              id="end-timestamp"
              placeholder="YYYY:MM:DD HH:MM:SS"
              value={endTimestamp}
              readOnly={isExcessReport}
              style={{ backgroundColor: isExcessReport ? "#D3D3D3" : "#FFF" }}
              onChange={(e) => setEndTimestamp(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="trend-panel">
        {tableData.length > 0 && <TrendTable jsonData={tableData} />}
        {table2Data.length > 0 && <TrendTable jsonData={table2Data} />}
      </div>
      <TextToSpeech isHoverEnabled={isHoverEnabled} toggleHover={toggleHover} />
    </div>
  );
};

export default AnalyzeTrends;