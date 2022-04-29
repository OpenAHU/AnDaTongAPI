const collectRouter = require("./collect")
const analysisRouter = require('./analysis')
const searchRouter = require('./search')

const routes = (app) => {
  app.use("/collect", collectRouter)
  app.use('/analysis', analysisRouter)
  app.use('/search', searchRouter)
}

module.exports = routes