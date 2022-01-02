class RAM {
    constructor(pc, size = 1024) {
        this.pc = pc;
        this.size = size;
        this.usage = new Map();
    }

    get use() {
        let use = 0;
        this.usage.forEach(size => {
            use += size;
        });
        return use
    }

    get free() {
        return this.size - this.use;
    }

    setRam(size) {
        this.size = size;
    }

    add(name, size) {
        if (this.free >= size) {
            let current = this.usage.get(name) || 0;
            this.usage.set(name, current + size);
            return true;
        }
        this.delete(name);
        return false;
    }

    delete(name) {
        this.usage.delete(name);
    }
}

exports.RAM = RAM;