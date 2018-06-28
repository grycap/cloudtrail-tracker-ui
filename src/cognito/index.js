import Vue from 'vue'
import CognitoAuth from './cognito'
import config from '../env.js'


Vue.use(CognitoAuth, config.COGNITO)

export default new CognitoAuth()
