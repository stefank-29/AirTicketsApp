const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminMongoose = require('admin-bro-mongoose')
const User = require('../models/User')
const mongoose = require('mongoose');

AdminBro.registerAdapter(AdminMongoose)

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
  resources: [
    { resource: User}],
})
const ADMIN = {
    username: 'admin@example.com',
    password: 'admin'
}



const router = AdminBroExpress.buildAuthenticatedRouter(adminBro,{
    cookieName: process.env.ADMIN || 'admin',
    cookiePassword: process.env.ADMINPASSOWRD || 'adminamdinadmin',
    authenticate: async (username,password) => {
        if(username === ADMIN.username && password === ADMIN.password) {
            return ADMIN
        }
        return null;
            
    } 

},null , {
    resave:false,
    saveUninitialized:true,
});

module.exports = router;