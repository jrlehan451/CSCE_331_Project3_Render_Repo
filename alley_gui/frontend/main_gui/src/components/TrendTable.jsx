import React from 'react';

const TrendTable = ({ jsonData }) => {
    if (!jsonData || jsonData.length === 0) {
        return <p>No data available</p>;
    }

    // Extracting headers from the first object in jsonData
    const headers = Object.keys(jsonData[0]);

    return (
        <table>
        <thead>
            <tr>
            {headers.map(header => (
                <th key={header}>{header}</th>
            ))}
            </tr>
        </thead>
        <tbody>
            {jsonData.map((row, index) => (
            <tr key={index}>
                {headers.map(header => (
                <td key={header}>{row[header]}</td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    );
};

export default TrendTable;