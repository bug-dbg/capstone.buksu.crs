const { default: AdminJS } = require('adminjs')
const AdminJSMongoose = require('@adminjs/mongoose')

AdminJS.registerAdapter(AdminJSMongoose)

const AdminResources = require('./user/user.admin')
const { Test } = require('../models/Test')
const { Feedbacks } = require('../models/Feedback')
const { Reports } = require('../models/Report')
const { Users } = require('../models/User')


/** @type {import('adminjs').AdminJSOptions} */



const options = {
    resources: [AdminResources, Test, Feedbacks, Reports],
    logoutPath: '/adminlogout',
    loginPath: '/admin/login',
    rootPath: '/admin',
    branding: {
        companyName: 'BukSU CRS',
        softwareBrothers: false,
        // logo: '../img/logo/logo.png',
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
    },

    // custom admin.js dashboard
    // dashboard: {
    //     handler: async () => {
    //         // Asynchronous code where you, e. g. fetch data from your database
    
    //         return { message: 'Hello World' }
    //     }, 
    //     component: AdminJS.bundle('./components/dashboard'),
    //   }

}

module.exports = options