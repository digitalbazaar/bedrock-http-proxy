/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const helpers = require('./helpers');

const mock = {};
module.exports = mock;

const identities = mock.identities = {};
let userName;

// identity with proper permissions
userName = 'regularUser';
identities[userName] = {};
identities[userName].identity = helpers.createIdentity(userName);
identities[userName].meta = {
  sysResourceRole: [{
    sysRole: 'bedrock-http-proxy-test.regular',

    // FIXME: should some resource ID be specified for this, maybe
    // the proxy endpoint?  Maybe proxy endpoints have some UUID type id
    // associated with them?  `urn:uuid:<uuid>` ??
    // generateResource: 'id'
  }]
};
identities[userName].keys = helpers.createKeyPair({
  userName,
  userId: identities[userName].identity.id,
  publicKey: '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqv8gApfU3FhZx1gyKmBU\n' +
    'czZ1Ba3DQbqcGRJiwWz6wrr9E/K0PcpRws/+GPc1znG4cKLdxkdyA2zROUt/lbaM\n' +
    'TU+/kZzRh3ICZZOuo8kJpGqxPDIm7L1lIcBLOWu/UEV2VaWNOENwiQbh61VJlR+k\n' +
    'HK9LhQxYYZT554MYaXzcSRTC/RzHDTAocf+B1go8tawPEixgs93+HHXoLPGypmqn\n' +
    'lBKAjmGMwizbWFccDQqv0yZfAFpdVY2MNKlDSUNMnZyUgBZNpGOGPm9zi9aMFT2d\n' +
    'DrN9fpWMdu0QeZrJrDHzk6TKwtKrBB9xNMuHGYdPxy8Ix0uNmUt0mqt6H5Vhl4O0\n' +
    '0QIDAQAB\n' +
    '-----END PUBLIC KEY-----\n',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEpQIBAAKCAQEAqv8gApfU3FhZx1gyKmBUczZ1Ba3DQbqcGRJiwWz6wrr9E/K0\n' +
    'PcpRws/+GPc1znG4cKLdxkdyA2zROUt/lbaMTU+/kZzRh3ICZZOuo8kJpGqxPDIm\n' +
    '7L1lIcBLOWu/UEV2VaWNOENwiQbh61VJlR+kHK9LhQxYYZT554MYaXzcSRTC/RzH\n' +
    'DTAocf+B1go8tawPEixgs93+HHXoLPGypmqnlBKAjmGMwizbWFccDQqv0yZfAFpd\n' +
    'VY2MNKlDSUNMnZyUgBZNpGOGPm9zi9aMFT2dDrN9fpWMdu0QeZrJrDHzk6TKwtKr\n' +
    'BB9xNMuHGYdPxy8Ix0uNmUt0mqt6H5Vhl4O00QIDAQABAoIBAQCpA3yXM42AsY8j\n' +
    'mwgSnJ48NqJaF5L8P7+UhHi6KMZ+fSYydl0zCevge4bzFD3JrNuZ8VD1b57AxejT\n' +
    'Ec2so/9vVxjJi1AK6WR3FA608rumGJLQJd4Vd2ojfxabTeWOKOo642R/LSFpPzVE\n' +
    'T0toqxqiA53IhxhAc2jDLO+PLIvrao0Y8bWWq36tbxsAplrv8Gms6ZRwfKoX5P32\n' +
    'azBpJOqneNdSMRPHky6t2uiYyuPeG9pbuaClkD7Ss9lpH0V1DLQmAAlP9I0Aa06B\n' +
    'a9zPFPb3Ae8F0HO/tsf8gIvrlT38JvLe5VuCS7/LQNCZguyPZuZOXLDmdETfm1FD\n' +
    'q56rCV7VAoGBANmQ7EqDfxmUygTXlqaCQqNzY5pYKItM6RFHc9I+ADBWsLbuKtfP\n' +
    'XUMHQx6PvwCMBpjZkM7doGdzOHb0l3rW8zQONayqQxN9Pjd7K+dkSY6k0SScw46w\n' +
    '0AexDQSM/0ahVAHfXXi1GbKwlonM0nn/7JHz7n/fL9HwV8T3hAGClbPDAoGBAMk0\n' +
    'K5d+Ov55sKW0ZatZ0vTnfBCSrVEfG6FkcyK7uiSsMdWo2/De0VtJF7od2DM5UyP6\n' +
    'Y/DSVk4oPepbug5oGdu8t1Q3jbS61A7i/dssirQC4hEFAtoTGsVfaH8wu4AKyWd7\n' +
    '0rUmSrnyqNr4mfQBjdaXByvWO9rdEfZcZqaSQ4/bAoGAKy/CR7Q8eYZ4Z2eoBtta\n' +
    'gPl5rvyK58PXi8+EJRqbjPzYTSePp5EI8TIy15EvF9uzv4mIXhfOLFrJvYsluoOK\n' +
    'eS3M575QXEEDJZ40g9T7aO48eakIhH2CfdReQiX+0jVZ6Jk/A6PnOvokl6vpp7/u\n' +
    'ZLZoBEf4RRMRSQ7czDPwpWMCgYEAlNWZtWuz+hBMgpcqahF9AprF5ICL4qkvSDjF\n' +
    'Dpltfbk+9/z8DXbVyUANZCi1iFbMUJ3lFfyRySjtfBI0VHnfPvOfbZXWpi1ZtlVl\n' +
    'UZ7mT3ief9aEIIrnT79ezk9fM71G9NzcphHYTyrYi3pAcAZCRM3diSjlh+XmZqY9\n' +
    'bNRfU+cCgYEAoBYwp0PJ1QEp3lSmb+gJiTxfNwIrP+VLkWYzPREpSbghDYjE2DfC\n' +
    'M8pNbVWpnOfT7OlhN3jw8pxHWap6PxNyVT2W/1AHNGKTK/BfFVn3nVGhOgPgH1AO\n' +
    'sObYxm9gpkNkelXejA/trbLe4hg7RWNYzOztbfbZakdVjMNfXnyw+Q0=\n' +
    '-----END RSA PRIVATE KEY-----\n'
});

