// 创建路由对象，并编写路由，然后导出
const express = require("express")
const axios = require('axios')
const router = express.Router()


router.get("/books/:searchValue/:pageIndex", (req, res) => {
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


router.get("/detail/:bookID", (req, res) => {
  const bookID = req.params.bookID
  console.log("ss")
  axios({
    "method": "GET",
    "url": "http://opac.ahu.edu.cn/Mobile/sjxq",
    "params": {
      "refcode": bookID
    }
  })
    .then(value => value.data)
    .then(html => {
      bookinfo = {}
      bookinfo.name = /<h4>(.*)<\/h4>/.exec(html)[1]
      bookinfo.intro = /<div class="intro">(.*)<\/div>/.exec(html)[1]
      bookinfo.collections = html.match(/<ul class="li_right">(.*?)<\/ul>/sg)
        .map(item => {
          const dict = {}
          const infos = item.match(/<li>(.*?)<\/li>/g)
          dict["索书号"] = infos[0].slice(4, -5)
          dict["馆藏地"] = infos[3].slice(4, -5)
          dict["书刊状态"] = infos[5].slice(4, -5)
          return dict
        })
      return bookinfo
    })
    .then(value => res.json(value))
})

module.exports = router

