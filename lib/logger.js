/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');

module.exports = bedrock.loggers.get('app').child('bedrock-http-proxy');
