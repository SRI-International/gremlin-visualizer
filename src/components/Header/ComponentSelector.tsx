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
import { clearGraph, selectGraph, setComponents, setSuppliers } from '../../reducers/graphReducer';

export function ComponentSelector() {
  const dispatch = useDispatch();
  const { selectorNodes, components } = useSelector(selectGraph);
  const names = selectorNodes.filter(node => node.type === 'Component').map(node => node.properties.name);

  const [selectedComponentNames, setSelectedComponentNames] = React.useState<string[]>(components);

  const handleChange = (event: SelectChangeEvent<typeof selectedComponentNames>) => {
    const {
      target: { value },
    } = event;
    setSelectedComponentNames(
      typeof value === 'string' ? value.split(',') : value,
    );
    dispatch(setComponents(typeof value === 'string' ? value.split(',') : value));
  };

  return (
    <>
      <FormControl size="small" className={style['header-component-select']}>
        <InputLabel id="component-select">Select Component</InputLabel>
        <Select
          labelId="component-select"
          value={selectedComponentNames}
          multiple
          label="Select Component"
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