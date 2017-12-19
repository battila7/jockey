const path = require('path');
const { spawnSync } = require('child_process');

const validateContext = () => Promise.resolve();

const cloneRepository = function cloneRepository(uri, target) {
    spawnSync('git', ['clone', uri, path.resolve(process.cwd(), target)]);
};

const doCheckout = function doCheckout(directory, checkout) {
    spawnSync('git', ['checkout', checkout], { cwd: path.resolve(process.cwd(), directory )});
}

const execute = function execute(context, { clone, directory, checkout }) {
    const targetDirectory = directory || context.directory;

    if (clone) {
        cloneRepository(clone, targetDirectory);
    }

    doCheckout(targetDirectory, checkout);

    context.directory = targetDirectory;

    return context;
};


module.exports = {
    validateContext,
    execute
}
