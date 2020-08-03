var http = require('http');
var fetch = require('node-fetch');
var btoa = require('btoa');

var listeningPort = 8181;
var vlcEndpoint = 'http://localhost:8080';
var vlcPassword = process.argv[2]; // Third argument is the password `node vlcInterface.js {vlcPassword}`
var vlcUserName = ''; // VLC username is always blank

let url = vlcEndpoint + '/requests/status.xml';
console.info('Testing VLC connection', url);
fetch(url, {
    method: 'GET',
    headers: {'Authorization': 'Basic ' + btoa(vlcUserName + ':' + vlcPassword)}
})
    .then(response => {        
        console.info('VLC Response', response.url, response.status, response.statusText);
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
    
        let url = vlcEndpoint + '/requests/status.xml?command=' + command;
        console.info('fetching url', url);
        fetch(url, {
            method: 'GET',
            headers: {'Authorization': 'Basic ' + btoa(vlcUserName + ':' + vlcPassword)}
        })
            .then(response => {        
                console.info('VLC Response', response.url, response.status, response.statusText);
                res.writeHead(response.status, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
                res.write(response.statusText);
                res.end();
            })
            .catch(function(err) {
                console.error("error", err);
                res.writeHead(500, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
                res.write('Error fetching ' + url + ':  Ensure VLC is running and web interface is enabled');
                res.end();
            });
    }).listen(listeningPort); 
    
    console.info('VLC Web server passthrough listenting on port ' + listeningPort);
}