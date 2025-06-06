const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { parseGIF, decompressFrames } = require('gifuct-js');
const sharp = require('sharp');
const GIFEncoder = require('gif-encoder-2');
const app = express();

const PORT = 3000;
// const AVATAR_SIZE = 155;
// const AVATAR_RADIUS = AVATAR_SIZE / 2;


async function createCircularAvatar(avatarBuffer,width) {
    // 生成圆形头像掩膜的SVG模板
    const circleSVG = Buffer.from(
        `<svg width="${width}" height="${width}"><circle cx="${width/2}" cy="${width/2}" r="${width/2}" fill="white"/></svg>`
    );

    return sharp(avatarBuffer)
        .resize(width, width)
        .composite([{ input: circleSVG, blend: 'dest-in' }])
        .png()
        .toBuffer();
}

async function overlayAvatarOnGif(gifBuffer, avatarBuffer,delay,selectedSource,width) {
    let avatarPositions = "";
    if (selectedSource === "2.gif"){
        avatarPositions = gif2Positions;
    }
    const gif = parseGIF(gifBuffer);
    const frames = decompressFrames(gif, true);
    const gifWidth = gif.lsd.width;
    const gifHeight = gif.lsd.height;

    // 处理头像圆形裁剪并获取 raw 数据
    const circularAvatarBuffer = await createCircularAvatar(avatarBuffer,width);
    const avatarImage = await sharp(circularAvatarBuffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
    const { data: avatarRaw, info: avatarInfo } = avatarImage;

    // 初始化 GIFEncoder
    const encoder = new GIFEncoder(gifWidth, gifHeight);
    encoder.setRepeat(gif.appExtensions?.[0]?.loopCount ?? 0);
    encoder.setTransparent(0x00FF00); // 绿色透明色 (R:0, G:255, B:0)

    // 通过 PassThrough 监听编码流
    const stream = encoder.createReadStream();
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));

    encoder.start();

    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const frameImageBuffer = await sharp(frame.patch, {
            raw: {
                width: frame.dims.width,
                height: frame.dims.height,
                channels: 4,
            },
        })
            .resize(gifWidth, gifHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .composite([
                {
                    input: avatarRaw,
                    raw: {
                        width: avatarInfo.width,
                        height: avatarInfo.height,
                        channels: 4,
                    },
                    left: avatarPositions[i % avatarPositions.length][0] - 4,
                    top: avatarPositions[i % avatarPositions.length][1] - 4,
                    blend: 'over',
                },
            ])
            .raw()
            .toBuffer();

        encoder.setDelay(delay); // 优先使用原帧延迟
        encoder.addFrame(frameImageBuffer);
    }

    encoder.finish();

    await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
    });

    return Buffer.concat(chunks);
}

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
const fs2 = require('fs');
const {gif2Positions} = require("./src/positions/gif2");
// GET 接口：获取 gif2 文件夹下的所有图片并转为 Base64
app.post('/api/images', async (req, res) => {

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
            avatarPositions: gif2Positions,
        });
    } catch (error) {
        console.error('Error reading images:', error);
        res.status(500).json({ success: false, message: 'Failed to load images.' });
    }
});
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
