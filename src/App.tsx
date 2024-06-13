import React, { useState } from 'react';
import { NetworkGraphComponent } from './components/NetworkGraph/NetworkGraphComponent';
import { HeaderComponent } from './components/Header/HeaderComponent';
import { SidebarComponent } from './components/Details/SidebarComponent';

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

  return (
    <div>
      <HeaderComponent />
      <NetworkGraphComponent panelWidth={panelWidth} />
      <SidebarComponent panelWidth={panelWidth} handleMouseDown={handlePanelDragSelect} />
    </div>
  );
}