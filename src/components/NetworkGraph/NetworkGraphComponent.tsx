import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  selectGraph,
} from '../../reducers/graphReducer';
import { selectOptions } from '../../reducers/optionReducer';
import { Box } from "@mui/material";
import { getGraph } from "../../logics/graph";

export const NetworkGraphComponent = () => {
  const { nodes, edges } = useSelector(selectGraph);
  const { graphOptions } = useSelector(selectOptions);
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef.current != null) {
      getGraph(
        myRef.current,
        { nodes, edges },
        graphOptions
      );
    }
  }, [nodes, edges, graphOptions]);
  return <Box className='graph-container' sx={{width: `calc(100% - ${350}px)`}}>
    <Box ref={myRef} sx={{height: 'calc(100vh - 20px)'}} className={'mynetwork'} />
  </Box>;
};
