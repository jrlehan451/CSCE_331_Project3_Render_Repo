import React from 'react';
import { ListItemButton, styled } from '@mui/material';

const CustomButton = styled(ListItemButton)(({ theme }) => ({
  /* Your button styling */
}));

const MenuItemsButtons = ({ onAdd, onDelete, onUpdate }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        <CustomButton onClick={onAdd}>Add Item</CustomButton>
        <CustomButton onClick={onDelete}>Delete Item</CustomButton>
        <CustomButton onClick={onUpdate}>Update Item</CustomButton>
      </div>
      <CustomButton style={{ width: '90%' }}>
        Apply Recommended Adjustments
      </CustomButton>
    </div>
  );
};

export default MenuItemsButtons;
