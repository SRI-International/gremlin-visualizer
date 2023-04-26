import React from 'react';
import { useSelector } from 'react-redux';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { QUERY_ENDPOINT, COMMON_GREMLIN_ERROR } from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';
import { useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import {
  selectGremlin,
  setError,
  setHost,
  setPort,
  setQuery,
} from '../../reducers/gremlinReducer';
import { clearGraph } from '../../reducers/graphReducer';
import { clearQueryHistory } from '../../reducers/optionReducer';

export const HeaderComponent = ({}) => {
  const dispatch = useDispatch();
  const { host, port, query, error } = useSelector(selectGremlin);
  const { nodeLabels, nodeLimit } = useSelector(
    (state: RootState) => state.options
  );

  function handleClearGraph() {
    dispatch(clearGraph());
    dispatch(clearQueryHistory());
  }

  function sendQuery() {
    dispatch(setError(null));
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
        console.log(error);
        dispatch(setError(COMMON_GREMLIN_ERROR));
      });
  }

  function onHostChanged(host: string) {
    dispatch(setHost(host));
  }

  function onPortChanged(port: string) {
    dispatch(setPort(port));
  }

  function onQueryChanged(query: string) {
    dispatch(setQuery(query));
  }

  return (
    <div className={'header'}>
      <form noValidate autoComplete="off">
        <TextField
          value={host}
          onChange={(event) => onHostChanged(event.target.value)}
          id="standard-basic"
          label="host"
          style={{ width: '10%' }}
          variant="standard"
        />
        <TextField
          value={port}
          onChange={(event) => onPortChanged(event.target.value)}
          id="standard-basic"
          label="port"
          style={{ width: '10%' }}
          variant="standard"
        />
        <TextField
          value={query}
          onChange={(event) => onQueryChanged(event.target.value)}
          id="standard-basic"
          label="gremlin query"
          style={{ width: '60%' }}
          variant="standard"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendQuery.bind(this)}
          style={{ width: '150px' }}
        >
          Execute
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearGraph.bind(this)}
          style={{ width: '150px' }}
        >
          Clear Graph
        </Button>
      </form>

      <br />
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  );
};
