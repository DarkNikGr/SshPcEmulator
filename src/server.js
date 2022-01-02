const ssh2 = require('ssh2');
const { Network } = require('./netwwork');
const { PcEmulator } = require('./pcEmulator');

class Server {
    constructor(hostKeys, host) {
      this.host = host;
      this.network = new Network();

      this.server = new ssh2.Server({
          hostKeys: [hostKeys]
        }, (client) => {
          let pc = new PcEmulator(this.host, this.network);
          client.on('authentication', (ctx) => {
            if (pc.account.authenticate(ctx.username, ctx.password)) {
                ctx.accept();
            } else {
                ctx.reject();
            }
          })
        
          client.on('ready', () => {
            pc.initPc();
        
            client.on('session', (accept, reject) => {
                var session = accept();
                session.once('pty', (accept, reject, info) => accept());
                session.once('shell', (accept, reject) => pc.initShell(accept()));
            });
          })
          
          client.on('close', () => {
            pc.log('Client disconnected');
          });
      })
    }

    start(port = 2222, host = '127.0.0.1') {
      this.server.listen(port, host, function() {
        console.log(`SSH Server is online on port ${this.address().port}`);
      });
    }

    addPc(ip, username, password) {
      let pc = new PcEmulator(this.host, this.network, ip);
      pc.account.authenticate(username, password, true);
      pc.account.user.password = password;
      pc.account.save();
      pc.initPc();
    }
}

exports.Server = Server;
