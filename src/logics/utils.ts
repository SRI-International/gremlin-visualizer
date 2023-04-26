import _ from 'lodash';
import threatActor from '../assets/icons/stix2_threat_actor_icon_tiny_round_v1.png';
import identity from '../assets/icons/stix2_identity_icon_tiny_round_v1.png';
import attackGoal from '../assets/icons/stix2_attack_goal_icon_tiny_round_v1.png';
import infrastructure from '../assets/icons/stix2_infrastructure_icon_tiny_round_v1.png';
import { Edge, Node } from 'vis-network';
import { NodeLabel } from '../reducers/optionReducer';

interface NodeData extends Node {
  properties: any;
  type: string;
  edges?: Edge[];
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
      if (!nodeLabelMap[type]) {
        const field = selectRandomField(node.properties);
        const nodeLabel: NodeLabel = { type, field };
        nodeLabels.push(nodeLabel);
        nodeLabelMap[type] = field;
      }
      const labelField = nodeLabelMap[type];
      const label = labelField && labelField in node.properties ? node.properties[labelField] : type;
      const gNode: NodeData = { id: node.id, label: String(label), group: node.label, properties: node.properties, type };
      
      nodes.push(gNode);

      edges = edges.concat(_.map(node.edges, edge => ({ ...edge, type: edge.label, arrows: { to: { enabled: true, scaleFactor: 0.5 } } })));
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
