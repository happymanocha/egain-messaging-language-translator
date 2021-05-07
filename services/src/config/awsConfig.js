const SecretManager = require('aws-sdk/clients/secretsmanager');
const SystemManager = require('aws-sdk/clients/ssm');

const ssm = new SystemManager();
const secretClient = new SecretManager({
  region: process.env.AWS_REGION,
});

/**
 * This methods secret value of given secretId from aws secret manager
 * @param {string} secretId
 */
async function getSecret(secretId) {
  console.info(`inside getSecret Method. secretId : ${secretId}`);
  let secretValue = '';
  await secretClient
    .getSecretValue({
      SecretId: secretId
    })
    .promise()
    .then((data) => {
      if ('SecretString' in data) {
        secretValue = data.SecretString;
      } else {
        // eslint-disable-next-line new-cap
        const buff = new Buffer.from(data.SecretBinary, 'base64');
        secretValue = buff.toString('ascii');
      }
    })
    .catch((err) => {
      console.error(
        `error while getting secret value from secret Manager for secretId :${secretId}`,
        err
      );
    });

  return secretValue;
}

/**
 * This method returns all the parameters from parameter store available at given path
 * @param {string} parameterPath
 */
async function getParametersFromStore(parameterPath) {
  console.info(
    `inside getParametersFromStore method.Input parameter path : ${parameterPath}`
  );
  let retVal = [];
  let hasMoreParameters = true;
  let nextToken;
  const req = {
    Path: parameterPath,
    MaxResults: 10
  };
  while (hasMoreParameters) {
    // nextToken is used to fetch next set of parameters
    if (nextToken) req.NextToken = nextToken;
    await ssm
      .getParametersByPath(req)
      .promise()
      // eslint-disable-next-line no-loop-func
      .then((data) => {
        if (data.NextToken) {
          // nextToken is returned if there are more parameters to fetch
          nextToken = data.NextToken;
          hasMoreParameters = true;
        } else {
          hasMoreParameters = false;
        }
        retVal = retVal.concat(data.Parameters);
      })
      .catch((err) => {
        console.error(
          `error while getting parameters from parameter store for path :${parameterPath}`,
          err
        );
      });
  }

  return retVal;
}

module.exports = {
  getSecret,
  getParametersFromStore
};