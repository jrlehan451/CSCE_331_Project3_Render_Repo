import React,  { useState, useEffect} from 'react';
import axios from "axios";
import TrendTable from "../components/TrendTable";
import HomeButton from './images/HomeButton.png';
import arrow from './images/back_arrow.png';
import './AnalyzeTrends.css'

const AnalyzeTrends = () => {
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
          response = await axios.get(`http://localhost:4000/${removeSpaces(selectedTrend)}`, {
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

    const returnHome = () => {
      window.location.href = "/";
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
        <h1 className="trendsTitle">Analyze Trends</h1>
        <button className="home-button" onClick={returnHome}> 
            <img src={HomeButton} alt="home" />
        </button>
        <button className="backButton" onClick={returnToManager}>
            <img src={arrow} alt="arrow" />
        </button>
        
        <div class = "selection">
          <label htmlFor="trend-choice">Select a Trend:</label>
          <select id="trend-choice" value={selectedTrend}onChange={(e) => setSelectedTrend(e.target.value)}>
            <option value="Excess Report">Excess Report</option>
            <option value="Menu Item Popularity Analysis">Menu Item Popularity Analysis</option>
            <option value="Restock Report">Restock Report</option>
            <option value="Sales Report">Sales Report</option>
            <option value="What Sales Together">What Sales Together</option>
          </select>

          <button class="GoButton" onClick={generateTrend}>Go</button>

          {selectedTrend === 'Menu Item Popularity Analysis' && (
            <div className="number-input-section">
              <label htmlFor="number">Number:</label>
              <input type="number" id="number" placeholder="Enter a number" value={number} onChange={(e) => setNumber(e.target.value)} min="1"/>
            </div>
          )}
        </div>

        <div className="timestamp-section">
          <div className="start-timestamp-section">
            <label htmlFor="start-timestamp">Start Time:</label>
            <input type="text" id="start-timestamp" placeholder="YYYY:MM:DD HH:MM:SS" value={startTimestamp} onChange={(e) => setStartTimestamp(e.target.value)} />
          </div>
          
          <div className="end-timestamp-section">
            <label htmlFor="end-timestamp">End Time:</label>
            <input type="text" id="end-timestamp" placeholder="YYYY:MM:DD HH:MM:SS" value={endTimestamp} readOnly={isExcessReport} onChange={(e) => setEndTimestamp(e.target.value)}/>
          </div>
        </div>

        <div className="trend-panel">
            {tableData.length > 0 && <TrendTable jsonData={tableData} />}
            {table2Data.length > 0 && <TrendTable jsonData={table2Data} />}
        </div>
      </div>
    );
};

export default AnalyzeTrends;