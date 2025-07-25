import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from '../s3';

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'aws-bucket-bigzoo',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `product-${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});
