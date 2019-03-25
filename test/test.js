/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const brHttpProxy = require('bedrock-http-proxy');
const brPermission = require('bedrock-permission');
require('bedrock-mongodb');

bedrock.events.on('bedrock.init', () => {
  brHttpProxy.addProxy({
    authorizationCheck: _authorizationCheck,
    method: 'get',
    route: '/test-proxy',
    strictSSL: false,
    // using IP here so nock can be used for this hostname
    targetEndpoint: 'https://127.0.0.1:18443/test-target-endpoint'
  });
  brHttpProxy.addProxy({
    authorizationCheck: _authorizationCheck,
    method: 'post',
    route: '/test-proxy',
    strictSSL: false,
    // using IP here so nock can be used for this hostname
    targetEndpoint: 'https://127.0.0.1:18443/test-target-endpoint'
  });
});

require('bedrock-test');
bedrock.start();

async function _authorizationCheck({user}) {
  let authorized = false;
  try {
    await brPermission.checkPermission(user.actor, 'TEST_PROXY_ACCESS');
    authorized = true;
  } catch(e) {
    if(e.name !== 'PermissionDenied') {
      throw e;
    }
  }
  return {authorized};
}
