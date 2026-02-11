const http = require('http'); // http module
const responseHandler = require('./responses.js');
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Here we are routing each request url to a different endpoint
// function. For data endpoints, they will internally support
// head requests. Note that we could alternatively route requests
// based on if they have a GET or HEAD method. However, for head
// requests, we generally want to calculate our usual GET response
// for that request, but then just send back the metadata. So
// we will just call the same endpoints and conditionally send
// back the response body.
const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/success': responseHandler.getSuccess,
  '/badRequest': responseHandler.getBadRequest,
  '/unauthorized': responseHandler.getUnauthorized,
  '/forbidden' : responseHandler.getForbidden,
  '/internal' : responseHandler.getInternal,
  '/notImplemented' : responseHandler.getNotImplemented,
  notFound: responseHandler.notFound
};

// function to handle requests
const onRequest = (request, response) => {
  // first we have to parse information from the url
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);


  // Then we route based on the path that the user went to
  if (urlStruct[parsedUrl.pathname]) {
    return urlStruct[parsedUrl.pathname](request, response);
  }
  
  return urlStruct.notFound(request, response);
};

// start server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});