const express = require('express');
const { textOnGifApi, uploadEmojiApi } = require('../controller/emojiController');

const myRouter = express.Router();  // 创建路由实例

myRouter.post('/emoji-app/emoji/uploadEmoji', uploadEmojiApi);
myRouter.post('/emoji-app/emoji/textToGif', textOnGifApi);

module.exports = myRouter;
