import { Data, Network, Options } from "vis-network";

let network: Network | null = null;

type CallbackOptions = {
  selectNodeCallback?: (params?: any) => void;
  selectEdgeCallback?: (params?: any) => void;
  dragEndCallback?: (params?: any) => void;
};

interface LayoutData {
  nodes: { [key: string]: { x: number, y: number } }
}

const defaultOptions = {
  physics: {
    forceAtlas2Based: {
      gravitationalConstant: -26,
      centralGravity: 0.005,
      springLength: 230,
      springConstant: 0.18,
      avoidOverlap: 1.5,
    },
    maxVelocity: 40,
    solver: 'forceAtlas2Based',
    timestep: 0.35,
    stabilization: false,
  },
  layout: {
    randomSeed: '0.1030370700134704:1683151406408',
    improvedLayout: false,
  },
  interaction: {
    hideEdgesOnZoom: true,
  },
  nodes: {
    shape: 'dot',
    size: 20,
    borderWidth: 2,
    font: {
      size: 11,
    },
  },
  edges: {
    width: 2,
    font: {
      size: 11,
    },
    smooth: {
      type: 'dynamic',
    },
  },
} as Options

export function getNetwork(container?: HTMLElement, data?: Data, layout?: string, callbacks?: CallbackOptions): Network | null {
  const networkOpts = {...defaultOptions};
  console.log(layout);
  if (layout) {
    networkOpts.physics = false;
  }

  if (network) {
    return network;
  }

  if (container && data && data.nodes && data.nodes.length > 0) {
    network = new Network(container, data, networkOpts);
    if (callbacks) {
      if (callbacks.selectNodeCallback) network.on('selectNode', callbacks.selectNodeCallback);
      if (callbacks.selectEdgeCallback) network.on('selectEdge', callbacks.selectEdgeCallback);
      if (callbacks.dragEndCallback) network.on('dragEnd', callbacks.dragEndCallback);
    }

    network.moveTo({
      scale: 0.2
    });
    setTimeout(() => {
      network?.setOptions({ physics: false });
    }, 10000);
  }

  return network;
}

export function updateNetwork(data?: Data, layout?: string) {
  const networkOpts = {...defaultOptions};
  console.log(layout);
  if (layout) {
    networkOpts.physics = false;
  }
  if (network) {
    if (data) network.setData(data);
    network.setOptions(networkOpts);

    network.moveTo({
      scale: 0.2
    });

    setTimeout(() => {
      network?.setOptions({ physics: false });
    }, 3000);
  }
}