import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, Drawer, List, ListItem, ListItemText, Tab, Tabs, Tooltip, } from '@mui/material';
import { selectOptions, } from '../../reducers/optionReducer';
import Query from "./QueryComponent";
import { Settings } from "./SettingsComponent";
import { DetailsComponent } from "./DetailsComponent";
import SavedQueries from "./SavedQueriesComponent"
import SearchIcon from '@mui/icons-material/Search';
import TocIcon from '@mui/icons-material/Toc';
import SettingsIcon from '@mui/icons-material/Settings';
import GradeIcon from '@mui/icons-material/Grade';

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
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: props.panelWidth,
          display: 'flex',
          flexDirection: 'row-reverse',
        },
      }} className='details'>

        <div
          id="dragger"
          onMouseDown={props.handleMouseDown}
          className={'dragger'}
        />

        <Tabs variant="fullWidth" orientation="vertical" value={value} onChange={handleChange} sx={{
          '.MuiTab-root': {
            minWidth: 60,
            padding: '6px',
            minHeight: 60,
            width: 'fit-content'
          },
        }} >
          <Tooltip title="Query" placement="left" arrow>
            <Tab icon={<SearchIcon />} value={0} />
          </Tooltip>
          <Tooltip title="Details" placement="left" arrow>
            <Tab icon={<TocIcon />} value={1} />
          </Tooltip>
          <Tooltip title="Settings" placement="left" arrow>
            <Tab icon={<SettingsIcon />} value={2} />
          </Tooltip>
          <Tooltip title="Saved Queries" placement="left" arrow>
            <Tab icon={<GradeIcon />} value={3} />
          </Tooltip>
        </Tabs>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ flexGrow: 1, overflowY: 'auto', width: `calc(${props.panelWidth}px - 60px)` }}>
          <TabPanel index={0} value={value}>
            <Query />
            <QueryHistoryList list={queryHistory} />
          </TabPanel>
          <TabPanel index={1} value={value}>
            <DetailsComponent />
          </TabPanel>
          <TabPanel index={2} value={value}>
            <Settings />
          </TabPanel>
          <TabPanel index={3} value={value}>
            <SavedQueries />
          </TabPanel>
        </Box>
      </Drawer>
    </Box>
  );
};
