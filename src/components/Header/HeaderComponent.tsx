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
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  createFilterOptions,
} from '@mui/material';
import { HOST, PORT, COMMON_GREMLIN_ERROR } from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';
import { useDispatch } from 'react-redux';
import {
  addLayoutPositions,
  changeLayout,
  clearGraph,
  clearLayouts,
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
import {
  clearQueryHistory,
  selectGremlin,
  setQueryBase,
} from '../../reducers/gremlinReducer';
import { useAppDispatch } from '../../app/store';

interface LayoutOptionType {
  inputValue?: string;
  title: string;
}

type LayoutJson = {
  version: string;
  groups: string[];
  name: string;
  nodes: { [key: string]: { x: number; y: number } };
};

const filter = createFilterOptions<LayoutOptionType>();

export const HeaderComponent = ({}) => {
  const dispatch = useAppDispatch();

  const { nodeLabels, nodeLimit } = useSelector(selectOptions);
  const { nodes, groups, layoutChanged } = useSelector(selectGraph);
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
  // const [groups, setGroups] = useState<string[]>([]);
  const [groupOptions, setGroupOptions] = useState<readonly string[] | null>(
    null
  );
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
      setLayoutOptions(
        layoutData.data.map((l: string) => {
          const newValue = { inputValue: l, title: l };
          return newValue;
        })
      );

      for (let l of layoutData.data) {
        getLayout({ version, name: l }).then((response) => {
          const { data } = response;
          dispatch(addLayoutPositions(data));
        });
      }
    } else if (layoutData && layoutData.isError) {
      setLayoutOptions([]);
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
      setGroupOptions(opts);
    }
    setCanSave(layout != null && layoutChanged);
  }, [
    layoutData,
    layoutNodePositions.data,
    versionData,
    groupsData,
    layoutChanged,
  ]);

  function sendQuery(query: string, callback?: () => void | null) {
    setError(null);
    apiSendQuery({ host: HOST, port: PORT, query, nodeLimit })
      .then((response) => {
        onFetchQuery(response, query, nodeLabels, dispatch);
        if (callback) callback();
      })
      .catch(() => {
        setError(COMMON_GREMLIN_ERROR);
      });
  }

  const handleVersionChange = (evt: SelectChangeEvent) => {
    const v = evt.target.value;

    setVersion(v);
    dispatch(clearGraph());
    dispatch(clearLayouts());
    dispatch(clearQueryHistory());
    dispatch(setQueryBase(versionData[v]));
    sendQuery(`${versionData[v]}.V()`);

    dispatch(setSelectedLayout(null));
    setLayout(null);
    getLayouts(v);
  };

  const handleGroupChange = (evt: SelectChangeEvent<typeof groups>) => {
    const {
      target: { value },
    } = evt;

    dispatch(setGraphGroup(typeof value === 'string' ? value.split(',') : value));
  };

  const handleLoadGroup = () => {
    if (groups) {
      setLayout(null);
      dispatch(clearGraph());
      dispatch(setGraphGroup(groups));

      const str = groups.map((gr) => `'${gr}'`).join(',');
      sendQuery(`${queryBase}.V().has('groups', within(${str}))`);
    }
  };

  const handleLayoutChange = (
    evt: SyntheticEvent,
    newValue: string | LayoutOptionType | null
  ) => {
    if (typeof newValue === 'string') {
      setLayout({
        title: newValue,
        inputValue: newValue,
      });
      dispatch(setSelectedLayout(newValue));
    } else if (newValue && newValue.inputValue) {
      setLayout({
        inputValue: newValue.inputValue,
        title: newValue.title,
      });

      // check if it's adding a new layout
      if (/Add.*/.test(newValue.title)) {
        setCanSave(true);
      } else {
        // dispatch(setSelectedLayout(newValue.inputValue));
        dispatch(changeLayout(newValue.inputValue, sendQuery));
        // getLayout({ version, name: newValue.inputValue });
      }
    } else {
      setLayout(newValue);
      dispatch(setSelectedLayout(undefined));
    }
  };

  const handleSave = () => {
    if (layout && layout.inputValue != null) {
      const positions = network?.getPositions();
      const layoutName = layout.inputValue;
      const layoutObj: LayoutJson = {
        version,
        groups,
        name: layoutName,
        nodes: {},
      };

      for (let node of nodes) {
        if (node.id && node.uniqueId && positions) {
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
        <Paper elevation={10} className={style['header-model-block']}>
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
        </Paper>
        <Paper elevation={10} className={style['header-group-block']}>
          <FormControl size="small" className={style['header-groups-select']}>
            <InputLabel id="model-group">Group</InputLabel>
            <Select
              labelId="model-group"
              label="Group"
              value={groups}
              multiple
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
          <FormControl size="small" className={style['header-groups-load']}>
            <Button
              variant="contained"
              color="primary"
              disabled={groups.length === 0}
              onClick={handleLoadGroup}
            >
              Load
            </Button>
          </FormControl>
        </Paper>
        <Paper elevation={10} className={style['header-layout-block']}>
          <FormControl size="small" className={style['header-layout-select']}>
            <Autocomplete
              id="model-layouts"
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              freeSolo
              value={layout}
              options={layoutOptions}
              renderOption={(props, option) => (
                <li {...props}>{option.title}</li>
              )}
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
        </Paper>
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
