using Workerd = import "/workerd/workerd.capnp";

const workerConfig :Workerd.Config = (

  # Every workerd instance consists of a set of named services. A worker, for instance,
  # is a type of service. Other types of services can include external servers, the
  # ability to talk to a network, or accessing a disk directory. Here we create a single
  # worker service. The configuration details for the worker are defined below.
  services = [ (name = "main", worker = .mainWorker), (name = "internet", external = .externalNetwork) ],

  sockets = [ ( name = "http", address = "unix:./var/worker.sock", http = (), service = "main" ) ]
);

const mainWorker :Workerd.Worker = (
  modules = [
    (name = "worker.js", esModule = embed "worker.js"),
    (name = "index.js", esModule = embed "index.js")
  ],
  compatibilityDate = "2021-11-10",
  compatibilityFlags = ["streams_enable_constructors", "transformstream_enable_standard_constructor"]
);

const externalNetwork :Workerd.ExternalServer = (
  address = "unix:./var/api.sock",
  http = ()
);
