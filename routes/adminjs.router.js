const { default: AdminJS, useCurrentAdmin } = require('adminjs')
const { buildAuthenticatedRouter } = require('@adminjs/express')
const express = require('express')
const bcrypt = require('bcrypt')
const { Users } = require('../models/User')
const session = require('express-session')
const { default: mongoose } = require('mongoose')
const MongoStore = require('connect-mongo')


/**
 * @param {AdminJS} adminjs
 * @return {express.Router} router
 */
const buildAdminRouter = (admin) => {
  const router = buildAuthenticatedRouter(admin, {
    cookieName: 'admin-access-token',
    cookiePassword: 'process.env.JWT_SECRET',
    authenticate: async (email, password) => {
      const user = await Users.findOne({ email })

      if (user && await bcrypt.compare(password, user.encryptedPassword) && user.role === 1) {
        return user.toJSON()
      }
      return null
    }
  }, null, {
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.LOCAL_MONGODB_URL })
  })
  return router
}

module.exports = buildAdminRouter