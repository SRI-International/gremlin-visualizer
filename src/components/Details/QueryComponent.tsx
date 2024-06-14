import React, { ChangeEvent } from "react";
import { Button, TextField } from "@mui/material";
import { clearGraph } from '../../reducers/graphReducer';
import { clearQueryHistory } from '../../reducers/optionReducer';
import { useDispatch, useSelector } from 'react-redux';
import { selectGremlin, setError, setQuery, } from '../../reducers/gremlinReducer';
import axios from "axios";
import { COMMON_GREMLIN_ERROR, QUERY_ENDPOINT } from "../../constants";
import { onFetchQuery } from "../../logics/actionHelper";
import { RootState } from "../../app/store";

const Query = ({}) => {
  const dispatch = useDispatch()
  const { host, port, query } = useSelector(selectGremlin);
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
        console.warn(error)
        dispatch(setError(COMMON_GREMLIN_ERROR));
      });
  }

  function onQueryChanged(query: ChangeEvent<HTMLTextAreaElement>): void {
    dispatch(setQuery(query.target.value));
    return
  }

  return (
    <div>
      <form noValidate autoComplete="off">
        <TextField
          value={query}
          onChange={onQueryChanged}
          id="standard-basic"
          label="gremlin query"
          InputProps={{ style: { fontFamily: 'monospace' } }}
          style={{ width: '100%' }}
          variant="outlined"
          multiline={true}
          sx={{ fontFamily: 'monospace' }}
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
    </div>);
}

export default Query