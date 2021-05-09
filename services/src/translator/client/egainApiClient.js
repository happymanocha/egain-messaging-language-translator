// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios');
const config = require('../config/constants.js');

// eslint-disable-next-line import/no-dynamic-require
const awsConfig = require(process.env.AWS_REGION
  ? '/opt/nodejs/config/awsConfig.js'
  : '../../../layers/common/nodejs/config/awsConfig.js');
/*
    Fetch the session token for eGain API.
*/
async function getXegainSession() {
  console.info('getXegainSession method');
  const secretString = await awsConfig.getSecret('egps/sample-apps/language-translate-app/egain');
  const apiSecretJson = secretString;
  console.info('eGain credential fetched :: ', apiSecretJson);
  const egainHost = await awsConfig.getParametersFromStore('/egps/sample-apps/language-translate-app/apihost');
  let url = egainHost + config.LOGIN_URL;
  console.info('eGain host fetched :: ', egainHost);
  url = 'http://ussuhvin0360.egeng.info/system/ws/v12/authentication/user/login?forceLogin=yes';
  const requestHeaders = {
    Accept: 'application/json',
    'Accept-Language': 'en-US',
    'Content-Type': 'application/json'
  };
  const requestBody = {
    userName: 'bupacrm',
    password: 'egain123'
  };

  const proxy = {
    host: '10.32.80.123',
    port: 808
  };

  const request = {
    method: 'POST',
    url,
    headers: requestHeaders,
    data: requestBody,
    proxy

  };

  const session = await axios(request)
    .then((resp) => {
      console.log('resp: ', resp.status);
      let xsession;
      if (resp.status === 204) {
        console.log('info', 'User authenticated successfully: ', resp.status);
        xsession = `${resp.headers['x-egain-session']}`;
        console.log('session fetched ', xsession);
      }
      return xsession;
    }).catch((err) => {
      console.log('error', 'error while getting x-egain-session', err);
    });
  return session;
}

/*
    Fetch the eGain activity details which will include live chat transcript
*/
async function getActivityDetails(session, activityId) {
  console.info('getActivityDetails param passed ', session, activityId);
  const requestHeaders = {
    Accept: 'application/json',
    'x-egain-session': session,
    'Accept-Language': 'en-US'
  };
  const url = `http://ussuhvin0360.egeng.info/system/ws/v12/interaction/activity/${activityId}?$attribute=all`;
  const proxy = {
    host: '10.32.80.123',
    port: 808
  };
  const request = {
    method: 'GET',
    url,
    headers: requestHeaders,
    proxy

  };
  const actData = await axios(request)
    .then((resp) => {
      console.log('resp: ', resp.status);
      let response;
      if (resp.status === 200) {
        console.log('info', 'Activity details fetched: ', resp.status);
        response = resp.data;
      }
      return response;
    }).catch((err) => {
      console.error('Error while getting activity details ', err);
    });

  return actData;
}

module.exports = {
  getXegainSession,
  getActivityDetails
};
