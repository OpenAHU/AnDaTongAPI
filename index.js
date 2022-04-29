const express = require('express');

const app = express();

const axios = require('axios')

// 注册中间件
require("./middlewareConfig")(app)

app.get('/', (req, res) => {
  res.send('开编!')
});

app.get('/bath', (req, res) => {
  res.json({ north: '不知道开没开'})
});

app.get('/examroom/:studentID', (req, res) => {
  const studentID = req.params.studentID;
  axios.get("http://kskw.ahu.edu.cn/bkcx.asp?xh="+studentID)
  .then(value => res.json(value.data))
});

app.listen(3000, () => {
  console.log('server started');
});
