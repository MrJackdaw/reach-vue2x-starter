/** HTTP Request Verbs */
import APIConfig from "./configured-api";

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
export default APIConfig;
