const fs = require('fs');
const path = require('path');

class Account {
    constructor() {
        this.user = false
        this.register = true;
    }

    authenticate(username, password, forse = false) {
        if (!username || !password) return false;
        username = username.toLowerCase();
        let userPath = `${path.resolve(__dirname)}/../accounts/${username}.json`;
        if (fs.existsSync(userPath)) {
            let user = JSON.parse(fs.readFileSync(userPath));
            if (forse || user.password === password) {
                this.user = user;
            }
        } else {
            if (this.register) {
                this.user = this.generateDefaultUser(username, password);
                fs.writeFileSync(userPath, JSON.stringify(this.user));
            }
        }
        return this.user;
    }

    save() {
        let userPath = `${path.resolve(__dirname)}/../accounts/${this.user.username}.json`;
        fs.writeFileSync(userPath, JSON.stringify(this.user));
    }

    generateDefaultUser(username, password) {
        return {
            username: username,
            password: password,
            cpu: 'default',
            ram: 1024
        }
    }
}

exports.Account = Account;