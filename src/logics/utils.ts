import _ from 'lodash';
import { Edge, Network, Node } from 'vis-network';
import { NodeLabel } from '../reducers/optionReducer';
import cytoscape from "cytoscape";
import Sigma from "sigma";

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
  x: number
  y: number
  [key:string]: any
}

export type GraphTypes = Sigma | Network | cytoscape.Core | null

export interface GraphData {
  nodes: NodeData[],
  edges: EdgeData[]
}

export interface GraphOptions {
  isPhysicsEnabled: boolean,
}

const selectRandomField = (obj: any) => {
  let firstKey;
  for (firstKey in obj) break;
  return firstKey;
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


