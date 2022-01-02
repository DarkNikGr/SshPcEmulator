const fs = require('fs');
const { Server } = require('./src/server');

const server = new Server(fs.readFileSync('host.key'), 'Server')
server.start(2222, '127.0.0.1');
server.addPc('10.0.0.2', 'test01', '123');