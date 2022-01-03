const { Commant } = require("./_commant");

class cmdTest extends Commant {
    async run(args) {
        this.pc.write(`start test with id: ${this.id}`);
        if (!this.pc.hardware.ram.add(this.id, 512)) return this.exit('not enough memory');

        this.pc.write(`run with cpu: ${this.pc.hardware.cpu.chip.name}`);
        this.pc.write(`run with ram: ${this.pc.hardware.ram.size}MB`);

        if (!await this.runTasks([
            {task: 'stage 1 start', complete:'stage 1 complete', cycles: 100, ram: 512},
            {task: 'stage 2 start', complete:'stage 2 complete', cycles: 200},
            {task: 'stage 3 start', complete:'stage 3 complete', then: this.testAfterCode},
        ])) return this.exit();

        this.clearResorces();
        this.pc.write('complete first task');

        if (!await this.runTasks([
            {task: 'stage 4 start', complete:'stage 4 complete', cycles: 100, ram: 1000, then: () => {this.pc.write('test after code second task');}},
            {task: 'stage 5 start', complete:'stage 5 complete', cycles: 200, ram: 1000},
            {task: 'stage 6 start', complete:'stage 6 complete', cycles: 300, ram: 2000},
        ])) return this.exit();

        this.pc.write('complete secont task');
        return this.exit();
    }
    
    async testAfterCode() {
        this.pc.write('test after code');
    }

    async man(args) {
        this.pc.write('man test');
    }
}

exports.cmdTest = cmdTest;