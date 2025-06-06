
const { GifFrame, GifUtil } = require('gifwrap');
const sharp = require('sharp');
const {gif2Positions} = require("../positions/gif2");
const {gif3Positions} = require("../positions/gif3");
const {parseGIF, decompressFrames} = require("gifuct-js");
const GIFEncoder = require("gif-encoder-2");

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

async function overlayAvatarOnGif(gifBuffer, avatarBuffer,delay,selectedSource) {
    let avatarPositions = "";
    if (selectedSource === "2.gif"){
        avatarPositions = gif2Positions;
    }
    if (selectedSource === "3.gif"){
        avatarPositions = gif3Positions;
    }
    const gif = parseGIF(gifBuffer);
    const frames = decompressFrames(gif, true);
    const gifWidth = gif.lsd.width;
    const gifHeight = gif.lsd.height;

    // 初始化 GIFEncoder
    const encoder = new GIFEncoder(gifWidth, gifHeight);
    encoder.setRepeat(0);
    encoder.setTransparent(0x00FF00); // 绿色透明色 (R:0, G:255, B:0)

    // 通过 PassThrough 监听编码流
    const stream = encoder.createReadStream();
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));

    encoder.start();

    for (let i = 0; i < frames.length; i++) {
        // 处理头像圆形裁剪并获取 raw 数据
        const circularAvatarBuffer = await createCircularAvatar(avatarBuffer,avatarPositions[i][2]);
        const avatarImage = await sharp(circularAvatarBuffer)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
        const { data: avatarRaw, info: avatarInfo } = avatarImage;




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



module.exports = {
    overlayAvatarOnGif
}