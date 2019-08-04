var express = require('express')
var router = express.Router()
// middleware that is specific to this router
var role_actionController = require('../controller/phanquyen/role_actionController');



router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
router.post('/get', function (req, res) {
    console.log('------------------------------------get  role-----------------------------------')
    console.log('body',req.body)
    let body = req.body;
    let pageNumber = body.pageNumber;
    let pageSize = body.pageSize;
    let index = body.index;
    let sortBy = body.sortBy
    role_actionController.getRole(pageNumber, pageSize,index,sortBy, function (data) {
        res.send(data);
    })
})



router.delete('/delete', function (req, res) {
    console.log('----------delete-----------------',req.body.id)
    role_actionController.deleteRole(req.body.id, function (data) {
        console.log(data)
        res.send(data);
    })
})

router.post('/insert',function (req, res) {
    console.log('----------------insert-------------',req.body)
    role_actionController.insertRoleAction(req.body, function (data) {
        res.send(data);
        console.log('result',data)

    })

})

router.post('/update',function (req, res) {
  console.log('---------------update-------------',req.body)
  role_actionController.updateRoleAction(req.body, function (data) {
      res.send(data);
  })
})
router.post('/search',function(req,res){
  let pageSize=req.body.pageSize;
  let pageNumber=req.body.pageNumber;
  let textSearch = req.body.searchText;
  let columnSearch = req.body.columnSearch;
  let index = req.body.p1;
  let sortBy = req.body.p2
  console.log('helo')
  
  role_actionController.search(pageSize,pageNumber,textSearch, columnSearch,index,sortBy ,function(data){
      res.send(data);
  })
})
router.post('/getRoleCode',function(req,res){
    role_actionController.getRoleCode(function(data){
        res.send(data)
    })
})
router.post('/getRoleAction',function(req,res){
    role_actionController.getRoleAction(function(data){
        res.send(data)
    })
})
router.post('/roleInsert',function(req,res){
    console.log('------------------------------------body role insertttttttt',req.body)
    role_actionController.insertRole(req.body.name,req.body.des,function(data){
        res.send(data)
    })
})
router.post('/actionInsert',function(req,res){
    console.log('------------------------------------body action insertttttttt',req.body)
    role_actionController.insertAction(req.body.name,function(data){
        res.send(data)
    })
})
module.exports = router