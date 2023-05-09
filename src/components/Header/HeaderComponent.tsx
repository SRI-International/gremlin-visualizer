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
  setLayoutChanged,
  setNodePositions,
  setSelectedLayout,
} from '../../reducers/graphReducer';
import { selectOptions } from '../../reducers/optionReducer';
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
import { clearQueryHistory, selectGremlin, setQueryBase } from '../../reducers/gremlinReducer';

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

  const { nodeLabels, nodeLimit } = useSelector(selectOptions);
  const { nodes, layoutChanged } = useSelector(selectGraph);
  const { queryBase } = useSelector(selectGremlin);

  const { data: versionData } = useGetVersionsQuery(undefined);
  const { data: groupsData } = useGetGroupsQuery(undefined);
  const [getLayouts, layoutData] = useLazyGetLayoutsQuery();
  const [getLayout, layoutNodePositions] = useLazyGetLayoutQuery();
  const [apiSetVersion, { isLoading }] = useSetVersionMutation();
  const [apiSendQuery] = useQueryMutation();
  const [apiSaveLayout] = useSaveLayoutMutation();

  const [version, setVersion] = useState('');
  const [versionOptions, setVersionOptions] = useState<
    readonly string[] | null
  >(null);
  const [group, setGroup] = useState<string | undefined>('');
  const [groupOptions, setGroupOptions] = useState<
    readonly string[] | null
  >(null);
  const [canSave, setCanSave] = useState(layoutChanged);
  const [q, setQ] = useState('');
  const [layout, setLayout] = useState<LayoutOptionType | null>(null);
  const [layoutOptions, setLayoutOptions] = useState<
    readonly LayoutOptionType[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const network = getNetwork();

  useEffect(() => {
    if (layoutData && layoutData.isSuccess) {
      // TODO: check group in the data
      setLayoutOptions(
        layoutData.data
          .map((l: string) => {
            const nameSplit = l.split('(');
            const name = nameSplit[0];
            const group = nameSplit[1] ? nameSplit[1].replace(')', '') : '';

            const newValue = { inputValue: l, title: name, group };
            return newValue;
          })
          .filter((o: LayoutOptionType) => o.group === group)
      );
    } else if (layoutData && layoutData.isError) {
      setLayoutOptions([]);
    }
    if (layout && layoutNodePositions && layoutNodePositions.data) {
      dispatch(setNodePositions(layoutNodePositions.data.nodes));
    }
    if (versionData) {
      // initialize the db
      // TODO: maybe this should be handled backend
      const keys = Object.keys(versionData);
      const opts: string[] = [];

      for (let key of keys) {
        opts.push(key);
      }

      setVersionOptions(opts);
    }
    if (groupsData) {
      const opts: string[] = [...groupsData];
      opts.sort();
      setGroupOptions(opts)
    }
    setCanSave(layout != null && layoutChanged)
  }, [layoutData, layoutNodePositions.data, versionData, groupsData, layoutChanged]);

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
    const v = evt.target.value;

    setVersion(v);
    setGroup('');
    dispatch(clearGraph());
    dispatch(clearQueryHistory());
    dispatch(setQueryBase(versionData[v]))
    sendQuery(`${versionData[v]}.V()`);

    dispatch(setSelectedLayout(null));
    setLayout(null);
    getLayouts(v);
  };

  const handleGroupChange = (evt: SelectChangeEvent) => {
    const g = evt.target.value;
    setGroup(g);
    setLayout(null);
    dispatch(clearGraph());
    dispatch(setGraphGroup(group));

    if (layoutData.data) {
      setLayoutOptions(
        layoutData.data
          .map((l: string) => {
            const nameSplit = l.split('(');
            const name = nameSplit[0];
            const group = nameSplit[1] ? nameSplit[1].replace(')', '') : '';

            const newValue = { inputValue: l, title: name, group };
            return newValue;
          })
          .filter((o: LayoutOptionType) => o.group === g)
      );
    }

    sendQuery(`${queryBase}.V().has('groups', '${evt.target.value}')`);
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
        dispatch(setSelectedLayout(newValue.inputValue));
        getLayout({ version, name: newValue.inputValue });
      }
    } else {
      setLayout(newValue);
      dispatch(setSelectedLayout(undefined));
    }
  };

  const handleSave = () => {
    if (layout && layout.inputValue != null) {
      const positions = network?.getPositions();
      const layoutName =
        group !== '' ? `${layout.inputValue}(${group})` : layout.inputValue;
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
            {groupOptions?.map((g: string, ndx: number) => (
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
