// eslint-disable-next-line import/no-dynamic-require
const awsConfig = require(process.env.AWS_REGION
  ? '/opt/nodejs/config/awsConfig.js'
  : '../../../layers/common/nodejs/config/awsConfig.js');
const egainHost = awsConfig.getParametersFromStore('/egps/sample-apps/language-translate-app/apihost');
const props = {
  ACTIVITY_PATH: '/system/ws/v19/apps/interaction/activity/',
  LOGIN_URL: '/system/ws/v12/authentication/user/login?forceLogin=Yes'
};
module.exports = {
  props,
  egainHost
};
