import cy, { NodeDefinition, Singular } from "cytoscape";
import edgehandles from 'cytoscape-edgehandles';
import cxtmenu from 'cytoscape-cxtmenu';
import { EdgeData, getColor, GraphData, GraphOptions, GraphTypes, NodeData, traverseQuery } from "../utils";
import cola, { ColaLayoutOptions } from "cytoscape-cola";
import store, { AppDispatch } from "../../app/store";
import { removeNodes, setSelectedEdge, setSelectedNode, updateColorMap } from "../../reducers/graphReducer";
import { Workspace } from "../../components/Details/SettingsComponent";
import { setIsPhysicsEnabled } from "../../reducers/optionReducer";
import getIcon from "../icons";
import { openEdgeDialog, openNodeDialog } from "../../reducers/dialogReducer";
import dagre from 'cytoscape-dagre';
import { deleteNode } from "../actionHelper";


export interface connectionConfig {
  host: string;
  port: string;
  nodeLimit: number;
  dispatch: AppDispatch;
}

let axiosConfig: connectionConfig | null = null;


export function configCytoGraphConnection(config: connectionConfig) {
  axiosConfig = config;
}

let shiftKeyDown = false;
export const layoutOptions = ['force-directed', 'hierarchical', 'circle', 'concentric', 'grid', 'breadthfirst']
let graph: cy.Core | null = null;
let layout: cy.Layouts | null = null;
let layoutName: string = 'force-directed'
const opts: ColaLayoutOptions = {
  name: 'cola',
  infinite: true,
  animate: true,
  centerGraph: false,
  fit: false,
}

cy.use(cola)
cy.use(edgehandles)
cy.use(dagre)
cy.use(cxtmenu)

function toCyNode(n: NodeData): cy.NodeDefinition {
  let nodeColorMap = store.getState().graph.nodeColorMap
  let color = n.type !== undefined ? nodeColorMap[n.type] : '#000000';
  return {
    group: "nodes",
    data: { ...n, id: n.id!.toString() },
    style: {
      'width': 41,
      'height': 41,
      'border-color': color,
      'border-width': '0px',
      'background-color': color,
      'background-opacity': 0,
      'background-image': getIcon(n.type),
      'background-fit': 'contain',
      'text-max-width' : '100px',
      'text-wrap': 'wrap',
      'text-valign': 'bottom'
    },
    position: { x: n.x ? n.x : Math.random(), y: n.y ? n.y : Math.random() },
  };
}

function toCyEdge(e: EdgeData): cy.EdgeDefinition {
  return {
    group: "edges",
    data: { ...e, id: e.id!.toString(), source: e.from!.toString(), target: e.to!.toString() }
  }
}

export function getCytoGraph(container?: HTMLElement, data?: GraphData, options?: GraphOptions | undefined, workspace?: Workspace | null): GraphTypes {
  if (!graph) {
    graph = cy({
      container: container,
      elements: {
        nodes: [],
        edges: []
      },
      minZoom: .1,
      maxZoom: 10,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(id)'
          }
        },
        {
          selector: 'node[label]',
          style: {
            label: 'data(label)'
          }
        },
        {
          selector: 'node.semitransp',
          style: { 'opacity': 0.5 }
        },
        {
          selector: 'edge.semitransp',
          style: { 'opacity': 0.3 }
        },
        {
          selector: 'edge',
          style: {
            width: 1,
            "curve-style": "bezier",
            "target-arrow-shape": 'triangle',
            "label": "data(label)"
          }
        }
      ]
    }
    );
    layout = graph.layout(opts)

    const eh = (graph as any).edgehandles()
    const menu = (graph as any).cxtmenu({
      commands: [ // an array of commands to list in the menu or a function that returns the array
        { // example command
          content: 'Delete', // html/text content to be displayed in the menu
          select: function (ele: Singular) { // a function to execute when the command is selected
            deleteNode(ele.id(), axiosConfig);
            store.dispatch(removeNodes([ele.id()]))
          },
          enabled: true // whether the command is selectable
        },
        { // example command
          content: 'Hide', // html/text content to be displayed in the menu
          select: function (ele: Singular) { // a function to execute when the command is selected
            store.dispatch(removeNodes([ele.id()]))
          },
          enabled: true // whether the command is selectable
        },
        { // example command
          content: 'Incoming Edges', // html/text content to be displayed in the menu
          select: function (ele: Singular) { // a function to execute when the command is selected
            traverseQuery(ele.id(), "in")
          },
          enabled: true // whether the command is selectable
        },
        { // example command
          content: 'Outgoing Edges', // html/text content to be displayed in the menu
          select: function (ele: Singular) { // a function to execute when the command is selected
            traverseQuery(ele.id(), "out")
          },
          enabled: true // whether the command is selectable
        },
    ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
    })

    layout.start()
    graph.on('tap', 'node', (event) => {
      store.dispatch(setSelectedNode(event.target.id()));
      const sel = event.target;
      graph!.elements().removeClass("semitransp");
      graph!.elements().difference(sel.outgoers().union(sel.incomers())).not(sel).addClass("semitransp");
    })
    graph.on('tap', 'edge', (event) => {
      store.dispatch(setSelectedEdge(event.target.id()));
      const sel = event.target;
      graph!.elements().removeClass("semitransp");
      graph!.elements().difference(sel.connectedNodes()).not(sel).addClass("semitransp");
    })
    graph.on('drag', 'node', e => {
      store.dispatch(setIsPhysicsEnabled(false))
    })
    graph.on('tap', e => {
      if (e.target == graph && e.originalEvent.shiftKey) {
        store.dispatch(openNodeDialog({ x: e.position.x, y: e.position.y }));
      }
      else if (e.target == graph) {

        graph!.elements().removeClass("semitransp");
      }
    })

    graph.on('ehcomplete', (_event, sourceNode, targetNode, addedEdge) => {
      addedEdge.remove();
      const edgeFrom = sourceNode.id();
      const edgeTo = targetNode.id();
      store.dispatch(openEdgeDialog({ edgeFrom: edgeFrom, edgeTo: edgeTo }));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Shift' && !shiftKeyDown) {
        shiftKeyDown = true;
        eh.enableDrawMode();
      }
    }
    );
    document.addEventListener('keyup', function (e) {
      if (e.key === 'Shift' && shiftKeyDown) {
        shiftKeyDown = false;
        eh.disableDrawMode();
      }
    });


    return graph;
  }
  if (container && data) {

    let nodes: NodeDefinition[] = data.nodes?.map(x => {
      let nodeColorMap = Object.assign({}, store.getState().graph.nodeColorMap)
      if (x.type !== undefined && !(x.type in nodeColorMap)) {
        nodeColorMap[`${x.type}`] = getColor()
        store.dispatch(updateColorMap(nodeColorMap))
      }
      return toCyNode(x)
    }) || []
    let edges = data.edges?.map(x => toCyEdge(x)) || []
    for (let n of nodes) {
      if (!graph.nodes().map(x => x.id()).includes(n.data.id!)) {
        graph.add(n)
      } else {
        graph.getElementById(n.data.id!).data({ ...n.data, ...{ x: undefined, y: undefined } })
      }
      if (workspace) {
        setNodePositions(workspace as Workspace | undefined);
      }
    }
    for (let n of graph.nodes()) {
      if (!nodes.map(x => x.data.id).includes(n.id())) {
        graph.remove(n)
      }
    }
    for (let e of edges) {
      if (!graph.edges().map(x => x.id()).includes(e.data.id!) && graph.$id(e.data.target).size() > 0) {
        const sourceNodeID = e.data.source
        if (!graph.nodes().map(x => x.id()).includes(sourceNodeID)) {
          continue;
        }
        graph.add(e)
      }
    }
    for (let e of graph.edges().map(x => x.id())) {
      if (!data.edges.map(x => x.id.toString()).includes(e)) {
        graph.remove(e)
      }
    }
  }
  if (options) {
    if (options.isPhysicsEnabled && !workspace) applyLayout(layoutName)
    else layout?.stop();
  }
  return graph;
}

