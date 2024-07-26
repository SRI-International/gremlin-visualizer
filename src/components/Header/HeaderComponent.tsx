import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, LinearProgress, Paper, createFilterOptions } from '@mui/material';
import { COMMON_GREMLIN_ERROR, QUERY_ENDPOINT } from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';
import { selectOptions } from '../../reducers/optionReducer';
import { SupplierSelector } from './SupplierSelector';
import { ComponentSelector } from './ComponentSelector';
import { MaterialSelector } from './MaterialSelector';
import style from './HeaderComponent.module.css';
import { Edge, Node } from 'vis-network';
import _ from 'lodash';
import { selectGraph, setSuppliers } from '../../reducers/graphReducer';
import { selectGremlin, setQuery, } from '../../reducers/gremlinReducer';
import axios from 'axios';


export const HeaderComponent = ({ }) => {
  const { nodeLabels, nodeLimit, graphOptions } = useSelector(selectOptions);
  const { selectorNodes, components, suppliers, materials } = useSelector(selectGraph);
  const [error, setError] = useState<string | null>(null);
  console.log('rerender header');
  const dispatch = useDispatch();
  const { host, port, query } = useSelector(selectGremlin);
  console.log(components);
  console.log(suppliers);

  useEffect(() => {
    onChange();
  }, [components, suppliers, materials])

  const onChange = () => {
    console.log("onChange");
    let queryToSend = '';
    let str = '';
    setError(null);
    if (suppliers.length > 0) {
      console.log("suppliers if")
      str = suppliers.map((gr) => `'${gr}'`).join(',');
      queryToSend = `g.V().has("Entity", "name", within(${str})).emit().repeat(out())`;
      sendRequest(queryToSend);
    }
    if (components.length > 0) { 
      console.log("components if")
      str = components.map((gr) => `'${gr}'`).join(',');
      queryToSend = `g.V().has("Component", "name", within(${str})).emit().repeat(in())`;
      sendRequest(queryToSend);
    }
    if (materials.length > 0) {
      console.log("materials if")
      str = materials.map((gr) => `'${gr}'`).join(',');
      queryToSend = `g.V().has("Material", "name", within(${str})).emit().repeat(in())`;
      sendRequest(queryToSend);
    }
  };

  const sendRequest = (query : string) => {
    axios
    .post(
      QUERY_ENDPOINT,
      { host, port, query, nodeLimit },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then((response) => {
      onFetchQuery(response, query, nodeLabels, dispatch);
    })
    .catch((error) => {
      console.warn(error)
      setError(COMMON_GREMLIN_ERROR);
    });
  }


  return (
    <div className="header">
      <form
        noValidate
        autoComplete="off"
      >
        <Paper
          elevation={10}
          className={style['header-model-block']}
        >
          <ComponentSelector />
        </Paper>
        <Paper
          elevation={10}
          className={style['header-group-block']}
        >
          <SupplierSelector />
        </Paper>
        <Paper
          elevation={10}
          className={style['header-layout-block']}
        >
          <MaterialSelector/>
        </Paper>
      </form>

      <br />
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  );
};
