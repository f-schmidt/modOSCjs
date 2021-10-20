var app = require('express')();
var osc = require("osc");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var udpPort = new osc.UDPPort({
    // This is the port we're listening on.
    localAddress: "127.0.0.1",
    localPort: 57121,

    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

// Open the socket.
udpPort.open();
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('slider2', function (msg) {
        var msgout = {
            address: "/hello/from/oscjs",
            args: [{
                type: "f",
                value: msg
            },
            {
                type: "f",
                value: msg
            }
            ]
        };
        udpPort.send(msgout);
        console.log("Message received: " + msg);
        console.log("Sending message", msgout.address, msg, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    });
});

http.listen(2000, function () {
    console.log('listening on *:2000');
});