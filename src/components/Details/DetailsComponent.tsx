import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  FormControlLabel,
  Switch,
  Divider,
  Tooltip,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import _ from 'lodash';
import { JsonToTable } from 'react-json-to-table';
import {
  COMMON_GREMLIN_ERROR,
  HOST,
  PORT,
} from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';
import { refreshNodeLabels, selectGraph } from '../../reducers/graphReducer';
import { selectGremlin, setError } from '../../reducers/gremlinReducer';
import {
  addNodeLabel,
  editNodeLabel,
  removeNodeLabel,
  selectOptions,
  setIsPhysicsEnabled,
  setNodeLimit,
} from '../../reducers/optionReducer';
import { EdgeOptions, IdType } from 'vis-network';
import { getNetwork } from '../../logics/network';
import { useQueryMutation } from '../../services/gremlin';

type QueryHistoryProps = {
  list: Array<string>;
};

type NodeLabelListProps = {
  nodeLabels: Array<any>;
};

const QueryHistoryList = ({ list }: QueryHistoryProps) => (
  <List dense={true}>
    {list.map((value: string, ndx: number) => (
      <ListItem key={ndx}>
        <ListItemText primary={value} />
      </ListItem>
    ))}
  </List>
);

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
        <ListItem key={ndx} sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <TextField
            id="standard-basic"
            label="Node Type"
            variant="standard"
            size="small"
            sx={{ marginRight: '5px' }}
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
            variant="standard"
            size="small"
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

export const DetailsComponent = () => {
  const dispatch = useDispatch();
  const { queryHistory } = useSelector(selectGremlin);
  const { selectedNode, selectedEdge } = useSelector(selectGraph);
  const { nodeLabels, nodeLimit, isPhysicsEnabled } =
    useSelector(selectOptions);
  const [apiSendQuery] = useQueryMutation();
  const network = getNetwork();

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

  function onTraverse(nodeId: IdType | undefined, direction: string) {
    const query = `g.V('${nodeId}').${direction}()`;
    apiSendQuery({ host: HOST, port: PORT, query, nodeLimit })
      .then((response) => {
        onFetchQuery(response, query, nodeLabels, dispatch);
      })
      .catch(() => {
        setError(COMMON_GREMLIN_ERROR);
      });
  }

  function onTogglePhysics(enabled: boolean) {
    dispatch(setIsPhysicsEnabled(enabled));

    if (network) {
      const edges: EdgeOptions = {
        smooth: {
          enabled,
          roundness: 10,
          type: enabled ? 'dynamic' : 'continuous',
        },
      };
      network.setOptions({ physics: enabled, edges });
    }
  }

  let hasSelected = false;
  let selectedType = null;
  let selectedId: IdType | undefined = undefined;
  let selectedProperties = null;
  let selectedHeader = null;
  if (!_.isEmpty(selectedNode)) {
    hasSelected = true;
    selectedType = _.get(selectedNode, 'type');
    selectedId = _.get(selectedNode, 'id');
    selectedProperties = _.get(selectedNode, 'properties');
    // stringifyObjectValues(selectedProperties);
    selectedHeader = 'Node';
  } else if (!_.isEmpty(selectedEdge)) {
    hasSelected = true;
    selectedType = _.get(selectedEdge, 'type');
    selectedId = _.get(selectedEdge, 'id');
    selectedProperties = _.get(selectedEdge, 'properties');
    selectedHeader = 'Edge';
    // stringifyObjectValues(selectedProperties);
  }

  return (
    <div className={'details'}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Query History</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <QueryHistoryList list={queryHistory} />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {/* <Grid item xs={12} sm={12} md={12}>
                  <Tooltip
                    title="Automatically stabilize the graph"
                    aria-label="add"
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isPhysicsEnabled}
                          onChange={() => {
                            onTogglePhysics(!isPhysicsEnabled);
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
                  <Tooltip
                    title="Number of maximum nodes which should return from the query. Empty or 0 has no restrictions."
                    aria-label="add"
                  >
                    <TextField
                      label="Node Limit"
                      type="Number"
                      variant="standard"
                      size="small"
                      value={nodeLimit}
                      onChange={(event) => {
                        const limit = event.target.value;
                        onEditNodeLimit(limit);
                      }}
                    />
                  </Tooltip>
                </Grid> */}
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
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={onRefresh.bind(this)}
                    startIcon={<RefreshIcon />}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={onAddNodeLabel.bind(this)}
                    startIcon={<AddIcon />}
                  >
                    Add Node Label
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        {hasSelected && (
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h5">Information: {selectedHeader}</Typography>
            {selectedHeader === 'Node' && (
              <Grid item xs={12} sm={12} md={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={6} md={6}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onTraverse(selectedId, 'out')}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Traverse Out Edges
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onTraverse(selectedId, 'in')}
                      startIcon={<ArrowBackIcon />}
                    >
                      Traverse In Edges
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid item xs={12} sm={12} md={12}>
              <Grid container>
                <Table aria-label="simple table">
                  <TableBody>
                    <TableRow key={'type'}>
                      <TableCell scope="row">Type</TableCell>
                      <TableCell align="left">{String(selectedType)}</TableCell>
                    </TableRow>
                    <TableRow key={'id'}>
                      <TableCell scope="row">ID</TableCell>
                      <TableCell align="left">{String(selectedId)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <JsonToTable json={selectedProperties} />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
};
