# 汉传佛教寺院导览图（TempV02）

**中文** | [English](README.en.md)

一个不依赖前端框架的交互式寺院导览网站。用户可在鸟瞰导览图上点击殿堂热点，进入对应的图文介绍页面；网站提供中文与英文版本，并为钟楼、鼓楼等地点提供可点击的音效热点。

> **版本说明 / Version notice**  
> 本仓库发布的是历史 **V02** 版本，仅用于开源展示、学习与维护。当前线上运行的是 **V03** 版本，请访问 [www.xizhoutemple.com](https://www.xizhoutemple.com)。  
> This repository contains the historical **V02** release for open-source reference. The currently deployed website runs **V03** at [www.xizhoutemple.com](https://www.xizhoutemple.com).

> TempV02 是西洲寺院导览项目的历史独立版本。本仓库保留其源码、双语内容、媒体资源和本地开发方式。

## 功能

- 鸟瞰寺院图上的可访问交互热点
- 16 个寺院建筑/地点的独立介绍页
- Markdown 驱动的介绍内容
- 中文 (`/zh/`) 与英文 (`/en/`) 入口
- 图集、关联页面和局部音效播放
- 英文静态详情页与 sitemap，便于索引

## 快速开始

要求：Node.js（仅使用内置模块；当前没有第三方依赖）。

```bash
git clone https://github.com/GarrySkandar/xizhoutemple-v02.git
cd xizhoutemple-v02
node server.js
```

随后打开：

- 中文：`http://localhost:3000/zh/`
- English: `http://localhost:3000/en/`

可通过 `PORT` 修改端口，例如 PowerShell：

```powershell
$env:PORT=8080; node server.js
```

## 项目结构

```text
TempV02/
├── assets/                 # 首页鸟瞰图等共享素材
├── images/                 # 各殿堂图片
├── music/                  # 鼓声、钟声等音频
├── content/                # 中文源 Markdown；English/ 为英文源 Markdown
├── data.js                 # 中文热点位置、媒体关联等结构化数据
├── index.html + main.js    # 源站首页与热点渲染
├── halls/                  # 中文详情页（现有静态页面）
├── generate-pages.js       # 生成中文详情页的旧/独立脚本
├── build-locales.js        # 生成 zh/ 与 EN/ 本地化发布副本
├── build-sites.js          # 生成 Sites 发布目录 dist/
├── server.js               # 无依赖本地静态服务器
├── zh/                     # 构建得到的中文副本
├── EN/                     # 构建得到的英文副本
└── dist/                   # Sites 发布构建输出
```

完整的数据流、构建边界和协作规则见 [架构说明](docs/ARCHITECTURE.md)。

## 运行效果与使用说明

- [中文图文说明](docs/RUNNING_GUIDE.zh-CN.md)
- [English illustrated guide](docs/RUNNING_GUIDE.en.md)

两个版本在页面右上角提供语言切换。以根域名部署时，中文入口为 `/zh/`，英文入口为 `/en/`。

## 内容编辑

1. 在 `content/<id>.md` 修改中文介绍。
2. 在 `content/English/<id>.md` 修改相应英文介绍。
3. 在 `data.js` 增加或调整热点的 `id`、位置、图片和音效信息。
4. 如需要更新生成的语言副本，先阅读下方“构建安全”说明，再执行构建。

热点 `id` 必须与 Markdown 文件名和详情页文件名一致，例如 `shanmen` 对应 `content/shanmen.md` 与 `halls/shanmen.html`。

## 构建安全

`npm run build` 会依次执行 `build-locales.js` 和 `build-sites.js`。这两个脚本会删除后重建以下已有目录：

- `zh/`
- `EN/`
- `dist/`

因此，**不要把手工内容仅保存在这些目录内**。在执行构建前，应先确认 Git 状态，并提交或备份其中需要保留的改动。推荐把可编辑的内容放在源目录（`content/`、`assets/`、`images/`、`music/` 和根目录的源码文件）中。

## 开源前清单

- [ ] 确认所有图片、音频及文本拥有公开再发布的权利，或补充来源与许可说明。
- [ ] 选择并新增开源许可证（例如 MIT、Apache-2.0 或 CC BY 4.0；需根据代码与内容分别判断）。
- [ ] 检查 `.openai/hosting.json` 中的部署项目标识是否应随仓库公开。
- [ ] 决定是否提交 `zh/`、`EN/`、`dist/` 等生成副本；推荐只保留一种明确的发布策略。
- [ ] 在 GitHub 仓库设置 Topics、描述、默认分支和 Issue/PR 模板。

## 许可证

当前仓库尚未包含许可证文件。公开发布前请补充适合代码、图片、音频与文稿的授权声明。
