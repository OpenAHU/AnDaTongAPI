const usernumberRouter = require("./usernumber")
const express = require("express")
const router = express.Router()

router.use("/usernumber", usernumberRouter)

module.exports = router