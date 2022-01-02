const { CPU } = require("./cpu");
const { RAM } = require("./ram");

class Hardware {
    constructor(pc, cpu, ramSize) {
        this.cpu = new CPU(pc, cpu);
        this.ram = new RAM(pc, ramSize);
    }
}

exports.Hardware = Hardware;