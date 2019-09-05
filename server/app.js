var express = require('express');
const cors = require("cors");
const path = require('path')
jwt = require('jsonwebtoken');
config = require('./configurations/config');
var app = express();
app.use('/upload', express.static(path.join(__dirname, 'upload', './')))
const login = require('./router/login')
const checked = require('./router/checkrole')
const setpermiss = require('./router/setpermission')
const role_action = require('./router/role_action')
const port = 5000;

// var xlsx = require("xlsx")
// var wb = xlsx.readFile("./upload/test_Read_excel.xlsx")
// var ws = wb.Sheets["Sheet1"]
// var data =xlsx.utils.sheet_to_json(ws)
// console.log("day la data ",data[1]['KIỂU DỮ LIỆU'])
// console.log("day la name ",data[1].name)

var groupRoute = require('./router/group')
var setGroupPermission = require('./router/setGroupPermission')
var nhansuRoute = require('./router/nhansuRoute')
var hotroRoute = require('./router/hotroRoute')
var menuRoute = require('./router/menu_Route')
var quanly_hoadonRoute = require('./router/quanly_hoadonRoute')
var khachhangRoute = require('./router/khachhangRoute')
var router = require('./router/unitRoute');
var cusrouter = require('./router/customerRoute')
var hopdong = require('./router/hopdong')
var userRouter = require('./router/index');
var diabanRoute = require('./router/diaban')
var duanRoute = require('./router/duan')
var memberRoute = require('./router/memberRoute')
var fileRoute = require('./router/fileRoute')
var ChangePass = require('./router/changepass')
var authorize = require('./middleware/authorize')
var bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.set('Secret', config.secret);
var whitelist = ['http://localhost:3000', 'http://localhost:5000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
var multer = require('multer')
app.use(cors());

// var multer = require('multer')
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './upfille')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })
// var upload = multer({ storage: storage })
// app.post('/upfile', upload.single("file"), function (req, res ){
//   console.log(req.file)
//   res.send("Success")
// })


app.use('/nhansu', nhansuRoute);
app.use('/member', memberRoute);
app.use('/changepass', ChangePass);

app.use('/hotro', hotroRoute)

app.use('/hopdong', hopdong)

app.use('/menu', menuRoute)

app.use('/qlhd', quanly_hoadonRoute)

app.use('/group', groupRoute)

app.use('/diaban', diabanRoute)

app.use('/duan', duanRoute)

app.use('/khachhangRoute', khachhangRoute)

app.use('/customer', cusrouter)

app.use('/filekhachhangs', fileRoute);

app.use('/Login', login);

app.use('/setGroupPermission', setGroupPermission);

app.use('/Login', login);

app.use('/setGroupPermission', setGroupPermission);

app.use('/Login', login);

app.use('/checkrole', checked)

app.use('/setpermission', setpermiss)

app.use('/role_action', role_action)

app.use('/user', authorize, userRouter);

//app.use('/', authorize, hopdongrouters );

app.use('/unit', router);

//upload multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage }).single('file')
app.post('/upload', function (req, res) {
  console.log('da vao upload');
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    return res.status(200).send(req.file)
  })
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.post('/verify')