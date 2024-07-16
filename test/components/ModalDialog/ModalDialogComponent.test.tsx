import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../../../src/App';
import userEvent from '@testing-library/user-event';
import { defaultNodeLabel, EdgeData, NodeData, extractEdgesAndNodes, storeSuggestions } from "../../../src/logics/utils";
import { setupStore } from "../../../src/app/store";
import axios from 'axios';
import { EDGE_ID_APPEND, QUERY_ENDPOINT, QUERY_RAW_ENDPOINT } from '../../../src/constants';
import { setNodePositions } from '../../../src/logics/graph';
import { addNodes, addEdges } from '../../../src/reducers/graphReducer'
import { openNodeDialog, setSuggestions } from '../../../src/reducers/dialogReducer';
import { setNodeLabels } from '../../../src/reducers/optionReducer';
import { ModalDialogComponent } from '../../../src/components/ModalDialog/ModalDialogComponent';
// jest.mock('../../../src/logics/graph', () => ({
//     applyLayout: jest.fn(),
//     getNodePositions: jest.fn(),
//     setNodePositions: jest.fn(),
//     layoutOptions: ['force-directed', 'hierarchical']
// }));
jest.mock('../../../src/logics/graphImpl/sigmaImpl', () => ({
    __esModule: true, // Ensure it's treated as a module

}));

jest.mock("axios", () => ({
    ...jest.requireActual("axios"),
    post: jest.fn(),
}));

jest.mock('../../../src/constants', () => ({
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

test("test modalDialog renders", async () => {
    let user = userEvent.setup();
    let store = setupStore({});
    jest.spyOn(store, 'dispatch');
    store.dispatch(openNodeDialog({ x: 200, y: 200 }));
    render(
        <Provider store={store}>
            <ModalDialogComponent />
        </Provider>
    );
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
})

test("test modalDialog renders with suggested", async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue({ data:{
        "data": [
          {
            "id": 32,
            "label": "person",
            "properties": {
              "name": "Bob",
              "age": "21"
            },
            "edges": []
          }
        ],
        "status": 200,
        "statusText": "OK",
        "headers": {
          "content-length": "78",
          "content-type": "application/json; charset=utf-8"
        },
        "config": {
          "transitional": {
            "silentJSONParsing": true,
            "forcedJSONParsing": true,
            "clarifyTimeoutError": false
          },
          "adapter": [
            "xhr",
            "http",
            "fetch"
          ],
          "transformRequest": [
            null
          ],
          "transformResponse": [
            null
          ],
          "timeout": 0,
          "xsrfCookieName": "XSRF-TOKEN",
          "xsrfHeaderName": "X-XSRF-TOKEN",
          "maxContentLength": -1,
          "maxBodyLength": -1,
          "env": {},
          "headers": {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
          },
          "method": "post",
          "url": "http://localhost:3001/query",
          "data": "{\"host\":\"localhost\",\"port\":\"8182\",\"query\":\"g.addV('person').property('name', 'Bob').property('age', '21')\",\"nodeLimit\":100}"
        },
        "request": {}
      }});

    // const argument0: NodeData[] = [
    //     {
    //         "id": 1,
    //         "label": "person",
    //         "properties": {
    //             "name": "Bob",
    //             "age": "21"
    //         },
    //         "edges": [
    //             {
    //                 "id": "0",
    //                 "from": 1,
    //                 "to": 2,
    //                 "label": "knows",
    //                 "properties": {
    //                     "length": "2"
    //                 }
    //             }
    //         ]
    //     },
    //     {
    //         "id": 2,
    //         "label": "person",
    //         "properties": {
    //             "name": "Max",
    //             "age": "18"
    //         },
    //         "edges": []
    //     },
    // ] as NodeData[]
    // const argument1 = [];
    let user = userEvent.setup();
    let store = setupStore({});
    jest.spyOn(store, 'dispatch');

    // store.dispatch(setNodeLabels(nodeLabels));
    store.dispatch(openNodeDialog({ x: 200, y: 200 }));

    console.log(store.getState());
    render(
        <Provider store={store}>
            <ModalDialogComponent />
        </Provider>
    );

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    const input = screen.getByDisplayValue('name');

    // Additional checks can be performed to ensure the right element is selected, if needed
    expect(input).toBeInTheDocument();
})
