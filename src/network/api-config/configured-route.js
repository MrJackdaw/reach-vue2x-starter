const METHODS = {
  POST: "POST",
  GET: "GET",
  DELETE: "DELETE",
  PATCH: "PATCH",
  PUT: "PUT",
};

/**
 * A function that configures a request to a single endpoint. When called, it makes a
 * request to the specified endpoint and returns a promise. If the request fails, it
 * will pass the rejected response to the supplied (user-defined) `globalErrorHandler`,
 * which can implement retry or exit logic as needed.
 *
 * @param {object} route Single endpoint request configuration
 * @param {Function} route.url Function that returns request URL with any interpolation (e.g `id` in `/user/:id`)
 * @param {string|null} route.contentType Request `content-type` header. Defaults to `application/json;charset=UTF-8;`
 * @param {string|null} route.acceptHeaders Request `accept` header. Defaults to `* /*`
 * @param {boolean|null} route.authenticate When true, `APIConfig` will attempt to attach a `Authorization` header, and
 * look in the supplied (at runtime) params for a `token`. An error will be thrown if one is not found.
 * @param {object|null} route.headers Optional request header overrides. Will be used to generate final request `headers`.
 * @param {string|null} route.method HTTP verb (`get`, `post`, `put`, ...) Use the `METHODS` export to ensure `APIConfig`
 * recognizes the method.
 * @param {string|null} route.mode CORS mode. Defaults to `cors`
 * @param {string|null} route.redirect Redirect policy (one of `manual` or `follow`)
 * @param {(error: Object, responseCode: number, request:Request) => Promise<any>|null} globalErrorHandler Optional global
 * error handler. Receives this from `APIConfig` instance.
 *
 * @returns {(params: object|undefined) => Promise<any>} Function that returns a promise.
 */
export default function configureRoute(
  route /* : RouteDefinition */,
  globalErrorHandler = (error) => error
) {
  /**
   * Makes an http/s request `with` the supplied `params`. Enables the api
   * `configInstance.route(routeParams).with(requestParams)`
   * @param {object} params The request body contents. Anything that would be
   * passed to a `fetch` call (except the `url` for the request) goes here.
   * @param {string|undefined} params.token An optional bearer token for authenticating
   * with a remote server. Required if the `ConfiguredRoute` instance contains a
   * `authenticate: true` key/value.
   * @param {object|undefined} params.body (optional) request `body` [required for `post`
   * requests]
   */
  return function configuredRequest(params = {}) {
    // Get an object ready to make a request
    const method = route.method || METHODS.GET;
    let url = route.url(params);

    // Configure request
    let reqConfig = {
      method,
      // Allow for setting cookies from origin
      credentials: route.credentials || "omit", // omit, include
      // Prevent automatic following of redirect responses (303, 30x response code)
      redirect: route.redirect || "manual",
      // CORS request policy
      mode: route.mode || "cors",
    };

    if (route.contentType !== "multipart/form-data") {
      reqConfig.headers = configureReqHeaders(params, url);
    }

    // Configure request body
    if (method !== METHODS.GET) {
      reqConfig.body = configureRequestBody(params, reqConfig.headers);
    }

    let fetchRequest = new Request(url, reqConfig);
    let responseCode = -1;
    const successResponse = { message: "success" };

    // Return fetch Promise
    return fetch(fetchRequest)
      .then((data) => {
        responseCode = data.status;
        // If it has json, return json
        if (data.json) return data.json() || successResponse;
        // Safari apparently handles API "redirect" (303, 30x) responses very, very poorly;
        // We intercept the response and return something that doesn't kill the app.
        const isRedirectResponse = data.type === "opaqueredirect";
        // "DELETE" request doesn't return a body, so return "success" for that too
        const isDeleteResponse =
          method === METHODS.DELETE && responseCode < 400;
        if (isRedirectResponse || isDeleteResponse) return successResponse;
        // At this point, the response *better* have a body. Or else.

        return data || successResponse;
      })
      .then(onResponseFallback)
      .catch(onResponseFallback);

    function onResponseFallback(json) {
      // Check for API failures and reject response if response status error
      if (json.error) {
        return globalErrorHandler(
          Promise.reject(json),
          responseCode,
          new Request(url, reqConfig)
        );
      }

      // Return the configured fetch request for external retry attempts
      if (responseCode > 400 || responseCode === -1) {
        return globalErrorHandler(
          Promise.reject(json),
          responseCode,
          new Request(url, reqConfig)
        );
      }

      // Else return the response since it was likely successful
      return Promise.resolve(json || successResponse);
    }
  };

  /**
   * Configure request headers. If `route.authenticate` is true, optionally inject
   * an `Authorization: Bearer ...` header using an expected `token` key in `params`
   * @param {object} params request params
   * @param {string} url request url
   * @returns {object} header
   */
  function configureReqHeaders(params, url) {
    // overrides
    const ov = {
      ...(route.headers || {}),
      ...(route.acceptHeaders || {}),
      ...(params.headers || {}),
    };
    const contentType =
      route.contentType || ov.contentType || "application/json;charset=utf-8";

    const headers = new Headers();
    headers.append("Content-Type", contentType);

    // Inject token
    if (route.authenticate) {
      if (params.token) {
        headers.append("Authorization", `Bearer ${params.token}`);
      } else {
        throw new Error(`Did not pass token to authenticate at url ${url}`);
      }
    }

    return headers;
  }

  /**
   * Configure request `body`.
   * @param {object} params request params
   * @param {Headers} rHeaders request headers
   * @returns {object} header
   */
  function configureRequestBody(params, rHeaders) {
    if (!rHeaders) {
      throw new Error("Invalid request headers");
    }

    switch (rHeaders.get("Content-Type")) {
      case "application/x-www-form-urlencoded":
        return generateURLEncodedBody(params.body || params);
      default:
        return JSON.stringify(params.body || params);
    }
  }

  function generateURLEncodedBody(params) {
    const body = new URLSearchParams();

    if (typeof params === "object") {
      Object.keys(params).forEach((key) => body.append(key, params[key]));
    }

    return body;
  }
}
