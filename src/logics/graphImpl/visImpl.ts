import { EdgeOptions, Network, Options } from "vis-network";
import cy from "cytoscape";
import cola from "cytoscape-cola";
import store from "../../app/store"
import { setSelectedEdge, setSelectedNode } from "../../reducers/graphReducer";
import { GraphData } from "../utils";
import { setIsPhysicsEnabled } from "../../reducers/optionReducer";

cy.use(cola)

let network: Network | null = null;


export function getVisNetwork(container?: HTMLElement, data?: GraphData, options?: Options | undefined): Network | null {
  if (network) {
    if (data) network.setData(data);
    if (options) network.setOptions(options);
    return network;
  }

  if (container && data) {
    network = new Network(container, data, options);
    network.on('selectNode', (params?: any) => {
      const nodeId =
        params.nodes && params.nodes.length > 0 ? params.nodes[0] : null;
      store.dispatch(setSelectedNode(nodeId));
    })
    network.on('selectEdge', (params?: any) => {
      const edgeId =
        params.edges && params.edges.length === 1 ? params.edges[0] : null;
      const isNodeSelected = params.nodes && params.nodes.length > 0;
      if (!isNodeSelected && edgeId !== null) {
        store.dispatch(setSelectedEdge(edgeId));
      }
    })
    network.on("dragging", function (params) {
      const edges: EdgeOptions = {
        smooth: {
          enabled: false,
          roundness: 10,
          type: 'continuous',
        },
      };
      network!.setOptions({ physics: false, edges });
    });
    store.dispatch(setIsPhysicsEnabled(false))
  }

  return network;
}

