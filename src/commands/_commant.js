const { v4: uuidv4 } = require('uuid');

class Commant {
    constructor(pc) {
        this.pc = pc;
        this.error = false;
        this.id = uuidv4();
        this.version = "1.0";
    }

    clearResorces() {
        this.pc.hardware.ram.delete(this.id);
    }

    exit(error = false) {
        if (error) this.error = error;
        this.clearResorces();
        return this.error ? false : true;
    }

    async runTasks(tasks) {
        for (const task of tasks) {
            this.pc.write(task.task);
            if (task.ram){
                if (!this.pc.hardware.ram.add(this.id, task.ram)) {
                    this.error = 'not enough memory';
                    return false;
                };
            }
            if (task.cycles) {
                await this.pc.hardware.cpu.process(task.cycles);
            }
            if (task.complete) {
                this.pc.write(task.complete);
            }
            if (task.then) {
                await task.then.bind(this)();
            }
        }
        return true;
    }

    async run(args) {

    }

    async man(args) {
        this.pc.write(`-v, --version        Show app version`);
        this.pc.write(`-h, --help           Show app help`);
    }

    async version(args) {
        this.pc.write(`Version: ${this.version}`);
    }

    async _run (args) {
        if (args.h || args.help) {
            await this.man(args);
            return true;
        } else if (args.v || args.version) {
            await this.version(args);
            return true;
        }
        return await this.run(args);
    }
}

exports.Commant = Commant;