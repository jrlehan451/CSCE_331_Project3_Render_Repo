import React from 'react';
import './TrendTable.css'

/**
 * @conmponent TrendTable
 * @description This component displays the trend table for the analyze trends page
 * @param {*} jsonData 
 * @returns 
 */
const TrendTable = ({ jsonData }) => {
  /**
   * @description gets the names of the columns for the selected trend
   * @function getColumnNames
   * @returns array of the columnNames
   */
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

    /**
     * @description formats the content of the cells of the table based on the type of information being entered
     * @function formatCellValue
     * @param {string} columnName 
     * @param {*} cellValue 
     * @returns correct value for the cell
     */
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
  
      /**
       * @function renderTableHeader
       * @description displays the correct column headers based on the selected report
       */
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
  
    /**
     * @description fills in the table with the correct values based on the selected report
     * @function renderTableBody
     * @returns cell values based on the selected report
     */
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