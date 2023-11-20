import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const MenuItemsTable = ({ data, columns }) => {
  return (
    <div style={{ height: 400, width: '80vw', marginBottom: '20px' }}>
      <DataGrid rows={data} columns={columns} columnBuffer={2} />
    </div>
  );
};

export default MenuItemsTable;
