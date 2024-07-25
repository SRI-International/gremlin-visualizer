import _ from 'lodash';
import { Edge, Network, Node } from 'vis-network';
import { NodeLabel } from '../reducers/optionReducer';
import cytoscape from "cytoscape";
import Sigma from "sigma";
import { setSuggestions, Suggestions } from '../reducers/dialogReducer';
import store from '../app/store';
import { DIALOG_TYPES } from '../components/ModalDialog/ModalDialogComponent';
import { RISK_COLORS } from '../constants';
import { updateColorMap } from '../reducers/graphReducer';

let convert = require('color-convert')

let hues = [
  // 0, 
  240,
  // 60, 120, 
  280, 30, 310, 180]
//remove hues of 0(red), 60(yellow), 120(green) when coloring risks
let hueIndex = 0;
let light = 50

export const getColor = (node: NodeData) => {
  if (node.properties.risk !== undefined) {
    return RISK_COLORS.risk[node.properties.risk as keyof typeof RISK_COLORS.risk];
  }
  else {
    let nodeColorMap = Object.assign({}, store.getState().graph.nodeColorMap)
    if (node.type !== undefined && !(node.type in nodeColorMap)) {
      let color = '#' + convert.hsl.hex(hues[hueIndex++], 100, light)
      if (hueIndex == 8) light = light === 50 ? 75 : light === 75 ? 25 : 50
      hueIndex %= 8;
      nodeColorMap[`${node.type}`] = color
      store.dispatch(updateColorMap(nodeColorMap))
    }
    return node.type !== undefined ? nodeColorMap[node.type] : undefined
  }
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
  [dialogType: string]: {
    [label: string]: Set<string>;
  }
}

const storeSuggestions = (nodes: Array<NodeData>, edges: Array<EdgeData>) => {
  const suggestions: Suggestions = {
    [DIALOG_TYPES.NODE]: { types: [], labels: {} },
    [DIALOG_TYPES.EDGE]: { types: [], labels: {} }
  };

  const nodeSuggestions = suggestions[DIALOG_TYPES.NODE];
  nodes.forEach(node => {
    nodeSuggestions.types.push(node.type);
    if (!nodeSuggestions.labels[node.type]) {
      nodeSuggestions.labels[node.type] = []
    }
    Object.keys(node.properties).forEach(field => {
      nodeSuggestions.labels[node.type].push(field);
    });
  })
  Object.keys(nodeSuggestions.labels).forEach(label => {
    const tempLabelSet = new Set(nodeSuggestions.labels[label]);
    suggestions[DIALOG_TYPES.NODE].labels[label] = Array.from(tempLabelSet);
  });
  let tempTypeSet = new Set(nodeSuggestions.types);
  suggestions[DIALOG_TYPES.NODE].types = Array.from(tempTypeSet)


  const edgeSuggestions = suggestions[DIALOG_TYPES.EDGE];
  edges.forEach(edge => {
    edgeSuggestions.types.push(edge.type);
    if (!edgeSuggestions.labels[edge.type]) {
      edgeSuggestions.labels[edge.type] = [];
    }
    Object.keys(edge.properties).forEach(field => {
      edgeSuggestions.labels[edge.type].push(field);
    });
  })
  Object.keys(edgeSuggestions.labels).forEach(label => {
    const tempLabelSet = new Set(edgeSuggestions.labels[label]);
    suggestions[DIALOG_TYPES.EDGE].labels[label] = Array.from(tempLabelSet);
  });
  tempTypeSet = new Set(edgeSuggestions.types);
  suggestions[DIALOG_TYPES.EDGE].types = Array.from(tempTypeSet)

  store.dispatch(setSuggestions(suggestions));
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


