import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Box,
  Divider,
  Fab, FormControl,
  FormControlLabel,
  Grid,
  IconButton, InputLabel,
  List,
  ListItem, MenuItem, Select,
  Switch,
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
import { addWorkspace, refreshNodeLabels, selectGraph } from "../../reducers/graphReducer";
import { applyLayout, getNodePositions, layoutOptions, setNodePositions } from "../../logics/graph";
import { GRAPH_IMPL } from "../../constants";
// import { Workspace } from "../../reducers/graphReducer";

type NodeLabelListProps = {
  nodeLabels: Array<any>;
};
const NodeLabelList = ({ nodeLabels }: NodeLabelListProps) => {
  const dispatch = useDispatch();
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

  return (
    <List dense={true}>
      {indexedLabels.map((nodeLabel: any, ndx: number) => (
        <ListItem key={ndx}>
          <TextField
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
          <TextField
            id="standard-basic"
            label="Label Field"
            InputLabelProps={{ shrink: true }}
            value={nodeLabel.field}
            onChange={(event) => {
              const field = event.target.value;
              const type = nodeLabel.type;
              onEditNodeLabel(nodeLabel.index, { type, field });
            }}
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

  const [ workspaceImport, setWorkspaceImport ] = useState(false);
  const [ workspaceExport, setWorkspaceExport ] = useState(false);
  const [ workspaceSelected, setWorkspaceSelected ] = useState<string | null>(null);
  const [ workspaceName, setWorkspaceName ] = useState<string | null>(null);
  const workspaceOptions = useSelector(selectGraph).workspaces;

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

  function loadWorkspaceOptions() {
    console.log(workspaceOptions)
    return workspaceOptions.map(workspace => {
      if (workspace.impl !== GRAPH_IMPL) return <></>;
      else return <MenuItem key={workspace.name}>{workspace.name}</MenuItem>;
    });
  }

  function onSelectWorkspace(event: { target: { value: React.SetStateAction<string | null>; }; }) {
    setWorkspaceSelected(event.target.value);
  }

  function onConfirmLoadWorkspace(){
    setNodePositions('a')
  }

  function onCancelSelectWorkspace() {
    setWorkspaceImport(false);
    setWorkspaceSelected(null);
  }


  function onCancelSaveWorkspace() {
    setWorkspaceExport(false);
  }

  function onConfirmSaveWorkspace() {
    let savedWorkspace = {
      name: workspaceName,
      impl: GRAPH_IMPL,
      layout: getNodePositions()
    }
    dispatch(addWorkspace(savedWorkspace))
    onCancelSaveWorkspace()
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12}>
        <form noValidate autoComplete="off">
          <TextField
            value={host}
            onChange={(event) => onHostChanged(event.target.value)}
            id="standard-basic"
            label="host"
            style={{ width: '100%' }}
            variant="standard"
          />
          <TextField
            value={port}
            onChange={(event) => onPortChanged(event.target.value)}
            id="standard-basic"
            label="port"
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
        <Button variant='contained' onClick={() => setWorkspaceExport(true)} style={{width: 'calc(50% - 10px)', margin: '5px'}}>
          Export Layout
        </Button>
        <Button variant='contained' onClick={() => setWorkspaceImport(true)} style={{width: 'calc(50% - 10px)', margin: '5px'}}>
          Import Layout
        </Button>
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
      <Grid item xs={12} sm={12} md={12}>
        <Button
          variant='contained'
          color="primary"
          style={{ marginRight: '8px' }}
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
        >
          Add Node Label
        </Button>
      </Grid>
      <Dialog
        open={workspaceImport}>
        <DialogTitle>Load Workspace</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Workspace</InputLabel>
            <Select
              id="workspaceSelect"
              value={null}
              label="Workspace"
              onChange={onSelectWorkspace}
            >
              {loadWorkspaceOptions()}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={onCancelSelectWorkspace}>Cancel</Button>
          <Button variant='contained' onClick={onConfirmLoadWorkspace}>Load</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={workspaceExport}
        onSubmit={onConfirmSaveWorkspace}>
        <DialogTitle>Save Workspace</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              margin="dense"
              id="workspaceName"
              label="Workspace Name"
              variant="standard"
              onChange={(event) => setWorkspaceName(event.target.value)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={onCancelSaveWorkspace}>Cancel</Button>
          <Button type='submit' variant='contained'>Load</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}