import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNodeLabel,
  editNodeLabel,
  removeNodeLabel,
  selectOptions,
  setIsPhysicsEnabled,
  setLayout,
  setNodeLimit
} from "../../reducers/optionReducer";
import DeleteIcon from "@mui/icons-material/Delete";
import { selectGremlin, setHost, setPort } from "../../reducers/gremlinReducer";
import { refreshNodeLabels } from "../../reducers/graphReducer";
import { applyLayout, layoutOptions } from "../../logics/graph";
import { selectDialog } from "../../reducers/dialogReducer";
import { DIALOG_TYPES } from "../../components/ModalDialog/ModalDialogComponent";

export type Workspace = {
  name: string,
  impl: string,
  layout: Record<string, { x: number, y: number }>
  zoom: number,
  view: { x: number, y: number }
}

type NodeLabelListProps = {
  nodeLabels: Array<any>;
};
const NodeLabelList = ({ nodeLabels }: NodeLabelListProps) => {
  const dispatch = useDispatch();
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const { suggestions } = useSelector(selectDialog);
  const indexedLabels = nodeLabels.map((nodeLabel: any, ndx: number) => {
    return {
      ...nodeLabel,
      index: ndx,
    };
  });

  const onRemoveNodeLabel = (index: number) => {
    dispatch(removeNodeLabel(index));
  };

  function onEditNodeLabel(index: number, nodeLabel: any) {
    dispatch(editNodeLabel({ id: index, nodeLabel }));
  }
  const handleAutocompleteFocus = (type: string) => (_event: any) => {
    setAutocompleteOptions(suggestions[DIALOG_TYPES.NODE]?.labels[type] ?? []);
  }

  const handleAutocompleteChange = (index: number, type: string) => (event: any, newValue: any) => {
    const field = newValue;
    const nodeLabel = { type, field };
    dispatch(editNodeLabel({ id: index, nodeLabel }));



  }


  return (
    <List dense={true}>
      {indexedLabels.map((nodeLabel: any, ndx: number) => (
        <ListItem key={ndx}>
          <TextField
            sx={{ width: '50%' }}
            id="standard-basic"
            label="Node Type"
            InputLabelProps={{ shrink: true }}
            value={nodeLabel.type}
            onChange={(event) => {
              const type = event.target.value;
              const field = nodeLabel.field;
              onEditNodeLabel(nodeLabel.index, { type, field });
            }}
          />
          <Autocomplete
            sx={{ width: '50%' }}
            freeSolo
            options={autocompleteOptions}
            value={nodeLabel.field || ''}
            onChange={handleAutocompleteChange(nodeLabel.index, nodeLabel.type)}
            onFocus={handleAutocompleteFocus(nodeLabel.type)}
            renderInput={(params) => (
              <TextField
                {...params}
                id="standard-basic"
                label="Label Field"
                data-testid={`label-field-${ndx}`}
                InputLabelProps={{ shrink: true }}
                onChange={(event) => {
                  const field = event.target.value;
                  const type = nodeLabel.type;
                  onEditNodeLabel(nodeLabel.index, { type, field });
                }}
              />)}
          />
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => onRemoveNodeLabel(nodeLabel.index)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};


export const Settings = () => {
  const dispatch = useDispatch();
  const { host, port } = useSelector(selectGremlin);
  const { nodeLabels, nodeLimit, graphOptions } = useSelector(selectOptions);

  function onHostChanged(host: string) {
    dispatch(setHost(host));
  }

  function onPortChanged(port: string) {
    dispatch(setPort(port));
  }

  function onAddNodeLabel() {
    dispatch(addNodeLabel());
  }

  function onEditNodeLabel(index: number, nodeLabel: string) {
    dispatch(editNodeLabel({ id: index, nodeLabel }));
  }

  function onRemoveNodeLabel(index: number) {
    dispatch(removeNodeLabel(index));
  }

  function onEditNodeLimit(limit: string) {
    dispatch(setNodeLimit(limit));
  }

  function onRefresh() {
    dispatch(refreshNodeLabels(nodeLabels));
  }

  function onTogglePhysics(enabled: boolean) {
    dispatch(setIsPhysicsEnabled(enabled));
  }

  function onLayoutChange(x: SelectChangeEvent) {
    applyLayout(x.target.value)
    dispatch(setLayout(x.target.value))
  }


  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12}>
        <form noValidate autoComplete="off">
          <TextField
            value={host}
            onChange={(event) => onHostChanged(event.target.value)}
            id="host-field"
            label="host"
            style={{ width: '100%' }}
            variant="standard"
          />
          <TextField
            value={port}
            onChange={(event) => onPortChanged(event.target.value)}
            id="port-field"
            label="port"
            data-testid="port-label"
            style={{ width: '100%' }}
            variant="standard"
          />
        </form>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Tooltip
          title="Number of maximum nodes which should return from the query. Empty or 0 has no restrictions."
          aria-label="add"
        >
          <TextField
            style={{ width: '150px' }}
            label="Node Limit"
            type="Number"
            variant="outlined"
            value={nodeLimit}
            onChange={(event) => {
              const limit = event.target.value;
              onEditNodeLimit(limit);
            }}
          />
        </Tooltip>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <FormControl fullWidth sx={{ display: 'flex', flexDirection: 'row' }}>
          <Box flexGrow='1'>
            <InputLabel id="layout-label">Layout</InputLabel>
            <Select
              size='small'
              fullWidth
              labelId="layout-label"
              id="layout-select"
              value={graphOptions.layout}
              label="Layout"
              onChange={onLayoutChange}
            >
              {layoutOptions.map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
            </Select>
          </Box>
          <Tooltip
            title="Automatically stabilize the graph"
            aria-label="add"
          >
            <Fab size='small' color='primary' style={{ minWidth: '40px' }}
              onClick={() => onTogglePhysics(!graphOptions.isPhysicsEnabled)}>
              {graphOptions.isPhysicsEnabled && <StopIcon /> || <PlayArrowIcon />}
            </Fab>
          </Tooltip>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Typography>Node Labels</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <NodeLabelList nodeLabels={nodeLabels} />
      </Grid>
      <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <Button
          variant='contained'
          color="primary"
          style={{ width: 'calc(50% - 10px)', flexGrow: 1, margin: '5px' }}
          startIcon={<RefreshIcon />}
          onClick={onRefresh.bind(this)}
        >
          Refresh
        </Button>
        <Button
          variant="outlined"
          color='primary'
          onClick={onAddNodeLabel.bind(this)}
          startIcon={<AddIcon />}
          style={{ width: 'calc(50% - 10px)', flexGrow: 1, margin: '5px' }}
        >
          Add Node Label
        </Button>
      </Grid>
    </Grid>
  )
}