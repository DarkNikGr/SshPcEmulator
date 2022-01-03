const { Commant } = require("./_commant");

class cmdCd extends Commant {
    async run(args) {
        const path = this.pc.fileSystem.getFullPath(args._[0] && args._[0].trim() || false);

        if (this.pc.fileSystem.existPath(path)) {
            this.pc.fileSystem.path = this.pc.fileSystem.getFixedPath(path);
        } else {
            this.pc.write('folder not found');
        }
        return this.exit();
    }
}

exports.cmdCd = cmdCd;