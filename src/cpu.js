const cpuList = {
    'amdRayzen5900x': {
        name: 'AMD Ryzen 9 5900X',
        coreSpeed: 3.7,
        cores: 12,
        hyperThreading: true
    },
    'intelSeleronG5925': {
        name: 'Intel Celeron G5925',
        coreSpeed: 3.6,
        cores: 2,
        hyperThreading: false
    }
}

class CPU {
    constructor(pc, cpu) {
        this.pc = pc;
        this.chip = false;
        this.sockets = 1;        

        this.setCpu(cpu)
    }

    get cyclesPerSecond() {
        return (Number)(this.sockets * this.chip.coreSpeed * this.chip.cores * (this.chip.hyperThreading? 2 : 1) * 10).toFixed(0); 
    }

    prosseseTime(cycles = 0){
        return (Number)(cycles / this.cyclesPerSecond * 1000).toFixed(0);
    }

    process(cycles = 0) {
        return new Promise(resolve => setTimeout(resolve, this.prosseseTime(cycles)))
    }

    processInSec(ms = 0) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    setCpu(cpu) {
        switch(cpu) {
            case "2x-amd-rayzen-5900x": {
                this.chip = cpuList.amdRayzen5900x;
                this.sockets = 2;
            }
            case "amd-rayzen-5900x": {
                this.chip = cpuList.amdRayzen5900x;
                break;
            }
            case "intel-celeron-g5925":
            default: {
                this.chip = cpuList.intelSeleronG5925;
                break;
            }
        }
    }
}

exports.CPU = CPU;