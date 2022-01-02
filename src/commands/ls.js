const { Commant } = require("./_commant");

class cmdLs extends Commant {
    async run(args) {
        this.pc.write('ls run complete');
        return this.exit();
    }
}

exports.cmdLs = cmdLs;