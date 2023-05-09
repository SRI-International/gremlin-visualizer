import _ from 'lodash';
import { Edge, Node } from 'vis-network';
import { NodeLabel } from '../reducers/optionReducer';
import assignIcon from './icons';

export interface NodeData extends Node {
  properties: any;
  type: string;
  uniqueId: string;
  edges?: Edge[];
}

const selectRandomField = (obj: any) => {
  let firstKey;
  for (firstKey in obj) break;
  return firstKey;
};

export const extractEdgesAndNodes = (
  nodeList: Array<NodeData>,
  oldNodeLabels: NodeLabel[] = []
) => {
  let edges: Edge[] = [];
  const nodes: Node[] = [];
  const nodeLabels: NodeLabel[] = [...oldNodeLabels];

  const nodeLabelMap = _.mapValues(_.keyBy(nodeLabels, 'type'), 'field');

  _.forEach(nodeList, (node) => {
    const type = node.label;
    if (type) {
      if (!nodeLabelMap[type]) {
        const field = selectRandomField(node.properties);
        const nodeLabel: NodeLabel = { type, field };
        nodeLabels.push(nodeLabel);
        nodeLabelMap[type] = field;
      }
      const labelField = nodeLabelMap[type];
      const label =
        labelField && labelField in node.properties
          ? node.properties[labelField]
          : type;
      const icon = assignIcon(node);
      // console.log(node);
      const gNode: NodeData = {
        id: node.id,
        uniqueId: `${node.properties.layout_id}`,
        label: String(label),
        group: node.label,
        properties: node.properties,
        type,
      };
      if (icon) {
        gNode.image = icon;
        gNode.shape = 'image';
      }
      nodes.push(gNode);

      edges = edges.concat(
        _.map(node.edges, (edge) => ({
          ...edge,
          type: edge.label,
          arrows: { to: { enabled: true, scaleFactor: 0.5 } },
        }))
      );
    }
  });

  return { edges, nodes, nodeLabels };
};

export const stringifyObjectValues = (obj: any) => {
  _.forOwn(obj, (value, key) => {
    if (!_.isString(value)) {
      obj[key] = JSON.stringify(value);
    }
  });
};
