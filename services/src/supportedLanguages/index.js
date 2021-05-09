// eslint-disable-next-line import/no-dynamic-require
const googleClient = require(process.env.AWS_REGION
  ? '/opt/nodejs/client/googleTranslateClient.js'
  : '../../../layers/common/nodejs/client/googleTranslateClient.js');

exports.lambdaHandler = async () => {
  const response = {};
  response.headers = {
    'Access-Control-Allow-Headers': 'Content-Type,Accept',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
  };
  response.body = 'Error occurred';
  try {
    const languages = await googleClient.getSupportedLanguages();
    if (languages) {
      response.body = JSON.stringify(languages);
      response.statusCode = 200;
    }
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
  }
  return response;
};
