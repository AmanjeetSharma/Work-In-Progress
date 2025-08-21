import fs from "fs";
import multer from "multer";

const tempDir = "./public/temp";

// Ensure the folder exists at runtime
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({ storage });










// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./public/temp");
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });

// export const upload = multer({ storage: storage });