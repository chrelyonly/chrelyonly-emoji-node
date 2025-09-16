import fs from 'fs';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import GIFEncoder from 'gifencoder';
import gifFrames from 'gif-frames'; // 引入新的库

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
    const gifFrameData = await gifFrames({ url: imagePath, frames: 'all', outputType: 'png' });
    if (gifFrameData.length === 0) {
        throw new Error("无法读取 GIF 帧数据。");
    }

    const firstFrameBuffer = await streamToBuffer(gifFrameData[0].getImage());
    const { frameW, frameH } = await prepareBaseCanvas(firstFrameBuffer);

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
    for (let gifIndex = 0; gifIndex < gifFrameData.length; gifIndex++) {
        const frameData = gifFrameData[gifIndex];
        const frameBuffer = await streamToBuffer(frameData.getImage());
        const { canvas: baseCanvas } = await prepareBaseCanvas(frameBuffer);

        // 设置当前原始帧的延迟，并转换为 GIFEncoder 的单位 (1/100s -> 1/1000s)
        const delay = frameData.frameInfo.delay * 10;
        encoder.setDelay(delay);

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