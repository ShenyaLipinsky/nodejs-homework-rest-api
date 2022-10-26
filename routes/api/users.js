const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { User, schemas } = require("../../models/user/user");
const { auth, upload, validation } = require("../../middlewares");
const { ctrlWrapper } = require("../../helpers");
const ctrl = require("../../controllers/auth");

const router = express.Router();

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  async (req, res, next) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
    try {
      const [extension] = filename.split(".").reverse();
      const newFileName = `${_id}.${extension}`;
      const resultUpload = path.join(avatarsDir, newFileName);
      await fs.rename(tempUpload, resultUpload);
      await Jimp.read(resultUpload)
        .then((file) => {
          return file.resize(250, 250).quality(60).write(resultUpload);
        })
        .catch((err) => {
          console.error(err);
        });
      const avatarURL = path.join("avatars", newFileName);
      await User.findByIdAndUpdate(_id, { avatarURL });
      res.json({
        avatarURL,
      });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/register",
  validation(schemas.registerSchema),
  ctrlWrapper(ctrl.register)
);

router.post("/login", validation(schemas.loginSchema), ctrlWrapper(ctrl.login));

router.get("/current", auth, ctrlWrapper(ctrl.getCurrent));

router.get("/logout", auth, ctrlWrapper(ctrl.logout));

module.exports = router;
