const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){ cb(null, '/uploads/');  },
    filename: function(req, file, cb){    cb(null,  file.originalname );  }
});

const fileFilter = (req, file , cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    }
    else{
        cb(null, true);
    }
}

const uploads = multer({
    storage: storage,
    limits :{ fileSize: 1024*1024*4 },
    fileFilter: fileFilter
  });

  //const uploads = multer({ dest: 'uploads/' });

 router.post('/upload', uploads.single('userimage'), (req, res, next)=>{
    // console.log(req.file);
    let flag = false;
    //const temp = req.body.userid;
    //console.log('id : '+temp);
    flag = true;
    res.json({"success": flag});
});

module.exports = router;