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

        return component.steps.reduce((prom, step) => prom.then(context => this.executeStep(step, context)), Promise.resolve(context));
    },
    executeStep(step, context) {
        const plugin = plugins.forName(step.use);

        return plugin.validateContext(context)
                .then(() => plugin.execute(context, step.with));
    }
};

module.exports = RodeoCommand;
