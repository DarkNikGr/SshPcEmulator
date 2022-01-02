const { Commant } = require("./_commant");

class cmdCd extends Commant {
    async run(args) {
        const path = this.getPath(args);

        if (this.pc.fileSystem.getFolder(this.getPathAray(path))) {
            this.pc.fileSystem.path = this.getEdingPath(path);
        } else {
            this.pc.write('folder not found');
        }
        return this.exit();
    }

    getEdingPath(path) {
        return `/${this.getPathAray(path).join('/')}`;
    }

    getPathAray(path) {
        return path.split('/').filter((x) => x);
    }

    getPath(args) {
        let path = args._[0] && args._[0].trim() || false;

        if (!path || path === '~') path = this.pc.fileSystem.userPath;
        if (path === '..') {
            path = this.pc.fileSystem.path.split('/');
            path.pop();
            path = '/' + path.join('/');
        }

        if (path.charAt(0) !== '/')  path = `${this.pc.fileSystem.path}/${path}`;
        
        return path;
    }
}

exports.cmdCd = cmdCd;