// identity with without proper permissions
userName = 'unauthorizedUser';
identities[userName] = {};
identities[userName].identity = helpers.createIdentity(userName);
// no role is assigned to this user
identities[userName].meta = {};
identities[userName].keys = helpers.createKeyPair({
  userName,
  userId: identities[userName].identity.id,
  publicKey: '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtLvDzQWHfiICNmP4nkz1\n' +
    '+UtqDZZHpbk86MF33D4EL5ftbjVo/hB9Tk13zB7C3amdXSSx2bQUcwZmp2Yfonpq\n' +
    'na3yyQkN3wxMYDYP6umIrL18KCJgZ/gV91Rbe+Rfp+uYoiLHd5diUhSVkhhL1pAG\n' +
    'vEiYiFq4fKzCpM9oC4cv3DoL2nkapdamNsXIAePvn5tReJt6olLhusfEQm+T1zqa\n' +
    'oRTelP4yg5/RdJzJ0oSQy06cJWqprPjZaaOMtOjdBUQEu1wBX6DrYFCp741lj/iL\n' +
    'rURl8FHHkDgjA0T6vfkZOW9uuO9BC0VgvFo+9N/UHRhQtQMStLqa8J7avW2gAvV3\n' +
    'EQIDAQAB\n' +
    '-----END PUBLIC KEY-----\n',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEpAIBAAKCAQEAtLvDzQWHfiICNmP4nkz1+UtqDZZHpbk86MF33D4EL5ftbjVo\n' +
    '/hB9Tk13zB7C3amdXSSx2bQUcwZmp2Yfonpqna3yyQkN3wxMYDYP6umIrL18KCJg\n' +
    'Z/gV91Rbe+Rfp+uYoiLHd5diUhSVkhhL1pAGvEiYiFq4fKzCpM9oC4cv3DoL2nka\n' +
    'pdamNsXIAePvn5tReJt6olLhusfEQm+T1zqaoRTelP4yg5/RdJzJ0oSQy06cJWqp\n' +
    'rPjZaaOMtOjdBUQEu1wBX6DrYFCp741lj/iLrURl8FHHkDgjA0T6vfkZOW9uuO9B\n' +
    'C0VgvFo+9N/UHRhQtQMStLqa8J7avW2gAvV3EQIDAQABAoIBAQCmkHF4jwL7RP6D\n' +
    'AAmOYuFCmrUnxntLiXdQD5WWffU/o6YnLsQPekTxmEWy8hqnTP2BbSMXv3YlOB39\n' +
    'Ywn+pRGDNmAN1PFawivVc52h4w6aHJvDJUNyLlqYMb+KY8Ogr2lg6+qnFfaALQZX\n' +
    'uVqTaPM8LS+eYvWpuVI9sAR0s2dxbuR8Ws1VeTxtDMY3k5K7siYgANwb/VbTH6IT\n' +
    'Ft100gTx5RJfDh4ePOsQn/i6qM4tKZBcbZwv9asce/lYlJXivPdySJL9Cd9+4pe4\n' +
    'esF8VPn6qCsK2EPXEA6nIRObBTX4E/dRcfXd3hiQ3mtghaFn9GWv0Y8EEZUDDmV7\n' +
    'Huh+EvqRAoGBAOQHzatP1GGisjrArfsgX/y+lAwuRchEtMe+pP3KnTt2NH7vwmMm\n' +
    'p+pQVgBqndiGHjc/0dJeLqW7kSRIk3UThPnuNWoI99AM/JHESAjqiPJff0dghCgk\n' +
    'pitR7ssIg7iZg76y/sXzi+bALfKxKwl5HnZiTG+HJLH4y/ch2e1zd2qFAoGBAMrm\n' +
    '06Ag0VfxXU8GHDr8bJzPU9RgcBTcSqqdpoxaW/KS4ED5qpT8LI1RSOeMGY+i1uEi\n' +
    'n3AQf1zbLW3O1Pt52lzXIMdwPYpR0s4y4ZjAczaDzBsNXe1pPU0FYfUu99IrCmO0\n' +
    'ED82Tz7hLInYehOBiga5eW84WUp65rxRrWjmaK4dAoGAQtCyh+bdQTqN5L8+e13y\n' +
    'IjmpYaRRWCwhmIGZELBEv/6TxTn1iF30R6kAeiDDXYV25xNxJKXqHy/FiI8nfd+Z\n' +
    'UC5nQkmcaz7S5tdPkCVAuVwYDE8Qij6q3fik8qLtDbMVslP6aQBC1vsqu3kENkNi\n' +
    'FKga43cC3o8bHK+zjmsN640CgYAJ+asx1is0naMuvWgp5jsYwoCmkk8wV1w8Yx/L\n' +
    'Cq42kM4Bo8SlKniuQe7Jo3OmQiU6UE9yXP1F/WiQW3jRHD6GDfWImJYN9NPeW1YI\n' +
    'An4nkfc45UFW6LOg08DrIvIAHSmXmUSrNupSdxOPe1sVFmtIxVmZBDYvmTc6zvEt\n' +
    'lRZUaQKBgQDfN/4OB5rVunnhXH9MBcddFcUvhjsoLlqGh29TsYC/DiYTpl7glJVt\n' +
    'C/In+4WDYV6pjBh7JA5xGLJxQa6Vjlhx5R4UxY30TkPzFs1hoASLHz7I3nehfMUX\n' +
    '4xaogVrk3vd/jDczzroXhYXuiWTW2ATB6edTu7GyVDzsfCxjnCT6Iw==\n' +
    '-----END RSA PRIVATE KEY-----\n'
});
