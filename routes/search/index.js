const bookRouter = require("./book")
const express = require("express")
const router = express.Router()

router.use("/book", bookRouter)

module.exports = router