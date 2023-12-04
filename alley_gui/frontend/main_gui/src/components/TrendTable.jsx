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

    function formatCellValue(columnName, cellValue) {
        switch (columnName) {
          case 'name':
          case 'drink_1':
          case 'drink_2':
          case 'add_on_name':
          case 'drink_name':
            return capitalizeName(cellValue.trim(), ' ');
          case 'total_sales':
            return Number(cellValue).toFixed(2);
          default:
            return cellValue;
        }
      }
  
    const renderTableHeader = () => {
      const columnNames = getColumnNames();
  
      return (
        <thead>
          <tr>
            {columnNames.map((columnName, index) => (
              <th key={index}>{capitalizeName(columnName.trim(), '_')}</th>
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
                <td key={cellIndex}>{formatCellValue(getColumnNames()[cellIndex], cellValue)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      );
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
      if (sessionStorage.getItem("high_contrast_mode")) {
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
      <div className="trend-table-container" onLoad={() => loadCurrentMode()}>
      <button onClick={highContrastMode}>test</button>
        <table className="trend-table">
          {renderTableHeader()}
          {renderTableBody()}
        </table>
      </div>
    );
  };
  
  export default TrendTable;