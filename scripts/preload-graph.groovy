g = traversal().withRemote('conf/remote-graph.properties')
g.io('/app/graph.graphml').with(IO.reader, IO.graphml).read().iterate()