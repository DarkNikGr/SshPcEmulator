const { Commant } = require("./_commant");

class cmdLs extends Commant {
    async run(args) {
        let files = this.pc.fileSystem.getFolderFiles(this.pc.fileSystem.getFullPath(args._[0] && args._[0].trim() || this.pc.fileSystem.path));

        if (args.a) {
            files.unshift('..');

            files.unshift('.');
        }

        if (args.o) {
            this.advancePrint(files);
        } else {
            this.simplePrint(files);
        }

        return this.exit();
    }

    advancePrint(files) {
        this.pc.write(`Total: ${files.length}`);
        for (const file of files) {
            this.pc.write(file);
        }
    }

    simplePrint (files) {
        let text = '';
        for (const file of files) {
            text += file + '\t';
        }
        this.pc.write(text);
    }
}

exports.cmdLs = cmdLs;