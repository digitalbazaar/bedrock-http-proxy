/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const _logger = require('./logger');
const assert = require('assert-plus');
const bedrock = require('bedrock');
const {asyncHandler} = require('bedrock-express');
const {ensureAuthenticated} = require('bedrock-passport');
const {create} = require('apisauce');
const https = require('https');
const {util: {BedrockError}} = bedrock;

const proxies = [];

// HTTP methods that have a body
const bodyMethods = new Set(['post', 'put', 'patch']);

exports.addProxy = ({
  authorizationCheck, method, route, strictSSL = true, targetEndpoint
}) => {
  assert.func(authorizationCheck, 'options.authorizationCheck');
  assert.string(method, 'options.method');
  assert.string(route, 'options.route');
  assert.bool(strictSSL, 'options.strictSSL');
  assert.string(targetEndpoint, 'options.targetEndpoint');

  const baseURL = targetEndpoint;
  const httpsAgent = new https.Agent({rejectUnauthorized: strictSSL});
  const targetApi = create({baseURL});

  proxies.push({
    authorizationCheck,
    httpsAgent,
    method,
    route,
    targetApi
  });
};

bedrock.events.on('bedrock-express.configure.routes', app => {
  // TODO: conditionally add rateLimiting API?
  for(const {
    authorizationCheck, httpsAgent, method, route, targetApi
  } of proxies) {
    const methodLowerCase = method.toLowerCase();
    app[methodLowerCase](
      route,
      ensureAuthenticated,
      asyncHandler(async (req, res) => {

        // check authorization
        const {authorized} = await authorizationCheck({user: req.user});
        if(!authorized) {
          throw new BedrockError(
            'Authorization check failed.', 'NotAllowedError', {
              httpStatusCode: 403,
              public: true,
            });
        }

        // emit some event(s) for use with bedrock-event-log?

        let request;
        if(bodyMethods.has(methodLowerCase)) {
          request = targetApi[methodLowerCase]('', req.body, {httpsAgent});
        } else {
          request = targetApi[methodLowerCase]('', {}, {httpsAgent});
        }
        const response = await request;
        if(response.problem) {
          // do not leak any information about firewalled systems to public
          // log a specific error
          _logger.error('Network Error', {error: response.originalError});
          // throw a generic error
          throw new BedrockError('An error occurred.', 'NetworkError', {
            httpStatusCode: 400,
            public: true
          });
        }

        // success
        res.json(response.data);
      }));
  }
});
