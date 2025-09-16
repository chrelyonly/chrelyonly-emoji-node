import fs from 'fs';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import GIFEncoder from 'gifencoder';

/**
 * 准备基础画布
 * 将原图绘制到一个带文本和小图的画布上
 * @param {string} imagePath 图片路径
 * @returns {Promise<{canvas: import('@napi-rs/canvas').Canvas, frameW: number, frameH: number}>}
 */
async function prepareBaseCanvas(imagePath) {
    const img = await loadImage(imagePath); // 加载图片
    const ratio = img.height / img.width;   // 图片宽高比

    // 设置大图和小图尺寸
    const imgBigW = 500;
    const imgBigH = Math.round(imgBigW * ratio); // 高度按比例计算
    const imgSmallW = 100;
    const imgSmallH = Math.round(imgSmallW * ratio);

    // 文本高度，保证最少80像素
    const textH = Math.max(imgSmallH + 10, 80);
    const frameW = imgBigW;
    const frameH = imgBigH + textH; // 整个画布高度 = 大图高度 + 文本高度

    // 创建画布
    const canvas = createCanvas(frameW, frameH);
    const ctx = canvas.getContext('2d');

    // 绘制背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, frameW, frameH);

    // 绘制文本
    ctx.font = '30px "Microsoft YaHei", sans-serif'; // 中文字体
    ctx.textAlign = 'right';  // 右对齐
    ctx.fillStyle = 'black';
    ctx.fillText('要我一直', 280, imgBigH + 50); // 左边文字
    ctx.textAlign = 'left';   // 左对齐
    ctx.fillText('吗', 400, imgBigH + 50);       // 右边文字

    // 绘制大图
    ctx.drawImage(img, 0, 0, imgBigW, imgBigH);

    // 绘制小图（右下角）
    ctx.drawImage(
        img,
        290, // x 坐标
        imgBigH + 5 + (textH - imgSmallH) / 2, // y 坐标，垂直居中于文本区域
        imgSmallW,
        imgSmallH
    );

    return { canvas, frameW, frameH };
}

/**
 * 绘制单帧
 * 可绘制多层缩放图，用于德罗斯特效果
 * @param {CanvasRenderingContext2D} ctx 目标画布上下文
 * @param {Canvas} baseCanvas 基础画布
 * @param {number} frameW 画布宽度
 * @param {number} frameH 画布高度
 * @param {Array<{scale:number}>} scaleLayers 缩放层数组
 */
function drawFrame(ctx, baseCanvas, frameW, frameH, scaleLayers = []) {
    // 先填充白色背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, frameW, frameH);

    // 遍历每个缩放层
    for (const layer of scaleLayers) {
        const { scale } = layer;
        const w = Math.round(frameW * scale); // 缩放后的宽
        const h = Math.round(frameH * scale); // 缩放后的高

        // 偏移量，右下角保持固定位置
        const x = Math.round((frameW - w) * (1 - 0.28)); // 类似 Rust 版本中的 358/500
        const y = Math.round(frameH - h);

        ctx.drawImage(baseCanvas, x, y, w, h);
    }
}

/**
 * 生成普通图片（PNG）
 * @param {string} imagePath
 */
export async function alwaysNormal(imagePath) {
    const { canvas } = await prepareBaseCanvas(imagePath);
    return canvas.toBuffer('image/png'); // 输出 PNG
}

/**
 * 生成无限放大循环（德罗斯特效果）
 * @param {string} imagePath
 * @param {boolean} loop 是否循环
 */
export async function alwaysAlways(imagePath, loop = false) {
    const { canvas: baseCanvas, frameW, frameH } = await prepareBaseCanvas(imagePath);

    if (!loop) return baseCanvas.toBuffer('image/png'); // 如果不循环，直接输出 PNG

    const frameNum = 20; // 帧数
    const encoder = new GIFEncoder(frameW, frameH);
    encoder.start();        // 开始编码
    encoder.setRepeat(0);   // 0 = 无限循环
    encoder.setDelay(100);  // 每帧延迟 100ms
    encoder.setQuality(10); // 质量参数

    const coeff = Math.pow(5, 1 / frameNum); // 缩放系数
    const canvas = createCanvas(frameW, frameH);
    const ctx = canvas.getContext('2d');

    // 循环绘制每一帧
    for (let i = 0; i < frameNum; i++) {
        let scale = Math.pow(coeff, i);
        const layers = [];
        // 每帧绘制 4 层递减缩放图，形成套娃效果
        for (let j = 0; j < 4; j++) {
            layers.push({ scale });
            scale /= 5;
        }
        drawFrame(ctx, baseCanvas, frameW, frameH, layers);
        encoder.addFrame(ctx); // 添加到 GIF
    }

    encoder.finish();
    return encoder.out.getData(); // 输出 GIF
}

/**
 * 主入口函数
 * @param {string} imagePath 图片路径
 * @param {{mode: 'normal' | 'loop', circle: boolean, loop: boolean}} options
 */
export async function always(imagePath, options = { mode: 'normal', circle: false, loop: false }) {
    if (options.circle) return alwaysAlways(imagePath, false); // circle 模式
    if (options.loop) return alwaysAlways(imagePath, true);    // loop 模式
    if (options.mode === 'loop') return alwaysAlways(imagePath, true);
    return alwaysNormal(imagePath); // 默认普通模式
}

// 调用示例
(async () => {
    // 输出 PNG
    const buf = await always('1.gif', { mode: 'normal' });
    fs.writeFileSync('output.png', buf);

    // 输出无限循环 GIF
    const bufGif = await always('1.gif', { mode: 'loop' });
    fs.writeFileSync('output.gif', bufGif);
})();
