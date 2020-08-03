var http = require('http');
var fetch = require('node-fetch');
var btoa = require('btoa');
var convert = require('xml-js');

var listeningPort = 8181;
var vlcEndpoint = 'http://localhost:8080';
var vlcPassword = process.argv[2]; // Third argument is the password `node vlcInterface.js {vlcPassword}`
var vlcUserName = ''; // VLC username is always blank
var contentType = 'text/json'; // Default to json

let url = vlcEndpoint + '/requests/status.xml';
console.info('Testing VLC connection', url);
fetch(url, {
    method: 'GET',
    headers: {'Authorization': 'Basic ' + btoa(vlcUserName + ':' + vlcPassword)}
})
    .then(response => {        
        console.info('VLC Response', response.url, response.status, response.statusText);

        return response.text();        
    })
    .then(body => {                    
        // Dump some data on how the output will look
        console.info('test json', getBody(contentType, body));
        console.info('test xml', body);

        // Able to start server
        startServer();
    })
    .catch(function(err) {
        console.error("error", err);
        console.error("Error connecting to VLC: exiting");
        process.exit(1);
    });

function startServer() {
    console.info('Starting Server');
    http.createServer(function (req, res) {

        var command = req.url;
        command = command.substr(1); // Strip '/' from the beginning            

        if (!req.headers['accept'].includes('json') && req.headers['accept'].includes('xml')) {
            contentType = 'text/xml';
        }
        
        let url = vlcEndpoint + '/requests/status.xml?command=' + command;

        if (command === 'playlist') {
            url = vlcEndpoint + '/requests/playlist_jstree.xml';
        }

        console.info('fetching url', url);
        fetch(url, {
            method: 'GET',
            headers: {'Authorization': 'Basic ' + btoa(vlcUserName + ':' + vlcPassword)}
        })
            .then(response => {
                console.info('VLC Response', response.url, response.status, response.statusText);
                res.writeHead(response.status, {'Content-Type': contentType, 'Access-Control-Allow-Origin': '*'});

                return response.text();
            })
            .then(body => {                    
                res.write(getBody(contentType, body));
                res.end();
            })
            .catch(function(err) {
                console.error("error", err);
                res.writeHead(500, {'Content-Type': contentType, 'Access-Control-Allow-Origin': '*'});

                var errorText = 'Error fetching ' + url + ':  Ensure VLC is running and web interface is enabled';
                var errorBody = '<?xml version="1.0" encoding="utf-8" standalone="yes" ?><root><error>' + errorText + '</error></root>';
                res.write(getBody(contentType, errorBody));
                res.end();
            });
    }).listen(listeningPort); 

    console.info('VLC Web server passthrough listenting on port ' + listeningPort);
}

/**
 * Get the body depending on content type
 * Since VLC sends us XML we are assuming the body is in xml
 * 
 * @param {string} contentType 
 * @param {string} xmlBody 
 */
function getBody(contentType, xmlBody) {    
    if (contentType.includes('json')) {
        // Convert xml to json        
        var json = convert.xml2json(xmlBody, {compact: true});
        var jsonObject = JSON.parse(json);

        // xml2json is a bit verbose
        // We are really just interested in the root
        return JSON.stringify(jsonObject.root);
    }

    return xmlBody;
}