const express = require('express')
const app = express()
const multer  = require('multer')
const cors = require('cors')
const upload = multer({ dest: 'uploads/' })

// APIエラーハンドリングするためのwrapper
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(err => {
  console.error(err)
  if (!res.headersSent) {
    res.status(500).json({message: 'Internal Server Error'})
  }
})
// エラーハンドリング
process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))
process.on('SIGINT', () => process.exit(1))

// CORS（別ドメインからの通信を許可する）
app.use(cors())
// publicフォルダ
app.use(express.static('public'))
// POSTデータを取得するためのミドルウェア
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// アップロードAPI
app.post('/api/upload', upload.single('image'), wrap(async (req, res) => {
  console.log(req.body)
  console.log(req.file)
  res.json({image: req.file, ...req.body})
}))

// サーバ起動
app.listen(process.env.PORT || 5000, () => {
  console.log('server started')
})