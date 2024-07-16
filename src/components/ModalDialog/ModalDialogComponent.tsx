import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog, selectDialog, } from '../../reducers/dialogReducer';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField
} from '@mui/material';
import axios from 'axios';
import { manualAddElement } from '../../logics/actionHelper';
import { selectGremlin, setError } from '../../reducers/gremlinReducer';
import { ArrowForward } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import { COMMON_GREMLIN_ERROR, QUERY_ENDPOINT, } from "../../constants";
import { selectOptions } from '../../reducers/optionReducer';

type FormField = {
  propertyName: string;
  propertyValue: string;
};

export const DIALOG_TYPES = {
  NODE: 'node',
  EDGE: 'edge'
};

export const ModalDialogComponent = () => {
  const { host, port } = useSelector(selectGremlin);
  const { nodeLabels, nodeLimit } = useSelector(selectOptions);
  const dispatch = useDispatch();
  const { isDialogOpen, x, y, dialogType, edgeFrom, edgeTo, suggestions } = useSelector(selectDialog);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [type, setType] = useState<string>('');
  const [duplicateError, setDuplicateError] = useState<string>('');
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);

  useEffect(() => {
    if (isDialogOpen) {
      setFormFields([]);
      setType(suggestions[dialogType]?.types[0]);
      setDuplicateError('');
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (suggestions[dialogType]?.labels[type]) {
      const newFormFields = suggestions[dialogType]?.labels[type].map(field => {
        return {
          propertyName: field,
          propertyValue: ''
        }
      }
    )
      setFormFields(newFormFields);
    }
    else {
      setFormFields([]);
    }
  }, [type, isDialogOpen]);

  const getDialogTitle = (dialogType: any) => {
    switch (dialogType) {
      case DIALOG_TYPES.NODE:
        return "Add New Node";
      case DIALOG_TYPES.EDGE:
        return "Add New Edge";
      default:
        return "";
    }
  }
  const getDialogText = (dialogType: any) => {
    switch (dialogType) {
      case DIALOG_TYPES.NODE:
        return null;
      case DIALOG_TYPES.EDGE:
        return (
          <DialogContentText style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: 'black' }}>
            Node Id : {edgeFrom} <ArrowForward style={{ verticalAlign: "middle" }} /> Node Id : {edgeTo}
          </DialogContentText>);
      default:
        return null;
    }
  }
  const handleAutocompleteFocus = (suggestionsCategory: string, type: string) => (_event: any) => {
    switch (suggestionsCategory) {
      case "labels":
        setAutocompleteOptions(suggestions[dialogType]?.labels[type] ?? []);
        break;
      case "types":
        setAutocompleteOptions(suggestions[dialogType]?.types ?? []);
        break;
      default:
        setAutocompleteOptions([]);
        break;
    }
  }
  const handleAutocompleteChange = (name: string, index: number) => (event: any, newValue: any) => {
    switch (name) {
      case "propertyName":
        setFormFields(prevFormFields =>
          prevFormFields.map((formField, i) =>
            i === index ? { ...formField, [name]: newValue } : formField
          )
        );
        break;
      case "type":
        setType(newValue);
        break;
      default:
        return;
    }
  }

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
    const isNodeDialog = (dialogType == DIALOG_TYPES.NODE);

    let query = '';
    if (isNodeDialog) {
      query = `g.addV('${type}')`;
    } else {
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
        console.log(JSON.stringify(response, null, 2));
        const addedElement = isNodeDialog ? [{ ...response.data[0], x, y }] : response.data
        manualAddElement(isNodeDialog, addedElement, nodeLabels, dispatch);
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
        <DialogTitle>{getDialogTitle(dialogType)}</DialogTitle>
        <DialogContent>
          {getDialogText(dialogType)}
          <Autocomplete
            freeSolo
            options={autocompleteOptions}
            value={type || ''} 
            onChange={handleAutocompleteChange("type", -1)}
            onFocus={handleAutocompleteFocus("types", type)}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                required
                margin="dense"
                name="type"
                label="Type"
                onChange={(e) => setType(e.target.value)}
                fullWidth
                variant="standard"
                sx={{ paddingBottom: 2 }}
              />)}
          />
          {duplicateError && <p style={{ color: 'red' }}>{duplicateError}</p>}
          <Grid container spacing={2}>
            {formFields.map((form, index) => (
              <React.Fragment key={index}>
                <Grid item xs={5}>
                  <Autocomplete
                    freeSolo
                    options={autocompleteOptions}
                    value={form.propertyName || ''} 
                    onChange={handleAutocompleteChange("propertyName", index)}
                    onFocus={handleAutocompleteFocus("labels", type)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        margin="dense"
                        name="propertyName"
                        label="Property Name"
                        onChange={event => handleFormChange(event, index)}
                        fullWidth
                        variant="standard"
                      />)}
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
