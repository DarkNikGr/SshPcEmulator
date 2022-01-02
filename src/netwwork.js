class Network {    
    constructor(name) {
        this.lan = new Map();
    }

    DHCP() {
        let ip = false;
        do {
            ip = "10."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))
        } while (this.lan.get(ip));
        return ip;
    }

    connect(pc, ip = false) {
        if (!ip || this.lan.get(ip)) {
            ip = this.DHCP();
        }
        this.lan.set(ip, pc);
        return ip;
    }

    getPc(ip) {
        return this.lan.get(ip) || false;
    }
}

exports.Network = Network;
