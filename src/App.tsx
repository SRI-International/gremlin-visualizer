import React, { useState } from 'react';
import { NetworkGraphComponent } from './components/NetworkGraph/NetworkGraphComponent';
import { HeaderComponent } from './components/Header/HeaderComponent';
import { SidebarComponent } from './components/Details/SidebarComponent';
import { GraphTypes } from "./logics/utils";
import { Network } from "vis-network";
import Sigma from "sigma";
import { ModalDialogComponent } from './components/ModalDialog/ModalDialogComponent';

export const App = () => {

  const [panelWidth, setPanelWidth] = useState(350);

  const handlePanelDragSelect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    document.addEventListener('mousemove', handlePanelDrag)
    document.addEventListener('mouseup', handlePanelDragUnselect)
    document.body.style.userSelect = 'none'
  }

  const handlePanelDrag = (event: MouseEvent) => {
    let offsetRight =
      document.body.offsetWidth - (event.clientX - document.body.offsetLeft) + 20;
    let minWidth = 50;
    let maxWidth = 600;
    if (offsetRight > minWidth && offsetRight < maxWidth) {
      setPanelWidth(offsetRight);
    }
  }

  const handlePanelDragUnselect = () => {
    document.removeEventListener('mousemove', handlePanelDrag)
    document.removeEventListener('mouseup', handlePanelDragUnselect)
    document.body.style.userSelect = 'auto'
  }

  const [graph, setGraph] = useState<GraphTypes>(null);

  function retrieveGraph(graph: GraphTypes) {
    setGraph(graph)
  }

  function createWorkspace() {

    let positions: Record<string, object> = {};

    if (graph === null) return;
    if (graph instanceof Network) {
      positions = graph.getPositions()
    } else if (graph instanceof Sigma) {
      graph.getGraph().forEachNode(((node, attributes) => positions[node] = { x: attributes.x, y: attributes.y }))
    } else {
      graph.nodes().map(node => positions[node.data('id')] = node.position())
    }

    console.log(positions)
  }

  return (
    <div>
      <HeaderComponent />
      <NetworkGraphComponent panelWidth={panelWidth} retrieveGraph={retrieveGraph} />
      <SidebarComponent panelWidth={panelWidth} handleMouseDown={handlePanelDragSelect} createWorkspace={createWorkspace} />
      <ModalDialogComponent />
    </div>
  );

}