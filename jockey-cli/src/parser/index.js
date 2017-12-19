const fs = require('fs');
const yaml = require('js-yaml');

const ENCODING = 'utf8';

const parse = function parse(path) {
    return yaml.safeLoad(fs.readFileSync(path, ENCODING));
}

module.exports = {
    parse
};
