import httpServer from './app.js'
import config from './utils/config.js'

httpServer.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
