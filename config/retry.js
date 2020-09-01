'use strict';

const Joi = require('joi');
const Regex = require('./regex');

const SCHEMA_ENVIRONMENT = Joi.object()
    // IEEE Std 1003.1-2001
    // Environment names contain uppercase letters, digits, and underscore
    // They cannot start with digits
    .pattern(Regex.ENV_NAME, Joi.any())
    // All others are marked as invalid
    .unknown(false)
    // Add documentation
    .messages({
        'object.unknown': '{{#label}} only supports uppercase letters, digits, '
            + 'and underscore (cannot start with digit)'
    });

const SCHEMA_RETRY_OBJECT = Joi.object()
    .keys({
        condition: Joi.alternatives().try(Joi.string(), Joi.object().regex()).optional(),
        maxRetry: Joi.number().integer().positive().default(1),
        interval: Joi.number().integer().positive().unit('seconds')
            .default(0),
        environment: SCHEMA_ENVIRONMENT
    });

const SCHEMA_RETRY = Joi.alternatives().try(SCHEMA_RETRY_OBJECT, Joi.boolean()).default(false);

module.exports = {
    retry: SCHEMA_RETRY
};

// const schema = Joi.object().keys({
//     retry: SCHEMA_RETRY
// })
// const res = schema.validate({
//     retry: {
//         maxRetry: 5,
//         interval: 3,
//         environment: {
//             TEST_VL: 'tt'
//         }
//     }
// })

// console.log(res);
