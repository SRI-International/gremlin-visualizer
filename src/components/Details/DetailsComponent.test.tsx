import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SidebarComponent } from './SidebarComponent';
import userEvent from '@testing-library/user-event';
import { defaultNodeLabel, EdgeData, NodeData } from "../../logics/utils";
import { setupStore } from "../../app/store";
import axios from 'axios';
import { QUERY_ENDPOINT, QUERY_RAW_ENDPOINT } from '../../constants';
import { Store, AnyAction } from 'redux';
import { updateNode } from '../../reducers/graphReducer';
import { onFetchQuery } from '../../logics/actionHelper';
jest.mock('../../logics/graph', () => ({
    applyLayout: jest.fn(),
    getNodePositions: jest.fn(),
    setNodePositions: jest.fn(),
    layoutOptions: ['random', 'hierarchical'] 
}));

jest.mock("axios", () => ({
    ...jest.requireActual("axios"),
    post: jest.fn(),
}));
// jest.mock('../../logics/actionHelper', () => ({
//     onFetchQuery: jest.fn(),
//   }));



const selectedNodeDummy: NodeData = { id: 1, label: 'Bob', properties: { name: "Bob", age: "21" }, edges: [], type: 'person', x: 0, y: 0 };
const selectedEdgeDummy: EdgeData = { id: 1, from: 2, to: 3, label: 'created', properties: { name: "dummy edge", age: "0" }, type: 'created' };
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
        selectedNode: selectedNodeDummy,
        selectedEdge: null,
        nodes: [],
        edges: [],
    }
};



describe('node tests', () => {


    test('renders node details correctly', async () => {
        const mockStore = configureStore();
        let store = mockStore(initialState);
        store.dispatch = jest.fn();
        render(
            <Provider store={store}>
                <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
            </Provider>
        );
        const detailsTab = screen.getByRole('tab', { name: 'Details' });
        await act(async () => {
            fireEvent.click(detailsTab);
        })
        expect(screen.getByText('Information: Node')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument(); 
        expect(screen.getByText('21')).toBeInTheDocument(); 
    });



    test("sends correct axios post when deleting a node property", async () => {
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

        const detailsTab = screen.getByRole('tab', { name: 'Details' });
        await user.click(detailsTab);
        const editText = screen.findByTestId("deleteButton-name");
        await user.click(await editText);

        const drop_query = `g.V('1').properties("name").drop()`;
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(2);
            expect(axios.post).toHaveBeenNthCalledWith(1,
                QUERY_RAW_ENDPOINT,
                {
                    host: initialState.gremlin.host,
                    port: initialState.gremlin.port,
                    query: drop_query,
                    nodeLimit: initialState.options.nodeLimit
                },
                { headers: { 'Content-Type': 'application/json' } }
            );
        });
    })


    test("onTraverse out triggers 4 dispatches in OnFetchQuery", async () => {
        let user = userEvent.setup();
        const mockStore = configureStore();
        let store = mockStore(initialState);
        store.dispatch = jest.fn();
        const mockedAxios = axios as jest.Mocked<typeof axios>;
        mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });
        render(
            <Provider store={store}>
                <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
            </Provider>
        );
        const detailsTab = screen.getByRole('tab', { name: 'Details' });
        await user.click(detailsTab);


        const button = screen.getByRole('button', { name: /Traverse Out Edges/i });
        await user.click(button);
        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledTimes(4);
            expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: 'graph/addNodes',
                payload: expect.anything() 
            }));
            expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: 'graph/addEdges',
                payload: expect.anything()  
            }));
            expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: 'options/setNodeLabels',
                payload: expect.anything() 
            }));
            expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: 'options/addQueryHistory',
                payload: expect.anything() 
            }));
        });
    })



    test("onTraverse In triggers triggers 4 dispatches in onFetchQuery", async () => {
        let user = userEvent.setup();
        const mockStore = configureStore();
        let store = mockStore(initialState);
        store.dispatch = jest.fn();
        const mockedAxios = axios as jest.Mocked<typeof axios>;
        mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });
        jest.spyOn(store, 'dispatch');

        render(
            <Provider store={store}>
                <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
            </Provider>
        );

        const detailsTab = screen.getByRole('tab', { name: 'Details' });
        await user.click(detailsTab);


        const button = screen.getByRole('button', { name: /Traverse In Edges/i });
        await user.click(button);
        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledTimes(4);
            expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: 'graph/addNodes',
                payload: expect.anything() 
            }));
            expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: 'graph/addEdges',
                payload: expect.anything()  
            }));
            expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: 'options/setNodeLabels',
                payload: expect.anything() 
            }));
            expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: 'options/addQueryHistory',
                payload: expect.anything() 
            }));
        });

    })


    test('clicking add property and confirming calls axios post with right arguments', async () => {
        let user = userEvent.setup();
        const mockStore = configureStore();
        let store = mockStore(initialState);
        store.dispatch = jest.fn();
        const mockedAxios = axios as jest.Mocked<typeof axios>;
        mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });
        render(
            <Provider store={store}>
                <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
            </Provider>
        );
        const detailsTab = screen.getByRole('tab', { name: 'Details' });
        await act(async () => {
            fireEvent.click(detailsTab);
        })

        const button = screen.getByRole('button', { name: /Add Property/i });
        await user.click(button);

        const propertyNameInput = screen.getByRole('textbox', { name: 'Property Name' });
        const propertyValueInput = screen.getByRole('textbox', { name: 'Property Value' });

        await user.type(propertyNameInput, 'height');
        await user.type(propertyValueInput, '170');

        const submitButton = screen.getByRole('button', { name: 'Add' });
        await user.click(submitButton);

        const expected_query = "g.V('1').property(\"height\", \"170\")"
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenNthCalledWith(1,
                QUERY_ENDPOINT,
                {
                    host: initialState.gremlin.host,
                    port: initialState.gremlin.port,
                    query: expected_query,
                    nodeLimit: initialState.options.nodeLimit
                },
                { headers: { 'Content-Type': 'application/json' } }
            );
        });
    


    });


})





describe("edge tests", () => {

    test('renders edge details correctly', async () => {
        const mockStore = configureStore();
        let store = mockStore({ ...initialState, graph: { selectedNode: null, selectedEdge: selectedEdgeDummy } });
        store.dispatch = jest.fn();
        render(
            <Provider store={store}>
                <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
            </Provider>
        );
        const detailsTab = screen.getByRole('tab', { name: 'Details' });
        await act(async () => {
            fireEvent.click(detailsTab);
        })

        expect(screen.getByText('Information: Edge')).toBeInTheDocument();
        expect(screen.getByText('created')).toBeInTheDocument(); /
        expect(screen.getByText('0')).toBeInTheDocument(); 
    });
})
