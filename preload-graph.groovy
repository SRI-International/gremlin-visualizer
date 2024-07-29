g = traversal().withRemote(DriverRemoteConnection.using('gremlin-server', 8182))
g.io('/app/graph.graphml').with(IO.reader, IO.graphml).read().iterate()
