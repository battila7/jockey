const path = require('path');
const { spawn } = require('child_process');

const validateContext = () => Promise.resolve();

const addDefines = function addDefines(args, define) {
    return args.concat(Object.keys(define).map(key => {
        return `-D${key}=${define[key]}`;
    }));
};

const addProfiles = function addProfiles(args, profiles) {
    const joinedProfiles = profiles.join(',');
    const profilesString = joinedProfiles.length > 0 ? `-P${joinedProfiles}` : '';

    return args.concat([profilesString]);
};

const addDebug = function addDebug(args, debug) {
    const debugArray = [];

    if (debug) {
        debugArray.push(`-Drun.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=${debug.address}"`)
    }

    return args.concat(debugArray);
};

const addCommand = function addCommand(args, command) {
    return args.concat(command.split(' '));
};

const execute = function execute(context, { command, debug, define = {}, directory, profiles = [], waitForCompletion = true }, output) {
    const targetDirectory = directory || context.directory;

    let args = addCommand([], command);
    args = addProfiles(args, profiles);
    args = addDefines(args, define);
    args = addDebug(args, debug);
    args = args.filter(arg => arg != '');

    return new Promise((resolve, reject) => {
        if (!waitForCompletion) {
            resolve();
        }

        const executable = /^win/.test(process.platform) ? 'mvn.cmd' : 'mvn';

        const proc = spawn(executable, args, { cwd: targetDirectory, env: Object.assign({}, process.env, context.env)});

        proc.stdout.pipe(output);

        proc.on('error', reject);

        proc.on('close', resolve);
    });
};


module.exports = {
    validateContext,
    execute
}
