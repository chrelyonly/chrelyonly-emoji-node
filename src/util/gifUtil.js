/**
 * overlayAvatarOnGif.js
 *
 * 作者: chrelyonly
 * 创建时间: 2025年6月7日
 * 描述: 将圆形头像覆盖到指定位置的 GIF 每一帧上，支持多平台的 ffmpeg 路径处理。
 */

const fs = require("fs");
const fsPromise = require("fs/promises");
const os = require("os");
const path = require("path");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const pLimit = require("p-limit");

// 根据运行平台设置 ffmpeg 执行路径
const platform = os.platform();
if (platform === "win32") {
    ffmpeg.setFfmpegPath(path.join("src", "lib", "win", "ffmpeg.exe"));
} else if (platform === "darwin") {
    ffmpeg.setFfmpegPath(path.join("src", "lib", "mac", "ffmpeg-mac"));
} else if (platform === "linux") {
    ffmpeg.setFfmpegPath(path.join("src", "lib", "linux", "ffmpeg"));
} else {
    throw new Error(`Unsupported platform: ${platform}`);
}

// 引入对应 GIF 的头像位置信息
const { gif2Positions } = require("../positions/gif2");
const { gif3Positions } = require("../positions/gif3");

/**
 * 创建圆形头像并保存为 PNG 格式
 * @param {Buffer} avatarBuffer - 原始头像的 buffer 数据
 * @param {number} width - 输出头像的尺寸
 * @param {string} outputPath - 输出路径
 */
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
 * 将圆形头像叠加到 GIF 的每一帧指定位置上，并生成新 GIF
 * @param {string} inputAvatar - base64 格式头像字符串
 * @param {number} delay - 帧率（帧之间的间隔）
 * @param {string} selectedSource - GIF 文件名 (例如: "2.gif", "3.gif")
 * @param rotate 旋转度数
 * @returns {Promise<Buffer>} - 返回生成的 GIF buffer
 */
async function overlayAvatarOnGif(inputAvatar, delay, selectedSource,rotate) {
    let resultBuffer;
    const GIF_PATH = path.join("public", "static", selectedSource);
    const tmpDir = fs.mkdtempSync(path.join("temp", "gif-avatar-"));
    const gifPath = path.join(tmpDir, "input.gif");
    const outputGif = path.join(tmpDir, "output.gif");

    try {
        const gifBuffer = await fsPromise.readFile(GIF_PATH);
        const avatarBuffer = Buffer.from(
            inputAvatar.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
        );

        fs.writeFileSync(gifPath, gifBuffer);

        // 获取对应 GIF 的头像位置数组
        let positions = "";
        if (selectedSource === "2.gif") {
            positions = gif2Positions;
        } else if (selectedSource === "3.gif") {
            positions = gif3Positions;
        } else {
            return Buffer.alloc(0); // 不支持的 GIF
        }

        // 使用 ffmpeg 提取 GIF 每一帧为 PNG
        const framePattern = path.join(tmpDir, "frame_%03d.png");
        await new Promise((resolve, reject) => {
            ffmpeg(gifPath)
                .output(framePattern)
                .on("end", resolve)
                .on("error", reject)
                .run();
        });

        // 为不同尺寸缓存裁剪好的圆形头像
        const avatarCache = new Map();
        for (const [_, __, size] of positions) {
            if (!avatarCache.has(size)) {
                const avatarPath = path.join(tmpDir, `avatar_${size}.png`);
                await createCircularAvatar(avatarBuffer, size, avatarPath);
                avatarCache.set(size, avatarPath);
            }
        }

        // 限制并发数为4，处理每一帧的头像叠加
        const limit = pLimit(4);
        const frameOverlayPromises = positions.map(([x, y, size], i) =>
            limit(async () => {
                const frameInput = path.join(
                    tmpDir,
                    `frame_${String(i + 1).padStart(3, "0")}.png`
                );
                const frameOutput = path.join(
                    tmpDir,
                    `overlay_${String(i + 1).padStart(3, "0")}.png`
                );
                const avatarPath = avatarCache.get(size);
                // 无意义的操作就简化
                if (rotate === 0|| rotate === 360){
                    await sharp(frameInput)
                        .composite([{ input: avatarPath, left: x, top: y }])
                        .toFile(frameOutput);
                }else{
                    //这里必须拆解步骤,先合成图,在旋转,否则需要重新找点位
                    const avatarComposite = await sharp(frameInput)
                        .composite([{ input: avatarPath, left: x, top: y }])
                        .toBuffer();

                    await sharp(avatarComposite)
                        .rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
                        .toFile(frameOutput);
                }

            })
        );

        await Promise.all(frameOverlayPromises);

        const overlayPattern = path.join(tmpDir, "overlay_%03d.png");

        // 使用 palettegen 和 paletteuse 保持透明度合成新的 GIF
        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(overlayPattern)
                .inputOptions(["-framerate", `${delay}`])
                .outputOptions(["-loop", "0", "-y"])
                .complexFilter([
                    "[0:v] palettegen=reserve_transparent=1 [p]; [0:v][p] paletteuse",
                ])
                .output(outputGif)
                .on("end", resolve)
                .on("error", reject)
                .run();
        });

        resultBuffer = fs.readFileSync(outputGif);
    } catch (e) {
        console.error("系统内异常", e);
    } finally {
        // 清理临时目录
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    return resultBuffer;
}

// 导出主函数
module.exports = {
    overlayAvatarOnGif,
};
