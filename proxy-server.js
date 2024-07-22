const express = require('express');
const bodyParser = require('body-parser');
const gremlin = require('gremlin');
const cors = require('cors');
const app = express();
const port = 3001;
const fs = require('fs');
const path = require('path');

app.use(cors({
  credentials: true,
}));

// parse application/json
app.use(bodyParser.json());

const workspacesFilePath = path.join(__dirname, 'workspaces.json');

const readWorkspaces = () => {
  if (!fs.existsSync(workspacesFilePath)) {
    fs.writeFileSync(workspacesFilePath, JSON.stringify({ workspaces: [] }));
  }
  const workspacesData = fs.readFileSync(workspacesFilePath);
  return JSON.parse(workspacesData).workspaces;
};

const writeWorkspaces = (workspaces) => {
  fs.writeFileSync(workspacesFilePath, JSON.stringify({ workspaces }, null, 2));
};

app.post('/workspaces', (req, res) => {
  const workspaces = readWorkspaces();
  const newWorkspace = req.body;
  workspaces.push(newWorkspace);
  writeWorkspaces(workspaces);
  res.status(201).send(newWorkspace);
});

app.get('/workspaces', (_req, res) => {
  const workspaces = readWorkspaces();
  res.send(workspaces);
});

app.put('/workspaces/:name', (req, res) => {
  const workspaces = readWorkspaces();
  const updatedWorkspace = req.body;
  const workspaceIndex = workspaces.findIndex(w => w.name === req.params.name);
  if (workspaceIndex !== -1) {
    workspaces[workspaceIndex] = updatedWorkspace;
    writeWorkspaces(workspaces);
    res.send(updatedWorkspace);
  } else {
    res.status(404).send({ message: 'Workspace not found' });
  }
});

app.delete('/workspaces/:name', (req, res) => {
  let workspaces = readWorkspaces();
  workspaces = workspaces.filter(w => w.name !== req.params.name);
  writeWorkspaces(workspaces);
  res.status(204).send();
});

function mapToObj(inputMap) {
  let obj = {};
  inputMap.forEach((value, key) => {
    obj[key] = value
  });

  return obj;
}

function edgesToJson(edgeList) {
  return edgeList.map(
    edge => ({
      id: typeof edge.get('id') !== "string" ? JSON.stringify(edge.get('id')) : edge.get('id'),
      from: edge.get('from'),
      to: edge.get('to'),
      label: edge.get('label'),
      properties: mapToObj(edge.get('properties')),
    })
  );
}

function nodesToJson(nodeList) {
  return nodeList.map(
    node => ({
      id: node.get('id'),
      label: node.get('label'),
      properties: mapToObj(node.get('properties')),
      edges: edgesToJson(node.get('edges'))
    })
  );
}

function makeQuery(query, nodeLimit) {
  const nodeLimitQuery = !isNaN(nodeLimit) && Number(nodeLimit) > 0 ? `.limit(${nodeLimit})` : '';
  return `${query}${nodeLimitQuery}.dedup().as('node').project('id', 'label', 'properties', 'edges').by(__.id()).by(__.label()).by(__.valueMap().by(__.unfold())).by(__.outE().project('id', 'from', 'to', 'label', 'properties').by(__.id()).by(__.select('node').id()).by(__.inV().id()).by(__.label()).by(__.valueMap().by(__.unfold())).fold())`;

}

app.post('/query', (req, res, next) => {
  const gremlinHost = req.body.host;
  const gremlinPort = req.body.port;
  const nodeLimit = req.body.nodeLimit;
  const query = req.body.query;
  const isRawQuery = req.body.isRawQuery;

  const client = new gremlin.driver.Client(`ws://${gremlinHost}:${gremlinPort}/gremlin`, {
    traversalSource: 'g',
    mimeType: 'application/json'
  });
  client.submit(makeQuery(query, nodeLimit), {})
    .then((result) => {
      res.send(nodesToJson(result._items));
    })
    .catch((err) => {
      next(err);
    });

});

app.post('/query-raw', (req, res, next) => {
  const gremlinHost = req.body.host;
  const gremlinPort = req.body.port;
  const query = req.body.query;

  const client = new gremlin.driver.Client(`ws://${gremlinHost}:${gremlinPort}/gremlin`, {
    traversalSource: 'g',
    mimeType: 'application/json'
  });
  client.submit(query, {})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      next(err);
    });
});

app.listen(port, () => console.log(`Simple gremlin-proxy server listening on port ${port}!`));