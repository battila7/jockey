const LineWrapper = require('stream-line-wrapper');
const pref = require('prefix-stream-lines');

const parser = require('../parser');
const plugins = require('../plugins');

const RodeoCommand = {
    cliConfigure(prog) {
        prog
            .version('1.0.0')
            .command('rodeo', 'Run the config file.')
            .argument('[file]', 'The configuration file', opt => opt, 'jockey.yml')
            .action(({ file }) => this.execute(file));
    },
    execute(file) {
        const configuration = parser.parse(file);

        configuration.components.reduce((prom, component) => prom.then(() => this.executeComponent(component)), Promise.resolve())
    },
    executeComponent(component) {
        const context = {
            env: {}
        };

        Object.setPrototypeOf(context.env, null);

        return component.steps.reduce((prom, step) => {
            const output = (new LineWrapper({ prefix: `| ${component.name} |  -  `}));

            output.pipe(process.stdout);

            return prom.then(context => this.executeStep(step, context, process.stdout));
        }, Promise.resolve(context));
    },
    executeStep(step, context, output) {
        const plugin = plugins.forName(step.use);

        return plugin.validateContext(context)
                .then(() => plugin.execute(context, step.with, output));
    }
};

module.exports = RodeoCommand;
