import _ from 'lodash';
import { Edge, Network, Node } from 'vis-network';
import { NodeLabel } from '../reducers/optionReducer';
import getIcon from "../assets/icons";
import cytoscape from "cytoscape";
import Sigma from "sigma";

interface NodeData extends Node {
  properties: any;
  type: string;
  edges?: Edge[];
}

export type GraphTypes = Sigma | Network | cytoscape.Core | null

export interface GraphData {
  nodes: Node[],
  edges: Edge[]
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
    if (type) {
      if (!(type in nodeLabelMap)) {
        const field = selectRandomField(node.properties);
        const nodeLabel: NodeLabel = { type, field };
        nodeLabels.push(nodeLabel);
        nodeLabelMap[type] = field;
      }
      const labelField = nodeLabelMap[type];
      const label = labelField && labelField in node.properties ? node.properties[labelField] : `${type}:${node.id}`;
      const gNode: NodeData = { id: node.id, label: String(label), group: node.label, properties: node.properties, type };
      let icon = getIcon(type);
      if (icon) {
        gNode.image = icon;
        gNode.shape = 'image';
      }

      nodes.push(gNode);

      edges = edges.concat(_.map(node.edges, edge => ({ ...edge, type: edge.label, arrows: { to: { enabled: true, scaleFactor: 0.5 } } })));
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
