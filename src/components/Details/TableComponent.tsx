import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { selectGraph } from '../../reducers/graphReducer';
import { useSelector } from 'react-redux';
import { EdgeData, NodeData } from '../../logics/utils';
import { Data, IdType } from 'vis-network';
import { Key } from '@mui/icons-material';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Switch, TablePagination, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useEffect } from 'react';


type RowData = {
    type: string,
    displayLabel: string,
    additionalAttributes: { [key: string]: any };
};
interface HeadCell {
    disablePadding: boolean;
    id: keyof RowData;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'displayLabel',
        numeric: false,
        disablePadding: false,
        label: 'Label',
    },
    {
        id: 'type',
        numeric: false,
        disablePadding: false,
        label: 'Type',
    }
];

function createData(nodes: Array<NodeData>, edges: Array<EdgeData>, showNodes: boolean, showEdges: boolean) {
    let rows: RowData[] = [];
    if (showNodes) {
        nodes.forEach((node) => {
            let data: RowData = { type: node.type, displayLabel: node.label, additionalAttributes: { id: node.id, elementType: 'node', ...node.properties } };
            rows.push(data);
        })
    }
    if (showEdges) {
        edges.forEach((edge) => {
            let data: RowData = { type: edge.type, displayLabel: edge.label, additionalAttributes: { id: edge.id, elementType: 'edge', from: edge.from, to: edge.to, ...edge.properties } };
            rows.push(data);
        })
    }
    return rows;
}



function Row(props: { row: RowData }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ padding: '8px 0px', width: '10px' }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="left" component="th" scope="row">{row.displayLabel}</TableCell>
                <TableCell align="right">{row.type}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Additional
                            </Typography>
                            <Table size="small" aria-label="additional-info">
                                <TableHead>
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(row.additionalAttributes).map(([name, value]) => (
                                        <TableRow key={name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                {name}
                                            </TableCell>
                                            <TableCell>{value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
        const numA = Number(aValue);
        const numB = Number(bValue);
        if (!isNaN(numA) && !isNaN(numB)) {
            if (numB < numA) {
                return -1;
            }
            if (numB > numA) {
                return 1;
            }
            return 0;
        }
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (bValue < aValue) {
            return -1;
        }
        if (bValue > aValue) {
            return 1;
        }
    }
    return 0;
}

type Order = 'asc' | 'desc';

type SortableKeys = Exclude<keyof RowData, 'additionalAttributes'>;
function getComparator<Key extends SortableKeys>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: any },
    b: { [key in Key]: any },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: SortableKeys) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}



function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: SortableKeys) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property as SortableKeys);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell />
                {headCells.map((headCell, index) => (
                    <TableCell
                        key={headCell.id}
                        align={index % 2 === 0 ? "left" : "right"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id as SortableKeys)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function CollapsibleTable() {
    const { nodes, edges } = useSelector(selectGraph);
    const [rows, setRows] = React.useState(createData(nodes as NodeData[], edges as EdgeData[], true, false));
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<SortableKeys>('type');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [nodesChecked, setNodesChecked] = React.useState(true);
    const [edgesChecked, setEdgesChecked] = React.useState(false);

    useEffect(() => {
        setRows(createData(nodes, edges, nodesChecked, edgesChecked));
    }, [nodesChecked, edgesChecked]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: SortableKeys,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            rows.slice().sort(getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, rows],
    );

    const handleNodesToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNodesChecked(event.target.checked);
        if (!event.target.checked && edgesChecked === false) {
            setEdgesChecked(true);
        }
    };

    const handleEdgesToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEdgesChecked(event.target.checked);
        if (!event.target.checked && nodesChecked === false) {
            setNodesChecked(true);
        }
    };

    return (
        <Grid sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 16px)' }}>

            <FormControl component="fieldset">
                <FormLabel component="legend">Filter</FormLabel>
                <FormGroup aria-label="position" row>
                    <FormControlLabel
                        control={<Checkbox checked={nodesChecked} onChange={handleNodesToggle} />}
                        label="Nodes"
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={edgesChecked} onChange={handleEdgesToggle} />}
                        label="Edges"
                        labelPlacement="end"
                    />
                </FormGroup>
            </FormControl>

            <Paper sx={{ width: '100%', overflow: 'auto', flex: 1 }}>
                <TableContainer sx={{ flex: 1 }}>
                    <Table stickyHeader aria-label="collapsible table" size="small">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row) => (
                                <Row key={row.additionalAttributes.id} row={row} />
                            ))}
                            {emptyRows > 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Grid>
    );
}
