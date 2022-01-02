const fs = require('fs');
const path = require('path');

class FileSystem {
    constructor (user) {
        this.user = user;
        this.files = [];
        this.path = `/`;
        this.userPath = `/`;
        this.initFiles();
    }

    initFiles() {
        let filePath = `${path.resolve(__dirname)}/../fileSystems/${this.user}.json`;
        if (fs.existsSync(filePath)) {
            this.files = JSON.parse(fs.readFileSync(filePath));
        } else {
            this.files = this.generateDefaultFileSystem(this.user);
            fs.writeFileSync(filePath, JSON.stringify(this.files));
        }
        this.path = `/home/${this.user}`;
        this.userPath =  `/home/${this.user}`;
    }

    save() {
        let filePath = `${path.resolve(__dirname)}/../fileSystems/${this.user}.json`;
        fs.writeFileSync(filePath, JSON.stringify(this.files));
    }

    generateDefaultFileSystem(username) {
        return [{
            type: 'dir',
            name: 'home',
            items: [{
                type: 'dir',
                name: username,
                items: [{
                    type: 'file',
                    name: 'test.txt',
                    content: "test text\ntest text line 2"
                }]
            }]
        }]
    }

    getFolder(pathArray, files = this.files) {
        if (!pathArray.length) return files;
        const nextFolder = pathArray.shift();
        const dir = files.find(x => x.name === nextFolder && x.type === 'dir');
        if (!dir) return false;
        return this.getFolder(pathArray, dir.items);
    }

    get interfacePath() {
        return this.path == this.userPath ? '~' : this.path
    }
}

exports.FileSystem = FileSystem;