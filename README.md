重新用node写了一遍,java的gif编码器有点问题,但是node的gif编码器也不好用(已解决)
## 建议
### 浏览器的gif播放有帧限制,过低会导致gif动画异常(即使保存出来也异常),用请求工具直接访问接口拿gif可以无视浏览器帧限制
### ffmpeg
#### 1.已修改为内置ffmpeg独立编译精简版(仅仅占用10MB)
#### 2.使用官方仓库代码编译,2025年6月9日14:23:17的克隆
```
https://github.com/FFmpeg/FFmpeg.git
https://github.com/chrelyonly/chrelyonly-ffmpeg-gif
```
## 环境node
### 建议node20 使用pnpm
``` 
pnpm install
```
### 暂不兼容mac系统和arm架构的
# 
## 使用ffmpeg进行gif编码,不再使用自带的库
## 在这里预览效果
```
https://nginx-3.frp.chrelyonly.cn/emoji-app/
```

##下载ffmpeg
### 在这个地址下载对应系统的,下载(lgpf协议),
```
https://github.com/BtbN/FFmpeg-Builds/releases
https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n7.1-latest-win64-lgpl-7.1.zip
https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n7.1-latest-linux64-lgpl-7.1.tar.xz
```
### 然后修改ffmpeg的调用位置就行
```
ffmpeg.setFfmpegPath(path.join("src", "lib", "win", "ffmpeg.exe")
```
