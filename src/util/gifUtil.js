const fs = require("fs");
const fsPromise = require("fs/promises");
const os = require("os");
const path = require("path");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const pLimit = require("p-limit");

// 平台检测
const platform = os.platform();
if (platform === "win32") {
    ffmpeg.setFfmpegPath(path.join("src", "lib", "win", "ffmpeg.exe"));
} else if (platform === "darwin") {
    ffmpeg.setFfmpegPath(path.join("src", "lib", "mac", "ffmpeg-mac"));
} else if (platform === "linux") {
    ffmpeg.setFfmpegPath(path.join("src", "lib", "linux", "ffmpeg-linux"));
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

async function overlayAvatarOnGif(inputAvatar, delay, selectedSource) {
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

        let positions = "";
        if (selectedSource === "2.gif") {
            positions = gif2Positions;
        } else if (selectedSource === "3.gif") {
            positions = gif3Positions;
        } else {
            return Buffer.alloc(0);
        }

        const framePattern = path.join(tmpDir, "frame_%03d.png");
        await new Promise((resolve, reject) => {
            ffmpeg(gifPath)
                .output(framePattern)
                .on("end", resolve)
                .on("error", reject)
                .run();
        });

        const avatarCache = new Map();
        for (const [_, __, size] of positions) {
            if (!avatarCache.has(size)) {
                const avatarPath = path.join(tmpDir, `avatar_${size}.png`);
                await createCircularAvatar(avatarBuffer, size, avatarPath);
                avatarCache.set(size, avatarPath);
            }
        }

        const limit = pLimit(4); // 并发上限
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
                await sharp(frameInput)
                    .composite([{ input: avatarPath, left: x, top: y }])
                    .toFile(frameOutput);
            })
        );

        await Promise.all(frameOverlayPromises);

        const overlayPattern = path.join(tmpDir, "overlay_%03d.png");

        // 合并 palettegen 和 paletteuse
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
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    return resultBuffer;
}

module.exports = {
    overlayAvatarOnGif,
};
