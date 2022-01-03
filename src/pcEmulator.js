const { Account } = require("./account");
const minimist = require('minimist');
const { FileSystem } = require("./fileSystem");
const { Hardware } = require("./hardware");
const {commands} = require('./commands');
const { v4: uuidv4 } = require('uuid');

class PcEmulator {    
    constructor(hostname, network, ip = false) {
        this.id = uuidv4();
        this.hostname = hostname;
        this.network = network;
        this.account = new Account();
        this.fileSystem = false;
        this.hardware = false;
        this.stream = false;
        this.ip = this.network.connect(this, ip);
        this.log('Client connected');
    }

    log(msg) {
        console.log(`[${this.ip}] ${msg}`);
    }

    initPc() {
        this.log(`login as ${this.account.user.username}`);
        this.fileSystem = new FileSystem(this.account.user.username);
        this.hardware = new Hardware(this,
            this.account.user.cpu || 'default',
            this.account.user.ram || 1024
        );
        this.hardware.ram.add('system', Math.floor(Math.random() * 100) + 400);
    }

    initShell(stream) {
        let cmd = '';
        this.stream = stream;
        this.write(this.prefixLine, false);
        this.stream.on('data', async (input) => {
            const charBuffer = Buffer.from(input);
            // console.log(charBuffer); //log input
            if (Buffer.compare(charBuffer, new Buffer([0x0d])) === 0) {
                // enter
                if (cmd.trim()) {
                    this.stream.write('\n');
                    this.stream.write(new Buffer([0x0d]));
                    if (cmd.trim() === 'exit') {
                        this.stream.exit(0);
                        this.stream.end();
                    } else if (cmd.trim() === 'clear') {
                        //
                    } else {
                        await this.run(cmd.trim());
                        cmd = '';
                        this.write(this.prefixLine, false);
                    }
                }
            } else if (
                Buffer.compare(charBuffer, new Buffer([0x1b, 0x5b, 0x41])) === 0
                || Buffer.compare(charBuffer, new Buffer([0x1b, 0x5b, 0x42])) === 0
            ) {
                // up down for history
            } else if (Buffer.compare(charBuffer, new Buffer([0x09])) === 0) {
                // tab
            }  else if (Buffer.compare(charBuffer, new Buffer([0x03])) === 0) {
                // ctr + c
            } else if (Buffer.compare(charBuffer, new Buffer([0x7f])) === 0) {
                // backspace
                if (cmd.length) {
                    cmd = cmd.slice(0, -1);
                    this.stream.write(new Buffer([0x1b, 0x5b, 0x44, 0x20, 0x1b, 0x5b, 0x44]));
                }
            } else if (
                Buffer.compare(charBuffer, new Buffer([0x1b, 0x5b, 0x44])) === 0 // left
                || Buffer.compare(charBuffer, new Buffer([0x1b, 0x5b, 0x43])) === 0 //right
                || Buffer.compare(charBuffer, new Buffer([0x1b, 0x5b, 0x32, 0x7e])) === 0 //ins
                || Buffer.compare(charBuffer, new Buffer([0x1b, 0x5b, 0x33, 0x7e])) === 0 //del
                || Buffer.compare(charBuffer, new Buffer([0x1b, 0x5b, 0x48])) === 0 // home
                || Buffer.compare(charBuffer, new Buffer([0x1b, 0x5b, 0x46])) === 0 //end
                || Buffer.compare(charBuffer, new Buffer([0x1b, 0x5b, 0x35, 0x7e])) === 0 //page up
                || Buffer.compare(charBuffer, new Buffer([0x1b, 0x5b, 0x36, 0x7e])) === 0 //page down
            ) {
                // do nothing
            }  else {
                this.stream.write(charBuffer);
                cmd += input;
            }
        });
    }

    get prefixLine() {
        return  `${this.account.user.username}@${this.hostname}:${this.fileSystem.interfacePath}$ `;
    }

    write(data, line = true) {
        if (line) {
            this.stream.write(data + '\n');
            this.stream.write(new Buffer([0x0d]));
        } else {
            this.stream.write(data);
        }
    }

    writeDynamic(data) {
        this.stream.write(new Buffer([0x0d]));
        this.stream.write(data);
    }

    async run(cmdRow) {
        let cmdArgs = cmdRow.split(' ').filter((x) => x);
        if (commands[cmdArgs[0]]) {
            const bin = new commands[cmdArgs[0]](this);
            if(!await bin._run(minimist(cmdArgs.slice(1)))) {
                if (bin.error) {
                    this.write(`Error [${cmdArgs[0]}] ${bin.error}`);
                }
            }
        } else {
            this.write(`Command ${cmdArgs[0]} not found`);
        } 
        this.log('Run: ' + cmdRow);
    }
}

exports.PcEmulator = PcEmulator;
