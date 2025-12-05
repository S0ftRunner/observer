import multer from 'multer';

import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/pcaps/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}: pcap analize`;
    const extName = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(pcap|pcapng)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Поддерживаются файлы только формата .pcap или .pcapng'));
    }
  },
});

export const uploadPcap = upload.single('pcapFile');
