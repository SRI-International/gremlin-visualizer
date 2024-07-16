import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SidebarComponent } from '../../../src/components/Details/SidebarComponent';
import userEvent from '@testing-library/user-event';
import { defaultNodeLabel, EdgeData, NodeData } from "../../../src/logics/utils";
import { setupStore } from "../../../src/app/store";
import axios from 'axios';
import { EDGE_ID_APPEND, QUERY_ENDPOINT, QUERY_RAW_ENDPOINT } from '../../../src/constants';
import { Store, AnyAction } from 'redux';
import { updateNode } from '../../../src/reducers/graphReducer';
import { onFetchQuery } from '../../../src/logics/actionHelper';

jest.mock('../../../src/logics/graph', () => ({
    applyLayout: jest.fn(),
    getNodePositions: jest.fn(),
    setNodePositions: jest.fn(),
    layoutOptions: ['random', 'hierarchical']
}));

jest.mock("axios", () => ({
    ...jest.requireActual("axios"),
    post: jest.fn(),
}));

const customQueries = {
    "get node with name marko" : "g.V().has('name', 'marko')",
    "get person nodes that marko has outgoing edges to" : "g.V().has('name', 'marko').out().hasLabel('person')"
  }
// Replace SAVED_QUERIES import in SavedQueries component with customQueries for testing
jest.mock('../../../src/constants', () => ({
    SAVED_QUERIES: customQueries,
    INITIAL_LABEL_MAPPINGS: []
}));

type State = {
    gremlin: {
        host: string;
        port: string;
        query: string;
    };
    options: {
        nodeLabels: string[];
        nodeLimit: number;
        queryHistory: string[];
    };
    graph: {
        selectedNode: NodeData | null;
        selectedEdge: EdgeData | null;
        nodes: NodeData[],
        edges: NodeData[],
    };


};

const initialState: State = {
    gremlin: {
        host: 'localhost',
        port: '8182',
        query: 'g.V()'
    },
    options: {
        nodeLabels: [],
        nodeLimit: 50,
        queryHistory: []
    },

    graph: {
        selectedNode: null,
        selectedEdge: null,
        nodes: [],
        edges: [],
    }
};


test("clicking play button for first saved query sends axios", async () => {
    let user = userEvent.setup();
    const mockStore = configureStore();
    let store = mockStore(initialState);
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });

    render(
        <Provider store={store}>
            <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
        </Provider>
    );

    const savedQueriesTab = screen.getByRole('tab', { name: 'Saved Queries' });
    await user.click(savedQueriesTab);
    const firstQueryButton = screen.getByRole('button', { name: "Play-0" });
    expect(firstQueryButton).toBeInTheDocument();

    await user.click(firstQueryButton);

    const query =  "g.V().has('name', 'marko')";
    await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
            QUERY_ENDPOINT,
            expect.objectContaining({
                host: initialState.gremlin.host,
                port: initialState.gremlin.port,
                query: query,
                nodeLimit: initialState.options.nodeLimit
            }),
            expect.objectContaining({
                headers: { 'Content-Type': 'application/json' }
            })
        );
    });
})