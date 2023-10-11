const express = require('express')
const app = express()
require('dotenv').config()
const port  = process.env.PORT
const auth_route = require('./src/routes/auth_route')
const hdl_error = require('./src/middlewares/hdl_error')
const hdl_resource_not_found = require('./src/middlewares/hdl_resource_not_found')
app.use(express.json())


app.use('/auth',auth_route)
app.use(hdl_error)
app.use(hdl_resource_not_found)
app.listen(port,()=>console.log("server operational at port:",port))