import fs from 'fs';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import GIFEncoder from 'gifencoder';
import gifFrames from 'gif-frames';
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import os from "os"; // 引入新的库

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
/**
 * 准备基础画布
 * 将原图绘制到一个带文本和小图的画布上
 * @param {Buffer} imageBuffer 单帧图片Buffer
 * @returns {Promise<{canvas: import('@napi-rs/canvas').Canvas, frameW: number, frameH: number}>}
 */
async function prepareBaseCanvas(imageBuffer) {
    const img = await loadImage(imageBuffer); // 从 Buffer 加载图像
    const ratio = img.height / img.width;

    const imgBigW = 500;
    const imgBigH = Math.round(imgBigW * ratio);
    const imgSmallW = 100;
    const imgSmallH = Math.round(imgSmallW * ratio);

    const textH = Math.max(imgSmallH + 10, 80);
    const frameW = imgBigW;
    const frameH = imgBigH + textH;

    const canvas = createCanvas(frameW, frameH);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, frameW, frameH);

    ctx.font = '30px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'black';
    ctx.fillText('要我一直', 280, imgBigH + 50);
    ctx.textAlign = 'left';
    ctx.fillText('吗', 400, imgBigH + 50);

    ctx.drawImage(img, 0, 0, imgBigW, imgBigH);
    ctx.drawImage(
        img,
        290,
        imgBigH + 5 + (textH - imgSmallH) / 2,
        imgSmallW,
        imgSmallH
    );

    return { canvas, frameW, frameH };
}

/**
 * 绘制单帧
 * @param {CanvasRenderingContext2D} ctx 目标画布上下文
 * @param {Canvas} baseCanvas 基础画布
 * @param {number} frameW 画布宽度
 * @param {number} frameH 画布高度
 * @param {Array<{scale:number}>} scaleLayers 缩放层数组
 */
function drawFrame(ctx, baseCanvas, frameW, frameH, scaleLayers = []) {
    // 明确清除整个画布，确保是透明的
    ctx.clearRect(0, 0, frameW, frameH);

    // 重新填充白色背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, frameW, frameH);

    // 遍历每个缩放层
    for (const layer of scaleLayers) {
        const { scale } = layer;
        const w = Math.round(frameW * scale);
        const h = Math.round(frameH * scale);
        const x = Math.round((frameW - w) * (1 - 0.28));
        const y = Math.round(frameH - h);
        ctx.drawImage(baseCanvas, x, y, w, h);
    }
}
/**
 * 从可读流中读取所有数据并转换为 Buffer
 * @param {import('stream').Readable} stream
 * @returns {Promise<Buffer>}
 */
function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}
/**
 * 生成同步动画（德罗斯特效果），并解决循环断层问题
 * @param {string} imagePath
 */
export async function alwaysSyncSmooth(imagePath) {

    // const GIF_PATH = path.join("public", "static", selectedSource);
    const tmpDir = fs.mkdtempSync(path.join("temp", "gif-"));
    // const gifPath = path.join(tmpDir, "input.gif");
    // const outputGif = path.join(tmpDir, "output.gif");
    // 使用 ffmpeg 提取 GIF 每一帧为 PNG
    const framePattern = path.join(tmpDir, "frame_%03d.png");
    await new Promise((resolve, reject) => {
        ffmpeg(imagePath)
            .outputOptions([
                '-vsync 0',   // 关闭帧率同步，保持帧数不变
                '-ignore_loop 0' // 保持GIF动画循环设置
            ])
            .output(framePattern)
            .on("end", resolve)
            .on("error", reject)
            .run();
    });
    const frameFiles = fs.readdirSync(tmpDir)
        .filter(f => f.endsWith(".png"))
        .sort()
    // const gifFrameData = await gifFrames({ url: imagePath, frames: 'all', outputType: 'png' });
    // if (gifFrameData.length === 0) {
    //     throw new Error("无法读取 GIF 帧数据。");
    // }

    const frameBuffer = fs.readFileSync(path.join(tmpDir,frameFiles[0]));
    const { frameW, frameH } = await prepareBaseCanvas(frameBuffer);

    const encoder = new GIFEncoder(frameW, frameH);
    encoder.start();
    encoder.setRepeat(0); // 无限循环
    encoder.setQuality(10);

    const fullLoopFrames = 40; // 完整往返循环的帧数
    const halfLoopFrames = fullLoopFrames / 2; // 单程帧数
    const coeff = Math.pow(5, 1 / halfLoopFrames); // 缩放系数

    const canvas = createCanvas(frameW, frameH);
    const ctx = canvas.getContext('2d');

    // 循环原始 GIF 的每一帧
    for (let gifIndex = 0; gifIndex < frameFiles.length; gifIndex++) {
        const frameBuffer = fs.readFileSync(path.join(tmpDir,frameFiles[gifIndex]));
        const { canvas: baseCanvas } = await prepareBaseCanvas(frameBuffer);
        // encoder.setDelay(delay);
        // 计算当前帧在德罗斯特效果完整循环中的索引
        const de_index = gifIndex % fullLoopFrames;

        // 根据索引决定缩放指数，实现平滑往返
        let scale_exp;
        if (de_index < halfLoopFrames) {
            scale_exp = de_index;
        } else {
            scale_exp = fullLoopFrames - de_index;
        }

        let scale = Math.pow(coeff, scale_exp);

        const layers = [];
        for (let j = 0; j < 4; j++) {
            layers.push({ scale });
            scale /= 5;
        }

        drawFrame(ctx, baseCanvas, frameW, frameH, layers);
        encoder.addFrame(ctx);
    }

    encoder.finish();
    return encoder.out.getData();
}

// 调用示例
(async () => {
    // 假设你有 1.gif 这个文件
    const bufGif = await alwaysSyncSmooth('1.gif');
    fs.writeFileSync('output_sync_smooth.gif', bufGif);
    console.log('平滑过渡的同步 GIF 已成功生成！');
})();