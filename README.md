# VLC Web Interface Passthrough

* A very simple node web server to pass commands to vlc web interface (to avoid CORs)
* run `node vlcInterface.js {vlcPassword}` 
* http://localhost:8181/{command} will map to http://localhost:8080/requests/status.xml?command={command}

# Basic commands

* pl_stop
* pl_pause (toggles paused status)
* pl_play&id={id}
* pl_next
* pl_previous
* fullscreen (toggles fullscreen)
* in_play&input=file:///home/david/projects/iptv/src/sources/detroit.m3u
* volume&val=256 (100%)
* volume&val=512 (200%)  
* seek&val=48%

# TODO - Convert payload from xml to json (load special urls as well)
* http://localhost:8080/requests/playlist_jstree.xml 
