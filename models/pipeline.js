'use strict';
const Joi = require('joi');
const mutate = require('../lib/mutate');

const MODEL = {
    id: Joi
        .string().hex().length(40)
        .description('Identifier of this Pipeline')
        .example('2d991790bab1ac8576097ca87f170df73410b55c'),

    scmUrl: Joi
        .string().regex(/^git@([^:]+):([^\/]+)\/(.+?)\.git(#.+)?$/)
        .description('Source Code URL for the application')
        .example('git@github.com:screwdriver-cd/data-model.git#master'),

    configUrl: Joi
        .string().regex(/^git@([^:]+):([^\/]+)\/(.+?)\.git(#.+)?$/)
        .description('Source Code URL for Screwdriver configuration')
        .example('git@github.com:screwdriver-cd/optional-config.git#master'),

    createTime: Joi
        .date()
        .description('When this pipeline was created')
};

module.exports = {
    /**
     * All the available properties of Pipeline
     *
     * @property base
     * @type {Joi}
     */
    base: Joi.object(MODEL).label('Pipeline'),

    /**
     * Properties for Pipeline that will come back during a GET request
     *
     * @property get
     * @type {Joi}
     */
    get: Joi.object(mutate(MODEL, [
        'id', 'scmUrl', 'createTime'
    ], [
        'configUrl'
    ])).label('Get Pipeline'),

    /**
     * Properties for Pipeline that will be passed during an UPDATE request
     *
     * @property update
     * @type {Joi}
     */
    update: Joi.object(mutate(MODEL, [
        'scmUrl'
    ], [
        'configUrl'
    ])).label('Update Pipeline'),

    /**
     * Properties for Pipeline that will be passed during a CREATE request
     *
     * @property create
     * @type {Joi}
     */
    create: Joi.object(mutate(MODEL, [
        'scmUrl'
    ], [
        'configUrl'
    ])).label('Create Pipeline'),

    /**
     * List of fields that determine a unique row
     *
     * @property keys
     * @type {Array}
     */
    keys: ['scmUrl'],

    /**
     * Tablename to be used in the datastore
     *
     * @property tableName
     * @type {String}
     */
    tableName: 'pipelines',

    /**
     * List of indexes to create in the datastore
     *
     * @property indexes
     * @type {Array}
     */
    indexes: ['scmUrl']
};