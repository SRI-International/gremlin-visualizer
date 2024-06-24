import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectGraph,
} from '../../reducers/graphReducer';
import { selectOptions, setIsPhysicsEnabled } from '../../reducers/optionReducer';
import { Box, Button, ButtonGroup, IconButton, Switch, Tooltip } from "@mui/material";
import { fitTo, getGraph, zoomIn, zoomOut } from "../../logics/graph";
import { GraphTypes } from "../../logics/utils";
import { Add, CenterFocusStrong, Remove } from '@mui/icons-material';
import { Network } from 'vis-network';
import store from '../../app/store';


interface NetworkGraphComponentProps {
  panelWidth: number
}

type BasicProps = {
  [key: string]: any;
};

const ButtonGroupIconButton = React.forwardRef(({ ...props }: BasicProps, _ref) => {
  // intercept props only implemented by `Button`
  const { disableElevation, fullWidth, variant, ...iconButtonProps } = props;
  return <IconButton {...iconButtonProps}/>;
});

const GraphControls = () => {
  const { graphOptions } = useSelector(selectOptions);
  const dispatch = useDispatch();
  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  const handleFitTo = () => {
    fitTo();
  };
  const handleTogglePhysics = () => () => {
    dispatch(setIsPhysicsEnabled(!graphOptions.isPhysicsEnabled));

  }


  return (
    <ButtonGroup
      variant="outlined"
      orientation="vertical"
      className={"graph-controls"}
    >
      <Tooltip title="Zoom In">
        <ButtonGroupIconButton onClick={handleZoomIn}>
          <Add />
        </ButtonGroupIconButton>
      </Tooltip>
      <Tooltip title="Reset View">
        <ButtonGroupIconButton onClick={handleFitTo}>
          <CenterFocusStrong />
        </ButtonGroupIconButton>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <ButtonGroupIconButton onClick={handleZoomOut}>
          <Remove />
        </ButtonGroupIconButton>
      </Tooltip>
      <Tooltip title="Toggle Physics">
        <Switch
        checked={graphOptions.isPhysicsEnabled}
        onChange={handleTogglePhysics()}
        size="small"
        inputProps={{ 'aria-label': 'controlled' }}
        />
      </Tooltip>
    </ButtonGroup>
  );
};


export const NetworkGraphComponent = (props: NetworkGraphComponentProps) => {
  const { nodes, edges } = useSelector(selectGraph);
  const { graphOptions } = useSelector(selectOptions);
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef.current != null) {
      let graph = getGraph(
        myRef.current,
        { nodes, edges },
        graphOptions
      );
    }
  }, [nodes, edges, graphOptions]);

  return <Box className='graph-container' sx={{ width: `calc(100% - ${props.panelWidth}px)`, position:'relative' }}>
    <Box ref={myRef} sx={{ height: 'calc(100vh - 20px)' }} className={'mynetwork'} />
    <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1000 }}>
    {!(nodes.length === 0) && !(edges.length === 0) && <GraphControls />}
  </Box>
  </Box>;
};