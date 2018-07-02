#CloudTrail-Tracker-UI 

CloudTrail-Tracker-UI is the web portal based on Vue.js that queries the REST service of the CloudTrail-Tracker tool to visually show the high-level aggregate information related to the use of resources in AWS by different users based on the events information.


Before you start have a read over [What is Amazon Cognito](http://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) and [Vue.js](https://vuejs.org/)?

To use this application it is necessary to create a Cognito Pool to store your users and change the values that appear in the file env_example.js (the file should be called env.js) with those that correspond with your Cognito User Pool.