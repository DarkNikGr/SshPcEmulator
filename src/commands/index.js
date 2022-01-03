const { cmdCd } = require("./cd");
const { cmdLs } = require("./ls");
const { cmdCat } = require("./cat");
const { cmdTest } = require("./test");

exports.commands = {
    ls: cmdLs,
    cd: cmdCd,
    cat: cmdCat,
    test: cmdTest
};