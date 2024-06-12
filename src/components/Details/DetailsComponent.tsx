import { Fab, Grid, Table, TableBody, TableCell, TableRow, Typography, Button, Tooltip, TextField} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, {useState, useEffect} from "react";
import { IdType } from "vis-network";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { selectGremlin, setError } from "../../reducers/gremlinReducer";
import { selectGraph } from "../../reducers/graphReducer";
import { selectOptions } from "../../reducers/optionReducer";
import _ from "lodash";
import { stringifyObjectValues } from "../../logics/utils";
import { COMMON_GREMLIN_ERROR, QUERY_ENDPOINT, DISABLE_NODE_EDIT} from "../../constants";
import { updateOnConfirm, onFetchQuery } from "../../logics/actionHelper";
import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

type EditEvent = {
  name: string;
  value: string;
  previousValue: string;
};

export const DetailsComponent = () => {
  const dispatch = useDispatch();
  const { host, port } = useSelector(selectGremlin);
  const { selectedNode, selectedEdge } = useSelector(selectGraph);
  const { nodeLabels, nodeLimit, queryHistory, isPhysicsEnabled } =
    useSelector(selectOptions);

  const [editField, setEditField] = useState<null | string>(null);
  const [editValue, setEditValue] = useState<null | string>(null);

  let hasSelected = false;
  let selectedType: null | undefined = null;
  let selectedId: IdType | undefined = undefined;
  let selectedProperties = null;
  let selectedHeader = null;
  if (!_.isEmpty(selectedNode)) {
    hasSelected = true;
    selectedType = _.get(selectedNode, 'type');
    selectedId = _.get(selectedNode, 'id');
    selectedProperties = _.get(selectedNode, 'properties');
    stringifyObjectValues(selectedProperties);
    selectedHeader = 'Node';
  } else if (!_.isEmpty(selectedEdge)) {
    hasSelected = true;
    selectedType = _.get(selectedEdge, 'type');
    selectedId = _.get(selectedEdge, 'id');
    selectedProperties = _.get(selectedEdge, 'properties');
    selectedHeader = 'Edge';
    stringifyObjectValues(selectedProperties);
  }

  useEffect(() => {
    setEditField(null);
    setEditValue(null);
  }, [selectedNode, selectedEdge]);

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  /**
   * Return a number of table rows with key-value cells for object properties
   * @param data
   * @returns
   */
  function getRows(data: any) {
    if (data == null) return;
    return Object.entries(data).map(e => {

      return <TableRow>
                <TableCell><strong>{String(e[0])}</strong></TableCell>
                <TableCell>
                  {!DISABLE_NODE_EDIT ? (
                      <EditText
                      name={String(e[0])}
                      style={{ fontSize: '16px', border: '1px solid #ccc' }}
                      onSave={onConfirmEdit}
                      defaultValue={String(e[1])}
                      showEditButton
                    />
                  ) : <strong>{String(e[0])}</strong>
                  }
                </TableCell>
              </TableRow>;
    });
  }

  function onTraverse(nodeId: IdType | undefined, direction: string) {
    const query = `g.V('${nodeId}').${direction}()`;
    axios
      .post(
        QUERY_ENDPOINT,
        {
          host,
          port,
          query,
          nodeLimit,
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((response) => {
        onFetchQuery(response, query, nodeLabels, dispatch);
      })
      .catch((error) => {
        dispatch(setError(COMMON_GREMLIN_ERROR));
      });
  }

  function onConfirmEdit({ name, value, previousValue }: EditEvent) {
    setEditField(null);
    setEditValue(null);
    const query = `g.V('${selectedId}').property('${name}', '${value}')`;
    axios
      .post(
        QUERY_ENDPOINT,
        {
          host,
          port,
          query,
          nodeLimit,
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((response) => {
        updateOnConfirm(selectedId, response, query, nodeLabels, dispatch);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message || COMMON_GREMLIN_ERROR;
        dispatch(setError(errorMessage));
        // dispatch(setError(COMMON_GREMLIN_ERROR));
      });
  }

  function onCancelEdit() {
    setEditField(null);
    setEditValue(null);
  }

  return hasSelected && (<>
        <h2>Information: {selectedHeader}</h2>
        {selectedHeader === 'Node' && (
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6}>
              <Fab
                variant="extended"
                size="small"
                onClick={() => onTraverse(selectedId, 'out')}
              >
                Traverse Out Edges
                <ArrowForwardIcon />
              </Fab>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <Fab
                variant="extended"
                size="small"
                onClick={() => onTraverse(selectedId, 'in')}
              >
                Traverse In Edges
                <ArrowBackIcon />
              </Fab>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={12}>
          <Grid container>
            <Table aria-label="simple table">
              <TableBody>
                <TableRow key={'type'}>
                  <TableCell scope="row"><strong>Type</strong></TableCell>
                  <TableCell align="left">{String(selectedType)}</TableCell>
                </TableRow>
                <TableRow key={'id'}>
                  <TableCell scope="row"><strong>ID</strong></TableCell>
                  <TableCell align="left">{String(selectedId)}</TableCell>
                </TableRow>
                {getRows(selectedProperties)}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </>
    ) ||
    (<Grid item xs={12} sm={12} md={12}>
      <Grid container>

        <Typography>No Nodes Selected</Typography>
      </Grid>
    </Grid>)

}