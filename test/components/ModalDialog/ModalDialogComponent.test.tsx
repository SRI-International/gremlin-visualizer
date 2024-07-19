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
import { openNodeDialog, openEdgeDialog, setSuggestions } from '../../../src/reducers/dialogReducer';
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

test("test node modalDialog renders with suggested", async () => {
    let user = userEvent.setup();
    let store = setupStore({});
    jest.spyOn(store, 'dispatch');

    // store.dispatch(setNodeLabels(nodeLabels));
    store.dispatch(openNodeDialog({ x: 200, y: 200 }));
    store.dispatch(setSuggestions({
      "node": {
        "types": [
          "person"
        ],
        "labels": {
          "person": [
            "name",
            "age"
          ]
        }
      },
      "edge": {
        "types": [],
        "labels": {}
      }
    }))
    render(
        <Provider store={store}>
            <ModalDialogComponent />
        </Provider>
    );

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('age')).toBeInTheDocument();
 
})

test("test edge modalDialog renders with suggested", async () => {
  let user = userEvent.setup();
  let store = setupStore({});
  jest.spyOn(store, 'dispatch');

  // store.dispatch(setNodeLabels(nodeLabels));
  store.dispatch(openEdgeDialog({ edgeFrom: 0, edgeTo: 1 }));
  store.dispatch(setSuggestions({
    "node": {
      "types": [
        "person"
      ],
      "labels": {
        "person": [
          "name",
          "age"
        ]
      }
    },
    "edge": {
      "types": [
        "knows"
      ],
      "labels": {
        "knows": [
          "length",
          "strength"
        ]
      }
    }
  }))

  render(
      <Provider store={store}>
          <ModalDialogComponent />
      </Provider>
  );

  expect(screen.queryByRole('dialog')).toBeInTheDocument();
  expect(screen.getByDisplayValue('length')).toBeInTheDocument();
  expect(screen.getByDisplayValue('strength')).toBeInTheDocument();

})

test("submitting dispatches addNode", async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.post.mockResolvedValue({ data:{
      "data": [
        {
          "id": 0,
          "label": "person",
          "properties": {
            "name": "Bob"
          },
          "edges": []
        }
      ]
    }});


  let user = userEvent.setup();
  let store = setupStore({});
  jest.spyOn(store, 'dispatch');

  // store.dispatch(setNodeLabels(nodeLabels));
  store.dispatch(openNodeDialog({ x: 200, y: 200 }));


  render(
      <Provider store={store}>
          <ModalDialogComponent />
      </Provider>
  );
  const inputElement = screen.getByRole('combobox', { name: /type/i });
  // await user.click(inputElement);
  await user.type(inputElement, "person");
  const buttonElement = screen.getByRole('button', { name: /Add More../i });
  await user.click(buttonElement);

  const nameInput = screen.getByRole('combobox', { name: /Property Name/i });
  expect(nameInput).toBeInTheDocument();
  // await user.click(inputElement2);
  await user.type(nameInput, "name");
  await waitFor(() => {
    expect(nameInput).toHaveValue('name');
  });

  // const valueInput = screen.getByText('Property Value');
  const valueInput = screen.getByRole('textbox', { name: /Property Value/i });
  // await user.click(inputElement3);
  await user.type(valueInput, "Bob");
  await waitFor(() => {
    expect(valueInput).toHaveValue('Bob');
  });
 
  const submitButton = screen.getByRole('button', { name: /Submit/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'graph/addNodes',
        payload: expect.anything()
    }));
});

  // Additional checks can be performed to ensure the right element is selected, if needed
})



test("cancel closes dialog", async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.post.mockResolvedValue({ data:{
      "data": [
        {
          "id": 0,
          "label": "person",
          "properties": {
            "name": "Bob"
          },
          "edges": []
        }
      ]
    }});


  let user = userEvent.setup();
  let store = setupStore({});
  jest.spyOn(store, 'dispatch');

  // store.dispatch(setNodeLabels(nodeLabels));
  store.dispatch(openNodeDialog({ x: 200, y: 200 }));

  render(
      <Provider store={store}>
          <ModalDialogComponent />
      </Provider>
  );
  const cancelButton = screen.getByRole('button', { name: /Cancel/i });
  await user.click(cancelButton);

  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  })
  // Additional checks can be performed to ensure the right element is selected, if needed
})


