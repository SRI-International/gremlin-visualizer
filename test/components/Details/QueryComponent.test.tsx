import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Query from '../../../src/components/Details/QueryComponent';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { setupStore } from '../../../src/app/store';
import { SidebarComponent } from '../../../src/components/Details/SidebarComponent';

jest.mock("axios", () => ({
  ...jest.requireActual("axios"),
  post: jest.fn(),
}));
jest.mock('../../../src/logics/graph', () => ({
  applyLayout: jest.fn(),
  getNodePositions: jest.fn(),
  setNodePositions: jest.fn(),
  layoutOptions: ['random', 'hierarchical']
}));

const initialState = {
  gremlin: {
    host: 'localhost',
    port: '8182',
    query: 'g.V()'
  },
  options: {
    nodeLabels: [],
    nodeLimit: 50
  },
  graph: {
    nodes: [],
    edges: [],
    selectedNode: undefined,
    selectedEdge: undefined,
    nodeColorMap: {},
    workspaces: []
  },
  dialog: {
    isDialogOpen: false,
    dialogType: '',
    properties: {},
    x: null,
    y: null,
    edgeFrom: null,
    edgeTo: null,
    suggestions: {},
  }
};

test('queryComponent renders with g.V()', () => {
  const mockStore = configureStore();
  let store = mockStore(initialState);
  store.dispatch = jest.fn();
  const { getByLabelText } = render(
    <Provider store={store}>
      <Query />
    </Provider>
  );
  const gremlin_query_text = getByLabelText("gremlin query").textContent;

  expect(gremlin_query_text).toEqual("g.V()");
});

test('adding one node query sends axios post and dispatches addNode', async () => {
  let user = userEvent.setup();
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });
  const mockStore = configureStore();
  let store = mockStore(initialState);
  store.dispatch = jest.fn();
  jest.spyOn(store, 'dispatch');
  render(
    <Provider store={store}>
      <Query />
    </Provider>
  );

  const textField = screen.getByLabelText('gremlin query');
  const newQuery = 'g.addV("person").property("name", "Alice")';
  await user.clear(textField);
  await user.type(textField, newQuery);
  const button = screen.getByText('Execute');
  await userEvent.click(button);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
  });
  await waitFor(() => {
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'graph/addNodes',
      payload: expect.anything()
    }));
  });
});



test('executed query is added into query history list', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });
  let user = userEvent.setup();
  let store = setupStore();
  render(
    <Provider store={store}>
      <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
    </Provider>
  );

  const textField = screen.getByLabelText('gremlin query');
  const newQuery = 'g.addV("person").property("name", "Alice")';
  await user.clear(textField);
  await user.type(textField, newQuery);
  const button = screen.getByText('Execute');
  await userEvent.click(button);

  expect(store.getState().gremlin.query).toBe(newQuery);
  await waitFor(() => {
    const matchingElements = screen.getAllByText(newQuery);
    expect(matchingElements.length).toBe(2);
  });
});

test('execute then clear', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.post.mockResolvedValue({ data: 'Mocked success' });
  let store = setupStore();
  render(
    <Provider store={store}>
      <SidebarComponent panelWidth={350} handleMouseDown={() => { }} />
    </Provider>
  );

  const button = screen.getByText('Execute');
  await userEvent.click(button);

  const clearButton = screen.getByText('Clear Graph');
  await userEvent.click(clearButton);
  await waitFor(() => {
    const matchingElements = screen.getAllByText("g.V()");
    expect(matchingElements.length).toBe(1);
  });
});