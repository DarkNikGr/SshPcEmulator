const { Commant } = require("./_commant");

class cmdCat extends Commant {
    async run(args) {
        if (!args._[0]) return this.exit('File not found');
        let file = this.pc.fileSystem.getFullPath(args._[0] && args._[0].trim());
        if (!this.pc.fileSystem.existPath(file)) return this.exit('File not found');

        const data = this.pc.fileSystem.readFile(file);
        if (data) {
            this.pc.write(data);
        }

        return this.exit();
    }
}

exports.cmdCat = cmdCat;