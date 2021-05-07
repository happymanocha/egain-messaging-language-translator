const awsConfig = require("../config/awsConfig.js");
const {
    TranslationServiceClient
} = require('@google-cloud/translate');



async function translateText(text, targetLang, sourceLang) {
    const secretString = await awsConfig.getSecret('egps/sample-apps/language-translate-app/google');
    const apiSecretJson = secretString;
    const projectId = 'precise-tenure-312714';
    const location = 'global';
    console.info("Google credential fetched ", apiSecretJson);
    let config = {
        projectId: projectId,
        credentials: JSON.parse(apiSecretJson)
    };
    const translationClient = new TranslationServiceClient(config);
    // Construct request
    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/html', // mime types: text/plain, text/html
        sourceLanguageCode: sourceLang,
        targetLanguageCode: targetLang,
    };

    // Run request
    try {
        const [response] = await translationClient.translateText(request);

        for (const translation of response.translations) {
            console.info(`Translation: ${translation.translatedText}`);
            return translation.translatedText;
        }
    } catch (error) {
        console.error('Error occurred in Translate API', error);
    }

}

module.exports = {
    translateText
}