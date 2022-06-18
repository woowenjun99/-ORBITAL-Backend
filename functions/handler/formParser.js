const formidable = require('formidable');
const options = { multiples: true, maxFileSize: 50 * 1024 * 1024 };
const form = formidable(options);

/**
 * Use to parse the request body from the FE
 *
 * @param {Object} req The request body
 * @returns the fields if successful
 */
exports.formParser = (req) => {
  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ fields, files });
    });
  });
};
