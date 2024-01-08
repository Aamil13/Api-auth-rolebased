const multer = require('multer')

// to Check if the file is an image
const imageFilter = (req, file, cb) => {
    if(file){
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
};

//image upload
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, "images")//images => folder name
    },filename:(req, file, cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 10000)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({storage:storage, fileFilter: imageFilter});

module.exports = upload;