# 52runoob — 56juqingba.com 内容与配图生产仓库

为英文 how-to 网站制作图文指南。文章以 JSON 为内容源，另生成可人工阅读的英文稿和独立网页素材包。素材包不是已验证的 CMS 导入包，也不会自动发布或进入网站原有分类。

## 当前任务与进度

新要求：**19 个现有分类各新增至少 5 篇**，每篇标题以 “How to” 开头、15–20 步、每步一张图另配封面，并有站内链接、出站链接和参考资料。详见 `docs/批量内容生产计划.md` 和 `content/expanded-plan.csv`。

每轮最多生成 10 张插画，而每篇需要 16 张（封面 + 15 步），所以一轮做不完整篇；配图是当前进度瓶颈。
按这个上限，每多做 1 篇约需 1.6 轮纯画图；用户提出的“再写 50 篇”约等于 800 张图、80 轮以上。因此当前策略是**文字稿先行**：先把经过资料核实的正文备好，后续轮次集中补图。

- `content/Run-Your-First-5K/`：15 步图文稿、16 张不同的图片（新制 10 张，6 张沿用相关冬季跑步插画）、4 条站内链接、3 条站外资源和 4 条参考资料。2026-10-29 复查该文已在站点可访问并显示 15 步 15 图；发布不是由本仓库执行的。运动健康内容仍需真人审校。
- `downloads/First-5K-Upload.zip`：上述稿件的独立网页和人工上传素材包；页面上有待审校提示。
- `content/Repot-a-Houseplant/`：15 步英文稿，16 张插画全部为本文新制，体检 0 error；素材包 `downloads/Repot-a-Houseplant-Upload.zip`。待真人审校，未发布。
- `content/Plan-a-Run-Walk-Workout/`：15 步英文稿，16 张插画全部为本文新制，体检 0 error；素材包 `downloads/Run-Walk-Workout-Upload.zip`。待真人审校，未发布。
- `downloads/All-16-Articles-Upload.zip`：前 16 篇成稿的合集包，内含各篇独立文件夹与一个本地总目录页；每篇内容与对应单篇包逐字节一致。该文件已接近 GitHub 50 MB 建议上限，第 17 篇起不再更新合集，改以增量包续传。
- `downloads/Add-On-4-New-Articles-Upload.zip`：增量包，只装第 11–14 篇（遛狗、水彩、一对一会议、干手护理），但根目录的总目录页按 14 篇生成；适合已经上传过前 10 篇、只想补传新增的情况。由 `tools/package_increment.py` 生成。
- `downloads/下载清单.md`：**逐篇下载对照表**（23 篇 × 单篇包 × 大小 × 直链）。已上传过的篇目直接跳过，不要重复下载合集包或增量包。从第 24 篇起只产出该篇的单篇包，不再每轮重打增量包；需要补齐若干篇时再临时合并。
- `downloads/Add-On-Since-All-16-Upload.zip`：**最新增量包**，装 All-16 之后的全部新篇目（目前为第 17 篇《How to Organize a Holiday Potluck》、第 18 篇《How to Plan a School Club Meeting》、第 19 篇《How to Map a Philosophical Argument》、第 20 篇《How to Make a Sincere Apology》、第 21 篇《How to Listen More Actively》、第 22 篇《How to Set a Personal Boundary》与第 23 篇《How to Handle a Disagreement Calmly》），根目录总目录页按 23 篇生成；适合已上传过前 16 篇者续传。后续新篇会继续并入这个同名包，链接不变。
- `downloads/Add-On-Hang-a-Picture-Upload.zip`：上一版增量包，只装第 16 篇，目录页按 16 篇生成。
- 包内结构：单篇 35 个条目 = `index.html` + `Article-English.txt` + `README-中文.txt` + `Images/` 下 16 张插画 × 两档（`-1600.webp` 1600×900 与 `-960.webp` 960×540）；合集为 篇数×35 + 2。网页用 `srcset` 按屏幕宽度自动选档，手机只下载小图，封面不走懒加载。
- `content/Back-Up-Your-Photos/`：15 步英文稿，16 张插画全部为本文新制，体检 0 error；素材包 `downloads/Back-Up-Your-Photos-Upload.zip`。待真人审校，未发布。
- `content/Check-Your-Tire-Pressure/`（Cars and Other Vehicles）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 NHTSA；素材包 `downloads/Check-Your-Tire-Pressure-Upload.zip`。待真人审校，未发布。
- `content/Meal-Prep-Safely-for-the-Week/`（Food and Entertaining）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 USDA FSIS 与 FoodSafety.gov；素材包 `downloads/Meal-Prep-Safely-for-the-Week-Upload.zip`。待食品安全专业人士审校，未发布。
- `content/Build-an-Emergency-Fund/`（Finance and Business）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 CFPB；素材包 `downloads/Build-an-Emergency-Fund-Upload.zip`。属 YMYL 理财内容，须持证理财人士审校，未发布。
- 缺图稿件无法通过质量检查，因此不打包、不算完成；缺图清单见 `article.json` 的 `imageStatus.stepImagesPending`。未绘制的步骤在 JSON 里用 `imageTodo` 而非 `image`，这是测试强制的约定。
- `preview/All-Finished-Articles.html`：仓库内成稿目录页，由 `tools/make_preview_index.py` 生成，缺图稿会被拒绝列入。
- `content/Organize-Medicines-Safely-at-Home/`（Health）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 FDA、DEA 与 CDC；素材包 `downloads/Organize-Medicines-Safely-at-Home-Upload.zip`。属 YMYL 居家用药内容，须药师审校，未发布。
- `content/Pack-a-Personal-Item-for-a-Trip/`（Travel）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 TSA 与 FAA；素材包 `downloads/Pack-a-Personal-Item-for-a-Trip-Upload.zip`。安检与锂电池规则会变且各国不同，须真人按最新官方页面核校，未发布。
- `content/Hold-a-Family-Meeting/`（Family Life）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 NC State Extension、University of Wisconsin-Extension 与 CDC；素材包 `downloads/Hold-a-Family-Meeting-Upload.zip`。涉及未成年人沟通与家庭冲突，须真人审校，未发布。
- `content/Build-a-Dog-Walking-Routine/`（Pets and Animals）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 AVMA 三份指南与 CDC Healthy Pets；素材包 `downloads/Build-a-Dog-Walking-Routine-Upload.zip`。属 YMYL 动物健康内容，须执业兽医审校，未发布。
- `content/Begin-a-Watercolor-Sketchbook/`（Hobbies and Crafts）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 Tate、美国国会图书馆与加拿大文保研究所；素材包 `downloads/Begin-a-Watercolor-Sketchbook-Upload.zip`。待真人审校，未发布。
- `content/Prepare-for-a-One-on-One-Meeting/`（Work World）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 Baylor 大学人力资源、美国人事管理局（OPM）与哈佛商学院 Working Knowledge；素材包 `downloads/Prepare-for-a-One-on-One-Meeting-Upload.zip`。待 HR 专业人士审校，未发布。
- `content/Care-for-Dry-Hands/`（Personal Care and Style）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自美国皮肤病学会（AAD）两份干皮指南、CDC 手部皮炎页与 NIOSH 皮肤暴露页；素材包 `downloads/Care-for-Dry-Hands-Upload.zip`。属 YMYL 皮肤健康内容，须皮肤科医生审校，未发布。
- `content/Make-Effective-Study-Flashcards/`（Education and Communications）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 John Dunlosky 发表于 American Educator 的学习策略综述、罗切斯特大学学习中心与北卡罗来纳大学教堂山分校学习中心；素材包 `downloads/Make-Effective-Study-Flashcards-Upload.zip`。待教师或学习中心专业人士审校，未发布。
- `content/Hang-a-Picture-Securely/`（Arts and Entertainment）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自加拿大文保研究所（CCI）两份绘画养护指南、美国国家公园管理局 Conserve O Gram 2/7 与博物馆手册附录 L、美国国会图书馆纸本保存页；素材包 `downloads/Hang-a-Picture-Securely-Upload.zip`。涉及打孔与承重，须有经验的施工人员按当地建筑做法复核，未发布。
- `content/Organize-a-Holiday-Potluck/`（Holidays and Traditions）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 FoodSafety.gov 最低安全内部温度表、USDA FSIS《Kitchen Companion》、FDA 九大食物过敏原说明与明尼苏达州卫生部自助餐食品安全页；素材包 `downloads/Organize-a-Holiday-Potluck-Upload.zip`。属食品安全内容，须合格食品安全专业人士对照现行 USDA/FDA 及当地法规复核，未发布。
- `content/Plan-a-School-Club-Meeting/`（Youth）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自麻省大学 Mass 4-H 议事规则指南、密苏里大学推广站 LG903、爱荷华州立推广站会议脚本与俄亥俄州立 4-H 副主席手册；素材包 `downloads/Plan-a-School-Club-Meeting-Upload.zip`。面向青少年读者，须学校活动指导老师按本校社团手册复核，未发布。
- `content/Map-a-Philosophical-Argument/`（Philosophy and Religion）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自萨斯喀彻温大学图书馆论证图教程、俄克拉荷马州立大学开放教材《Logic and the Study of Arguments》与苏格兰资格监管局（SQA）哲学《Arguments in Action》辅导材料；素材包 `downloads/Map-a-Philosophical-Argument-Upload.zip`。术语口径各教材不一，须哲学或逻辑课教师复核，未发布。
- `content/Make-a-Sincere-Apology/`（Relationships）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自俄亥俄州立大学 Lewicki、Polin 与 Lount 的有效道歉六要素研究（含 NCMR 期刊原文）、加州大学伯克利分校 Greater Good 科学中心的三步道歉法与美国心理学会《Monitor on Psychology》宽恕专题；素材包 `downloads/Make-a-Sincere-Apology-Upload.zip`。涉及人际与心理健康，须咨询师、心理师或调解人复核，其中关于控制型与暴力关系的提示须按出版国的家暴服务指引核对，未发布。
- `content/Listen-More-Actively/`（Relationships）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 Samaritans 的 SHUSH 主动倾听要点与「照顾自己」一节，以及明尼苏达大学 REACH 对 Weger 等 2014 年主动倾听实验的研究摘要（含期刊原文 DOI）；素材包 `downloads/Listen-More-Actively-Upload.zip`。涉及心理健康与危机情境提示，须咨询师或倾听机构的培训者复核，其中紧急电话与保密义务须按出版国改写，未发布。
- `content/Set-a-Personal-Boundary/`（Relationships）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自 Mayo Clinic《Being assertive》、Mary Immaculate College 学生咨询处的果断沟通自助表（when you/I feel/I would prefer 脚本与 broken record、fogging、defusing 技巧）、密歇根州立大学推广站《When boundaries are crossed》与 HelpGuide 的边界类型说明；素材包 `downloads/Set-a-Personal-Boundary-Upload.zip`。涉及人际与心理健康，须咨询师或心理师复核，强制控制关系与职场章节须按出版国的家暴服务与雇佣实务改写，未发布。
- `content/Handle-a-Disagreement-Calmly/`（Relationships）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自美国心理学会《Control anger before it controls you》（宣泄会升级愤怒、认知重构、禁用 never/always）、加州大学伯克利分校人力资源指南《Resolving Conflict Situations》（先找需要再找方案、达成最小共识、两周复盘）与哈佛法学院谈判项目《What is Conflict Resolution, and How Does It Work?》（自利式公平、过度自信、沉没成本加注、回避四类陷阱）；素材包 `downloads/Handle-a-Disagreement-Calmly-Upload.zip`。涉及人际冲突与愤怒管理，须咨询师、调解员或心理师复核，安全警示须按出版国的家暴服务与雇佣实务改写，未发布。
- `content/Ask-for-Feedback-in-a-Relationship/`（Relationships）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自美国心理学会《Speaking of Psychology》第 381 集（罗切斯特大学 Harry Reis 谈「被爱」与「觉得被爱」的差别，以及要判决式的问法必然引发反弹）、第 386 集（海法大学 Guy Itzchakov 谈高质量倾听如何降低防御）与创新领导力中心的 SBI／SBII 反馈模型（情境-行为-影响，再问意图）；素材包 `downloads/Ask-for-Feedback-in-a-Relationship-Upload.zip`。涉及亲密关系与心理健康，须咨询师或伴侣治疗师复核，虐待关系警示须按出版国的家暴服务改写，未发布。**本篇只提供单篇包，未并入增量包。**
- `content/Start-a-Reflective-Journal/`（Philosophy and Religion）：15 步英文稿，16 张插画全部为本文新制，体检 0 error；资料取自爱丁堡大学 Reflection Toolkit 的反思模型总览与 What? So what? Now what?（Driscoll 1994，承 Borton 1970）以及斯坦福哲学百科《Marcus Aurelius》《Stoicism》（《沉思录》是写给自己的自我训诫，爱比克泰德主张每天写下备用的应对）；素材包 `downloads/Start-a-Reflective-Journal-Upload.zip`。涉及反思写作与心理健康邻域，须咨询师或反思实践教育者复核反刍与创伤警示，隐私建议须按出版国的数据保护惯例核对，未发布。**本篇只提供单篇包，未并入增量包。**
- 其余 70 篇为选题，尚未完成正文与配图。`expanded-plan.csv` 是进度记录，不要将选题当成成品。
- `content/Keep-Running-Through-Winter/`：此前制作的旧版 12 步样稿及 13 张插画；其原素材包为 `downloads/Winter-Running-Upload.zip`。公开网站的分类和详情页现已显示该稿，但旧稿不计入本批 15–20 步的新稿目标。

