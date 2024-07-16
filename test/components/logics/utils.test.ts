import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../../../src/App';
import userEvent from '@testing-library/user-event';
import { defaultNodeLabel, EdgeData, extractEdgesAndNodes, NodeData } from "../../../src/logics/utils";
import { setupStore } from "../../../src/app/store";
import axios from 'axios';
import { EDGE_ID_APPEND, QUERY_ENDPOINT, QUERY_RAW_ENDPOINT } from '../../../src/constants';
import { setNodePositions } from '../../../src/logics/graph';
import { addNodes, addEdges } from '../../../src/reducers/graphReducer'
import { openNodeDialog } from '../../../src/reducers/dialogReducer';
import { ModalDialogComponent } from '../../../src/components/ModalDialog/ModalDialogComponent';
import { DIALOG_TYPES } from '../../../src/components/ModalDialog/ModalDialogComponent';
test("extractEdgesAndNodes with custom arguments returns correct nodes, edges, nodeLabels", async () => {
    const argument0 : NodeData[] = [
        {
          "id": 1,
          "label": "person",
          "properties": {
            "name": "Bob",
            "age": "21"
          },    
          "edges": [
            {
              "id": "0",
              "from": 1,
              "to": 2,
              "label": "knows",
              "properties": {
                "length": "2"
              }
            }
          ]
        },
        {
          "id": 2,
          "label": "person",
          "properties": {
            "name": "Max",
            "age": "18"
          },
          "edges": []
        },
      ] as NodeData[]
      const argument1 = [];



      const expectedNodes = [
        {
          "id": 1,
          "label": "Bob",
          "properties": {
            "name": "Bob",
            "age": "21"
          },
          "edges": [
            {
              "id": "0",
              "from": 1,
              "to": 2,
              "label": "knows",
              "properties": {
                "length": "2"
              }
            }
          ],
          "type": "person"
        },
        {
          "id": 2,
          "label": "Max",
          "properties": {
            "name": "Max",
            "age": "18"
          },
          "edges": [],
          "type": "person"
        }
      ]
      const expectedEdges = [
        {
          "id": "0",
          "from": 1,
          "to": 2,
          "label": "knows",
          "properties": {
            "length": "2"
          },
          "type": "knows"
        }
      ]
      const expectedNodeLabels = [
        {
          "type": "person",
          "field": "name"
        }
      ]

    const {edges, nodes, nodeLabels} = extractEdgesAndNodes(argument0, argument1);
    expect(edges).toEqual(expectedEdges);
    expect(nodes).toEqual(expectedNodes);
    expect(nodeLabels).toEqual(expectedNodeLabels);
})