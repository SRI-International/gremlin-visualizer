import React from 'react';
import { Grid } from '@mui/material';
import { NetworkGraphComponent } from './components/NetworkGraph/NetworkGraphComponent';
import { HeaderComponent } from './components/Header/HeaderComponent';
import { SidebarComponent } from './components/Details/SidebarComponent';

export const App = () => (
  <div>
    <HeaderComponent />
    <NetworkGraphComponent />
    <SidebarComponent />
  </div>
);