export function applyLayout(name: string) {
  layoutName = name
  if (!graph || !layout) return
  layout.stop()
  switch (name) {
    case 'force-directed': {
      layout = graph.layout({ ...opts, ...{ infinite: store.getState().options.graphOptions.isPhysicsEnabled } })
      graph.center()
      store.dispatch(setIsPhysicsEnabled(true))
      break
    }
    case 'circle': {
      layout = graph.layout({ name: "circle", fit: true })
      store.dispatch(setIsPhysicsEnabled(false))
      break
    }
    case 'hierarchical': {
      layout = graph.layout({ name: "dagre" })
      store.dispatch(setIsPhysicsEnabled(false))
      break
    }
    case 'concentric': {
      layout = graph.layout({ name: "concentric" })
      store.dispatch(setIsPhysicsEnabled(false))
      break
    }
    case 'breadthfirst': {
      layout = graph.layout({ name: "breadthfirst", fit: true })
      store.dispatch(setIsPhysicsEnabled(false))
      break
    }
    case 'grid': {
      layout = graph.layout({ name: 'grid' })
      store.dispatch(setIsPhysicsEnabled(false))
      break
    }
    default: {
      console.warn(`Unknown layout ${name} applied`)
    }
  }
  layout.start()

}

export function getNodePositions() {
  layout?.stop()
  store.dispatch(setIsPhysicsEnabled(false))
  let positions: Record<string, { node_id: string, name: string, x: number, y: number}> = {};
  let nodemaps:  Record<string, { name: string, layout_id:string }> = {};

  graph?.nodes().forEach(node => {
    const node_name = node.data('properties').name;
    const node_id = node.data('id');
    const node_position = node.position();
    positions[node.data('properties').layout_id] = {node_id: node_id, name: node_name, x: node_position.x, y: node_position.y}
  })
  return {
    layout: positions,
    nodemap: nodemaps,
    //layout: layouts,
    zoom: graph?.zoom(),
    view: Object.assign({}, graph?.pan())
  };
}

export function setNodePositions(workspace: Workspace | undefined) {
  layout?.stop()
  store.dispatch(setIsPhysicsEnabled(false))
  graph?.nodes().forEach(node => {
    let newPosition = workspace?.layout[node.data('properties').layout_id]
    if (newPosition !== undefined) node.position(newPosition);
  })
  graph?.zoom(workspace?.zoom)
  graph?.pan(workspace?.view)
}

export function zoomIn() {
  const currentZoom = graph?.zoom();
  const newZoom = currentZoom! * 1.1;
  graph?.zoom(newZoom);
}

export function zoomOut() {
  const currentZoom = graph?.zoom();
  const newZoom = currentZoom! * 0.9;
  graph?.zoom(newZoom);
}

export function fitTo() {
  graph?.fit()
}

export function exportIMG() {
  const imageUrl = graph?.png();
  const link = document.createElement('a');
  link.href = imageUrl!;
  link.download = "graph.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
