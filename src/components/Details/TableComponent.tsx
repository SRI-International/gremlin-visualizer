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
import { IdType } from 'vis-network';
import { Key } from '@mui/icons-material';


type RowData = {
    id: IdType,
    elementType : string,
    type: string,
    displayLabel : string,
    additionalAttributes: { [key: string]: any };
};

function createData(nodes: Array<NodeData>, edges: Array<EdgeData>) {
    let rows: RowData[] = [];
    nodes.forEach((node) => {
        let data : RowData = {id: node.id, elementType : 'node', type: node.type, displayLabel: node.label, additionalAttributes: node.properties};
        rows.push(data);
    })
    edges.forEach((edge) => {
        let data : RowData = {id: edge.id, elementType: 'edge', type: edge.type, displayLabel: edge.label, additionalAttributes: {...edge.properties, from: edge.from, to:edge.to}};
        rows.push(data);
    })
    return rows;
}

// function createData(
//     name: string,
//     calories: number,
//     fat: number,
//     carbs: number,
//     protein: number,
//     price: number,
// ) {
//     return {
//         name,
//         calories,
//         fat,
//         carbs,
//         protein,
//         price,
//         history: [
//             {
//                 date: '2020-01-05',
//                 customerId: '11091700',
//                 amount: 3,
//             },
//             {
//                 date: '2020-01-02',
//                 customerId: 'Anonymous',
//                 amount: 1,
//             },
//         ],
//     };
// }


function Row(props: { row: RowData }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.id}
                </TableCell>
                <TableCell align="right">{row.elementType}</TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{row.displayLabel}</TableCell>
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
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(row.additionalAttributes).map(([name, value]) => (
                                        <TableRow key={name}>
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


export default function CollapsibleTable() {
    const { nodes, edges } = useSelector(selectGraph);
    const rows = createData(nodes as NodeData[], edges as EdgeData[]);
    console.log(nodes);
    console.log(edges); 
    console.log("yes");
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>id</TableCell>
                        <TableCell align="right">elementType</TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">Label</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.id} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
