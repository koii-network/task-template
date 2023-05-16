# Data Gatherer Template
The Data Gatherer is a standardized subset of [Koii Tasks](https://docs.koii.network/develop/microservices-and-tasks/what-are-tasks/), which allow a developer to hire thousands of automated worker nodes from the [Koii Network](docs.koii.network).

In general, a data gatherer is any task which is designed to crowdsource information from a pool of nodes. Because many Data Gatherer tasks follow a standardized incentive and fraud-detection mechanism, it is possible to abstract much of the complexity of task design, and the developer need only provide an Adapter class (see `adapters/` for some examples).

For more information on how the broader Task Flow works, check out [Koii's runtime environment docs](https://docs.koii.network/develop/microservices-and-tasks/what-are-tasks/gradual-consensus#why-is-it-gradual).

# Requirements

- [Node >=16.0.0](https://nodejs.org) 
- Yarn is preferred over NPM
- [Docker compose](https://docs.docker.com/compose/install/docker)

# What's in the template?
This repo provides a number of example Data Gatherers, which together give samples of how the standard can be used to navigate OAUTH, large Web3 Node Networks, and a variety of other common applications. This is an ongoing project, so feel free to contribute templates of your own.

## Designing Adapters
The Adapter class, defined in `model/adapter.js` is the core of the project, and can be extended to build your very own Data Gatherer for your particular application. To extend a Data Gatherer with an adapter, you'll need to define six key functions:

1. NavigateSession()

2. ParseOne()

3. ParseMany()

4. NewSearch()

5. CheckSession()

6. ListFromSearch()