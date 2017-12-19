const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');

const ENCODING = 'utf8';

const validateContext = () => Promise.resolve();

const execute = function execute(context, { file, override }) {
    const targetFile = path.resolve(process.cwd(), file);

    return new Promise((resolve, reject) => {
        const xmlString = fs.readFileSync(targetFile, ENCODING);

        xml2js.parseString(xmlString, function xmlResultHandler(err, result) {
            const properties = result.project.properties[0];

            Object.keys(override).forEach(key => {
                properties[key] = [override[key]]
            });

            const builder = new xml2js.Builder();
            const resultXmlString = builder.buildObject(result);

            fs.writeFileSync(targetFile, resultXmlString, { encoding: ENCODING });

            resolve(context);
        });
    });
};


module.exports = {
    validateContext,
    execute
}
