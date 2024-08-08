import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  chooseWorkspace,
  selectGraph,
} from '../../reducers/graphReducer';
import { selectOptions, setIsPhysicsEnabled } from '../../reducers/optionReducer';
import { Box, Button, ButtonGroup, Fab, IconButton, Switch, Tooltip } from "@mui/material";
import { configGraphConnection, getControls, getGraph } from "../../logics/graph";
import { GraphTypes } from "../../logics/utils";
import { Add, CenterFocusStrong, Remove } from '@mui/icons-material';
import { Network } from 'vis-network';
import store from '../../app/store';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { selectGremlin } from '../../reducers/gremlinReducer';


interface NetworkGraphComponentProps {
  panelWidth: number
}

type BasicProps = {
  [key: string]: any;
};

const ButtonGroupIconButton = React.forwardRef(({ ...props }: BasicProps, _ref) => {

  const { disableElevation, fullWidth, variant, ...iconButtonProps } = props;
  return <IconButton {...iconButtonProps} />;
});

const GraphControls = () => {
  const { graphOptions } = useSelector(selectOptions);
  const dispatch = useDispatch();
  const controls = getControls();

  const handleTogglePhysics = () => () => {
    dispatch(setIsPhysicsEnabled(!graphOptions.isPhysicsEnabled));

  }


  return (
    <ButtonGroup
      variant="outlined"
      orientation="vertical"
      className={"graph-controls"}
    >
      {controls.map((button, _index) => (
        <Tooltip title={button.name}>
          <ButtonGroupIconButton onClick={button.callback}>
            <button.icon />
          </ButtonGroupIconButton>
        </Tooltip>
      ))
      }
      <Tooltip title="Toggle Physics">
        <ButtonGroupIconButton onClick={handleTogglePhysics()}>
          {graphOptions.isPhysicsEnabled && <StopIcon /> || <PlayArrowIcon />}
        </ButtonGroupIconButton>
      </Tooltip>
    </ButtonGroup>
  );
};


export const NetworkGraphComponent = (props: NetworkGraphComponentProps) => {
  const { nodes, edges, workspace } = useSelector(selectGraph);
  const { graphOptions, nodeLimit } = useSelector(selectOptions);
  const { host, port } = useSelector(selectGremlin);
  const myRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (myRef.current != null) {
      configGraphConnection({ host: host, port: port, nodeLimit: nodeLimit, dispatch: dispatch })
      getGraph(
        myRef.current,
        { nodes, edges },
        graphOptions, workspace
      );
      dispatch(chooseWorkspace(null));
    }
  }, [nodes, edges, graphOptions]);

  return <Box className='graph-container' sx={{ width: `calc(100% - ${props.panelWidth}px)`, position: 'relative' }}>
    <Box ref={myRef} sx={{ height: 'calc(100vh - 20px)' }} className={'mynetwork'} />
    <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1000 }}>
      <GraphControls />
    </Box>
  </Box>;
};