const { default: AdminJS } = require('adminjs')
const AdminJSMongoose = require('@adminjs/mongoose')

AdminJS.registerAdapter(AdminJSMongoose)

const AdminResources = require('./user/user.admin')
const { Test } = require('../models/Test')
const { Feedbacks } = require('../models/Feedback')
const { Reports } = require('../models/Report')


/** @type {import('adminjs').AdminJSOptions} */

const options = {
    resources: [AdminResources, Test, Feedbacks, Reports],
    logoutPath: '/adminlogout',
    loginPath: '/admin/login',
    rootPath: '/admin',
    branding: {
        companyName: 'BukSU CRS',
        softwareBrothers: false,
    },

    locale: {
        translations: {
            messages: {
                loginWelcome: 'Administration Panel - Login' // the smaller text
            },
            labels: {
                loginWelcome: 'BukSU CRS Admin Page', // this could be your project name
            },
        }
    }
    // dashboard: {
    //     handler: async () => {

    //     },
    //     component: AdminJS.bundle('./my-dashboard-component')
    //   }
}

module.exports = options