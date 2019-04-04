/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const async = require('async');
const brIdentity = require('bedrock-identity');
const brKey = require('bedrock-key');
const database = require('bedrock-mongodb');
const httpSignatureHeader = require('http-signature-header');
const signatureAlgorithms = require('signature-algorithms');
const {util: {uuid}} = require('bedrock');

const api = {};
module.exports = api;

api.createHttpSignatureRequest = async function createHttpSignatureRequest({
  keyId, requestOptions, additionalIncludeHeaders = [],
  privateKeyPem
}) {
  if(!requestOptions.headers.date) {
    requestOptions.headers.date = new Date().toUTCString();
  }
  const includeHeaders = additionalIncludeHeaders.concat(
    ['date', 'host', '(request-target)']);
  const plaintext = httpSignatureHeader.createSignatureString(
    {includeHeaders, requestOptions});
  const authzHeaderOptions = {includeHeaders, keyId};
  const cryptoOptions = {
    plaintext,
    algorithm: 'rsa',
    hashType: 'sha256',
    privateKeyPem
    // algorithm: 'ed25519',
    // privateKeyBase58
  };
  authzHeaderOptions.signature = await signatureAlgorithms.sign(cryptoOptions);
  requestOptions.headers.Authorization = httpSignatureHeader.createAuthzHeader(
    authzHeaderOptions);
};

api.createIdentity = function(userName) {
  const newIdentity = {
    id: `urn:uuid:${uuid()}`,
    email: userName + '@bedrock.localhost',
  };
  return newIdentity;
};

api.removeCollection = function(collection, callback) {
  const collectionNames = [collection];
  database.openCollections(collectionNames, () => {
    async.each(collectionNames, function(collectionName, callback) {
      database.collections[collectionName].remove({}, callback);
    }, function(err) {
      callback(err);
    });
  });
};

api.removeCollections = function(callback) {
  const collectionNames = ['identity', 'eventLog', 'publicKey'];
  database.openCollections(collectionNames, () => {
    async.each(collectionNames, (collectionName, callback) => {
      database.collections[collectionName].remove({}, callback);
    }, function(err) {
      callback(err);
    });
  });
};

api.createKeyPair = function(options) {
  const userName = options.userName;
  const publicKey = options.publicKey;
  const privateKey = options.privateKey;
  let ownerId = null;
  if(userName === 'userUnknown') {
    ownerId = '';
  } else {
    ownerId = options.userId;
  }
  const newKeyPair = {
    publicKey: {
      '@context': 'https://w3id.org/security/v2',
      id: ownerId + '/keys/1',
      // type: 'CryptographicKey',
      type: 'RsaVerificationKey2018',
      owner: ownerId,
      label: 'Signing Key 1',
      publicKeyPem: publicKey
    },
    privateKey: {
      type: 'CryptographicKey',
      owner: ownerId,
      label: 'Signing Key 1',
      publicKey: ownerId + '/keys/1',
      privateKeyPem: privateKey
    }
  };
  return newKeyPair;
};

api.prepareDatabase = function(mockData, callback) {
  async.series([
    callback => {
      api.removeCollections(callback);
    },
    callback => {
      insertTestData(mockData, callback);
    }
  ], callback);
};

// Insert identities and public keys used for testing into database
function insertTestData(mockData, callback) {
  // const accountInsert = callbackify(brAccount.insert);
  async.forEachOf(mockData.identities, function(identity, key, callback) {
    async.parallel([
      function(callback) {
        brIdentity.insert({
          actor: null,
          identity: identity.identity,
          meta: identity.meta,
        }, callback);
      },
      function(callback) {
        brKey.addPublicKey(
          {actor: null, publicKey: identity.keys.publicKey}, callback);
      }
    ], callback);
  }, function(err) {
    if(err) {
      if(!database.isDuplicateError(err)) {
        // duplicate error means test data is already loaded
        return callback(err);
      }
    }
    callback();
  }, callback);
}
