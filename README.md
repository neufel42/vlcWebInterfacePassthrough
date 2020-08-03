# VLC Web Interface Passthrough

* A very simple node web server to pass commands to vlc web interface (to avoid CORs)
* run `node vlcInterface.js` 
* http://localhost:8181/{command} will map to http://localhost:8080/requests/status.xml?command={command}

# Basic commands

* pl_stop
* pl_pause (toggles paused status)
* pl_play&id={id}
* pl_next
* pl_previous
* fullscreen (toggles fullscreen)

# TODO - Convert payload from xml to json (load special urls as well)
* http://localhost:8080/requests/playlist_jstree.xml 
