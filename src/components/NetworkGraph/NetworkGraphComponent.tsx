import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveNodePosition,
  selectGraph,
  setSelectedEdge,
  setSelectedNode,
} from '../../reducers/graphReducer';
import { selectOptions } from '../../reducers/optionReducer';
import { getNetwork } from '../../logics/network';

export const NetworkGraphComponent = () => {
  const dispatch = useDispatch();
  const { nodes, edges, selectedLayout } = useSelector(selectGraph);
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
    const nodeId =
      params.nodes && params.nodes.length > 0 ? params.nodes[0] : null;
    const pointer = params.pointer ? params.pointer.canvas : null;

    console.log(nodeId, pointer);
    dispatch(saveNodePosition({ nodeId, pointer }));
  };

  useEffect(() => {
    if (myRef.current != null) {
      const network = getNetwork(
        myRef.current,
        { nodes, edges },
        selectedLayout,
        {
          selectNodeCallback,
          selectEdgeCallback,
          dragEndCallback,
        }
      );

      console.log(network?.getSeed());
    }
  }, [nodes, edges, selectedLayout]);

  return <div ref={myRef} className={'mynetwork'} />;
};
