const fs = require('fs'); // pull in the file system module
// load files into memory
// This is a synchronous operation, so you'd only
// want to do it on startup.
// This not the best way to load files unless you have few files.
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// function to get the index page
const getIndex = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(index);
    response.end();
};

// function to get css page
const getCSS = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.write(css);
    response.end();
};

const extractParamsFromURL = (request) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    return url.searchParams;
};

const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);

    // Headers contain our metadata. HEAD requests only get
    // this information back, so that the user can see what
    // a GET request to a given endpoint would return. Here
    // they would see what format of data (JSON) and how big
    // that data would be ('Content-Length')
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    };

    // send response with json object
    response.writeHead(status, headers);

    // HEAD requests don't get a body back, just the metadata.
    // So if the user made one, we don't want to write the body.
    if (request.method !== 'HEAD') {
        response.write(content);
    }

    response.end();
};

const respondXML = (request, response, status, responseJSON) => {

    const xmlString = `<response><message>${responseJSON.message}</message><id>${responseJSON.id}</id></response>`;
    const headers = {
        'Content-Type': 'text/xml',
        'Content-Length': Buffer.byteLength(xmlString, 'utf8'),
    };

    response.writeHead(status, headers);

    // HEAD requests only return headers
    if (request.method !== 'HEAD') {
        response.write(xmlString);
    }

    response.end();
};

const getSuccess = (request, response) => {
    const responseJSON = {
        message: 'This is a successful response.',
        status: 200,
        id: 'success'
    };
    if (request.headers.accept == "text/xml") {
        respondXML(request, response, responseJSON.status, responseJSON);
        return;
    }
    respondJSON(request, response, responseJSON.status, responseJSON);
};

const getBadRequest = (request, response) => {
    let responseJSON;
    if (extractParamsFromURL(request).get('valid') === 'true') {
        responseJSON = {
            message: 'This is a successful response.',
            status: 200,
            id: 'success'
        };
    }
    else {
        responseJSON = {
            message: 'Missing valid query parameter set to true.',
            status: 400,
            id: 'badRequest'
        };
    }

    if (request.headers.accept == "text/xml") {
        respondXML(request, response, responseJSON.status, responseJSON);
        return;
    }

    respondJSON(request, response, responseJSON.status, responseJSON);
};

const getUnauthorized = (request, response) => {
    let responseJSON;
    if (extractParamsFromURL(request).get('loggedIn') === 'yes') {
        responseJSON = {
            message: 'This is a successful response.',
            status: 200,
            id: 'sucess'
        };
    }
    else {
        responseJSON = {
            message: 'Missing loggedIn query parameter set to yes.',
            status: 401,
            id: 'unauthorized'
        };
    }

    if (request.headers.accept == "text/xml") {
        respondXML(request, response, responseJSON.status, responseJSON);
        return;
    }

    respondJSON(request, response, responseJSON.status, responseJSON);
};

const getForbidden = (request, response) => {
    const responseJSON = {
        message: 'You do not have access to this content.',
        status: 403,
        id: 'forbidden'
    };

    if (request.headers.accept == "text/xml") {
        respondXML(request, response, responseJSON.status, responseJSON);
        return;
    }

    respondJSON(request, response, responseJSON.status, responseJSON);
};

const getInternal = (request, response) => {
    const responseJSON = {
        message: 'Internal Server Error. Something went wrong.',
        status: 500,
        id: 'internalError'
    };
    if (request.headers.accept == "text/xml") {
        respondXML(request, response, responseJSON.status, responseJSON);
        return;
    }

    respondJSON(request, response, responseJSON.status, responseJSON);
};

const getNotImplemented = (request, response) => {
    const responseJSON = {
        message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
        status: 501,
        id: 'notImplemented'
    };
    if (request.headers.accept == "text/xml") {
        respondXML(request, response, responseJSON.status, responseJSON);
        return;
    }

    respondJSON(request, response, responseJSON.status, responseJSON);
};

const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        status: 404,
        id: 'notFound',
    };

    if (request.headers.accept == "text/xml") {
        respondXML(request, response, responseJSON.status, responseJSON);
        return;
    }

    respondJSON(request, response, responseJSON.status, responseJSON);
};

module.exports = {
    getIndex,
    getCSS,
    getSuccess,
    getBadRequest,
    getUnauthorized,
    getForbidden,
    getInternal,
    getNotImplemented,
    notFound
};