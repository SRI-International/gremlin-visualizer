import { Data, Network, Options } from "vis-network";

let network: Network | null = null;

type CallbackOptions = {
  selectNodeCallback?: (params?: any) => void, selectEdgeCallback?: (params?: any) => void;
};

export function getNetwork(container?: HTMLElement, data?: Data, options?: Options | undefined, callbacks?: CallbackOptions): Network | null {
  if (network) {
    if (data) network.setData(data);
    if (options) network.setOptions(options);
    return network;
  }

  if (container && data) {
    network = new Network(container, data, options);
    if (callbacks) {
      if (callbacks.selectNodeCallback) network.on('selectNode', callbacks.selectNodeCallback);
      if (callbacks.selectEdgeCallback) network.on('selectEdge', callbacks.selectEdgeCallback);
    }
  }

  return network;
}