# 接口选型

为了帮助`API`开发人员了解要使用哪种`API`设计风格以及在何种情况下使用，我们将在实际中提供`REST`，`GraphQL`，`gRPC`和`Webhooks`的真实示例，并分析它们的优缺点，以突出说明使每个选项成为理想选择的原因。

[When to Use What: REST, GraphQL, Webhooks, & gRPC](https://nordicapis.com/when-to-use-what-rest-graphql-webhooks-grpc/)

## REST

`REST`可能是本篇文章中最常见的项目，因为它已在`Web API`中变得非常普遍。`REST`是一个概念，最早是由`Roy Fielding`于 2000 年在其博士论文中定义的。他使用无状态的设计思想和标准化的方法，为基于一系列`Web`服务约束的体系结构体系奠定了基础。蜜蜂。

`REST`本质上是无状态的，其构建方式使得符合`REST`的任何`Web`服务都可以以无状态方式与文本资源表示进行交互。这些操作通常使用`GET`，`POST`，`PUT`和其他`HTTP`方法来定义，这是标准化交互的问题。

`REST`的主要特性之一是它具有超媒体丰富的事实。实际上，超媒体和`REST`非常紧密相关，以至于`Roy Fielding`表示，如果`API` 不支持超媒体，那么它们在技术上就不是`RESTful`的。最终，这意味着在`REST API`中，客户端和服务器之间是松散耦合的，这为客户端和服务器授予了资源操纵方面的极大自由度。因此，可以启用和支持快速迭代，服务器演进，资源供应弹性以及其他此类元素。

`REST`支持的内容远远超过我们在这里要介绍的内容，但是`REST` 具有分层的体系结构，高效的缓存和高可伸缩性，是针对众多问题和约束的高度可发现且高度可变形的解决方案。标准化`HTTP`语料的价值很难低估，它可以为最终用户提供上下文，并且可以标准化大多数交互。综上所述，`REST`是现代微服务 `API` 行业非常有效，有效且强大的解决方案。

## gRPC

`gRPC` 是对 `RPC` 的一个新尝试，最大特点是使用 `protobufs` 语言格式化数据。
`RPC` 主要用来做服务器之间的方法调用，影响其性能最重要因素就是 序列化/反序列化 `效率。RPC` 的目的是打造一个高效率、低消耗的服务调用方式，因此比较适合 `IOT` 等对资源、带宽、性能敏感的场景。而 `gRPC` 利用 `protobufs` 进一步提高了序列化速度，降低了数据包大小。

## GraphQL

`GraphQL` 解决客户-服务器关系的方法在这些选项中是独一无二的，并且在某种程度上是传统关系的逆转。借助 `GraphQL`，客户端可以确定所需的数据，所需的数据以及所需的格式。这是从服务器到客户端的经典命令的逆转，并允许许多扩展功能。`GraphQL` 与 `REST` 和 `RPC` 截然不同，`REST` 是一种架构，比其他任何事物都重要，而 `RPC` 是由客户端和服务器协商合同，但很大程度上由资源本身定义

`GraphQL` 不是 `REST` 的替代品，而是另一种交互形式：前端决定后端的返回结果。
`GraphQL` 带来的最大好处是精简请求响应内容，不会出现冗余字段，前端可以决定后端返回什么数据。但要注意的是，前端的决定权取决于后端支持什么数据，因此 `GraphQL` 更像是精简了返回值的 `REST`，而后端接口也可以一次性定义完所有功能，而不需要逐个开发。
再次强调，相比 `REST` 和 `gRPC`，`GraphQL` 是由前端决定返回结果的反模式。

[GraphQL](https://juejin.im/post/5ef010d2e51d4573fc2220fd)

## Webhooks

如果说 `GraphQL` 颠覆了前后端交互模式，那 `Webhooks` 可以说是彻头彻尾的反模式了，因为其定义就是，前端不主动发送请求，完全由后端推送。

它最适合解决轮询问题。或者说轮询就是一种妥协的行为，当后端不支持 `Webhooks` 模式时。

## 对比

- REST：一种依赖超媒体的无状态数据传输体系结构。`REST` 可以将可能出于各种目的以各种格式请求的各种资源捆绑在一起。REST 从根本上与无状态资源管理有关，因此，在这种情况下最好使用它。需要快速迭代和标准化 `HTTP` 语言的系统将发现 `REST` 最适合其用途。
- gRPC：一个灵活而轻巧的系统，用于请求数据。另一方面，当系统需要一定数量的数据或例行处理，并且请求者的功耗低或资源浪费时，最好使用 `gRPC`。在物联网就是一个很好的例子。
- GraphQL：一种方法，其中用户定义期望的数据和该数据的格式。请求者需要针对特定用途的特定格式的数据。在这些情况下，这些数据格式及其之间的关系至关重要，没有其他解决方案可以提供相同级别的互连数据。
- Webhooks：数据更新将自动提供，而不是请求。最后，当相关 API 主要更新客户端时，最好使用 `Webhooks`。尽管此类 `API` 也可以具有其他功能，甚至是 `RESTful` 的，但 `Webhook` 微服务的主要用途应该是在创建新的更新资源时更新客户端并提供更新的预配置数据。