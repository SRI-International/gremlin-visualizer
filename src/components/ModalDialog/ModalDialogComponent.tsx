import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDialog, closeDialog, } from '../../reducers/dialogReducer';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, DialogContentText } from '@mui/material';
import axios from 'axios';
import { manualAddEdge, manualAddNode } from '../../logics/actionHelper';
import { selectGremlin, setError } from '../../reducers/gremlinReducer';
import { ArrowForward } from '@mui/icons-material';
import {
  COMMON_GREMLIN_ERROR,
  QUERY_ENDPOINT,
} from "../../constants";
import { selectOptions } from '../../reducers/optionReducer';

type FormField = {
  propertyName: string;
  propertyValue: string;
};

export const ModalDialogComponent = () => {
  const { host, port } = useSelector(selectGremlin);
  const { nodeLabels, nodeLimit } = useSelector(selectOptions);
  const dispatch = useDispatch();
  const { isDialogOpen, x, y, isNodeDialog, edgeFrom, edgeTo} = useSelector(selectDialog);
  const [formFields, setFormFields] = useState<FormField[]>([{ propertyName: '', propertyValue: '' }]);
  const [type, setType] = useState<string>('');
  const [duplicateError, setDuplicateError] = useState<string>('');


  useEffect(() => {
    if (isDialogOpen) {
      setFormFields([{ propertyName: '', propertyValue: '' }]);
      setType('');
      setDuplicateError('');
    }
  }, [isDialogOpen]);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value } = event.target;
    setFormFields(prevFormFields =>
      prevFormFields.map((formField, i) =>
        i === index ? { ...formField, [name]: value } : formField
      )
    );
  };

  const addFields = () => {
    let object = {
      propertyName: '',
      propertyValue: ''
    };
    setFormFields([...formFields, object]);
  };

  const removeFields = (index: number) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const names = formFields.map(field => field.propertyName);
    const uniqueNames = new Set(names);

    if (names.length !== uniqueNames.size) {
      setDuplicateError('Duplicate property names are not allowed');
      return;
    }

    const data = { type, fields: formFields };

    let query = '';
    if (isNodeDialog) {
      query = `g.addV('${type}')`;
    }
    else {
      query = `g.V(${edgeFrom}).as('a').addE('${type}').to(__.V('${edgeTo}'))`;
    }
    for (const [key, value] of Object.entries(formFields)) {
      query += `.property('${value.propertyName}', '${value.propertyValue}')`;
    }
    if (!isNodeDialog) {
      query += `.select('a')`
    }
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
        if (isNodeDialog) {
          const addedNode = [{ ...response.data[0], x, y }];
          manualAddNode(addedNode, nodeLabels, dispatch);
        }
        else {
          const addedEdge = response.data;
          manualAddEdge(addedEdge, nodeLabels, dispatch);
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message || COMMON_GREMLIN_ERROR;
        dispatch(setError(errorMessage));
      });

    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
        maxWidth='sm'
        fullWidth={true}
      >
        <DialogTitle>{isNodeDialog? 'Add New Node' : 'Add New Edge'}</DialogTitle>
        <DialogContent>
          {(!isNodeDialog) && (<DialogContentText style = {{textAlign:'center', fontSize:'20px', fontWeight: 'bold', color:'black' }}>
          Node Id : {edgeFrom} <ArrowForward style={{verticalAlign: "middle"}} /> Node Id : {edgeTo}
          </DialogContentText>)}
          <TextField
            autoFocus
            required
            margin="dense"
            name="type"
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
            variant="standard"
            sx={{ paddingBottom: 2 }}
          />
          {duplicateError && <p style={{ color: 'red' }}>{duplicateError}</p>}
          <Grid container spacing={2}>
            {formFields.map((form, index) => (
              <React.Fragment key={index}>
                <Grid item xs={5}>
                  <TextField
                    required
                    margin="dense"
                    name="propertyName"
                    label="Property Name"
                    value={form.propertyName}
                    onChange={event => handleFormChange(event, index)}
                    fullWidth
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    required
                    margin="dense"
                    name="propertyValue"
                    label="Property Value"
                    value={form.propertyValue}
                    onChange={event => handleFormChange(event, index)}
                    fullWidth
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Button onClick={() => removeFields(index)} variant="outlined" color="secondary">
                    Remove
                  </Button>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Button onClick={addFields} variant="outlined" color="primary">
              Add More..
            </Button>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
