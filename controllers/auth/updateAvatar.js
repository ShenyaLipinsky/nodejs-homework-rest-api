const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { User } = require("../../models/user/user");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user;

    const { path: tempUpload, originalname } = req.file;

    const extension = originalname.split(".").pop();

    const filename = `${_id}.${extension}`;

    await Jimp.read(filename)
      .then((file) => {
        return file.resize(250, 250).quality(60).greyscale().write(filename);
      })
      .catch((err) => {
        console.error(err);
      });

    const resultUpload = path.join(avatarsDir, filename);

    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join("avatars", filename);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    await fs.unlink(req.file.path);

    throw error;
  }
};

module.exports = updateAvatar;
