import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  selectGraph,
} from '../../reducers/graphReducer';
import { selectOptions } from '../../reducers/optionReducer';
import { getNetwork } from '../../logics/network';
import { Box } from "@mui/material";

export const NetworkGraphComponent = () => {
  const { nodes, edges } = useSelector(selectGraph);
  const { networkOptions } = useSelector(selectOptions);
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef.current != null) {
      getNetwork(
        myRef.current,
        { nodes, edges },
        networkOptions
      );
    }
  }, [nodes, edges, networkOptions]);
  return <Box className='graph-container' sx={{width: `calc(100% - ${350}px)`}}>
    <div ref={myRef} className={'mynetwork'} />
  </Box>;
};
