import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  createFilterOptions,
} from '@mui/material';
import { HOST, PORT, COMMON_GREMLIN_ERROR } from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';
import { useDispatch } from 'react-redux';
import {
  clearGraph,
  selectGraph,
  setGraphGroup,
  setNodePositions,
  setSelectedLayout,
} from '../../reducers/graphReducer';
import { clearQueryHistory, selectOptions } from '../../reducers/optionReducer';
import {
  useGetGroupsQuery,
  useGetVersionsQuery,
  useLazyGetLayoutQuery,
  useLazyGetLayoutsQuery,
  useSaveLayoutMutation,
  useSetVersionMutation,
} from '../../services/cam4dm';
import { useQueryMutation } from '../../services/gremlin';
import style from './HeaderComponent.module.css';
import { getNetwork } from '../../logics/network';

interface LayoutOptionType {
  inputValue?: string;
  group: string;
  title: string;
}

type LayoutJson = {
  version: string;
  group?: string;
  name: string;
  nodes: { [key: string]: { x: number; y: number } };
};

const filter = createFilterOptions<LayoutOptionType>();

export const HeaderComponent = ({}) => {
  const dispatch = useDispatch();
  const [version, setVersion] = useState('');
  const [versionOptions, setVersionOptions] = useState<
    readonly string[] | null
  >(null);
  const [group, setGroup] = useState<string | undefined>('');
  const [canSave, setCanSave] = useState(false);
  const [q, setQ] = useState('');
  const [layout, setLayout] = useState<LayoutOptionType | null>(null);
  const [layoutOptions, setLayoutOptions] = useState<
    readonly LayoutOptionType[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const { nodeLabels, nodeLimit } = useSelector(selectOptions);
  const { nodes, group: graphGroup, selectedLayout } = useSelector(selectGraph);
  const { data: versionData } = useGetVersionsQuery(undefined);
  const { data: groupsData } = useGetGroupsQuery(undefined);
  const [getLayouts, layoutData] = useLazyGetLayoutsQuery();
  const [getLayout, layoutNodePositions] = useLazyGetLayoutQuery();
  const [apiSetVersion, { isLoading }] = useSetVersionMutation();
  const [apiSendQuery] = useQueryMutation();
  const [apiSaveLayout] = useSaveLayoutMutation();

  const network = getNetwork();

  useEffect(() => {
    if (layoutData && layoutData.isSuccess) {
      console.log('populate layout data');
      // TODO: check group in the data
      setLayoutOptions(
        layoutData.data
          .map((l: string) => {
            const nameSplit = l.split('-');
            const name = nameSplit[0];
            const group = nameSplit[1] || '';

            const newValue = { inputValue: l, title: name, group };
            console.log(newValue);
            return newValue;
          })
          .filter((o: LayoutOptionType) => o.group === group)
      );
    } else if (layoutData && layoutData.isError) {
      setLayoutOptions([]);
    }
    if (layoutNodePositions && layoutNodePositions.data) {
      dispatch(setNodePositions(layoutNodePositions.data.nodes));
    }
    if (versionData) {
      // initialize the db
      // TODO: maybe this should be handled backend
      apiSetVersion('base');
      const keys = Object.keys(versionData);
      const opts: string[] = [];
  
      for (let key of keys) {
        opts.push(key);
      }
  
      setVersionOptions(opts);
    }
  }, [layoutData, layoutNodePositions.data, versionData]);

  function sendQuery(query: string) {
    setError(null);
    apiSendQuery({ host: HOST, port: PORT, query, nodeLimit })
      .then((response) => {
        onFetchQuery(response, query, nodeLabels, dispatch);
      })
      .catch(() => {
        setError(COMMON_GREMLIN_ERROR);
      });
  }

  const handleVersionChange = (evt: SelectChangeEvent) => {
    console.log(evt);
    const v = evt.target.value;

    setVersion(v);
    setGroup('');
    dispatch(clearGraph());
    dispatch(clearQueryHistory());
    // apiSetVersion(evt.target.value as string).then(() => {
    //   sendQuery('g.V()');
    // });
    sendQuery(`${versionData[v]}.V()`)

    dispatch(setSelectedLayout(null));
    setLayout(null);
    getLayouts(v);
  };

  const handleGroupChange = (evt: SelectChangeEvent) => {
    setGroup(evt.target.value as string);
    dispatch(clearGraph());
    dispatch(setGraphGroup(group));

    setLayoutOptions(
      layoutData.data
        .map((l: string) => {
          const nameSplit = l.split('-');
          const name = nameSplit[0];
          const group = nameSplit[1] || '';

          const newValue = { inputValue: l, title: name, group };
          console.log(newValue);
          return newValue;
        })
        .filter((o: LayoutOptionType) => o.group === evt.target.value)
    );

    sendQuery(`g.V().has('groups', '${evt.target.value}')`);
  };

  const handleLayoutChange = (
    evt: SyntheticEvent,
    newValue: string | LayoutOptionType | null
  ) => {
    if (typeof newValue === 'string') {
      setLayout({
        title: newValue,
        inputValue: newValue,
        group: group || '',
      });
      console.log('set by string');
      dispatch(setSelectedLayout(newValue));
    } else if (newValue && newValue.inputValue) {
      setLayout({
        inputValue: newValue.inputValue,
        title: newValue.title,
        group: group || '',
      });

      // check if it's adding a new layout
      if (/Add.*/.test(newValue.title)) {
        setCanSave(true);
      } else {
        getLayout({ version, name: newValue.inputValue });
      }

      dispatch(setSelectedLayout(newValue.title));
    } else {
      setLayout(newValue);
      dispatch(setSelectedLayout(undefined));
    }
  };

  const handleSave = () => {
    if (selectedLayout) {
      const positions = network?.getPositions();
      const layoutName =
        group !== '' ? `${selectedLayout}-${group}` : selectedLayout;
      const layoutObj: LayoutJson = {
        version,
        group,
        name: layoutName,
        nodes: {},
      };

      for (let node of nodes) {
        if (node.id && positions) {
          layoutObj.nodes[node.uniqueId] = positions[node.id];
        }
      }

      apiSaveLayout({ version, name: layoutName, body: layoutObj });
      setCanSave(false);
    }
  };

  return (
    <div className={style['header']}>
      <form noValidate autoComplete="off">
        <FormControl size="small" className={style['header-model-select']}>
          <InputLabel id="model-version">Model</InputLabel>
          <Select
            labelId="model-version"
            label="Model"
            value={version}
            onChange={handleVersionChange}
            disabled={isLoading}
          >
            {versionOptions?.map((version: string, ndx: number) => (
              <MenuItem key={ndx} value={version}>
                {version}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" className={style['header-groups-select']}>
          <InputLabel id="model-group">Group</InputLabel>
          <Select
            labelId="model-group"
            label="Group"
            value={group}
            onChange={handleGroupChange}
            disabled={isLoading || version === ''}
          >
            {groupsData?.map((g: string, ndx: number) => (
              <MenuItem key={ndx} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" className={style['header-layout-select']}>
          <Autocomplete
            id="model-layouts"
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            freeSolo
            value={layout}
            options={layoutOptions}
            renderOption={(props, option) => <li {...props}>{option.title}</li>}
            onChange={handleLayoutChange}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some(
                (option) => inputValue === option.inputValue
              );
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  title: `Add "${inputValue}"`,
                  group: group || '',
                });
              }

              return filtered;
            }}
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              return option.title;
            }}
            renderInput={(params) => (
              <TextField {...params} label="Layout" size="small" />
            )}
          />
        </FormControl>
        <FormControl size="small" className={style['header-save']}>
          <Button
            variant="contained"
            color="primary"
            disabled={!canSave}
            onClick={handleSave}
          >
            Save
          </Button>
        </FormControl>
        {/* <FormControl size="small" className={style['header-query']}>
          <TextField
            value={q}
            onChange={(evt) => {
              setQ(evt.target.value);
            }}
            id="standard-basic"
            label="gremlin query"
            variant="outlined"
            size="small"
          />
        </FormControl>
        <FormControl size="small" className={style['header-execute']}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(clearGraph());
              sendQuery(q);
            }}
          >
            Execute
          </Button>
        </FormControl> */}
        {isLoading && (
          <Box className={style['header-progress']}>
            <LinearProgress color="inherit" />
          </Box>
        )}
      </form>

      <br />
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  );
};
