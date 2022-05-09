// 创建路由对象，并编写路由，然后导出
const express = require("express")
const axios = require('axios')
const router = express.Router()
const Database = require("@replit/database")
const db = new Database()

/**
 * 从安徽大学图书馆网站获取书籍搜索结果
 * @param {string} searchValue 查询关键词
 * @param {number} pageIndex 查询页码
 */
router.get("/books/:searchValue/:pageIndex", (req, res) => {
  // 搜索关键词
  const searchValue = req.params.searchValue
  // 更新数据库
  whattheirsearch(searchValue)
  const pageIndex = req.params.pageIndex
  axios({
    "method": "POST",
    "url": "http://opac.ahu.edu.cn/Mobile/jdjs",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    },
    "data": `str=${searchValue}&pageidx=${pageIndex}`
  })
    // 获取响应数据
    .then(value => value.data)
    // 处理书籍信息，包括从豆瓣搜索书籍封面
    .then(async data => await booksinfo(data))
    // 发送响应数据，即查到的结果
    .then(value => res.json(value))
    .catch(error => console.log(error))

  /**
   * 创建或更新书籍查询记录数据库
   * @param {string} searchValue 查询书籍关键词
   */
  function whattheirsearch(searchValue) {
    // 记录搜索的关键词和搜索发生的时间
    const searchInfo = {
      keyword: searchValue,
      searchTime: new Date().toLocaleDateString()
    }
    db.get("books").then(books => {
      // db 中存在 'books' 数据
      if (books) {
        // 更新 'books' 数据库
        books = JSON.parse(books)
        books.push(searchInfo)
      }
      // db中不存在 'books' 数据，则创建。
      else {
        books = [searchInfo]
      }
      return books
    })
      // 序列化后存入数据库
      .then(books => JSON.stringify(books))
      .then(books => { db.set("books", books) })
      .catch(error => console.log(error))
  }

  /**
   * 处理搜索结果
   * @param {ReturnData<searchBooksFromAhuLibrary>} data 搜索结果
   * @returns 
   */
  async function booksinfo(data) {
    return await Promise.all(data.map(async item => {
      // 搜索结果数据处理
      const dict = {}
      dict.name = item.C200A
      dict.author = item.C200F
      dict.year = item.C210D
      dict.publish = item.C210C
      dict.total = item.C
      dict.available = item.C1
      dict.id = item.REFCODE
      dict.isbn = item.CISBN
      // 从数据库调取书籍封面
      dict.imgurl = await db.get(dict.isbn)
      // 如果不存在，则从豆瓣获取封面
      if (!dict.imgurl) {
        await axios({
          "method": "GET",
          "url": "http://douban.com/isbn/" + dict.isbn,
          "headers": {
            "Cookie": "bid=m-J05VnJJQk; viewed=\"1077847\""
          }
        })
          .then(res => res.data)
          .then(data => {
            zzimgurl = data.match(/<meta property="og:image" content="(.*)" \/>/)
            dict.imgurl = zzimgurl.length ? zzimgurl[1] : null
            // 将ISBN码对应的书籍封面存入数据库
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

/**
 * 获取书籍详细信息
 * @param {string} bookID 书籍标识符
 */
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

  /**
   * 处理 html 网页
   * @param {htmlDocument} html 响应的网页
   * @returns 
   */
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
