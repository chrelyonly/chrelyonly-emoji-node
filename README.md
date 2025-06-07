重新用node写了一遍,java的gif编码器有点问题,但是node的gif编码器也不好用
## 在这里预览效果
```
https://nginx-3.frp.chrelyonly.cn/emoji-app/
```
# 建议
## 浏览器的gif播放有帧限制,过低会导致gif动画异常(即使保存出来也异常),用请求工具直接访问接口拿gif可以无视浏览器帧限制


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