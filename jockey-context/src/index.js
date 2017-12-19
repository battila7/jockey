const validateContext = () => Promise.resolve();

const operators = {
    '$push': function push(key, value, objectToModify) {
        objectToModify[key].push(...value);
    }
}

const resolvePath = function resolvePath(object, key) {
    const keys = key.split('.');

    let keyToInsert = keys.pop();
    let objectToModify = object;

    for (const key of keys) {
        if (!Object.prototype.hasOwnProperty.call(objectToModify, key)) {
            objectToModify.key = {};
        }

        objectToModify = objectToModify[key];
    }

    return {
        objectToModify,
        keyToInsert
    };
};

const applyOperator = function applyOperator(key, value, objectToModify) {
    const ops = new Set(Object.keys(operators));
    const valueKeys = new Set(Object.keys(value));

    const possible = new Set([...ops].filter(x => valueKeys.has(x)));

    if (possible.size == 0) {
        objectToModify[key] = value;
    } else {
        const op = [...possible][0];

        const fn = operators[op];

        fn(key, value[op], objectToModify);
    }
}

const execute = function execute(context, configuration) {
    Object.keys(configuration).forEach(key => {
        const value = configuration[key];

        const { objectToModify, keyToInsert } = resolvePath(context, key);

        applyOperator(keyToInsert, value, objectToModify);
    });

    return context;
};


module.exports = {
    validateContext,
    execute
}
