const express=require('express');
const router=express.Router();
const userController=require('../controller/userController')
const schema=require('../middleware/joivalidation')
router.post('/imageTest',userController.imgTest)
router.post('/createUser',schema.createUser,userController.createUser)
router.post('/listAllUser',userController.listAlluser)
router.post('/updateUser',userController.updateUser)
router.post('/deleteUser',userController.deleteUser)

module.exports=router;