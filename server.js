const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { parseGIF, decompressFrames } = require('gifuct-js');
const sharp = require('sharp');
const GIFEncoder = require('gif-encoder-2');
const app = express();

const PORT = 3000;


// 测试用
const fs2 = require('fs');
const {gif2Positions} = require("./src/positions/gif2");
const {gif3Positions} = require("./src/positions/gif3");
const {overlayAvatarOnGif} = require("./src/util/gifUtil");

// 静态资源配置
app.use('/emoji-app', express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10mb' }));

app.post('/emoji-app/emoji/uploadEmoji', async (req, res) => {
    try {
        const { base64,delay,selectedSource,width } = req.body;
        const GIF_PATH = path.join(__dirname, 'public', 'static', selectedSource);
        const gifBuffer = await fs.readFile(GIF_PATH);
        const avatarBuffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');

        const resultBuffer = await overlayAvatarOnGif(gifBuffer, avatarBuffer,delay,selectedSource,width);
        // await fs.writeFile(OUTPUT_PATH, resultBuffer);
        // const resultBase64
        // 直接返回 base64 字符串（可直接用 img src="data:image/gif;base64,...）
        const resultBase64 = resultBuffer.toString('base64');
        res.json({ success: true, data: `data:image/gif;base64,${resultBase64}` });

    } catch (error) {
        console.error('处理失败:', error);
        res.status(500).json({ success: false, message: '服务器内部错误' });
    }
});











// GET 接口：获取 gif2 文件夹下的所有图片并转为 Base64
app.post('/emoji-app/emoji/images', async (req, res) => {

    const {selectedSource} = req.body;
    const folderPath = path.join(__dirname, 'public', 'frames', selectedSource);

    try {
        const files = fs2.readdirSync(folderPath);
        const images = [];

        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext)) {
                const filePath = path.join(folderPath, file);
                const fileData = fs2.readFileSync(filePath);
                const base64Image = `data:image/${ext.slice(1)};base64,${fileData.toString('base64')}`;
                images.push({
                    filename: file,
                    data: base64Image
                });
            }
        }

        res.json({
            success: true,
            count: images.length,
            images,
            avatarPositions: gif3Positions,
        });
    } catch (error) {
        console.error('Error reading images:', error);
        res.status(500).json({ success: false, message: 'Failed to load images.' });
    }
});
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
