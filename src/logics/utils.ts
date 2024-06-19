import _ from 'lodash';
import { Edge, Network, Node } from 'vis-network';
import { NodeLabel } from '../reducers/optionReducer';
import cytoscape from "cytoscape";
import Sigma from "sigma";
import { FieldSuggestions, setSuggestions } from '../reducers/dialogReducer';
import store from '../app/store';
import { DIALOG_TYPES } from '../components/ModalDialog/ModalDialogComponent';

let convert = require('color-convert')

let hues = [0, 240, 60, 120, 280, 30, 310, 180]
let hueIndex = 0;
let light = 50

export const getColor = () => {
  let color = '#' + convert.hsl.hex(hues[hueIndex++], 100, light)
  if (hueIndex == 8) light = light === 50 ? 75 : light === 75 ? 25 : 50
  hueIndex %= 8;
  return color;
}

type IdType = string | number

export interface EdgeData {
  id: IdType
  from: IdType
  to: IdType
  label: string
  properties: any

  [key: string]: any
}

export interface NodeData {
  id: IdType
  properties: any
  label: string
  type: string
  edges: EdgeData[]
  x: number | undefined
  y: number | undefined

  [key: string]: any
}

export type GraphTypes = Sigma | Network | cytoscape.Core | null

export interface GraphData {
  nodes: NodeData[],
  edges: EdgeData[]
}

export interface GraphOptions {
  layout: string,
  isPhysicsEnabled: boolean,
}

const selectRandomField = (obj: any) => {
  let firstKey;
  for (firstKey in obj) break;
  return firstKey;
};

export interface TempFieldSuggestions {
  [dialogType : string] : {
    [label: string] : Set<string>;
  }
}

const storeSuggestions = (nodes: Array<NodeData>, edges: Array<EdgeData>) => {
  const fieldSuggestions: FieldSuggestions = {[DIALOG_TYPES.NODE] : {}, [DIALOG_TYPES.EDGE] : {}};
  const tempFieldSuggestions: TempFieldSuggestions = {[DIALOG_TYPES.NODE] : {}, [DIALOG_TYPES.EDGE] : {}};
  const nodeSuggestions = tempFieldSuggestions[DIALOG_TYPES.NODE];
  const edgeSuggestions = tempFieldSuggestions[DIALOG_TYPES.EDGE];

  nodes.forEach(node => {
    if (!nodeSuggestions[node.type]) {
      nodeSuggestions[node.type] = new Set();
    }
    Object.keys(node.properties).forEach(field => {
      nodeSuggestions[node.type].add(field);
    });
  })
  Object.keys(nodeSuggestions).forEach(type => {
    fieldSuggestions[DIALOG_TYPES.NODE][type] = Array.from(nodeSuggestions[type]);
  });

  edges.forEach(edge => {
    if (!edgeSuggestions[edge.type]) {
      edgeSuggestions[edge.type] = new Set();
    }
    Object.keys(edge.properties).forEach(field => {
      edgeSuggestions[edge.type].add(field);
    });
  })
  Object.keys(edgeSuggestions).forEach(type => {
    fieldSuggestions[DIALOG_TYPES.EDGE][type] = Array.from(edgeSuggestions[type]);
  });

  store.dispatch(setSuggestions(fieldSuggestions));
};

export const extractEdgesAndNodes = (nodeList: Array<NodeData>, oldNodeLabels: NodeLabel[] = []) => {
  let edges: Edge[] = [];
  const nodes: Node[] = [];
  const nodeLabels: NodeLabel[] = [...oldNodeLabels];

  const nodeLabelMap = _.mapValues(_.keyBy(nodeLabels, 'type'), 'field');

  _.forEach(nodeList, (node) => {
    const type = node.label;
    node = { ...node, type }
    if (type) {
      if (!(type in nodeLabelMap)) {
        const field = selectRandomField(node.properties);
        const nodeLabel: NodeLabel = { type, field };
        nodeLabels.push(nodeLabel);
        nodeLabelMap[type] = field;
      }
      const labelField = nodeLabelMap[type];
      const label = labelField && labelField in node.properties ? node.properties[labelField] : defaultNodeLabel(node);
      node = { ...node, label }

      nodes.push(node);

      edges = edges.concat(_.map(node.edges, edge => ({ ...edge, type: edge.label })));
    }
  });
  storeSuggestions(nodes as NodeData[], edges as EdgeData[]);
  return { edges, nodes, nodeLabels };
};

export const stringifyObjectValues = (obj: any) => {
  obj = Object.assign({}, obj)
  _.forOwn(obj, (value, key) => {
    if (!_.isString(value)) {
      obj[key] = JSON.stringify(value);
    }
  });
  return obj;
};

export function defaultNodeLabel(node: any) {
  return `${node.type}:${node.id}`
}


