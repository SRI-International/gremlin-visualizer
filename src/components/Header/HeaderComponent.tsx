import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, LinearProgress, Paper, createFilterOptions } from '@mui/material';
import { COMMON_GREMLIN_ERROR } from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';
import { selectOptions } from '../../reducers/optionReducer';
import {SupplierSelector} from './SupplierSelector';
import style from './HeaderComponent.module.css';
import { Edge, Node } from 'vis-network';
import _ from 'lodash';


export const HeaderComponent = ({}) => {
  const { nodeLabels, nodeLimit, graphOptions } = useSelector(selectOptions);

  const [error, setError] = useState<string | null>(null);
  console.log('rerender header');

  function sendQuery(
  ) {
  
  }
  
  const onSupplierChange = (
    oldGroups: string[],
    groups: string[],
    query: string
  ) => {
    dispatch(setGraphGroup(groups));
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
    <div className="header">
      <form
        noValidate
        autoComplete="off"
      >
        {/* <Paper
          elevation={10}
          className={style['header-model-block']}
        >
          <ModelSelector onVersionChange={onVersionChange} />
        </Paper> */}
        <Paper
          elevation={10}
          className={style['header-group-block']}
        >
          <SupplierSelector onSupplierChange={onSupplierChange} />
        </Paper>
        {/* <Paper
          elevation={10}
          className={style['header-layout-block']}
        >
          <LayoutSelector
            version={version}
            onLayoutChange={onLayoutChange}
          />
        </Paper> */}
        {/* {isLoading && (
          <Box className={style['header-progress']}>
            <LinearProgress color="inherit" />
          </Box>
        )} */}
      </form>

      <br />
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  );
};
