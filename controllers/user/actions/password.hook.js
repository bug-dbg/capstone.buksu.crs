const bcrypt = require('bcrypt')
const AdminJS = require('adminjs')

/** @type {AdminJS.After<AdminJS.ActionResponse>} */

const after = async (response) => {
    if(response.record && response.record.errors) {
        response.record.errors.password = response.record.errors.encryptedPassword
    }
    return response
}

/** @type {AdminJS.Before<AdminJS.ActionResponse>} */

const before = async (request) => {
    if(request.method === 'post') {
        const { password, ...otherParams } = request.payload;

        if(password) {
            const encryptedPassword = await bcrypt.hash(password, 10)

            return {
                ...request,
                payload: {
                    ...otherParams,
                    encryptedPassword,
                }
            }
        }
    }
    return request
}

// admin.js custom actions to automatically load an api key


module.exports = { after, before }