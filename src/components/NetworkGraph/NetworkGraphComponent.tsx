import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLayoutChanged,
  selectGraph,
  setSelectedEdge,
  setSelectedNode,
} from '../../reducers/graphReducer';
import { getNetwork } from '../../logics/network';
import style from './NetworkGraphComponent.module.css';
import { Network } from 'vis-network';
import { Button, ButtonGroup, IconButton, Tooltip } from '@mui/material';
import { Add, CenterFocusStrong, Remove } from '@mui/icons-material';

type GraphControlsProps = {
  network: Network;
};

type BasicProps = {
  [key: string]: any;
};

const ButtonGroupIconButton = ({ ...props }: BasicProps) => {
  // intercept props only implemented by `Button`
  const { disableElevation, fullWidth, variant, ...iconButtonProps } = props;
  return <IconButton {...iconButtonProps} />;
};

const GraphControls = ({ network }: GraphControlsProps) => {
  const handleZoomIn = () => {
    const scale = network.getScale();
    network.moveTo({ scale: scale + 0.1 });
  };

  const handleZoomOut = () => {
    const scale = network.getScale();
    network.moveTo({ scale: scale - 0.1 });
  };

  const handleFitTo = () => {
    network.fit();
  };

  return (
    <ButtonGroup
      variant="outlined"
      orientation="vertical"
      className={style['graph-controls']}
    >
      <Tooltip title="Zoom In">
        <ButtonGroupIconButton onClick={handleZoomIn}>
          <Add />
        </ButtonGroupIconButton>
      </Tooltip>
      <Tooltip title="Fit Nodes to Screen">
        <ButtonGroupIconButton onClick={handleFitTo}>
          <CenterFocusStrong />
        </ButtonGroupIconButton>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <ButtonGroupIconButton onClick={handleZoomOut}>
          <Remove />
        </ButtonGroupIconButton>
      </Tooltip>
    </ButtonGroup>
  );
};

export const NetworkGraphComponent = () => {
  const dispatch = useDispatch();
  const { nodes, edges, selectedLayout } = useSelector(selectGraph);
  const [network, setNetwork] = useState<Network | null>(null);
  const myRef = useRef(null);

  const selectNodeCallback = (params?: any) => {
    const nodeId =
      params.nodes && params.nodes.length > 0 ? params.nodes[0] : null;
    dispatch(setSelectedNode(nodeId));
  };

  const selectEdgeCallback = (params?: any) => {
    const edgeId =
      params.edges && params.edges.length === 1 ? params.edges[0] : null;
    const isNodeSelected = params.nodes && params.nodes.length > 0;
    if (!isNodeSelected && edgeId !== null) {
      dispatch(setSelectedEdge(edgeId));
    }
  };

  const dragEndCallback = (params?: any) => {
    dispatch(setLayoutChanged(true));
  };

  useEffect(() => {
    if (myRef.current != null) {
      setNetwork(
        getNetwork(myRef.current, { nodes, edges }, selectedLayout, {
          selectNodeCallback,
          selectEdgeCallback,
          dragEndCallback,
        })
      );

      // console.log(network?.getSeed());
    }
  }, [nodes, edges, selectedLayout]);

  return (
    <div className={style['graph-container']}>
      <div ref={myRef} className={style['graph-pane']} />
      {network && <GraphControls network={network} />}
    </div>
  );
};
