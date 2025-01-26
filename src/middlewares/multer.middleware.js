// Importing the multer library
// Multer is a middleware for handling `multipart/form-data` (used for uploading files).
import multer from "multer";

// Configuring storage for multer
// The storage object defines where and how uploaded files will be saved.
const storage = multer.diskStorage({
  // `destination` is a method used to specify the folder where files should be saved.
  // It takes three parameters: the request (`req`), the file being uploaded (`file`), and a callback (`cb`).
  destination: function (req, file, cb) {
    // Specify the folder where files will be saved.
    // Here, files are stored in `./public/temp`. Change this path as needed for production.
    cb(null, "./public/temp"); // The second argument is the path to the destination directory.
  },

  // `filename` is a method used to determine the name of the file saved on the server.
  // It also takes three parameters: `req`, `file`, and `cb`.
  filename: function (req, file, cb) {
    // Generate a unique suffix to avoid overwriting files with the same name.
    // The suffix is composed of the current timestamp (`Date.now()`) and a random number.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    // Combine the file's field name and the unique suffix to create a unique file name.
    cb(null, file.fieldname + '-' + uniqueSuffix); // Example: "avatar-1675728193915-123456789"
  }
});

// Creating an upload middleware instance
// The `upload` object uses the `storage` configuration defined above.
export const upload = multer({ storage: storage });

// `upload` is now a middleware function that can be used in routes
// to handle file uploads based on the specified storage settings.




/*
1.multer.diskStorage: Allows customization of the file upload process, including where and how files are saved.
2.destination: Determines the folder where uploaded files will be stored.
3.filename: Creates unique filenames to avoid conflicts.
4.upload: Middleware created using the storage configuration to manage file uploads. It can be used in your route handlers.
*/