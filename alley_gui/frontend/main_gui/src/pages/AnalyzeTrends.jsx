import React,  { useState } from 'react';
import axios from "axios";
import TrendTable from "../components/TrendTable";
import './Login.css'

const AnalyzeTrends = () => {
  const [selectedTrend, setSelectedTrend] = useState('Excess Report');
  const [startTimestamp, setStartTimestamp] = useState('');
  const [endTimestamp, setEndTimestamp] = useState('');
  const [number, setNumber] = useState('');
  const [tableData, setTableData] = useState([]);

  const generateTrend = async () => {
    try {
      let response;
      if (selectedTrend === 'Restock Report') {
        response = await axios.get('http://localhost:4000/RestockReport', {

        });
      } else if (selectedTrend === 'Excess Report') {
        response = await axios.get('http://localhost:4000/ExcessReport', {
          params: {
            startTimestamp,
          },
        });
      } else if (selectedTrend === 'Sales Report') {
        response = await axios.get('http://localhost:4000/SalesReport', {
          params: {
            startTimestamp,
            endTimestamp,
          },
        });
      } else if (selectedTrend === 'What Sells Together') {
        response = await axios.get('http://localhost:4000/WhatSellsTogether', {
          params: {
            startTimestamp,
            endTimestamp,
          },
        });
      } else if (selectedTrend === 'Menu Item Popularity Analysis') {
        response = await axios.get('http://localhost:4000/MenuItemPopularityAnalysis', {
          params: {
            startTimestamp,
            endTimestamp,
            number,
          },
        });
      }
      const jsonVals = await response.data;
      alert(jsonVals);
      setTableData(jsonVals);
    } catch (error) {
      console.error('Error generating trend:', error.message);
    }
  };
  

    const returnHome = () => {
      window.location.href = "/";
    };

    const returnToManager = () =>{
      var currLocation = window.location.href;
      window.location.href = currLocation.replace("AnalyzeTrends", "Manager");
    }

    return (
      <div>
        <h1 className="title">Analyze Trends</h1>
        <button className="home-button" onClick={returnHome}> Home </button>
        <span class= "back" onClick={returnToManager}></span>

        <label htmlFor="trend-choice">Select a Trend:</label>
        <select id="trend-choice" value={selectedTrend}onChange={(e) => setSelectedTrend(e.target.value)}>
          <option value="Excess Report">Excess Report</option>
          <option value="Menu Item Popularity Analysis">Menu Item Popularity Analysis</option>
          <option value="Restock Report">Restock Report</option>
          <option value="Sales Report">Sales Report</option>
          <option value="What Sales Toegther">What Sales Together</option>
        </select>
        <button onClick={generateTrend}>Go</button>

        <div className="timestamp-section">
          <label htmlFor="start-timestamp">Start Time:</label>
          <input type="text" id="start-timestamp" placeholder="Start Timestamp" value={startTimestamp} onChange={(e) => setStartTimestamp(e.target.value)} />
          <label htmlFor="end-timestamp">End Time:</label>
          <input type="text" id="end-timestamp" placeholder="End Timestamp" value={endTimestamp} onChange={(e) => setEndTimestamp(e.target.value)}/>
        </div>

        <div className="trend-panel">
            <TrendTable> jsonData={tableData}</TrendTable>
        </div>
      </div>
    );
};

export default AnalyzeTrends;