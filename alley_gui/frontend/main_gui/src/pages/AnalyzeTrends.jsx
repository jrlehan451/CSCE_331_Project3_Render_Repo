import React,  { useState, useEffect} from 'react';
import axios from "axios";
import TrendTable from "../components/TrendTable";
import arrow from './images/back_arrow.png';
import './AnalyzeTrends.css'
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
} from "../components/SpeechUtils";

const AnalyzeTrends = (props) => {
  const { isHoverEnabled, handleToggleHover } = props;
  const [isHoverEnabledState, setIsHoverEnabled] = useState(false); // Add this line

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

    const [selectedTrend, setSelectedTrend] = useState('Excess Report');
    const [startTimestamp, setStartTimestamp] = useState('');
    const [endTimestamp, setEndTimestamp] = useState(getCurrentDate());
    const [number, setNumber] = useState(1);
    const [tableData, setTableData] = useState([]);
    const [table2Data, setTable2Data] = useState([]);
    const [isExcessReport, setIsExcessReport] = useState(true);

    useEffect(() => {
      if(selectedTrend === 'Excess Report'){
        setIsExcessReport(true);
        setEndTimestamp(getCurrentDate());
      }
      else{
        setIsExcessReport(false);
        setEndTimestamp('');
      }
      setStartTimestamp('');
      setNumber(1);
      setTableData([]);
      setTable2Data([]);
    }, [selectedTrend]);

    useEffect(() => {
      const protection = async () => {
        const role = localStorage.getItem("Role");
        switch(role){
          case "Manager":
              break;
          default:
            window.location.href = window.location.origin;
            break;
        }
      };

      protection();
    });

    const generateTrend = async () => {
      let valid = true;
      if(selectedTrend !== 'Restock Report'){
        if(!isValidDateTimeFormat(startTimestamp)){
          alert("Starting timestamp is not valid. Please enter in the format \n(YYYY-MM-DD HH:MM:SS)");
          valid = false;
        }
      }
      if(selectedTrend !== 'Restock Report' && selectedTrend !== 'Excess Report'){
        if(!isValidDateTimeFormat(endTimestamp)){
          alert("End timestamp is not valid. Please enter in the format \n(YYYY-MM-DD HH:MM:SS)");
          valid = false;
        }
      }
      if(valid){
        try {
          let response;
          // Use the selectedTrend to dynamically construct the API endpoint
          response = await axios.get(`https://thealley.onrender.com/${removeSpaces(selectedTrend)}`, {
            params: {
              startTimestamp,
              endTimestamp,
              number,
            },
          });
    
          const jsonVals = await response.data;
          console.log('Data received:', jsonVals.data.inventory);
          setTableData(jsonVals.data.inventory.rows);
          if(selectedTrend === 'Sales Report'){
            console.log('Data received:', jsonVals.data.addons);
            setTable2Data(jsonVals.data.addons.rows)
          }
        } catch (error) {
          console.error('Error generating trend:', error.message);
        }
      }
    };

    function isValidDateTimeFormat(inputString) {
      const dateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      return dateTimePattern.test(inputString);
    };

    function removeSpaces(trendName){
      const words = trendName.split(' ');
      return words.join('');
    };

    const returnToManager = () =>{
      var currLocation = window.location.href;
      window.location.href = currLocation.replace("AnalyzeTrends", "Manager");
    };

    function getCurrentDate() {
      const currentDate = new Date();
      const utcFormat = currentDate.toISOString();
      const formattedDate = utcFormat.slice(0, 19).replace('T', ' ');
      return formattedDate;
    };

    return (
      <div>
      <div>
        <h1
          className="trendsTitle"
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          Analyze Trends
        </h1>
        <button
          className="backButton"
          onClick={returnToManager}
          onMouseOver={(e) => handleHover(e, isHoverEnabled)}
          onMouseOut={handleMouseOut}
        >
          <img src={arrow} alt="Back" />
        </button>
        
        <div class = "selection">
          <label
            htmlFor="trend-choice"
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >
            Select a Trend:
          </label>
          <select id="trend-choice" value={selectedTrend}onChange={(e) => setSelectedTrend(e.target.value)} onMouseOver={(e) => handleHover(e, isHoverEnabled)} onMouseOut={handleMouseOut} >
            <option value="Excess Report">Excess Report</option>
            <option value="Menu Item Popularity Analysis">Menu Item Popularity Analysis</option>
            <option value="Restock Report">Restock Report</option>
            <option value="Sales Report">Sales Report</option>
            <option value="What Sales Together">What Sales Together</option>
          </select>
          <button
            class="GoButton"
            onClick={generateTrend}
            onMouseOver={(e) => handleHover(e, isHoverEnabled)}
            onMouseOut={handleMouseOut}
          >Go</button>
          {selectedTrend === 'Menu Item Popularity Analysis' && (
            <div className="number-input-section">
              <label 
                htmlFor="number" 
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
                >Number:</label>
              <input type="number" id="number" placeholder="Enter a number" value={number} onChange={(e) => setNumber(e.target.value)} min="1"/>
            </div>
          )}
        </div>
        <div className="timestamp-section">
          {selectedTrend !== 'Restock Report' && (
            <div className="start-timestamp-section">
              <label
                htmlFor="start-timestamp"
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
              >
                Start Time:
              </label>
              <input type="text" id="start-timestamp" placeholder="YYYY:MM:DD HH:MM:SS" value={startTimestamp} onChange={(e) => setStartTimestamp(e.target.value)} />
            </div>
          )}
          
          {selectedTrend !== 'Restock Report' && (
            <div className="end-timestamp-section">
              <label
                htmlFor="end-timestamp"
                onMouseOver={(e) => handleHover(e, isHoverEnabled)}
                onMouseOut={handleMouseOut}
              >
                End Time:
              </label>
              <input type="text" id="end-timestamp" placeholder="YYYY:MM:DD HH:MM:SS" value={endTimestamp} readOnly={isExcessReport} style={{ backgroundColor: isExcessReport ? '#D3D3D3' : '#FFF' }} onChange={(e) => setEndTimestamp(e.target.value)}/>
            </div>
          )}
        </div>
        <div className="trend-panel">
            {tableData.length > 0 && <TrendTable jsonData={tableData} />}
            {table2Data.length > 0 && <TrendTable jsonData={table2Data} />}
        </div>
      </div>
      </div>
    );
};
export default AnalyzeTrends;
