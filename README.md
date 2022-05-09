
## 路由架构参考

[express 拆分路由 - 掘金](https://juejin.cn/post/6855129006514110472)

[Express 4.x - API Reference #router](https://expressjs.com/en/4x/api.html#router

以下接口不做说明，均使用GET方法。

## 功能接口

### 图书馆查询接口
```
https://api.never2.top/search/book/books/:searchValue/:pageIndex
```
```javascript
fetch("https://api.never2.top/search/book/books/你好/1", {
      "method": "GET",
      "headers": {}
})
```
```javascript
axios({
	"method": "GET",
	"url": "https://api.never2.top/search/book/books/你好/1"
})
```

### 书籍详情
```javascript
https://api.never2.top/search/book/detail/:bookID
```
```javascript
// Request (3) (GET https://api.never2.top/search/book/detail/1601560)
fetch("https://api.never2.top/search/book/detail/1601560", {
  "method": "GET",
  "headers": {}
})
```
```javascript
axios({
	"method": "GET",
	"url": "https://api.never2.top/search/book/detail/1601560"
})
```

## 统计接口

```javascript
https://api.never2.top/collect/searchvalue
```