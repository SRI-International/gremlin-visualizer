import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SidebarComponent } from '../../../src/components/Details/SidebarComponent';
import userEvent from '@testing-library/user-event';
import { EdgeData, NodeData } from "../../../src/logics/utils";
import { setupStore } from "../../../src/app/store";
import axios from 'axios';
import { addNodes, addEdges } from '../../../src/reducers/graphReducer'


jest.mock('../../../src/logics/graph', () => ({
    applyLayout: jest.fn(),
    getNodePositions: jest.fn(),
    setNodePositions: jest.fn(),
    layoutOptions: ['force-directed', 'hierarchical']
}));

jest.mock("axios", () => ({
    ...jest.requireActual("axios"),
    post: jest.fn(),
}));

const nodes = [
    {
        "id": 2,
        "label": "Ava",
        "properties": {
            "name": "Ava",
            "age": "21"
        },
        "edges": [
            {
                "id": "1",
                "from": 2,
                "to": 3,
                "label": "knows",
                "properties": {
                    "length": "2"
                }
            }
        ],
        "type": "person"
    },
    {
        "id": 3,
        "label": "Bob",
        "properties": {
            "name": "Bob",
            "age": "18"
        },
        "edges": [],
        "type": "person"
    }, {
        "id": 4,
        "label": "Caitlyn",
        "properties": {
            "name": "Caitlyn",
            "age": "18"
        },
        "edges": [],
        "type": "person"
    }, {
        "id": 5,
        "label": "Dominic",
        "properties": {
            "name": "Dominic",
            "age": "18"
        },
        "edges": [],
        "type": "person"
    }, {
        "id": 6,
        "label": "Eddy",
        "properties": {
            "name": "Eddy",
            "age": "18"
        },
        "edges": [],
        "type": "person"
    }, {
        "id": 7,
        "label": "Frank",
        "properties": {
            "name": "Frank",
            "age": "18"
        },
        "edges": [],
        "type": "person"
    }, {
        "id": 8,
        "label": "George",
        "properties": {
            "name": "George",
            "age": "18"
        },
        "edges": [],
        "type": "person"
    }, {
        "id": 9,
        "label": "Hank",
        "properties": {
            "name": "Hank",
            "age": "18"
        },
        "edges": [],
        "type": "person"
    }, {
        "id": 10,
        "label": "Ike",
        "properties": {
            "name": "Ike",
            "age": "18"
        },
        "edges": [],
        "type": "person"
    }, {
        "id": 11,
        "label": "Jonathan",
        "properties": {
            "name": "Jonathan",
            "age": "18"
        },
        "edges": [],
        "type": "person"
    }, {
        "id": 12,
        "label": "Kyle",
        "properties": {
            "name": "Kyle",
            "age": "18"
        },
        "edges": [],
        "type": "person"
    }
]
const edges = [
    {
        "id": "1",
        "from": 2,
        "to": 3,
        "label": "knows",
        "properties": {
            "length": "2"
        },
        "type": "knows"
    }
]
jest.mock('../../../src/constants', () => ({
    INITIAL_LABEL_MAPPINGS: {
        person: 'name'
    },
    GRAPH_IMPL: "vis"

}));

test("dispatch nodes and edges and confirm Bob and Max appears in table", async () => {
    let user = userEvent.setup();
    let store = setupStore({});
    jest.spyOn(store, 'dispatch');
    store.dispatch(addNodes(nodes));
    store.dispatch(addEdges(edges));
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });
    render(
        <Provider store={store}>
            <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
        </Provider>
    );

    const tableTab = screen.getByRole('tab', { name: 'Table View' });
    await user.click(tableTab);

    expect(screen.getByText('Ava')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
});

test("test that expand row works and shows age", async () => {
    let user = userEvent.setup();
    let store = setupStore({});
    jest.spyOn(store, 'dispatch');
    store.dispatch(addNodes(nodes));
    store.dispatch(addEdges(edges));
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });

    render(
        <Provider store={store}>
            <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
        </Provider>
    );

    const tableTab = screen.getByRole('tab', { name: 'Table View' });
    await user.click(tableTab);

    const expandButtons = screen.getAllByRole('button', { name: /expand row/i });
    await user.click(expandButtons[0]);
    expect(screen.getByText('age')).toBeInTheDocument();
    expect(screen.getByText('21')).toBeInTheDocument();
});


test("test click sort button twice should sort descending then ascending by name", async () => {
    let user = userEvent.setup();
    let store = setupStore({});
    jest.spyOn(store, 'dispatch');
    store.dispatch(addNodes(nodes));
    store.dispatch(addEdges(edges));
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });

    render(
        <Provider store={store}>
            <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
        </Provider>
    );

    const tableTab = screen.getByRole('tab', { name: 'Table View' });
    await user.click(tableTab);

    const sortButton = screen.getByRole('button', { name: 'Label' });

    await user.click(sortButton);

    const headersDescending = screen.getAllByRole('rowheader');

    const headerTextsDescending = headersDescending.map(header => header.textContent);
    expect(headerTextsDescending).toEqual(['Kyle', 'Jonathan', 'Ike', 'Hank', 'George', 'Frank', 'Eddy', 'Dominic', 'Caitlyn', 'Bob']);

    await user.click(sortButton);

    const headersAscending = screen.getAllByRole('rowheader');

    const headerTextsAscending = headersAscending.map(header => header.textContent);
    expect(headerTextsAscending).toEqual(['Ava', 'Bob', 'Caitlyn', 'Dominic', 'Eddy', 'Frank', 'George', 'Hank', 'Ike', 'Jonathan']);
});


test("test that rows per page can be set from default(10) to 5", async () => {
    let user = userEvent.setup();
    let store = setupStore({});
    jest.spyOn(store, 'dispatch');
    store.dispatch(addNodes(nodes));
    store.dispatch(addEdges(edges));
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });

    render(
        <Provider store={store}>
            <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
        </Provider>
    );

    const tableTab = screen.getByRole('tab', { name: 'Table View' });
    await user.click(tableTab);

    const rowsPerPageButton = screen.getByRole('combobox');
    await user.click(rowsPerPageButton);

    const fiveOption = screen.getByRole("option", { name: "5" })
    await user.click(fiveOption);

    const headers = screen.getAllByRole('rowheader');
    expect(headers).toHaveLength(5);
});

test("dechecking node selects edge and shows 1 edge", async () => {
    let user = userEvent.setup();
    let store = setupStore({});
    jest.spyOn(store, 'dispatch');
    store.dispatch(addNodes(nodes));
    store.dispatch(addEdges(edges));
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });

    render(
        <Provider store={store}>
            <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
        </Provider>
    );

    const tableTab = screen.getByRole('tab', { name: 'Table View' });
    await user.click(tableTab);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    const allKnowsTexts = screen.getAllByText('knows');
    expect(allKnowsTexts[0]).toBeInTheDocument();
});
