## 生产规范

1. 新稿 `requirements` 设置 `stepMin: 15`、`stepMax: 20`、`externalLinksMin: 2`、`uniqueImagesWithinArticle: true`。每一步与封面都要有不同的图片和准确 alt；使用旧图须记录来源。手绘画风参考本地参考图，不复制其人物或背景。
2. 至少 3 条有关的站内链接、2 条可点击的站外资源、3 条带网址的参考资料；优先使用已验证可访问的权威来源。发布前再次核对链接和时效。
3. 生成 1600×900 和 960×540 WebP 两种尺寸。医学、运动、财务、宠物、汽车等内容须由合适的真人进行事实和安全审校；不虚填作者或专家审校信息。
4. 缺图、缺链接或未通过体检的文章只能作为草稿，不得声称制作完成。独立网页包在服务器静态目录解压后才可能获得网址；不会自动进入原网站文章数据库。

## 开发与校验

```bash
# 生成可读稿、预览与未经 CMS 契约验证的 payload 草案
python3 tools/render_article.py content/Run-Your-First-5K/article.json
# 新稿严格校验 15–20 步、逐步配图、出站链接等
python3 tools/check_article.py content/Run-Your-First-5K/article.json
# 仅在正文、配图和链接检查通过后生成独立网页素材包
python3 tools/package_article.py content/Run-Your-First-5K/article.json downloads/First-5K-Upload.zip
# 回归测试
python3 -m unittest discover -s tests -v
```

旧文章没有新 `requirements` 时沿用旧的 9–14 步检查范围，不代表旧稿符合新要求。`docs/API发布说明.md` 中的 API 探测和封面上传是历史技术记录；通用发布器的真实写入仍被锁定，用户当前选择人工下载素材，不需要运行 API 工具。
