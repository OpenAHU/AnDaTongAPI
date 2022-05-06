const usernumberRouter = require("./usernumber")
const searchvalueRouter = require("./searchvalue")
const express = require("express")
const router = express.Router()

router.use("/usernumber", usernumberRouter)
router.use("/searchvalue", searchvalueRouter)

module.exports = router