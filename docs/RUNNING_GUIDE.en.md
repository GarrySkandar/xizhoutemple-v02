# TempV02: Illustrated User Guide

TempV02 is an interactive guide to a Chinese Buddhist monastery. Visitors choose Chinese or English, explore the aerial map, and open illustrated pages for individual halls. Selected buildings also include an audio interaction.

[中文图文说明](RUNNING_GUIDE.zh-CN.md)

## 1. Open the guide map

After starting the local server, open the Chinese entry point at `http://localhost:3000/zh/`. The page presents the monastery map with clickable building hotspots.

![Chinese guide map](images/zh-home.png)

Select any hotspot to open its page, such as the Mountain Gate, Hall of Heavenly Kings, Mahavira Hall, or Bell Tower. Hotspots also have accessible labels and can be reached with the Tab key.

## 2. Switch between Chinese and English

The language selector is in the upper-right corner of each home page.

| Current page | Switch to | Deployed path |
| --- | --- | --- |
| Chinese home | English | `/en/` |
| English home | Chinese | `/zh/` |

Both versions use the same map, images, and audio, while their hotspot labels, page titles, and Markdown content are localized.

> Deployment note: deploy the site at the domain root, for example `https://example.org/zh/` and `https://example.org/en/`. The existing language links are root-relative. A GitHub Pages project site such as `https://name.github.io/repository/` needs adjusted language links or a custom domain before publishing.

## 3. Read a hall page and play sound

Selecting a hotspot opens a dedicated page with a link back to the guide map, an illustration, Markdown-based content, and a link to the original Markdown file.

![Chinese Bell Tower page](images/zh-bell-tower.png)

On the Bell Tower and Drum Tower pages, the transparent hotspot over the picture plays the relevant bell or drum sound. It supports mouse click, Enter, and Space. The Markdown content is loaded over HTTP, so use `node server.js` instead of opening HTML files directly from the file system.

## 4. English experience

Open `http://localhost:3000/en/` for the English site. It preserves the visual map and media experience while localizing hall names, detail titles, and written content.

![English guide map](images/en-home.png)

English hall pages use static, indexable `halls/<id>.html` URLs. Both language versions provide a top navigation link back to the guide map.

## 5. Deployment acceptance checklist

Before release, verify the following in the hosted preview:

1. Open `/zh/`; confirm the Chinese home page, hotspots, and hall pages work.
2. Select `English` in the upper-right corner; confirm it opens `/en/`.
3. Select `Chinese` on `/en/`; confirm it returns to `/zh/`.
4. Check a hall page in each language for Markdown content, images, and back navigation.
5. Test the audio hotspots on both the Bell Tower and Drum Tower.
6. Check that the language selector and map remain usable at a mobile width.

## Run locally

```bash
git clone https://github.com/GarrySkandar/xizhoutemple-v02.git
cd xizhoutemple-v02
node server.js
```

The default URLs are `http://localhost:3000/zh/` for Chinese and `http://localhost:3000/en/` for English.

Before rebuilding deployment artifacts, read the build-safety section in [the architecture guide](ARCHITECTURE.md). The current build scripts recreate `zh/`, `EN/`, and `dist/`.
