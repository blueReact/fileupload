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

    var app = express();

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '/images/multer/my-uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now())
        }
    })

    var upload = multer({
        storage: storage
    })

    // security
    app.use(helmet());

    var server = livereload.createServer({
        exts: ['html', 'css', 'js', 'png', 'jpg']
    });
    server.watch(__dirname + "/public");

    // connect to mongodb
    mongoose.connect('mongodb://localhost/fileupload');
    mongoose.Promise = global.Promise;

    // middlewares
    app.use(morgan('dev'));
    app.use(express.static(path.join(__dirname, "public")));
    //app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));


    // routes
    //app.use('/api', routes);

    app.post('/fileUpload', function (req, res) {
        console.log('got a reuqest');
        res.status(200).send('success')

        /* upload(req, res, function (err) {
          if (err) {
            // An error occurred when uploading
            console.log(err)
            return
          }
          else {
              console.log('success')
              
          }
      
          // Everything went fine
        })*/

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