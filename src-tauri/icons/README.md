# 图标文件说明

此目录用于存放应用程序的图标文件。

需要以下格式的图标文件：

- 32x32.png - 32x32 像素 PNG 图标
- 128x128.png - 128x128 像素 PNG 图标
- 128x128@2x.png - 256x256 像素 PNG 图标（高分辨率）
- icon.icns - macOS 图标文件
- icon.ico - Windows 图标文件

## 生成图标的建议方法

1. **创建基础图标**
   - 使用设计工具（如 Figma、Sketch、Adobe Illustrator）创建一个高分辨率的方形图标
   - 建议尺寸为 1024x1024 像素
   - 使用简洁的设计，包含 Claude 相关元素

2. **转换为所需格式**
   ```bash
   # 如果有 ImageMagick，可以这样转换：
   convert icon-1024.png -resize 32x32 32x32.png
   convert icon-1024.png -resize 128x128 128x128.png
   convert icon-1024.png -resize 256x256 128x128@2x.png
   ```

3. **使用在线工具**
   - 可以使用在线图标生成器将 PNG 转换为 ICO 和 ICNS 格式
   - 推荐工具：favicon.io、convertico.com 等

## 临时解决方案

在开发阶段，可以使用 Tauri 的默认图标，或者创建简单的占位符图标。

## 图标设计建议

- 使用 Claude 相关的颜色（如橙色、蓝色渐变）
- 简洁的设计风格，确保在小尺寸下也清晰可辨
- 可以考虑使用环境切换相关的图标元素（如切换按钮、环境图标等）