const AdminJS = require('adminjs')
const { Users } = require('../../models/User')
const { 
    after: passwordAfterHook, 
    before: passwordBeforeHook, 
} = require('./actions/password.hook')

/** @type {AdminJS.ResourceOptions} */

const options = {
    properties: {
        encryptedPassword: {
           isVisible: false,
       },
       password: {
           type: 'password'
       }
    },
    actions: {
        new: {
            after: passwordAfterHook, 
            before: passwordBeforeHook, 
        },
        edit: {
            after: passwordAfterHook, 
            before: passwordBeforeHook, 
        }
    }

}

module.exports = {
    options,
    resource: Users,
}