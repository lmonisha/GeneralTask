const path = require('path');
const uuid = require('uuid')
const sharp = require('sharp');
const fs = require('fs');
var models = require('../db/models')
const bcrypt = require('bcryptjs');
require('dotenv').config();

module.exports.imgTest = (req, res) => {
    let file = req.files.file;
    console.log(file.data)
    let fileName = file.name;
    let fileNameSplit = fileName.split('.');
    console.log('fileNameSplit', fileNameSplit.length)
    fileName = fileNameSplit[0];
    let ext = path.extname(file.name)
    let uniqVal = uuid.v4();
    let uniqFileName = fileName + '-' + uniqVal + ext;
    let filePath = path.resolve(process.cwd() + '/images', uniqFileName);
    file.mv(filePath, async (err) => {
        if (err) {
            console.log('Error in Uploading Images');
            return res.status(500).send('Due to Internal server Error could not process the request')
        } else {
            var buffer = file.data
            await sharp(buffer)
                .webp({ quality: 20 })
                .toFile("./compress-image/" + uniqFileName);
            console.log('successfully completed')
            //deleteFile(filePath)//to avoid the problem of space issue
            return res.status(200).send('File Uploaded Successfully!!!');
        }
    })
}

async function deleteFile(filepath) {
    fs.stat(filepath, (err, file) => {
        if (err) {
            console.log('file not present')

        } else {
            fs.unlink(filepath, (err, file) => {
                if (err) {
                    console.log('file not present')

                } else {
                    console.log('file deleted successfully')
                }
            })
        }

    })
}

module.exports.listAlluser = (req, res) => {
    models.User.findAll().then(user => {
        return res.json({
            'Status': '200',
            'data': user
        })
    }).catch(err => {
        return res.json({
            'Status': '500',
            'errormsg': ' Due to Internal server error.Sorry for Inconvenice!!! '
        })
    })
}

module.exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phno } = req.body
        if (!(firstName && lastName && email && password && phno)) {
            res.status(400).send('all input required')
        }else{
        let filter = {}
        filter.where = {}
        filter.where.email = email
        console.log('filter---->', filter);
        models.User.findOne(filter).then(oldUser => {
            // console.log('oldUser---->', oldUser)
            if (oldUser) {
                res.status(400).send('user already exist please use some other login')
            } else {
                console.log('iam here');

                (async () => {
                    console.log('iam here');
                    let encryptedPasswrd = await bcrypt.hash(password, 10)
                    console.log('encryptedPasswrd---->', encryptedPasswrd)
                    let obj = {
                        firstName, lastName, email, phno, password: encryptedPasswrd
                    }
                    console.log('obj--->', obj);
                    models.User.create(obj).then(entry => {
                        return res.json({
                            'Status': '200',
                            'Data': ' User Inserted Successfully and the userId is '+entry.userId
                        })
                    }).catch(err => {
                        return res.json({
                            'Status': '500',
                            'Data': ' Internal server Error !!! '
                        })
                    })
                })()
            }
        })
    }
    } catch (err) {
        console.log('Error in Catch block')
    }
}

module.exports.updateUser = (req, res) => {
    try {
        console.log('req.body--->',req.body)
        const { email, phno, userId } = req.body
        models.User.update({email,phno},{
            where:{
                userId
            }
        }).then(updated => {
            return res.json({
                'Status': '202',
                'Data': ' User data has been updated Successfully !!! '
            })
        }).catch(err => {
            return res.json({
                'Status': '500',
                'Data': ' Internal server Error !!! '
            })

        })
    } catch (err) {
        console.log('Error in Catch block')

    }
}

module.exports.deleteUser = (req, res) => {
    try {
        console.log('req.body--->',req.body)
const{userId}=req.body
        models.User.destroy({
            where:{
                userId  
                      }
        }).then(deleted => {
            return res.json({
                'Status': '202',
                'Data': ' User data has been deleted Successfully !!! '
            })
        }).catch(err => {
        console.log('Error in db Catch block',err)

            return res.json({
                'Status': '500',
                'Data': ' Internal server Error !!! '
            })
        })

    } catch (err) {
        console.log('Error in Catch block',err)

    }
}