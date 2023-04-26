import React from 'react';
import { Grid } from '@mui/material';
import { NetworkGraphComponent } from './components/NetworkGraph/NetworkGraphComponent';
import { HeaderComponent } from './components/Header/HeaderComponent';
import { DetailsComponent } from './components/Details/DetailsComponent';

export const App = () => (
  <div>
    <Grid container spacing={1}>
      <Grid item xs={12} sm={12} md={12}>
        <HeaderComponent />
      </Grid>
      <Grid item xs={12} sm={9} md={9}>
        <NetworkGraphComponent />
      </Grid>
      <Grid item xs={12} sm={3} md={3}>
        <DetailsComponent />
      </Grid>
    </Grid>
  </div>
);
