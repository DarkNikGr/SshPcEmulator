const { cmdCd } = require("./cd");
const { cmdLs } = require("./ls");
const { cmdTest } = require("./test");

exports.commands = {
    ls: cmdLs,
    cd: cmdCd,
    test: cmdTest
};