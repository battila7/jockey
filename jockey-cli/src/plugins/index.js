const context = require('@jockey/jockey-context');
const git = require('@jockey/jockey-git');
const maven = require('@jockey/jockey-maven');
const pom = require('@jockey/jockey-pom');

const plugins = {
    context,
    git,
    pom,
    maven
};

Object.setPrototypeOf(plugins, null);

const forName = function forName(name) {
    return plugins[name];
};

module.exports = {
    forName
};
