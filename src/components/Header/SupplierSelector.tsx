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
import type { GroupSelectorProps } from './types/index';
import style from './HeaderComponent.module.css';
import { clearGraph, selectGraph } from '../../reducers/graphReducer';

export function SupplierSelector() {
  const dispatch = useDispatch();
  const { nodes, edges, suppliers } = useSelector(selectGraph);
  const names = nodes.filter(node => node.type === 'Entity').map(node => node.properties.name);

  const [selectedSupplierNames, setSelectedSupplierNames] = React.useState<string[]>(suppliers);

  const handleChange = (event: SelectChangeEvent<typeof selectedSupplierNames>) => {
    const {
      target: { value },
    } = event;
    setSelectedSupplierNames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  
  const handleLoadSupplier = () => {
    if (selectedSupplierNames) {
      dispatch(clearGraph());

      const str = selectedSupplierNames.map((gr) => `'${gr}'`).join(',');
      onSupplierChange(
        oldGroups,
        groups,
        `${queryBase}.V().has('groups', within(${str}))`
      );
    }
  };

  const onSupplierChange = (
    oldGroups: string[],
    groups: string[],
    query: string
  ) => {
    if (
      groups.length > 0 &&
      (groups.length > oldGroups.length ||
        groups.every((g) => oldGroups.includes(g))) &&
      selectedLayout
    ) {
      dispatch(changeLayout(selectedLayout, sendQuery));
    } else {
      dispatch(setSelectedLayout(null));
      sendQuery(query);
    }
  };


  return (

    <FormControl size="small" className={style['header-groups-select']}>
      <InputLabel id="change stuff">change</InputLabel>
      <Select
        labelId="change stuff"
        value={selectedSupplierNames}
        multiple
        label="Age"
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
  );
}