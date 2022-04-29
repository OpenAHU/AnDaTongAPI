// 创建路由对象，并编写路由，然后导出
const express = require("express")
const axios = require('axios')
const router = express.Router()


router.get("/:searchValue/:pageIndex", (req, res) => {
  const searchValue = req.params.searchValue
  const pageIndex = req.params.pageIndex
  axios({
    "method": "POST",
    "url": "http://opac.ahu.edu.cn/Mobile/jdjs",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    },
    "data": `str=${searchValue}&pageidx=${pageIndex}`
  })
    .then(value => value.data)
    .then(data => usefulbookinfo(data))
    .then(value => res.json(value))

  function usefulbookinfo(data) {
    return data.map(item => {
      const dict = {}
      dict.name = item.C200A
      dict.author = item.C200F
      dict.year = item.C210D
      dict.publish = item.C210C
      dict.id = item.REFCODE
      return dict
    })
  }
})

module.exports = router

