/* eslint-disable no-restricted-syntax */
const {
  TranslationServiceClient
} = require('@google-cloud/translate');
const awsConfig = require('../config/awsConfig.js');

async function getClient() {
  const secretString = await awsConfig.getSecret('egps/sample-apps/language-translate-app/google');
  const apiSecretJson = secretString;
  const projectId = 'precise-tenure-312714';
  console.info('Google credential fetched ', apiSecretJson);
  const config = {
    projectId,
    credentials: JSON.parse(apiSecretJson)
  };

  return new TranslationServiceClient(config);
}

async function translateText(text, targetLang, sourceLang) {
// Construct request
  const location = 'global';
  const projectId = 'precise-tenure-312714';
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: 'text/html', // mime types: text/plain, text/html
    sourceLanguageCode: sourceLang,
    targetLanguageCode: targetLang
  };
  let returnVal;
  // Run request
  try {
    const translationClient = await getClient();
    const [response] = await translationClient.translateText(request);
    // eslint-disable-next-line no-restricted-syntax
    for (const translation of response.translations) {
      console.info(`Translation: ${translation.translatedText}`);
      returnVal = translation.translatedText;
      return returnVal;
    }
  } catch (error) {
    console.error('Error occurred in Translate API', error);
  }

  return '';
}

async function getSupportedLanguages() {
  // Construct request
  const location = 'global';
  const projectId = 'precise-tenure-312714';
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    displayLanguageCode: 'en'
  };

  // Get supported languages
  let returnVal;
  try {
    const translationClient = await getClient();
    const [response] = await translationClient.getSupportedLanguages(request);
    returnVal = response.languages;
    for (const language of returnVal) {
      // Supported language code, generally consisting of its ISO 639-1 identifier, for
      // example, 'en', 'ja'. In certain cases, BCP-47 codes including language and
      // region identifiers are returned (for example, 'zh-TW' and 'zh-CN')
      console.log(`Language - Language Code: ${language.languageCode}`);
      // Human readable name of the language localized in the display language specified
      // in the request.
      console.log(`Language - Display Name: ${language.displayName}`);
      // Can be used as source language.
      console.log(`Language - Support Source: ${language.supportSource}`);
      // Can be used as target language.
      console.log(`Language - Support Target: ${language.supportTarget}`);
    }
    return returnVal;
  } catch (error) {
    console.error('Error occurred while fetching supported languages ', error);
  }
  return returnVal;
}

module.exports = {
  translateText,
  getSupportedLanguages
};
