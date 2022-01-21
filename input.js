const core = require('@actions/core');
const auth = require('./auth')

const stringInputs = {
    'accessId': 'access-id',
    'accessType': 'access-type',
    'apiUrl': 'api-url',
    'producerForAwsAccess': 'producer-for-aws-access',
};

const boolInputs = {
    'exportSecretsToOutputs': 'export-secrets-to-outputs',
    'exportSecretsToEnvironment': 'export-secrets-to-environment',
};

const dictInputs = {
    'staticSecrets': 'static-secrets',
    'dynamicSecrets': 'dynamic-secrets',
};

const fetchAndValidateInput = () => {
    let params = {
        accessId: core.getInput('access-id'),
        accessType: core.getInput('access-type'),
        apiUrl: core.getInput('api-url'),
        producerForAwsAccess: core.getInput('producer-for-aws-access'),
        staticSecrets: core.getInput('static-secrets'),
        dynamicSecrets: core.getInput('dynamic-secrets'),
        exportSecretsToOutputs: core.getInput('export-secrets-to-outputs'),
        exportSecretsToEnvironment: core.getInput('export-secrets-to-environment'),
    };
    // our only required parameter
    if (!params['accessId']) {
        throw new Error('You must provide the access id for your auth method via the access-id input');
    }

    // check for string types
    for (const [paramKey, inputId] of Object.entries(stringInputs)) {
        if (typeof params[paramKey] !== 'string') {
            throw new Error(`Input '${inputId}' should be a string`);
        }
    }
    // check for bool types
    for (const [paramKey, inputId] of Object.entries(boolInputs)) {
        if(typeof params[paramKey] !== 'boolean') {
            throw new Error(`Input '${inputId}' should be a boolean`);
        }
    }
    // check for dict types
    for (const [paramKey, inputId] of Object.entries(dictInputs)) {
        if (params[paramKey].constructor != Object) {
            throw new Error(`Input '${inputId}' should be a dictionary with the secret path as a key and the output name as the value`);
        }
    }
    // check access types
    if (!auth.allowedAccessTypes.includes(params['accessType'].toLowerCase())) {
        throw new Error("access-type must be one of: ['" + auth.allowedAccessTypes.join("', '") + "']");
    }
    params['accessType'] = params['accessType'].toLowerCase();

    return params;
};

exports.fetchAndValidateInput = fetchAndValidateInput;
