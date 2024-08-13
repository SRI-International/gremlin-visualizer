import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SidebarComponent } from '../../../src/components/Details/SidebarComponent';
import userEvent from '@testing-library/user-event';
import { setupStore } from "../../../src/app/store";
import axios from 'axios';

jest.mock('../../../src/logics/graph', () => ({
    applyLayout: jest.fn(),
    getNodePositions: jest.fn(),
    setNodePositions: jest.fn(),
    layoutOptions: ['force-directed', 'hierarchical']
}));

jest.mock("axios", () => ({
    ...jest.requireActual("axios"),
    post: jest.fn(),
    get: jest.fn(),
}));

const customQueries = {
    "get node with name marko": "g.V().has('name', 'marko')",
    "get person nodes that marko has outgoing edges to": "g.V().has('name', 'marko').out().hasLabel('person')"
}
jest.mock('../../../src/constants', () => ({
    SAVED_QUERIES: customQueries,
    INITIAL_LABEL_MAPPINGS: {
        person: 'name'
    },
    GRAPH_IMPL: "vis"

}));

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

test("refreshing a node label sends editNodeLabel/refresheNodeLabels dispatch", async () => {
    let user = userEvent.setup();
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





