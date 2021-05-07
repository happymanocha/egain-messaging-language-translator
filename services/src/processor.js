const egainClient = require('client/egainApiClient.js')
const googleClient = require('client/googleTranslateClient')

async function translateContent(event, context) {
    console.info('Event received :: ', event);
    let activityId, sourceLang, targetLang;
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
        sourceLang = "en";
        targetLang = "hi";
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
            contents.forEach(function (content) {
                if (content.type == "html") {
                    transcript = content.value;
                }
            });
        } else {
            console.error("Payload missing for activityId ", activityId);
        }
    } else {
        console.error("Activity details could not be fetched for activityId ", activityId);
    }

    if (transcript != '') {
        return googleClient.translateText(transcript, targetLang, sourceLang);
    }
}

module.exports = {
    translateContent
};