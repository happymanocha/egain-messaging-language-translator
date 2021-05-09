const processor = require('./processor.js');

exports.lambdaHandler = async (event) => {
  const response = {};
  response.headers = {
    'Access-Control-Allow-Headers': 'Content-Type,Accept',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
  };
  let translatedContent = 'Error occurred';
  try {
    translatedContent = await processor.translateContent(event);
    response.statusCode = 200;
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
  }
  response.body = JSON.stringify({
    contentHtml: translatedContent
  });

  return response;
};
