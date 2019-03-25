/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const {config} = bedrock;
const {create} = require('apisauce');
const helpers = require('./helpers');
const https = require('https');
const httpsAgent = new https.Agent({rejectUnauthorized: false});
const mockData = require('./mock.data');
const nock = require('nock');

const proxyEndpoint = `${config.server.baseUri}/test-proxy`;
const proxyApi = create({baseURL: proxyEndpoint});
const targetEndpoint = '/test-target-endpoint';
const targetSuccessResponse = {targetSuccess: true};

describe('Proxy HTTP API', () => {
  before(done => helpers.prepareDatabase(mockData, done));

  it('returns NotAllowedError on unauthenticated request', async () => {
    const response = await proxyApi.get('/', {}, {httpsAgent});
    response.problem.should.equal('CLIENT_ERROR');
    response.data.type.should.equal('NotAllowedError');
  });
  it('successfully proxies a request', async () => {
    _nockTargetEndpoint();
    const {privateKeyPem, publicKey: keyId} =
      mockData.identities.regularUser.keys.privateKey;
    const requestOptions = {
      method: 'get',
      url: proxyEndpoint,
      headers: {}};
    await helpers.createHttpSignatureRequest({
      keyId,
      privateKeyPem,
      requestOptions,
    });
    const {headers} = requestOptions;
    // NOTE: critical here that path is empty string and not '/' in order
    // for the `host` header to match what was computed in the HTTPSignature
    const response = await proxyApi.get('', {}, {httpsAgent, headers});
    should.not.exist(response.problem);
    response.data.should.eql(targetSuccessResponse);
  });
  it('successfully proxies a GET request with a query', async () => {
    _nockTargetEndpointGetQuery();
    const {privateKeyPem, publicKey: keyId} =
      mockData.identities.regularUser.keys.privateKey;
    const requestOptions = {
      method: 'get',
      url: proxyEndpoint + '?x=6',
      headers: {}};
    await helpers.createHttpSignatureRequest({
      keyId,
      privateKeyPem,
      requestOptions,
    });
    const {headers} = requestOptions;
    // NOTE: critical here that path is empty string and not '/' in order
    // for the `host` header to match what was computed in the HTTPSignature
    const response = await proxyApi.get('', {x: 6}, {httpsAgent, headers});
    should.not.exist(response.problem);
    response.data.should.eql(targetSuccessResponse);
  });
  it('returns NotAllowedError on unauthorized user', async () => {
    _nockTargetEndpoint();
    const {privateKeyPem, publicKey: keyId} =
      mockData.identities.unauthorizedUser.keys.privateKey;
    const requestOptions = {
      method: 'get',
      url: proxyEndpoint,
      headers: {}};
    await helpers.createHttpSignatureRequest({
      keyId,
      privateKeyPem,
      requestOptions,
    });
    const {headers} = requestOptions;
    // NOTE: critical here that path is empty string and not '/' in order
    // for the `host` header to match what was computed in the HTTPSignature
    const response = await proxyApi.get('', {}, {httpsAgent, headers});
    should.exist(response.problem);
    response.problem.should.equal('CLIENT_ERROR');
    response.data.type.should.equal('NotAllowedError');
  });
});

function _nockTargetEndpoint() {
  // must use a hostname here other than bedrock.localhost, nock intercepts
  // all requests to the given hostname
  nock('https://127.0.0.1:18443')
    .get(targetEndpoint)
    .reply(200, targetSuccessResponse);
}

function _nockTargetEndpointGetQuery() {
  nock('https://127.0.0.1:18443')
    .get(targetEndpoint)
    .query({x: '6'})
    .reply(200, targetSuccessResponse);
}
