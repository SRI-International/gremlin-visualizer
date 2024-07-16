import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SidebarComponent } from '../../../src/components/Details/SidebarComponent';
import userEvent from '@testing-library/user-event';
import { defaultNodeLabel, EdgeData, NodeData } from "../../../src/logics/utils";
import { setupStore } from "../../../src/app/store";
import axios from 'axios';
import { EDGE_ID_APPEND, QUERY_ENDPOINT, QUERY_RAW_ENDPOINT } from '../../../src/constants';
import { setNodePositions } from '../../../src/logics/graph';


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

const customQueries = {
    "get node with name marko": "g.V().has('name', 'marko')",
    "get person nodes that marko has outgoing edges to": "g.V().has('name', 'marko').out().hasLabel('person')"
}
// Replace SAVED_QUERIES import in SavedQueries component with customQueries for testing
jest.mock('../../../src/constants', () => ({
    SAVED_QUERIES: customQueries,
    INITIAL_LABEL_MAPPINGS: {
        person: 'name'
    },
    GRAPH_IMPL: "vis"

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


test("refreshing a node label sends update/refresheNodeLabels dispatch", async () => {
    let user = userEvent.setup();
    const mockStore = configureStore();
    let store = setupStore();
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    store.dispatch = jest.fn();
    mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });

    render(
        <Provider store={store}>
            <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
        </Provider>
    );


    const settingsTab = screen.getByRole('tab', { name: 'Settings' });
    await user.click(settingsTab);

    // expect(screen.getByText('name')).toBeInTheDocument();


    const labelTextField = screen.getByTestId(`label-field-0`);

    expect(labelTextField).toBeInTheDocument();



    await user.click(labelTextField);

    // await user.clear(labelTextField)
    await user.type(labelTextField, '{backspace}{backspace}{backspace}{backspace}');
    await user.type(labelTextField, 'age');

    const button = screen.getByRole('button', { name: /Refresh/i });
    await user.click(button);


    await waitFor(() => {
        expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'options/editNodeLabel',
            payload: expect.anything()
        }));
        expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'graph/refreshNodeLabels',
            payload: expect.anything()
        }));


    })

});






test("save workspace as 'saved workspace' and confirm it appears as one of the options in load workspace", async () => {
    let user = userEvent.setup();
    const mockStore = configureStore();
    let store = setupStore();
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    // store.dispatch = jest.fn();
    mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });
    jest.spyOn(store, 'dispatch');

    render(
        <Provider store={store}>
            <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
        </Provider>
    );


    const settingsTab = screen.getByRole('tab', { name: 'Settings' });
    await user.click(settingsTab);

    // expect(screen.getByText('name')).toBeInTheDocument();


    const labelTextField = screen.getByTestId(`label-field-0`);

    expect(labelTextField).toBeInTheDocument();



    await user.click(labelTextField);



    const saveWorkspaceButton = screen.getByRole('button', { name: /Save Workspace/i });
    await user.click(saveWorkspaceButton);

    const workspaceNameInput = screen.getByRole('textbox', { name: 'Workspace Name' });
    await user.click(workspaceNameInput);
    await user.type(workspaceNameInput, 'saved workspace');
    const saveButton = screen.getByRole('button', { name: /Save/i });
    await user.click(saveButton);
    await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    const loadWorkspaceButton = screen.getByRole('button', { name: /Load Workspace/i });
    await user.click(loadWorkspaceButton);

    const dropdown = within(await screen.findByTestId("workspace-select")).getByRole(
        "combobox",
    );
    await user.click(dropdown);
    expect(
        await screen.findByRole("option", { name: "saved workspace" }),
    ).toBeInTheDocument();

    const saved_workspace = screen.getByRole("option", { name: "saved workspace" });
    await user.click(saved_workspace);
    const loadButton = screen.getByRole('button', { name: /Load/i });
    await user.click(loadButton);





})





test("refreshing a node label sends update/refresheNodeLabels dispatch", async () => {
    let user = userEvent.setup();
    const mockStore = configureStore();
    let store = setupStore();
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    store.dispatch = jest.fn();
    mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });
    render(
        <Provider store={store}>
            <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
        </Provider>
    );

    const settingsTab = screen.getByRole('tab', { name: 'Settings' });
    await user.click(settingsTab);
    const labelTextField = screen.getByTestId(`label-field-0`);
    expect(labelTextField).toBeInTheDocument();
    await user.click(labelTextField);
    // await user.clear(labelTextField)
    await user.type(labelTextField, '{backspace}{backspace}{backspace}{backspace}');
    await user.type(labelTextField, 'age');
    const button = screen.getByRole('button', { name: /Refresh/i });
    await user.click(button);

    await waitFor(() => {
        expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'options/editNodeLabel',
            payload: expect.anything()
        }));
        expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'graph/refreshNodeLabels',
            payload: expect.anything()
        }));
    })
});


test("change host, port, nodelimit, layout sends dispatches", async () => {
    let user = userEvent.setup();
    const mockStore = configureStore();
    let store = setupStore();
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    jest.spyOn(store, 'dispatch');
    mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });
    render(
        <Provider store={store}>
            <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
        </Provider>
    );

    const settingsTab = screen.getByRole('tab', { name: 'Settings' });
    await user.click(settingsTab);

    const hostTextField = screen.getByLabelText('host');
    await user.clear(hostTextField);
    await user.type(hostTextField, "host_garbage");
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'gremlin/setHost',
        payload: "host_garbage"
    }));

    const portTextField = screen.getByLabelText('port');
    await user.clear(portTextField);
    await user.type(portTextField, "port_garbage");
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'gremlin/setPort',
        payload: "port_garbage"
    }));

    const nodeLimitTextField = screen.getByLabelText('Node Limit');
    await user.clear(nodeLimitTextField);
    await user.type(nodeLimitTextField, "10");
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'options/setNodeLimit',
        payload: "10"
    }));








});





