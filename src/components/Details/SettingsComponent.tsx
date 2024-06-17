import {
  Divider,
  Fab,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNodeLabel,
  editNodeLabel,
  removeNodeLabel,
  selectOptions,
  setIsPhysicsEnabled,
  setNodeLimit
} from "../../reducers/optionReducer";
import DeleteIcon from "@mui/icons-material/Delete";
import { selectGremlin, setHost, setPort } from "../../reducers/gremlinReducer";
import { refreshNodeLabels } from "../../reducers/graphReducer";
import { applyLayout, layoutOptions } from "../../logics/graph";


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
  const [selectedLayout, setSelectedLayout] = useState('force-directed');

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
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Layout</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedLayout}
            label="Layout"
            onChange={(x) => {
              applyLayout(x.target.value)
              setSelectedLayout(x.target.value)
            }}
          >
            {layoutOptions.map(x => <MenuItem value={x}>{x}</MenuItem>)}
          </Select>
        </FormControl>
        <Tooltip
          title="Automatically stabilize the graph"
          aria-label="add"
        >
          <FormControlLabel
            control={
              <Switch
                checked={graphOptions.isPhysicsEnabled}
                onChange={() => {
                  onTogglePhysics(!graphOptions.isPhysicsEnabled);
                }}
                value="physics"
                color="primary"
              />
            }
            label="Enable Physics"
          />
        </Tooltip>
        <Divider />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Typography>Node Labels</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <NodeLabelList nodeLabels={nodeLabels} />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Fab
          variant="extended"
          color="primary"
          size="small"
          onClick={onRefresh.bind(this)}
        >
          <RefreshIcon />
          Refresh
        </Fab>
        <Fab
          variant="extended"
          size="small"
          onClick={onAddNodeLabel.bind(this)}
        >
          <AddIcon />
          Add Node Label
        </Fab>
      </Grid>
    </Grid>
  )
}