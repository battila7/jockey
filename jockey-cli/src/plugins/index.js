const pipe = require('@jockey/jockey-pipe');
const git = require('@jockey/jockey-git');

const plugins = {
    pipe,
    git
};

Object.setPrototypeOf(plugins, null);

const forName = function forName(name) {
    return plugins[name];
};

module.exports = {
    forName
};
