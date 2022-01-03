const fs = require('fs');
const path = require('path');

class FileSystem {
    constructor (user) {
        this.user = user;
        this.rootFolderPath = `${path.resolve(__dirname)}/../fileSystems/_init`
        this.path = `/`;
        this.userPath = `/`;
        this.initFiles();
    }

    initFiles() {
        this.rootFolderPath = `${path.resolve(__dirname)}/../fileSystems/${this.user}`

        if (!fs.existsSync(this.rootFolderPath)) {
            this.generateDefaultFiles();
        }

        this.path = `/home/${this.user}`;
        this.userPath =  `/home/${this.user}`;
    }

    generateDefaultFiles() {
        fs.mkdirSync(this.rootFolderPath);
        fs.mkdirSync(this.rootFolderPath + `/home`);
        fs.mkdirSync(this.rootFolderPath + `/home/${this.user}`);
    }

    existPath(path) {
        return fs.existsSync(this.rootFolderPath + path)
    }

    getPathStatus(path) {
        return fs.lstatSync(this.rootFolderPath + path);
    }

    readFile(path) {
        if (this.existPath(path) && this.getPathStatus(path).isFile()) {
            return  fs.readFileSync(this.rootFolderPath + path, 'utf8')
        }
        return false;
    }

    getFolderFiles(path) {
        return fs.readdirSync(this.rootFolderPath + path);
    }

    get interfacePath() {
        return this.path == this.userPath ? '~' : this.path
    }

    getFixedPath(path) {
        return `/${this.getPathArray(path).join('/')}`;
    }

    getPathArray(path) {
        return path.split('/').filter((x) => x);
    }

    getFullPath(path) {
        path = path && path.trim() || false;

        if (!path || path === '~') path = this.userPath;
        if (path === '..') {
            path = this.path.split('/');
            path.pop();
            path = '/' + path.join('/');
        }

        if (path.charAt(0) !== '/')  path = `${this.path}/${path}`;

        return this.getFixedPath(path);
    }
}

exports.FileSystem = FileSystem;