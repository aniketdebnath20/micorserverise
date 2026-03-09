import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinart.js";
/* ---------------- FILE FILTER ---------------- */
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed"));
    }
};
/* ---------------- CLOUDINARY STORAGE ---------------- */
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "chat-app/images", // 📂 Cloudinary folder
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto" },
        ],
    }),
});
/* ---------------- MULTER CONFIG ---------------- */
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 📦 5MB max
    },
    fileFilter,
});
//# sourceMappingURL=multer.js.map