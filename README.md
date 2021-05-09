# eGainLanguageTranslator
This is sample language translator app integration in eGain
Integrate eGain Advisor Desktop with Language Translation 
Offering multilingual support is no more a choice but a need for geographically dispersed business teams.  Multilingual customer support leads to a better experience for the customer. Firstly, they don't feel shut out from your service, or put off by communication barriers. But beyond the obvious, they also get a quicker and more convenient support journey.  At the same time, business operations want to create cost efficient structure to maximize the agent's time rather than creating separate contact centers for different skills, product and languages. eGain platform provides innovative ways to empower your agents to add external application to help translating the content so that any agent can respond to customer in a language of their choice. This example uses Google translate APIs and provides a simple user interface for agents to translate the content with in eGain Advisor desktop. 

# Architecture 
![LanguageTranslation](https://user-images.githubusercontent.com/83808136/117493376-810a0100-af90-11eb-88e2-90b6d324197f.jpg)


# High level overview of this app architecture

App is configured via eGain tools console for advisor desktop which can be launched for chat activities. 
HTML supposed to be launched from app will be hosted in S3 bucket, https protocol for this hosted page will be provided via API gateway integration.
This HTML will call our API hosted in AWS which will go though API gateway. 
This is an authenticated API so html will pass authentication token which will be validated by our custom authorizer. 
This API is integrated with Lambda which will be in VPC, outside internet access will be via NAT Gateway. 
Lambda will call eGain messaging hub to fetch live chat transcript for activity id which will be passed in API path parameter. 
Once transcript is fetched it will call Google advance translate API to translate content and language detection. 
Translated content will be displayed in the app. 
Other features of this app

App will have an option using which agent can select translated language. By default it will be en-US. 
Advisor will have option to refresh app to get latest transcript content updated. Auto refresh button will be present.  


# Prerequisites
1. Git installed on your computer
2. eGain Cloud agent credentials
3. AWS cloud credentials with permission to access AWS API Gateway, Lambda and all mentioned services from "Additional Information".
4. If VPC is enabled then ensure eGain URL is accessible from Lambda.
5. Required s3 bucket folders 
        1. One bucket for deploying backend code required by SAM template. 
        2. One bucket for deploying UI code. Both buckets can be same, we can provide different folder path to avoid confusion.
6. IAM role with permissions on all required AWS service. Sample IAM role json file is attached in docs section. 
7. AWS CLI, please refer https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html to install and configure AWS CLI. This will be used to upload UI code in S3      bucket. 
8. SAM CLI, please refer https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-windows.html to install and configure SAM      CLI
9. You need to run the 'aws configure' to configure the aws profile for deployment


# Installation 
**Notes**: Steps mentioned below are for windows environment but can be followed in similar fashion for other OS too. 

1. Clone this repository
2. Edit the egain-language-translator-config.properties file with appropriate parameters. Proxy details will be required if access to internet is via proxy, if not then keep the fields empty.

| Property  | Description |
| ------------- | ------------- |
| AWS_REGION  | Region where the application will be deployed  |
| CODE_DEPLOY_BUCKET  | S3 bucket where code will be deployed and output will be stored |
| UI_HOST_BUCKET | Full path for S3 bucket where UI elements will be hosted  |
| LAMBDA_MASTER_ROLE | ARN of lambda role created with the mentioned policy |
| EGAIN_API_USERNAME | eGain agent username with all required permissions |
| EGAIN_API_PASSWORD  | eGain agent password |
| PROXY_IP  | Proxy IP address to connect to internet from lambda which will be in VPC, keep it empty if not applicable |
| PROXY_PORT  | Proxy IP address to connect to internet from lambda which will be in VPC, keep it empty if not applicable |
| DISABLE_PROXY  | True/False based on proxy requirement |
| VPC_ID  | AWS VPC ID - used for Lambda configuration. Keep it empty if not applicable |
| SECURITY_GROUP_ID  | Security group related to VPC - used for Lambda configuration. Keep it empty if not applicable |
| SUBNET_IDS  | Subnets related to VPC - used for Lambda configuration. Keep it empty if not applicable|
3. Open windows command prompt , execute egain-language-translator-deploy.sh file to start the deployment.


# Post Installation
1. Installation will upload UI code in dedicated S3 bucket but access to this S3 bucket needs to be configured manually depending on user preferences. 
    1. Expose your hosted UI in s3 bucket via cloudfront.
    2. Use API gateway S3 integration to access S3 bucket. Refer docs section for more info on how to do this. 
    3. Else use s3 bucket directly to access but it will be without https protocol. 
2. Copy the url of our hosted html from step above and then login to eGain Management console with your partition credentials. 
3. Go to tools console then Tools-> Partition:default -> Business Objects -> Attribute Settings -> Screen -> Toolbar
4. Configure the new button for advisor desktop using the URL, refer below screenshot. 
![image](https://user-images.githubusercontent.com/83808136/117493581-cc241400-af90-11eb-8f17-db0cc118895b.png)

 

# Verification
As a part of post deployment verification we can ensure working end to end functionality and check if all resources are deployed properly. For functionality testing refer below steps: 

1. Login into eGain advisor desktop with your agent credentials and mark yourself available for chat. 
2. Launch a eGain chat as customer. Refer eGain admin guide for detailed process. 
3. Once activity is assigned to your agent then select it, after that button configured in step 4 of post installation step will be visible on your info pane. 
4. This button will launch language translator for live chat or email in eGain. Refer docs section for screenshot of this integration. 

This package will deploy following components 
1. 2 Lambdas 
                1. egain-language-translator
                2. egain-supported-languages

2. 2 Layers
        1. egps-sample-app-language-translation-common
        2. egps-sample-app-language-translation-dependencies

3. 1 API with 2 paths
        1. Get : /translate
        2. Get : /languages

4. UI hosted in s3 bucket
5. Secret manager for google and egain credentials
6. Parameter store for other configurations. 

# Maintenance
1. All secret information like google translate API credentials, eGain agent credentials are stored in AWS secret manager. So if rotations of keys are required then it can be directly done via this. 
2. API created through this deployment process which is consumed in our html does support CORS but it allows all origins, in case we want to restrict it then same can configured via Lambda directly. 

# Additional Information
This Integration leverage the below services from AWS

1. AWS Lambda - Processed chat transcripts and consuming google translate API to translate content
2. Amazon Secrets Manager - Stores required sensitive information 
3. Parameter Store - Stores required parameters
4. S3 bucket - To host html page
5. API Gateway - to access html and APIs
6. Secret Manager - to store Google API credentials
7. Parameter Store- to store configuration details 
8. IAM Role - for controlling access
9. Amazon Cloud Watch  - For AWS services logging. 
