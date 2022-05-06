// 创建路由对象，并编写路由，然后导出
const express = require("express")
const axios = require('axios')
const router = express.Router()
const Database = require("@replit/database")
const db = new Database()


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
    .then(async data => await booksinfo(data))
    .then(value => res.json(value))
    .catch(error => console.log(error))

  async function booksinfo(data) {
    return await Promise.all(data.map(async item => {
      const dict = {}
      dict.name = item.C200A
      dict.author = item.C200F
      dict.year = item.C210D
      dict.publish = item.C210C
      dict.total = item.C
      dict.available = item.C1
      dict.id = item.REFCODE
      dict.isbn = item.CISBN
      dict.imgurl = await db.get(dict.isbn)
      if (!dict.imgurl) {
        await axios({
          "method": "GET",
          "url": "http://douban.com/isbn/" + dict.isbn,
          "headers": {
            "Cookie": "bid=m-J05VnJJQk; viewed=\"1077847\""
          }
        })
          .then(res => res.data)
          .then(data =>
          {
            zzimgurl = data.match(/<meta property="og:image" content="(.*)" \/>/)
            dict.imgurl = zzimgurl.length ? zzimgurl[1] : null
            db.set(dict.isbn, dict.imgurl)
          }
        )
          .catch(error => console.log(error))
      }
      return dict
    })
    )
  }
})


router.get("/detail/:bookID", (req, res) => {
  const bookID = req.params.bookID
  axios({
    "method": "GET",
    "url": "http://opac.ahu.edu.cn/Mobile/sjxq",
    "params": {
      "refcode": bookID
    }
  })
    .then(value => value.data)
    .then(html => abookinfo(html))
    .then(value => res.json(value))
    .catch(error => console.log(error))


  function abookinfo(html) {
    const bookinfo = {}
    bookinfo.name = /<h4>(.*)<\/h4>/.exec(html)[1]
    bookinfo.collections = html.match(/<ul class="li_right">(.*?)<\/ul>/sg)
      .map(item => collectinfo(item))
    return bookinfo

    function collectinfo(item) {
      const dict = {}
      const infos = item.match(/<li>(.*?)<\/li>/g)
      dict["索书号"] = infos[0].slice(4, -5)
      dict["馆藏地"] = infos[3].slice(4, -5)
      dict["书刊状态"] = infos[5].slice(4, -5)
      return dict
    }
  }
})

module.exports = router
