import React from 'react';
import { Grid } from '@mui/material';
import { NetworkGraphComponent } from './components/NetworkGraph/NetworkGraphComponent';
import { HeaderComponent } from './components/Header/HeaderComponent';
import { DetailsComponent } from './components/Details/DetailsComponent';

export const App = () => (
  <div>
      <HeaderComponent />
      <NetworkGraphComponent />
      <DetailsComponent />
  </div>
);
