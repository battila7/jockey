const prog = require('caporal');

const RodeoCommand = require('./rodeo');

RodeoCommand.cliConfigure(prog);

prog.parse(process.argv);
