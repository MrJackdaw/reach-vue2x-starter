import configureRoute from "./configured-route";

const METHODS = {
  POST: "POST",
  GET: "GET",
  DELETE: "DELETE",
  PATCH: "PATCH",
  PUT: "PUT",
};

/**
 * - Creates and configures a `Fetch` request using an APIRoute object
 * - Triggers the request and returns the JSON from the server
 * @param {object} routes A key-value store of server endpoints. Each key in
 * `routes` will become a method on the new `APIConfig` instance. The value of each
 * key will be a `RouteDefinition` with one or more of the following properties:
 *  - `acceptHeaders`: string | undefined;
 *  - `contentType`: string | undefined;
 *  - `url`: Function;
 *  - `authenticate`: boolean | undefined;
 *  - `method`: string | undefined
 * @param {object} globalErrorHandler An error handler to run when any network request
 * fails. The handler will receive the (`APIConfig` instance-) rejected promise as its
 * only argument. It should also return a promise (resolve/rejected per implementation needs).
 */
export default function APIConfig(
  routes /* : { [x: string]: RouteDefinition } */,
  globalErrorHandler = (error) => error
) {
  if (!routes) {
    throw new Error("Missing routes");
  }

  if (Object.keys(routes).length === 0) {
    throw new Error("APIConfig needs at least one valid route definition");
  }

  this.routes = routes;
  // Append route keys to object so accessibe as APIConfig.route(params).then(...);
  Object.keys(routes).forEach((routeName) => {
    const route = this.routes[routeName];
    const { group = null } = route;
    // Group route if key present (e.g. [getById, users] -> config.users.getByid vs
    // [getById] -> config.getById )
    if (group) {
      if (!this[group]) this[group] = {};

      this[group][routeName] = configureRoute(route, globalErrorHandler);
    } else {
      this[routeName] = configureRoute(route, globalErrorHandler);
    }
  });

  return this;
}

APIConfig.METHODS = METHODS;
