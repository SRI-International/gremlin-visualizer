import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { EdgeData, NodeData } from "../../../src/logics/utils";
import { setupStore } from "../../../src/app/store";
import axios from 'axios';
import { openNodeDialog, openEdgeDialog, setSuggestions } from '../../../src/reducers/dialogReducer';
import { ModalDialogComponent } from '../../../src/components/ModalDialog/ModalDialogComponent';
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

test("test modalDialog renders", async () => {
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

test("submitting dialog dispatches addNode", async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.post.mockResolvedValue({
    data: {
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
    }
  });
  let user = userEvent.setup();
  let store = setupStore({});
  jest.spyOn(store, 'dispatch');
  store.dispatch(openNodeDialog({ x: 200, y: 200 }));

  render(
    <Provider store={store}>
      <ModalDialogComponent />
    </Provider>
  );
  const inputElement = screen.getByRole('combobox', { name: /type/i });
  await user.type(inputElement, "person");
  const buttonElement = screen.getByRole('button', { name: /Add More../i });
  await user.click(buttonElement);
  const nameInput = screen.getByRole('combobox', { name: /Property Name/i });
  expect(nameInput).toBeInTheDocument();
  await user.type(nameInput, "name");
  await waitFor(() => {
    expect(nameInput).toHaveValue('name');
  });
  const valueInput = screen.getByRole('textbox', { name: /Property Value/i });
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
})

test("cancel closes dialog", async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.post.mockResolvedValue({
    data: {
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
    }
  });

  let user = userEvent.setup();
  let store = setupStore({});
  jest.spyOn(store, 'dispatch');
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
})


