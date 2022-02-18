const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './storages');
  },

  filename: (req, file, cb) => {
    // console.log(file);
    /* methode simple 
    cb(null, file.originalname); */
    //mac 

    cb(null, new Date().toString().replace(/:/g, '-') + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == 'image/jpeg' ||
    file.mimetype == 'image/png' ||
    file.mimetype == 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);
  }
};

module.exports = multer({ storage: storage, fileFilter: fileFilter, limits: { _fileSize: 1024 * 1024 * 1024 * 10 } });
