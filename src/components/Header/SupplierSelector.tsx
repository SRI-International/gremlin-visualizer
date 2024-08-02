import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { selectGremlin } from '../../reducers/gremlinReducer';
import style from './HeaderComponent.module.css';
import { clearGraph, selectGraph, setSuppliers } from '../../reducers/graphReducer';

export function SupplierSelector() {
  const dispatch = useDispatch();
  const { selectorNodes, edges, suppliers } = useSelector(selectGraph);
  const names = selectorNodes.filter(node => node.type === 'Entity').map(node => node.properties.name);

  const [selectedSupplierNames, setSelectedSupplierNames] = React.useState<string[]>(suppliers);

  const handleChange = (event: SelectChangeEvent<typeof selectedSupplierNames>) => {
    const {
      target: { value },
    } = event;
    setSelectedSupplierNames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    dispatch(setSuppliers(typeof value === 'string' ? value.split(',') : value));
  };

  return (
    <>
      <FormControl size="small" className={style['header-supplier-select']}>
        <InputLabel id="supplier-select">Select Supplier</InputLabel>
        <Select
          labelId="supplier-select"
          value={selectedSupplierNames}
          multiple
          label="Select Supplier"
          onChange={handleChange}
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            PaperProps: {
              style: { maxHeight: '600px' }
            }
          }}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}