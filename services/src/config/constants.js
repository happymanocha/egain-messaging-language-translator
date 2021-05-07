const awsConfig = require("../config/awsConfig.js");
const egainHost = awsConfig.getParametersFromStore('/egps/sample-apps/language-translate-app/apihost');
const props = {
    ACTIVITY_PATH: '/system/ws/v19/apps/interaction/activity/',
    LOGIN_URL: '/system/ws/v12/authentication/user/login?forceLogin=Yes'
}
module.exports = {
    props,
    egainHost
};