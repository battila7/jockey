const pipe = require('@jockey/jockey-pipe');

const plugins = {
    'pipe': pipe
};

Object.setPrototypeOf(plugins, null);

const forName = function forName(name) {
    return plugins[name];
};

module.exports = {
    forName
};
