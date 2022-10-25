const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
// const createError = require("http-errors");

const { User, schemas } = require("../../models/user/user");
const { auth, upload } = require("../../middlewares");
// const { sendMail } = require("../../helpers");

const router = express.Router();

// router.get("/verify/:verificationToken", async (req, res, next) => {
//   try {
//     const { verificationToken } = req.params;
//     const user = await User.findOne({ verificationToken });
//     if (!user) {
//       throw createError(404);
//     }
//     await User.findByIdAndUpdate(user._id, {
//       verify: true,
//       verificationToken: "",
//     });
//     res.json({
//       message: "Verification successful",
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/verify", async (req, res, next) => {
//   try {
//     const { error } = schemas.verify.validate(req.body);
//     if (error) {
//       throw createError(400, "missing required field email");
//     }
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (user.verify) {
//       throw createError(400, "Verification has already been passed");
//     }
//     const mail = {
//       to: email,
//       subject: "Подтвеждение email",
//       html: `<a target="_blank" href='http://localhost:3000/api/users/${user.verificationToken}'>Нажмите чтобы подтвердить свой email</a>`,
//     };
//     sendMail(mail);
//     res.json({
//       message: "Verification email sent",
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/current", auth, async (req, res, next) => {
//   res.json({
//     email: req.user.email,
//   });
// });

// router.get("/logout", auth, async (req, res, next) => {
//   const { _id } = req.user;
//   await User.findByIdAndUpdate(_id, { token: "" });
//   res.status(204).send();
// });

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

module.exports = router;
