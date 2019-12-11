# CloudTrail-Tracker-UI 

CloudTrail-Tracker-UI is the web portal based on Vue.js that queries the REST API of [CloudTrail-Tracker](https://github.com/grycap/cloudtrail-tracker) to visually show the high-level aggregate information related to the use of resources in AWS by different users based on the events information.

## Requirements

* An existing [Cognito User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) to store the  users, created in your AWS account.

* [npm](https://www.npmjs.com/) installed.

## Deployment

This is a static web application (HTML + CSS + JavaScript) and, therefore, it is expected to be deployed in an S3 bucket as this is the most secure, scalable and cost-effective approach.

1. Create a file named `src/env.js` (see example in `src/env_example.js`) specifying the corresponding values (obtained from the Cognito User Pool).
  
1. Modify the file `src/api.js` to define the API Gateway endpoint on which CloudTrail-Tracker is exposing its REST API.

1. Start a local server to verify the web application:
    ```sh
    npm run dev
    ```
    The web application will be available in `http://localhost:8080`

1. Create the static web site by issuing: 
    ```sh
    npm install
    npm run build
    ```
    The static web site will be available in the `dist` folder.

5. Upload the folder to an [S3 bucket with website configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html).


## Contributing

Before you contributing to this project, you should be familiar with [What is Amazon Cognito](http://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) and [Vue.js](https://vuejs.org/)
