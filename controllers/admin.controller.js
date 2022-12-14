const { default: AdminJS } = require('adminjs')
const AdminJSMongoose = require('@adminjs/mongoose')

AdminJS.registerAdapter(AdminJSMongoose)

const AdminResources = require('./user/user.admin')
const { Test } = require('../models/Test')
const { Feedbacks } = require('../models/Feedback')


/** @type {import('adminjs').AdminJSOptions} */

const options = {
    resources: [AdminResources, Test, Feedbacks],
    logoutPath: '/adminlogout',
    loginPath: '/admin/login',
    rootPath: '/admin',
    branding: {
        companyName: 'BukSU CRS'
    }
    // dashboard: {
    //     handler: async () => {

    //     },
    //     component: AdminJS.bundle('./my-dashboard-component')
    //   }
}

module.exports = options