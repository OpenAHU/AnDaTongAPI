// 创建路由对象，并编写路由，然后导出
const express = require("express")
const Database = require("@replit/database")

const db = new Database()
const router = express.Router()



// 显示所有
router.get("/", (req,res) => {
  db.get("books")
  .then(value => JSON.stringify(value))
  .then(value => res.send(value))
})

module.exports = router