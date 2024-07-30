import React, { useState } from "react";
import { Box, Button, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { selectGremlin, setError } from '../../reducers/gremlinReducer';
import axios from "axios";
import { COMMON_GREMLIN_ERROR, QUERY_ENDPOINT, SAVED_QUERIES } from "../../constants";
import { onFetchQuery } from "../../logics/actionHelper";
import { RootState } from "../../app/store";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';


export interface Queries {
    description: string;
    code: string | undefined;
}

const SavedQueries = ({ }) => {
    const dispatch = useDispatch();
    const { host, port } = useSelector(selectGremlin);
    const { nodeLabels, nodeLimit } = useSelector(
        (state: RootState) => state.options
    );
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const queries: Queries[] = Object.entries(SAVED_QUERIES).map(([description, code]) =>
        ({ description, code }));

    const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        setSelectedIndex(index);
        setShowDetails(true);
    };


    const handlePlay = (index: number) => {
        const query = queries[index].code;
        dispatch(setError(null));
        axios
            .post(
                QUERY_ENDPOINT,
                { host, port, query, nodeLimit },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((response) => {
                onFetchQuery(response, query as string, nodeLabels, dispatch);
            })
            .catch((error) => {
                console.warn(error)
                dispatch(setError(COMMON_GREMLIN_ERROR));
            });
    };



    return (
        <Grid container spacing={2} sx={{ position: 'relative', height: '100vh', overflow: 'auto' }}>
            <Grid item xs={12} sx={{ height: showDetails ? '50%' : '100%', overflowY: 'auto', overflowX: 'auto' }}>
                <List>
                    {queries.map((query, ndx) => (
                        <React.Fragment key={ndx}>
                            <ListItem disablePadding sx={{ height: 'auto', minHeight: 56, display: 'flex', alignItems: 'center', marginTop: "-1px", border: "1px solid black", borderTop: "none", '&:first-of-type': { borderTop: '1px solid black' }, '&:last-of-type': { borderBottom: '1px solid black' } }}>
                                <ListItemButton selected={selectedIndex === ndx} onClick={(event) => handleListItemClick(event, ndx)}>
                                    <ListItemText primary={query.description} sx={{ textAlign: 'center', wordBreak: 'break-word', minWidth: 0 }} />
                                    <IconButton onClick={(event) => handlePlay(ndx)} edge="end" size="large"  aria-label={`Play-${ndx}`}sx={{ color: 'rgb(30, 144, 255)' }}>
                                        <PlayArrowIcon />
                                    </IconButton>
                                </ListItemButton>
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            </Grid>
            {showDetails && selectedIndex > -1 && (
                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '95%',
                    height: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 1,
                    border: '2px solid black',
                    bgcolor: 'background.default'
                }}>
                    <Box sx={{ width: '90%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', textAlign: 'left' }}>
                            <Typography variant="body1">
                                Preview
                            </Typography>
                        </Box>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={() => setShowDetails(false)}
                                size="small"
                                sx={{ minWidth: 'auto', padding: '5px' }}
                                startIcon={<CloseIcon />}
                            >
                                Close
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{
                        width: '80%',
                        height: '80%',
                        bgcolor: 'white',
                        border: '2px solid #ccc',
                        boxShadow: 2,
                        p: 2,
                        overflowY: 'auto',
                        wordBreak: 'break-all'

                    }}>
                        {queries[selectedIndex].code}
                    </Box>
                </Box>
            )}
        </Grid>
    )
};

export default SavedQueries