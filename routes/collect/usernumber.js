// 创建路由对象，并编写路由，然后导出
const express = require("express")
const dayjs = require('dayjs')
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)
const Database = require("@replit/database")
const LZString = require('lz-string')

const db = new Database()
const router = express.Router()


const key = `${dayjs().year()}-${dayjs().week()}`

// 显示所有学号
router.get("/", (req,res) => {
  db.get(key)
  .then(value => LZString.decompress(value))
  .then(value => res.send(value))
})

router.get("/del/thisweek", (req,res) => {
  db.delete(key)
  res.send('delete')
})

router.get("/:studentID", (req, res) => {
  const studentID = req.params.studentID
  db.get(key)
    .then(value => value ?? LZString.compress('[]'))
    .then(value => LZString.decompress(value)) // 解压
    .then(value => new Set(JSON.parse(value))) // JSON字符串转Array转Set
    .then(value => {
      value.add(studentID) // 利用Set元素唯一的特性，不重复录入
      return value
    })
    .then(value => JSON.stringify(Array.from(value))) // Set转Array转JSON字符串
    .then(value => LZString.compress(value)) // 压缩，因为数据库空间有限
    .then(value => db.set(key, value)) // 设置键值
    .then(res.send('ok')) // 返回成功信息
})

module.exports = router