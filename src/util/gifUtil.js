const fs = require("fs");
const fsPromise = require('fs/promises');
const os = require("os");
const path = require("path");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");


// 判断平台
const platform = os.platform(); // 或 process.platform
if (platform === 'win32') {
    // Windows 系统
    ffmpeg.setFfmpegPath(path.join(__dirname, 'src', 'lib',"win", 'ffmpeg.exe'));
} else if (platform === 'darwin') {
    // macOS 系统
    ffmpeg.setFfmpegPath(path.join(__dirname, 'src', 'lib',"mac", 'ffmpeg-mac'));
} else if (platform === 'linux') {
    // Linux 系统
    ffmpeg.setFfmpegPath(path.join(__dirname, 'src', 'lib',"linux", 'ffmpeg-linux'));
} else {
    throw new Error(`Unsupported platform: ${platform}`);
}




const { gif2Positions } = require("../positions/gif2");
const { gif3Positions } = require("../positions/gif3");




async function createCircularAvatar(avatarBuffer, width, outputPath) {
    const svg = `<svg width="${width}" height="${width}">
    <circle cx="${width / 2}" cy="${width / 2}" r="${width / 2}" fill="white"/>
  </svg>`;

    await sharp(avatarBuffer)
        .resize(width, width)
        .composite([{ input: Buffer.from(svg), blend: "dest-in" }])
        .png()
        .toFile(outputPath);
}

/**
 * gif生成
 * @param inputAvatar 上传的头像
 * @param delay 帧数
 * @param selectedSource 资源名称
 * @returns {Promise<Buffer<ArrayBuffer>>} 文件二进制数组
 */
async function overlayAvatarOnGif(inputAvatar,delay, selectedSource) {
    // 返回的内容
    let resultBuffer;
    // 获取资源底图
    const GIF_PATH = path.join('public', 'static', selectedSource);

// 创建临时资源用来合成gif
    const tmpDir = fs.mkdtempSync(path.join("temp", "gif-avatar-"));
    const gifPath = path.join(tmpDir, "input.gif");
    const avatarPath = path.join(tmpDir, "avatar.png");
    const outputGif = path.join(tmpDir, "output.gif");
    try {
        const gifBuffer = await fsPromise.readFile(GIF_PATH);
        const avatarBuffer = Buffer.from(inputAvatar.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        // 读取素材图写入到工作区
        fs.writeFileSync(gifPath, gifBuffer);

        // 头像替换点
        let positions = "";
        if (selectedSource === "2.gif"){
            positions = gif2Positions
        }else if (selectedSource === "3.gif"){
            positions = gif3Positions
        }else{
            return Buffer.alloc(0);
        }

        // 拆帧
        const framePattern = path.join(tmpDir, "frame_%03d.png");
        await new Promise((resolve, reject) => {
            ffmpeg(gifPath)
                .output(framePattern)
                .on("end", resolve)
                .on("error", reject)
                .run();
        });

        // 叠加每帧
        for (let i = 0; i < positions.length; i++) {
            const [x, y] = positions[i];
            const frameInput = path.join(tmpDir, `frame_${String(i + 1).padStart(3, "0")}.png`);
            const frameOutput = path.join(tmpDir, `overlay_${String(i + 1).padStart(3, "0")}.png`);

            // 从第一帧中获取宽高数据
            const avatarSize = positions[i][2];
            await createCircularAvatar(avatarBuffer, avatarSize, avatarPath);
            await new Promise((resolve, reject) => {
                ffmpeg()
                    .input(frameInput)
                    .input(avatarPath)
                    .complexFilter([`overlay=${x}:${y}`])
                    .output(frameOutput)
                    .on("end", resolve)
                    .on("error", reject)
                    .run();
            });
        }

        // 合成 gif
        // const fps = Math.round(100 / delay);
        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(path.join(tmpDir, "overlay_%03d.png"))
                .inputFPS(delay)
                .outputOptions("-loop", "0")
                .output(outputGif)
                .on("end", resolve)
                .on("error", reject)
                .run();
        });

        resultBuffer = fs.readFileSync(outputGif);
    }catch (e) {
        console.log("系统内异常")
        console.log(e)
    }finally {
        // 始终删除临时文件
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    return resultBuffer;
}

module.exports = {
    overlayAvatarOnGif,
};
