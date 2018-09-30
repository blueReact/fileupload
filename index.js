(function () {
    'use strict';

    var express = require('express');
    var favicon = require('serve-favicon');
    var path = require('path');
    var mongoose = require('mongoose');
    var morgan = require('morgan');
    var helmet = require('helmet');
    var livereload = require('livereload');
    var multer = require('multer');

    var fs = require('fs')


    var app = express();
    
    // multer configuration
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'public', 'images', 'multer'))
        },
        filename: function (req, file, cb) {
            if (
                ((file.mimetype !== 'image/jpeg') || !file.originalname.match(/\.(jpeg)$/)) &&
                ((file.mimetype !== 'image/jpeg') || !file.originalname.match(/\.(jpg)$/))

            ) {
                var err = new Error()
                err.code = 422,
                err.message = 'PLease check the filetype and try again'

                return cb(err)
            } else {


                var fileExt = file.originalname.split('.').pop();
                var fileInitial = file.originalname.split('.');
                cb(null, fileInitial[0] + '__' + Date.now() + '.' + fileExt)
            }
        }
    })

    var upload = multer({
        storage: storage
    }).single('file')

    // security
    app.use(helmet());

    var server = livereload.createServer({
        exts: ['html', 'css', 'js', 'png', 'jpg']
    });
    server.watch(__dirname + "/public");

    // connect to mongodb
    mongoose.connect('mongodb://localhost/fileupload');
    mongoose.Promise = global.Promise;

    // var FileUpload = mongoose.model('./model')
    var Fileupload = path.join(__dirname, '..', 'model', 'fileUploadModel.js')
   



    // middlewares
    app.use(morgan('dev'));
    app.use(express.static(path.join(__dirname, "public")));
    //app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));


    // routes
    //app.use('/api', routes);

    app.post('/fileUpload', function (req, res) {
        // console.log('got a reuqest');
        // res.status(200).send('success')

        upload(req, res, function (err) {
            if (err) {
                // An error occurred when uploading
                console.log('upload', err)
                return
            } else {
                
                // An error occurred when uploading
                if(!req.file) {
                    res.send({
                        success: false,
                        message: 'No file was selected'
                    })
                }
                else {
                     // Everything went fine
                    console.log('success');

                    var fileExt = req.file.filename.split('.').pop();
                    var fileExt = fileExt.split('-');

                    var fileUpload = new Fileupload({
                        title: req.file.filename,
                        destination: req.file.destination,
                        filetype: fileExt[0]
                    });

                    fileUpload.save().then(function(success){
                        console.log(success)
                    }).catch(function(err){
                        console.log(err)
                    });
                    
                    res.status(201).json({
                        success: true,
                        createProduct: fileUpload
                    });

                    /*Fileupload.create(fileUpload, function(err, data){
                        if (err) return next(error)
                        return res.status(201).send({
                            success: true,
                            title: fileUpload.title,
                            destination: fileUpload.destination + '/' + fileUpload.title
                        })
                    })*/
                }
            }

           
        })

    })

    // error handler
    app.use(function (err, req, res, next) {
        return res.send({
            error: err.message
        });
    });

    // server listening env.PORT or @3k
    app.listen(process.env.PORT || 3000, function () {
        console.log('Running at port: 3000');
    });

})();