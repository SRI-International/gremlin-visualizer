import reducer, { refreshNodeLabels, GraphState} from '../../src/reducers/graphReducer';

test('test refreshNodeLabel changes label in state to age', () => {
    const previousState = {nodes: [{
        "id": 0,
        "label": "Bob",
        "properties": {
            "name": "Bob",
            "age": "21"
        },
        "edges": [],
        "type": "person"
    }],
        edges: [],
        selectedNode: undefined,
        selectedEdge: undefined,
        nodeColorMap: {},
        workspaces: []
    } as any

    const action = refreshNodeLabels([
        {
          type: "person",
          field: "age"
        }
      ]);
    
    const newState = reducer(previousState, action);
    expect(newState.nodes[0]).toEqual(expect.objectContaining({
        label: "21"
      }));


  })