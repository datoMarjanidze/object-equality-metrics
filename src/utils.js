module.exports.printInfoMsg = msg => console.log("\x1b[33m%s", msg, "\x1b[0m");

module.exports.printErrorMsg = msg => console.log("\x1b[31m%s", msg, "\x1b[0m");

module.exports.printSuccessMsg = msg => console.log("\x1b[32m%s", msg, "\x1b[0m");