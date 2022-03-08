import path from 'path';

import winston from 'winston';

const options = {
  file: {
    level: 'info',
    filename: path.join(__dirname, '..', '..', 'logs', 'app.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  console: {
    level: 'info',
  },
};

export default winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
});
