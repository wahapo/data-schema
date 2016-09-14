'use strict';
const Joi = require('joi');
const mutate = require('../lib/mutate');

const STEP = {
    name: Joi
        .string()
        .description('Name of the Step'),
    code: Joi
        .number().integer()
        .description('Exit code'),
    startTime: Joi
        .string()
        .isoDate()
        .description('When this step started'),
    endTime: Joi
        .string()
        .isoDate()
        .description('When this step stopped running')
};
const MODEL = {
    id: Joi
        .string().hex().length(40)
        .description('Identifier of this build')
        .example('4b8d9b530d2e5e297b4f470d5b0a6e1310d29c5e'),

    jobId: Joi
        .string().hex().length(40)
        .description('Identifier of the Job')
        .example('50dc14f719cdc2c9cb1fb0e49dd2acc4cf6189a0'),

    parentBuildId: Joi
        .string().hex().length(40)
        .description('Parent build in the case of matrix jobs')
        .example('50dc14f719cdc2c9cb1fb0e49dd2acc4cf6189a0'),

    number: Joi
        .number().positive()
        .description('Incrementing number of a Job')
        .example(15),

    container: Joi
        .string()
        .description('Container this build is running in')
        .example('node:4'),

    cause: Joi
        .string()
        .description('Reason why this build started')
        .example('pull request opened'),

    sha: Joi
        .string().hex()
        .length(40)
        .description('SHA this project was built on')
        .example('ccc49349d3cffbd12ea9e3d41521480b4aa5de5f'),

    startedBy: Joi
        .string()
        .description('Identifier of who started this build')
        .example('stjohnjohnson'),

    startedByUri: Joi
        .string().uri()
        .description('Link to more detail about the user')
        .example('http://github.com/stjohnjohnson'),

    authoredBy: Joi
        .string()
        .description('Username of the person who authored this commit')
        .example('jer'),

    authoredByUri: Joi
        .string().uri()
        .description('Link to more detail about the user')
        .example('http://github.com/jer'),

    commitMessage: Joi
        .string()
        .description('Contents of the commit message')
        .example('Fixing a bug with signing'),

    commitUri: Joi
        .string().uri()
        .description('Link to more detail about the commit')
        .example('https://github.com/screwdriver-cd/screwdriver/commits/271006'),

    createTime: Joi
        .string()
        .isoDate()
        .description('When this build was created'),

    startTime: Joi
        .string()
        .isoDate()
        .description('When this build started on a build machine'),

    endTime: Joi
        .string()
        .isoDate()
        .description('When this build stopped running'),

    parameters: Joi
        .object()
        .description('Input parameters that defined this build'),

    meta: Joi
        .object()
        .description('Key=>Value information from the build itself'),

    steps: Joi
        .array().items(
            Joi.object(
                mutate(STEP, ['name'], ['code', 'startTime', 'endTime'])
            ).description('Step metadata'))
        .description('List of steps'),

    status: Joi
        .string().valid([
            'SUCCESS',
            'FAILURE',
            'QUEUED',
            'ABORTED',
            'RUNNING'
        ])
        .description('Current status of the build')
        .example('SUCCESS')
        .default('QUEUED')
};

module.exports = {
    /**
     * All the available properties of Build
     *
     * @property base
     * @type {Joi}
     */
    base: Joi.object(MODEL).label('Build'),

    /**
     * Properties for Build that will come back during a GET request
     *
     * @property get
     * @type {Joi}
     */
    get: Joi.object(mutate(MODEL, [
        'id', 'jobId', 'number', 'cause', 'createTime', 'status'
    ], [
        'container', 'parentBuildId', 'sha', 'startTime', 'endTime', 'meta', 'parameters', 'steps',
        'startedBy', 'startedByUri', 'authoredBy', 'authoredByUri', 'commitMessage', 'commitUri'
    ])).label('Get Build'),

    /**
     * Properties for Build that will be passed during an UPDATE request
     *
     * @property update
     * @type {Joi}
     */
    update: Joi.object(mutate(MODEL, [
        'status'
    ], [
        'meta'
    ])).label('Update Build'),

    /**
     * Properties for Build that will be passed during a CREATE request
     *
     * @property create
     * @type {Joi}
     */
    create: Joi.object(mutate(MODEL, [
        'jobId'
    ])).label('Create Build'),

    /**
     * Properties when getting step data
     *
     * @property getStep
     * @type {Joi}
     */
    getStep: Joi.object(mutate(STEP, [
        'name'
    ], [
        'code',
        'startTime',
        'endTime'
    ])).label('Get Step Metadata'),

    /**
     * Properties when updating step data
     *
     * @property updateStep
     * @type {Joi}
     */
    updateStep: Joi.object(mutate(STEP, [], [
        'code',
        'startTime',
        'endTime'
    ])).label('Update Step Metadata'),

    /**
     * List of fields that determine a unique row
     *
     * @property keys
     * @type {Array}
     */
    keys: ['jobId', 'number'],

    /**
     * Primary column to sort queries by.
     * This defines queries to optionally sort a query result set by build number
     *
     * @type {String}
     */
    rangeKey: 'number',

    /**
     * List of all fields in the model
     * @property allKeys
     * @type {Array}
     */
    allKeys: Object.keys(MODEL),

    /**
     * Tablename to be used in the datastore
     *
     * @property tableName
     * @type {String}
     */
    tableName: 'builds',

    /**
     * List of indexes to create in the datastore
     *
     * @property indexes
     * @type {Array}
     */
    indexes: ['jobId', 'parentBuildId']
};
