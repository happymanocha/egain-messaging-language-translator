const egainClient = require('./client/egainApiClient.js');

// eslint-disable-next-line import/no-dynamic-require
const googleClient = require(process.env.AWS_REGION
  ? '/opt/nodejs/client/googleTranslateClient.js'
  : '../../../layers/common/nodejs/client/googleTranslateClient.js');

async function translateContent(event) {
  console.info('Event received :: ', event);
  let activityId; let sourceLang; let
    targetLang;
  let response;
  if (event.queryStringParameters) {
    const params = event.queryStringParameters;
    console.info('Query parameters ::', params);
    activityId = params.activityId;
    sourceLang = params.source;
    targetLang = params.target;
  }
  /* This is for testing purpose will be removed later */
  if (!activityId) {
    activityId = 1643;
    sourceLang = 'en';
    targetLang = 'hi';
  }
  const session = await egainClient.getXegainSession();
  let actDetails;
  if (session) {
    actDetails = await egainClient.getActivityDetails(session, activityId);
  }
  let transcript = '';
  if (actDetails) {
    if (actDetails.activity[0].payload) {
      const contents = actDetails.activity[0].payload.chat.transcript.content;
      contents.forEach((content) => {
        if (content.type === 'html') {
          transcript = content.value;
        }
      });
    } else {
      console.error('Payload missing for activityId ', activityId);
    }
  } else {
    console.error('Activity details could not be fetched for activityId ', activityId);
  }

  if (transcript !== '') {
    response = googleClient.translateText(transcript, targetLang, sourceLang);
  }

  return response;
}

module.exports = {
  translateContent
};
