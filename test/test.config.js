/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const path = require('path');
const {permissions, roles} = config.permission;

config.mocha.tests.push(path.join(__dirname, 'mocha'));

// MongoDB
config.mongodb.name = 'bedrock_http_proxy_test';
config.mongodb.dropCollections = {};
config.mongodb.dropCollections.onInit = true;
config.mongodb.dropCollections.collections = [];

// top level applications will need to define permissions related to proxy
// access
permissions.TEST_PROXY_ACCESS = {
  id: 'TEST_PROXY_ACCESS',
  label: 'Test Proxy Access',
  comment: 'Required to access a test proxy endpoint.'
};

roles['bedrock-http-proxy-test.regular'] = {
  id: 'bedrock-http-proxy-test.regular',
  label: 'Test Role',
  comment: 'Role for Test User',
  sysPermission: [
    permissions.TEST_PROXY_ACCESS.id,
  ]
};
