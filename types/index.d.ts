
declare module "*.jpg";
declare module "*.png";
declare module "cytoscape-cola" {
  import cytoscape from "cytoscape";

  export interface ColaLayoutOptions extends BaseLayoutOptions {
    name: "cola",
    infinite?: boolean,
    animate?: boolean, // whether to show the layout as it's running
    refresh?: number, // number of ticks per frame; higher is faster but more jerky
    maxSimulationTime?: number, // max length in ms to run the layout
    ungrabifyWhileSimulating?: boolean, // so you can't drag nodes during layout
    fit?: boolean, // on every layout reposition of nodes, fit the viewport
    padding?: number, // padding around the simulation
    boundingBox?: any, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    nodeDimensionsIncludeLabels?: boolean, // whether labels should be included in determining the space used by a node

    // layout event callbacks
    ready?: () => void, // on layoutready
    stop?: () => void, // on layoutstop

    // positioning options
    randomize?: boolean, // use random node positions at beginning of layout
    avoidOverlap?: boolean, // if true, prevents overlap of node bounding boxes
    handleDisconnected?: boolean, // if true, avoids disconnected components from overlapping
    convergenceThreshold?: number, // when the alpha value (system energy) falls below this value, the layout stops
    nodeSpacing?: (node: any) => number, // extra spacing around nodes
    flow?: any, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
    alignment?: any, // relative alignment constraints on nodes, e.g. {vertical: [[{node: node1, offset: 0}, {node: node2, offset: 5}]], horizontal: [[{node: node3}, {node: node4}], [{node: node5}, {node: node6}]]}
    gapInequalities?: any, // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]
    centerGraph?: boolean, // adjusts the node positions initially to center the graph (pass false if you want to start the layout from the current position)

    // different methods of specifying edge length
    // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
    edgeLength?: number, // sets edge length directly in simulation
    edgeSymDiffLength?: number, // symmetric diff edge length in simulation
    edgeJaccardLength?: number, // jaccard edge length in simulation

    // iterations of cola algorithm; uses default values on undefined
    unconstrIter?: any, // unconstrained initial layout iterations
    userConstIter?: any, // initial layout iterations with user-specified constraints
    allConstIter?: any, // initial layout iterations with all constraints including non-overlap

  }

  const cola: cytoscape.Ext;
  export = cola
}
