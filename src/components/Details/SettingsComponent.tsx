import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { addWorkspace, refreshNodeLabels, selectGraph } from "../../reducers/graphReducer";
import { applyLayout, getNodePositions, layoutOptions, setNodePositions } from "../../logics/graph";
import { GRAPH_IMPL } from "../../constants";
import { type } from "os";
import { selectDialog } from "../../reducers/dialogReducer";
import { DIALOG_TYPES } from "../../components/ModalDialog/ModalDialogComponent";



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

    // indexedLabels.forEach(label => {
    //   if (label.index===index) {
    //     type = label.type;
    //     field = label.field;
    //     break;
    //   }
    // })
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
          <Autocomplete
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
  const workspaces = useSelector(selectGraph).workspaces

  const [loadWorkspace, setLoadWorkspace] = useState(false);
  const [saveWorkspace, setSaveWorkspace] = useState(false);
  const [workspaceToLoad, setWorkspaceToLoad] = useState<string>('');
  const [workspaceSaveName, setWorkspaceSaveName] = useState<string>('');
  const [workspaceSaveNameConflict, setWorkspaceSaveNameConflict] = useState(false);

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


  function onSelectWorkspace(event: { target: { value: React.SetStateAction<string>; }; }) {
    setWorkspaceToLoad(event.target.value);
  }

  function onConfirmLoadWorkspace(event: { preventDefault: () => void; }) {
    event.preventDefault()
    let workspace = workspaces.find(workspace => workspace.name === workspaceToLoad)
    setNodePositions(workspace)
    onCancelLoadWorkspace()
  }

  function onCancelLoadWorkspace() {
    setLoadWorkspace(false);
    setWorkspaceToLoad('');
  }

  function loadWorkspaceOptions() {
    const workspaceOptions = workspaces.filter(workspace => workspace.impl === GRAPH_IMPL);
    if (workspaceOptions.length > 0) return workspaceOptions.map(workspace => {
      return <MenuItem key={workspace.name} value={workspace.name}>{workspace.name}</MenuItem>;
    });
    else return <MenuItem disabled value={''}>No workspaces saved</MenuItem>;
  }

  function onCancelSaveWorkspace() {
    setSaveWorkspace(false);
    setWorkspaceSaveName('')
    setWorkspaceSaveNameConflict(false)
  }

  function onConfirmSaveWorkspace(event: { preventDefault: () => void; }) {
    event.preventDefault()
    if (workspaces.find(workspace => workspace.name == workspaceSaveName)) {
      setWorkspaceSaveNameConflict(true)
      return;
    }
    finishSaveWorkspace(null)
  }

  function finishSaveWorkspace(event: { preventDefault: () => void; } | null) {
    event?.preventDefault()
    let savedWorkspace = {
      name: workspaceSaveName,
      impl: GRAPH_IMPL,
      ...getNodePositions()
    }
    dispatch(addWorkspace(savedWorkspace))
    onCancelSaveWorkspace()
  }

  function onWorkspaceSaveNameChange(event: { target: { value: React.SetStateAction<string>; }; }) {
    setWorkspaceSaveName(event.target.value)
    setWorkspaceSaveNameConflict(false)
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
        <Button
          variant='contained'
          onClick={() => setSaveWorkspace(true)}
          style={{ width: 'calc(50% - 10px)', margin: '5px' }}>
          Save Workspace
        </Button>
        <Button
          variant='contained'
          onClick={() => setLoadWorkspace(true)}
          style={{ width: 'calc(50% - 10px)', margin: '5px' }}>
          Load Workspace
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
        id='loadWorkspaceDialog'
        open={loadWorkspace}
        onClose={onCancelLoadWorkspace}
        PaperProps={{
          component: 'form',
          onSubmit: onConfirmLoadWorkspace,
        }}
      >
        <DialogTitle>Load Workspace</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item>
              <TextField
                select
                required
                id="workspaceSelect"
                label="Workspace"
                margin="dense"
                variant="standard"
                value={workspaceToLoad}
                style={{ width: '300px' }}
                onChange={onSelectWorkspace}
              >
                {loadWorkspaceOptions()}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={onCancelLoadWorkspace}>Cancel</Button>
          <Button type='submit' variant='contained'>Load</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        id='saveWorkspaceDialog'
        open={saveWorkspace}
        onClose={onCancelSaveWorkspace}
        PaperProps={{
          component: 'form',
          onSubmit: onConfirmSaveWorkspace,
        }}
      >
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
              style={{ width: '300px' }}
              onChange={onWorkspaceSaveNameChange}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={onCancelSaveWorkspace}>Cancel</Button>
          <Button type='submit' variant='contained'>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        id='workspaceSaveNameConflictDialog'
        open={workspaceSaveNameConflict}
        onClose={() => setWorkspaceSaveNameConflict(false)}
        PaperProps={{
          component: 'form',
          onSubmit: finishSaveWorkspace,
        }}
      >
        <DialogTitle>Workspace Name Conflict</DialogTitle>
        <DialogContent>
          <Typography>A workspace with the name "{workspaceSaveName}" already exists. Would you like to overwrite this
            workspace?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={onCancelSaveWorkspace}>No</Button>
          <Button type='submit' variant='contained'>Yes</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}