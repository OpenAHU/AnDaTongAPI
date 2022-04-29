// 创建路由对象，并编写路由，然后导出
const express = require("express")
const dayjs = require('dayjs')
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)
const Database = require("@replit/database")
const LZString = require('lz-string')

const db = new Database()
const router = express.Router()


// 显示本周人数
router.get("/", (req, res) => {
  const key = `${dayjs().year()}-${dayjs().week()}`
  db.get(key)
    .then(value => value ?? LZString.compress('[]'))
    .then(value => LZString.decompress(value)) // 解压缩
    .then(value => JSON.parse(value)) // 从json字符串转为数组
    .then(value => value.map(item => item.split('_')[0])) // 提取出学号
    .then(value => new Set(value)) // 通过Set去重
    .then(value => value.size) // 通过size属性获取个数
    .then(value => res.json([key, value]))
})

// 显示指定周学号
router.get("/:akey", (req, res) => {
  const akey = req.params.akey
  db.get(akey)
    .then(value => value ?? LZString.compress('[]'))
    .then(value => LZString.decompress(value)) // 解压缩
    .then(value => JSON.parse(value)) // 从json字符串转为数组
    .then(value => value.map(item => item.split('_')[0])) // 提取出学号
    .then(value => new Set(value)) // 通过Set去重
    .then(value => value.size) // 通过size属性获取个数
    .then(value => res.json([akey, value]))
})

module.exports = router