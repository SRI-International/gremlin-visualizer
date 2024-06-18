import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, Drawer, List, ListItem, ListItemText, Tab, Tabs, } from '@mui/material';
import { selectOptions, } from '../../reducers/optionReducer';
import Query from "./QueryComponent";
import { Settings } from "./SettingsComponent";
import { DetailsComponent } from "./DetailsComponent";

type QueryHistoryProps = {
  list: Array<string>;
};

const QueryHistoryList = ({ list }: QueryHistoryProps) => (
  <List dense={true}>
    {list.map((value: string, ndx: number) => (
      <ListItem key={ndx}>
        <ListItemText primary={value} primaryTypographyProps={{ style: { fontFamily: 'monospace' } }} />
      </ListItem>
    ))}
  </List>
);


interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface SidebarComponentProps {
  panelWidth: number,
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  createWorkspace: () => void
}

export const SidebarComponent = (props: SidebarComponentProps) => {
  const { queryHistory } = useSelector(selectOptions);
  const [value, setValue] = React.useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Drawer anchor='right' variant='permanent' open={true} sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: props.panelWidth },
      }} className='details'>
        <div
          id="dragger"
          onMouseDown={props.handleMouseDown}
          className={'dragger'}
        />
        <Tabs variant="fullWidth" value={value} onChange={handleChange}>
          <Tab value={0} label='Query' />
          <Tab value={1} label='Details' />
          <Tab value={2} label='Settings' />
        </Tabs>
        <Divider />

        <TabPanel index={0} value={value}>
          <Query />
          <QueryHistoryList list={queryHistory} />
        </TabPanel>
        <TabPanel index={2} value={value}>
          <Settings createWorkspace={props.createWorkspace} />
        </TabPanel>
        <TabPanel index={1} value={value}>
          <DetailsComponent />
        </TabPanel>
      </Drawer>
    </Box>
  );
};
