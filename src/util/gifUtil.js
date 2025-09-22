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
const {gif4Positions} = require("../positions/gif4");
const {gif5Positions} = require("../positions/gif5");
const {gif6Positions} = require("../positions/gif6");
const {gif7Positions} = require("../positions/gif7");
const {gif8Positions} = require("../positions/gif8");
const {gif10Positions} = require("../positions/gif10");
const {gif11Positions} = require("../positions/gif11");
const {gif12Positions} = require("../positions/gif12");
const {gif13Positions} = require("../positions/gif13");
const {gif14Positions} = require("../positions/gif14");
const {gif15Positions} = require("../positions/gif15");
const {gif16Positions} = require("../positions/gif16");

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
 * 创建矩形文本并保存为 PNG 格式
 * @param {string} text - 原始文字内容
 * @param {number} width - 输出头像的尺寸
 * @param {number} height - 输出头像的尺寸
 * @param {string} outputPath - 输出路径
 */

/**
 * 创建矩形文本并保存为 PNG 格式
 * @param {string} text - 原始文字内容
 * @param {number} width - 输出头像的尺寸
 * @param {number} height - 输出头像的尺寸
 * @param {string} outputPath - 输出路径
 * @param fontSize 字体大小
 */
async function createRectangularAvatar(text, width, height, outputPath,fontSize) {
    const maxCharsPerLine = 10;

    // 先按 \n 分割用户明确的换行
    const manualLines = text.split('\\n');

    // 然后再对每行按长度拆分
    const lines = [];
    for (const segment of manualLines) {
        for (let i = 0; i < segment.length; i += maxCharsPerLine) {
            lines.push(segment.slice(i, i + maxCharsPerLine));
        }
    }
    const lineHeight = fontSize * 1.2;
    const startY = (height - lineHeight * lines.length) / 2 + fontSize / 2;

    const svgText = lines.map((line, i) => {
        const y = startY + i * lineHeight;
        return `<text x="50%" y="${y}" text-anchor="middle" dominant-baseline="middle">${line}</text>`;
    }).join("\n");

    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
            text {
                fill: #ffffff;
                font-size: ${fontSize}px;
                font-family: sans-serif;
                font-weight: bold;
            }
        </style>
        <rect width="100%" height="100%" fill="transparent"/>
        ${svgText}
    </svg>`;

    await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

/**
 * 判断是否多图数组
 * @param positions
 * @returns {*[]}
 */
function extractAllSizes(positions) {
    const sizes = [];
    for (const pos of positions) {
        if (Array.isArray(pos[0])) {
            // 多图模式：pos 是 [ [x, y, size], [x, y, size], ... ]
            for (const [ x,y, size ] of pos) {
                sizes.push({
                    size: size,
                    x:x,
                    y:y
                });
            }
        } else {
            // 单图模式：pos 是 [x, y, size]
            const [  x,y, size ] = pos;
            sizes.push({
                size: size,
                x:x,
                y:y
            });
        }
    }
    return sizes;
}
/**
 * 将圆形头像叠加到 GIF 的每一帧指定位置上，并生成新 GIF
 * @param {string||[]} inputAvatarList - base64 格式头像字符串 单一或者数组
 * @param {number} delay - 帧率（帧之间的间隔）
 * @param {string} selectedSource - GIF 文件名 (例如: "2.gif", "3.gif")
 * @param rotate 旋转度数
 * @returns {Promise<Buffer>} - 返回生成的 GIF buffer
 */
async function overlayAvatarOnGif(inputAvatarList, delay, selectedSource,rotate) {
    let resultBuffer;
    const GIF_PATH = path.join("public", "static", selectedSource);
    const tmpDir = fs.mkdtempSync(path.join("temp", "gif-avatar-"));
    const gifPath = path.join(tmpDir, "input.gif");
    const outputGif = path.join(tmpDir, "output.gif");

    try {
        const gifBuffer = await fsPromise.readFile(GIF_PATH);
        // 判断头像是否数组
        let avatarBufferList = [];
        if (inputAvatarList instanceof Array){
            inputAvatarList.forEach(item=>{
                avatarBufferList.push(Buffer.from(
                    item.replace(/^data:image\/\w+;base64,/, ""),
                    "base64"
                ))
            })
        }else{
            avatarBufferList.push(Buffer.from(
                inputAvatarList.replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            ))
        }

        fs.writeFileSync(gifPath, gifBuffer);

        // 获取对应 GIF 的头像位置数组
        let positions = "";
        if (selectedSource === "2.gif") {
            positions = gif2Positions;
        } else if (selectedSource === "3.gif") {
            positions = gif3Positions;
        } else if (selectedSource === "4.gif") {
            positions = gif4Positions;
        } else if (selectedSource === "5.gif") {
            positions = gif5Positions;
        } else if (selectedSource === "6.gif") {
            positions = gif6Positions;
        } else if (selectedSource === "7.gif") {
            positions = gif7Positions;
        } else if (selectedSource === "10.gif") {
            positions = gif10Positions;
        } else if (selectedSource === "11.gif") {
            positions = gif11Positions;
        } else if (selectedSource === "12.gif") {
            positions = gif12Positions;
        } else if (selectedSource === "13.gif") {
            positions = gif13Positions;
        } else if (selectedSource === "14.gif") {
            positions = gif14Positions;
        } else if (selectedSource === "15.gif") {
            positions = gif15Positions;
        } else if (selectedSource === "16.gif") {
            positions = gif16Positions;
        } else {
            return Buffer.alloc(0); // 不支持的 GIF
        }

        let gifDir;
        switch (selectedSource) {
            case "2.gif":
                gifDir = "gif2";
                break;
            case "3.gif":
                gifDir = "gif3";
                break;
            case "4.gif":
                gifDir = "gif4";
                break;
            case "5.gif":
                gifDir = "gif5";
                break;
            case "6.gif":
                gifDir = "gif6";
                break;
            case "7.gif":
                gifDir = "gif7";
                break;
            case "10.gif":
                gifDir = "gif10";
                break;
            case "11.gif":
                gifDir = "gif11";
                break;
            case "12.gif":
                gifDir = "gif12";
                break;
            case "13.gif":
                gifDir = "gif13";
                break;
            case "14.gif":
                gifDir = "gif14";
                break;
            case "15.gif":
                gifDir = "gif15";
                break;
            case "16.gif":
                gifDir = "gif16";
                break;
            default:
                throw new Error(`Unsupported GIF: ${selectedSource}`);
        }
// 假设 public/frames/ 下有 frame_001.png, frame_002.png ...
        const frameFiles = await fs.promises.readdir("public/frames/" + gifDir);

// 过滤只取 png 文件并排序
        const pngFiles = frameFiles
            .filter(f => f.toLowerCase().endsWith('.png'))
            .sort((a, b) => {
                // 按数字排序 frame_0.png, frame_1.png ...
                const numA = parseInt(a.match(/\d+/)[0]);
                const numB = parseInt(b.match(/\d+/)[0]);
                return numA - numB;
            });

        await Promise.all(pngFiles.map(async (file, index) => {
            const src = path.join(`public/frames/${gifDir}`, file);
            // 重命名为 frame_001.png, frame_002.png ...
            const dest = path.join(tmpDir, `frame_${String(index + 1).padStart(3, '0')}.png`);
            await fs.promises.copyFile(src, dest);
        }));
        // const framePattern = path.join(tmpDir, "frame_%03d.png");
        // await new Promise((resolve, reject) => {
        //     ffmpeg(gifPath)
        //         .outputOptions([
        //             '-vsync 0',   // 关闭帧率同步，保持帧数不变
        //             '-ignore_loop 0' // 保持GIF动画循环设置
        //         ])
        //         .output(framePattern)
        //         .on("end", resolve)
        //         .on("error", reject)
        //         .run();
        // });

        // 为不同尺寸缓存裁剪好的圆形头像
        const avatarCache = new Map();


        // 判断是否多个头像
        if (inputAvatarList instanceof Array){
            const sizes = extractAllSizes(positions);
            for (const {x, y, size} of sizes) {
                for (let i = 0; i < avatarBufferList.length; i++) {
                    if (!avatarCache.has("" + x + y + size + i)) {
                        const avatarPath = path.join(tmpDir, `avatar_${"" + x + y + size + i}.png`);
                        await createCircularAvatar(avatarBufferList[i], size, avatarPath);
                        avatarCache.set("" + x + y + size + i, avatarPath);
                    }
                }
            }
        }else{
            for (const [_, __, size] of positions) {
                if (!avatarCache.has(size)) {
                    const avatarPath = path.join(tmpDir, `avatar_${size}.png`);
                    await createCircularAvatar(avatarBufferList[0], size, avatarPath);
                    avatarCache.set(size, avatarPath);
                }
            }
        }



        // 限制并发数为4，处理每一帧的头像叠加
        const limit = pLimit(Math.max(os.cpus().length, 4));

        const frameOverlayPromises = positions.map((item, i) =>
            limit(async () => {
                // 判断多图
                if (item && item.length > 1 && item[0] instanceof Array){
                    const frameInput = path.join(
                        tmpDir,
                        `frame_${String(i + 1).padStart(3, "0")}.png`
                    );
                    const frameOutput = path.join(
                        tmpDir,
                        `overlay_${String(i + 1).padStart(3, "0")}.png`
                    );
                    // 把所有头像放到一个 composite 数组中
                    const composites = item.map(([x, y, size],index) => ({
                        input: avatarCache.get("" + x + y + size + index),
                        left: x,
                        top: y
                    }));
                    if (rotate === 0 || rotate === 360) {
                        // 无旋转，直接一次性合成所有头像
                        await sharp(frameInput)
                            .composite(composites)
                            .toFile(frameOutput);
                    } else {
                        // 先合成，再旋转
                        const avatarComposite = await sharp(frameInput)
                            .composite(composites)
                            .toBuffer();

                        await sharp(avatarComposite)
                            .rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
                            .toFile(frameOutput);
                    }
                }else{
                    let [x, y, size] = item;
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
                }



            })
        );
        // const frameOverlayPromises = positions.map(([x, y, size], i) =>
        //     limit(async () => {
        //         const frameInput = path.join(
        //             tmpDir,
        //             `frame_${String(i + 1).padStart(3, "0")}.png`
        //         );
        //         const frameOutput = path.join(
        //             tmpDir,
        //             `overlay_${String(i + 1).padStart(3, "0")}.png`
        //         );
        //         const avatarPath = avatarCache.get(size);
        //         // 无意义的操作就简化
        //         if (rotate === 0|| rotate === 360){
        //             await sharp(frameInput)
        //                 .composite([{ input: avatarPath, left: x, top: y }])
        //                 .toFile(frameOutput);
        //         }else{
        //             //这里必须拆解步骤,先合成图,在旋转,否则需要重新找点位
        //             const avatarComposite = await sharp(frameInput)
        //                 .composite([{ input: avatarPath, left: x, top: y }])
        //                 .toBuffer();
        //
        //             await sharp(avatarComposite)
        //                 .rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        //                 .toFile(frameOutput);
        //         }
        //
        //     })
        // );

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


/**
 * 文生图
 */
const textOnGif = async  (textList, delay, selectedSource,rotate,gifPositions,fontSize,scaling) => {
    let resultBuffer;
    const tmpDir = fs.mkdtempSync(path.join("temp", "gif-text-"));
    const gifPath = path.join(tmpDir, "input.gif");
    const outputGif = path.join(tmpDir, "output.gif");

    try {
        const gifResponse = await $https(selectedSource,"get",{},3,{});
        fs.writeFileSync(gifPath, gifResponse.data);
        // 获取对应 GIF 的头像位置数组
        let positions = gifPositions;
        // 使用 ffmpeg 提取 GIF 每一帧为 PNG
        const framePattern = path.join(tmpDir, "frame_%03d.png");
        await new Promise((resolve, reject) => {
            ffmpeg(gifPath)
                .output(framePattern)
                .on("end", resolve)
                .on("error", reject)
                .run();
        });

        // 为不同文字缓存裁剪好的图片
        const textCache = new Map();
        for (let i = 0; i < positions.length; i++) {
        //     循环坐标点
            let item = positions[i];
            // 循环每一帧的每一张图片
            for (let j = 0; j < item.length; j++) {
                let item2 = item[j];
                // 只在需要填充的坐标才处理
                if (item2[4] > 0){
                //     大于0的时候证明需要填充,否则不填充
                    // 坐标作为缓存key
                    let key = "" + item2[0] + item2[1] + item2[2] + item2[3] + item2[4];
                    if (!textCache.has(key)) {
                        // 语言必须与坐标关联上,这里应该报错的
                        let textListElement;
                        textListElement = textList[item2[4]-1];
                        if (!textListElement) {
                            continue; // ⚠️ 注意：这必须在 async limit 函数中，return 提前终止
                        }
                        const textPath = path.join(tmpDir, `text_${key}.png`);
                        await createRectangularAvatar(textListElement, item2[2],item2[3], textPath,fontSize);
                        textCache.set(key, textPath);
                    }
                }
            }

        }
        // 限制并发数为4，处理每一帧的头像叠加
        const limit = pLimit(Math.max(os.cpus().length, 4));
        // 循环合成png到gif

        const frameOverlayPromises = []
        positions.map((item) =>{
// 循环每一帧的每一张图片
            for (let j = 0; j < item.length; j++) {
                let item2 = item[j];
                let task = limit(async () => {
                    // 获取刚才的切片
                    const frameInput = path.join(
                        tmpDir,
                        `frame_${String(item2[5]).padStart(3, "0")}.png`
                    );
                    // 设置保存的切片
                    const frameOutput = path.join(
                        tmpDir,
                        `overlay_${String(item2[5]).padStart(3, "0")}.png`
                    );
                    // 坐标作为缓存key
                    let key = "" + item2[0] + item2[1] + item2[2] + item2[3] + item2[4];
                    const textPath = textCache.get(key);
                    // 无意义的操作就简化
                    // 如果没有则不合并图片

                    if (!textPath){
                        await sharp(frameInput)
                            .toFile(frameOutput);
                    }else if (rotate === 0|| rotate === 360){
                        await sharp(frameInput)
                            .composite([{ input: textPath, left: item2[0], top: item2[1] }])
                            .toFile(frameOutput);
                    }else {
                        //这里必须拆解步骤,先合成图,在旋转,否则需要重新找点位
                        const avatarComposite = await sharp(frameInput)
                            .composite([{ input: textPath, left: item2[0], top: item2[1] }])
                            .toBuffer();

                        await sharp(avatarComposite)
                            .rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
                            .toFile(frameOutput);
                    }
                })
                frameOverlayPromises.push(task);
            }
        })
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
        // await new Promise((resolve, reject) => {
        //     ffmpeg()
        //         .input(outputGif)
        //         .outputOptions(["-y"])
        //         .videoFilters(`scale=iw*${scaling}/100:ih*${scaling}`)
        //         .output(finalGifPath)
        //         .on("end", resolve)
        //         .on("error", reject)
        //         .run();
        // });
        resultBuffer = fs.readFileSync(outputGif);
    } catch (e) {
        console.error("系统内异常", e);
    } finally {
        // 清理临时目录
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }

    return resultBuffer;
}


const checkGif = async (base64) => {
    const folderPath = fs.mkdtempSync(path.join("temp", "gif-text-"));
    const gifPath = path.join(folderPath, "input.gif");
    const images = [];

    try {
        // 写入 GIF 文件
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        await fs.promises.writeFile(gifPath, buffer);

        // 使用 ffmpeg 提取每一帧
        const framePattern = path.join(folderPath, "frame_%03d.png");
        await new Promise((resolve, reject) => {
            ffmpeg(gifPath)
                .output(framePattern)
                .on("end", resolve)
                .on("error", reject)
                .run();
        });

        // 异步读取图像列表并并发读取内容
        const files = (await fs.promises.readdir(folderPath))
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
            })
            .sort();

        const imagePromises = files.map(async file => {
            const ext = path.extname(file).toLowerCase();
            const filePath = path.join(folderPath, file);
            const fileData = await fs.promises.readFile(filePath);
            return {
                filename: file,
                data: `data:image/${ext.slice(1)};base64,${fileData.toString('base64')}`
            };
        });

        const results = await Promise.all(imagePromises);
        images.push(...results);
        return images;

    } catch (e) {
        console.error("系统内异常", e);
    } finally {
        // 清理临时目录
        fs.rmSync(folderPath, { recursive: true, force: true });
    }
};


// 导出主函数
module.exports = {
    overlayAvatarOnGif,
    textOnGif,
    checkGif
};
