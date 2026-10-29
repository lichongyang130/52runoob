# 配图 Prompt 模板：温暖手绘感，场景随内容变化

## 风格基准

以用户提供的参考图为**画法和氛围**参考：自然主义手绘插画、柔和的油画/水彩笔触、细微纸面或画布纹理、自然光、低饱和的鼠尾草绿 / 奶油白 / 赭色 / 土棕色，人物和物件比例真实、细节清楚。参考图作为本地工作素材，不提交至公开仓库；如本地没有该文件，请使用用户原附件。不要生成照片、扁平矢量画、强烈黑色描边的卡通图，也不照搬参考图的人物和构图。

**参考图是风格，不是场景模板。** 不要把每篇都画成乡村厨房，不要把围裙、木桌、窗户或复古服装机械套入其他主题。地点、时代、人物、工具、天气和光线应由文章及步骤决定：跑步可在公园、海边、城市人行道、居家玄关；修车在车道或车库；电脑文章用当代办公桌；只有内容需要时才出现厨房。夜景可以使用冷蓝灰色，依然保留温暖、细腻的手绘质感，不必每张都金黄色。

## 固定风格后缀（每张 prompt 末尾）

```text
naturalistic hand-painted editorial illustration, softly blended oil and watercolor brushwork on textured paper, luminous natural light appropriate to the scene, muted sage, ochre, cream and earthy tones, warm skin tones, believable details and anatomy, subtle depth, no heavy ink outlines, not a cartoon or flat vector, no text, no watermark, no logos
```

## 公式

```text
[用途与 16:9 横幅构图] + [参考图只用于画法，不复制场景/人物] +
[谁在什么地点做什么：与具体步骤一致] + [2–3 个必要且准确的物件] +
[符合时段、天气的光线] + [构图留白与安全细节] + [固定风格后缀]
```

生成时把参考图作为图片参考输入，并明确写 `style reference only; do not copy the people, kitchen, clothing or composition`。同篇各步骤使用**不同地点或不同镜头**（远景、环境中景、动作特写），不得为了凑数量重复同一动作。人物可自然地看向工具或任务；需要识别物件时优先保证准确清楚。避免不合理的解剖、器材和危险动作；不能依靠图片展示关键文字、数字或医疗/维修操作细节。

## 场景示例

| 类目 | 场景与动作示例 | 光线与变化 |
|---|---|---|
| Sports and Fitness | 穿现代运动装的人在公园小路热身；另一幅是城市人行道上的夜跑 | 冬日晨光 / 暮色路灯；远景 / 动作中景 |
| Food | 厨房中厨师揭开锅盖，手边有木勺和折好的布 | 根据烹饪步骤选厨房；不照搬参考图的室内布置 |
| Home and Garden | 在阳台或户外工作台为盆栽换盆，旁边有陶盆和泥土 | 明亮散射日光，手部动作特写 |
| Finance | 在明亮的现代书桌上整理账单、计算器和笔记本 | 窗边柔光；文件不出现可读文字或真实账单 |
| Cars | 在住宅车道检查车轮或打开的引擎盖 | 阴天自然光，工具与安全动作符合文章 |
| Computers | 在现代工作桌上整理笔记本电脑和外接硬盘 | 屏幕微光与自然光结合，不出现可读屏幕内容 |

实例（冬季跑步 Step 2）：

> One 16:9 illustration for a winter-running guide. Use the supplied image as a style reference only; do not copy its kitchen, people or clothing. A person in contemporary running clothes zips a thin jacket in a modern entrance hall, with a folded layer, gloves and a beanie on a bench; frosted daylight shows through the front door. Clear pose, natural anatomy, room around the subject — naturalistic hand-painted editorial illustration, softly blended oil and watercolor brushwork on textured paper, luminous natural light appropriate to the scene, muted sage, ochre, cream and earthy tones, warm skin tones, believable details and anatomy, subtle depth, no heavy ink outlines, not a cartoon or flat vector, no text, no watermark, no logos

## 每篇清单与后处理

- **1 张 hero + 每个步骤各 1 张**；12 步文章共 13 张，不能用一张图代替多个步骤。
- 每张 alt 写主体、动作、环境，并在人工验图后调整，使其忠实于实际画面。
- 图片以步骤顺序和语义命名，例 `02-layers-1600.webp` / `02-layers-960.webp`，不使用 UUID。
- 使用 `bash tools/make_images.sh content/<Slug>/images`，将 `images/raw/*.png` 转为 1600×900 和 960×540 WebP，质量 82、method 6；目标单张小于 200 KB。比例不同时居中裁切，生成时留足安全边距。
- 原始 PNG 是工作素材，不加入 Git；最终 WebP 与 alt 一起保留。替换已有图片后，发布缓存必须按文件内容哈希校验，防止沿用旧图 URL。
- 新旧风格过渡时，在文章 `media.stylePending` 列出仍待替换的图片 base；预览会标记旧图，体检与真实上传/发布会阻止未完成稿件。完成后清空该数组，更新 `publishing.imagePending`，重新渲染和体检。
