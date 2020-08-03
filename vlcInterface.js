var http = require('http');
var fetch = require('node-fetch');
var btoa = require('btoa');

var listeningPort = 8181;
var vlcEndpoint = 'http://localhost:8080';
var vlcPassword = process.argv[2]; // Second argument is the password
var vlcUserName = '';

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

console.log('VLC Web server passthrough listenting on port ' + listeningPort);