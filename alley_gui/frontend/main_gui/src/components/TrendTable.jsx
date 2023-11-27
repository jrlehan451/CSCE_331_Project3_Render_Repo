import React from 'react';
import './TrendTable.css'

const TrendTable = ({ jsonData }) => {
    const getColumnNames = () => {
        if (jsonData.length === 0) {
            return [];
        }
        const firstRow = jsonData[0];
        return Object.keys(firstRow);
    };

    function capitalizeName(name, delimiter) {
        const words = name.split(delimiter);
      
        for (let i = 0; i < words.length; i++) {
          words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
      
        return words.join(" ");
    };
  
    const renderTableHeader = () => {
      const columnNames = getColumnNames();
  
      return (
        <thead>
          <tr>
            {columnNames.map((columnName, index) => (
              <th key={index}>{capitalizeName(columnName, '_')}</th>
            ))}
          </tr>
        </thead>
      );
    };
  
    const renderTableBody = () => {
        return (
        <tbody>
          {jsonData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((cellValue, cellIndex) => (
                <td key={cellIndex}>{cellValue}</td>
              ))}
            </tr>
          ))}
        </tbody>
      );
    };
  
    return (
      <div className="trend-table-container">
        <table className="trend-table">
          {renderTableHeader()}
          {renderTableBody()}
        </table>
      </div>
    );
  };
  
  export default TrendTable;