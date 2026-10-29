# 配图 Prompt 模板（Howly 风格锁）

## 风格锁（每张末尾固定加这段）

```
documentary editorial photography, soft natural light, muted cool palette with warm skin tones,
35mm lens, shallow depth of field, realistic, no text, no watermark, no logos
```

## 公式

```
[谁 + 在做什么] + [环境里 2–3 个具体物件] + [时间与光线方向] + [构图要求] + [风格锁]
```

要点：
- 主体**不看镜头**（背影、侧脸、低头），保持纪实感；
- 每个环境塞 2–3 个生活痕迹物件（长椅、保温杯、叠好的衣服、霜、车钥匙）；
- 光线写具体：`early morning light behind trees`、`overcast winter light`、`warm indoor light spilling toward a cold window`；
- 构图写留白方向：`wide 16:9 composition with room around the subject`，方便裁切做卡片图；
- 负向词直接写进 prompt：`no readable text, no logos, no watermark`。

## 按类目举例

| 类目 | Prompt 片段 |
|---|---|
| Sports and Fitness | `a person jogging slowly on a gravel path, breath visible, gloves and beanie, frost at the edges of the path` |
| Food | `a cook lifting the lid from a steaming pot, wooden spoon, folded tea towel, warm morning light from a side window` |
| Home and Garden | `hands repotting a plant on newspaper, terracotta pot, loose soil, bright overcast daylight` |
| Finance | `a person at a kitchen table with statements, two pens, a mug, a laptop closed to one side, soft window light` |
| Cars | `hands holding jumper cables beside an open bonnet, engine bay slightly out of focus, overcast driveway light` |
| Computers | `a laptop on a desk with a screwdriver, external drive and a notebook, cool screen glow against warm room light` |

## 每篇文章的图片清单

| 序号 | 文件 | 内容 |
|---|---|---|
| 00 | `00-hero-1600.webp` | 最能代表全篇的场景（卡面 + og:image） |
| 01–12 | `NN-<语义>-1600.webp` | 与步骤一一对应，动作必须不同 |

## 生成后处理

```bash
bash tools/make_images.sh content/<Slug>/images   # PNG -> 960w / 1600w webp，q82
```

- 统一 16:9 居中裁切，避免主体被裁掉（构图时就在 prompt 里要求留白）；
- 输出检查：单张 < 200KB，尺寸 1600×900 / 960×540；
- 需要替换某张时，只重跑那一条 prompt，保持文件名不变，页面无需改动。
