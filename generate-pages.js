const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const dataSource = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(`${dataSource}\nthis.HALLS = HALLS;`, context);

const halls = context.HALLS;
const extraPages = [
  {
    id: 'weituo',
    name: '韦驮菩萨',
    image: 'images/weituo.png',
    imageLink: 'tianwang.html',
    position: '常见于天王殿背面或寺院护法空间。',
    deities: '韦驮菩萨，汉传佛教寺院中重要的护法形象。',
    function: '护持佛法、守护道场、护佑僧众修学。',
    meaning: '象征护法、精进、庄严与道场清净。',
    summary: '韦驮菩萨是汉传佛教寺院中常见的护法菩萨形象。',
    intro: '韦驮菩萨在汉传寺院中常被安置于天王殿背面，面向大雄宝殿方向，象征护持佛法与守护道场。其形象提示参访者在礼敬与修学中保持恭敬、精进与清净。'
  },
  {
    id: 'qianshou',
    name: '千手观音',
    image: 'images/qianshouguanyin.png',
    imageLink: 'daxiong.html',
    position: '常见于观音相关殿堂或大殿造像体系中。',
    deities: '千手千眼观世音菩萨。',
    function: '表达观音菩萨大慈大悲、寻声救苦与广行方便。',
    meaning: '千手象征广大神通与救度方便，千眼象征遍观众生苦难。',
    summary: '千手观音是观世音菩萨慈悲救苦精神的重要造像形式。',
    intro: '千手观音以多手多眼的庄严形象表现大慈大悲。千手代表救度众生的多种方便，千眼代表观照世间苦难。参访者可由此理解观音信仰中慈悲、愿力与行动并重的精神。'
  }
];
const pages = [...halls, ...extraPages];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderImage(hall, image, index) {
  const imageTag = `<img class="hallPhoto" src="../${image}" alt="${escapeHtml(hall.name)}示意图${index + 1}" />`;
  if (!hall.sound) return `      ${imageTag}`;

  const hotspot = hall.soundHotspot || { x: 50, y: 50, w: 36, h: 36 };
  return `      <div class="soundImageWrap">
        ${imageTag}
        <span class="soundHotspot" role="button" tabindex="0" data-sound="../${hall.sound}" data-x="${hotspot.x}" data-y="${hotspot.y}" data-w="${hotspot.w}" data-h="${hotspot.h}" style="position:absolute;z-index:2;display:block;box-sizing:border-box;left:0;top:0;width:1px;height:1px;transform:translate(-50%,-50%);margin:0;padding:0;border:0;background:transparent;cursor:pointer;" aria-label="${escapeHtml(hall.soundLabel || `播放${hall.name}音效`)}"></span>
      </div>`;
}

function renderImageBlock(hall, imageCountClass, imageMarkup) {
  if (hall.imageLink) {
    return `    <a class="imageCard ${imageCountClass} imageCardLink" href="${escapeHtml(hall.imageLink)}" aria-label="查看${escapeHtml(hall.name)}相关页面">
${imageMarkup}
    </a>`;
  }

  return `    <section class="imageCard ${imageCountClass}">
${imageMarkup}
    </section>`;
}

function renderSoundScript(hall) {
  if (!hall.sound) return '';

  return `
  <script>
    function updateSoundHotspots() {
      document.querySelectorAll('.soundHotspot').forEach((button) => {
        const wrap = button.closest('.soundImageWrap');
        const image = wrap ? wrap.querySelector('.hallPhoto') : null;
        if (!wrap || !image || !image.complete || !image.naturalWidth) return;

        const width = image.clientWidth;
        const height = image.clientHeight;
        button.style.left = (width * Number(button.dataset.x) / 100) + 'px';
        button.style.top = (height * Number(button.dataset.y) / 100) + 'px';
        button.style.width = (width * Number(button.dataset.w) / 100) + 'px';
        button.style.height = (height * Number(button.dataset.h) / 100) + 'px';
      });
    }

    document.querySelectorAll('[data-sound]').forEach((button) => {
      async function playSound() {
        const audio = new Audio(button.dataset.sound);
        audio.currentTime = 0;
        try {
          await audio.play();
        } catch (error) {
          console.warn('音频播放被浏览器拦截或文件不可用', error);
        }
      }

      button.addEventListener('click', playSound);
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          playSound();
        }
      });
    });
    window.addEventListener('load', updateSoundHotspots);
    window.addEventListener('resize', updateSoundHotspots);
    updateSoundHotspots();
  </script>`;
}

function renderMarkdownDrivenPage(hall, imageBlock) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(hall.name)} - 汉传佛教寺院殿堂介绍</title>
  <meta name="description" content="${escapeHtml(hall.summary)}" />
  <link rel="canonical" href="../halls/${hall.id}.html" />
  <link rel="stylesheet" href="../styles.css" />
</head>
<body class="detailBody">
  <header class="detailTopbar">
    <a class="back" href="../index.html">返回寺院导览图</a>
    <span id="pageTitle">${escapeHtml(hall.name)}</span>
  </header>
  <main class="detailPage">
${imageBlock}
    <article class="articleCard">
      <p class="eyebrow">Temple Hall</p>
      <div id="markdownContent" class="markdownBody" aria-live="polite">
        <h1>${escapeHtml(hall.name)}</h1>
        <p class="summary">正在读取 Markdown 内容...</p>
      </div>
      <a class="mdLink" href="../content/${hall.id}.md">查看 Markdown 原文</a>
    </article>
  </main>${renderSoundScript(hall)}

  <script>
    const markdownPath = '../content/${hall.id}.md';
    const contentEl = document.querySelector('#markdownContent');
    const pageTitleEl = document.querySelector('#pageTitle');
    let lastMarkdown = '';

    function escapeHtml(value) {
      return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    function inlineMarkdown(value) {
      return escapeHtml(value)
        .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/\\*(.+?)\\*/g, '<em>$1</em>');
    }

    function renderMarkdown(markdown) {
      const lines = markdown.replace(/\\r\\n?/g, '\\n').split('\\n');
      let html = '';
      let paragraph = [];
      let listItems = [];

      function flushParagraph() {
        if (!paragraph.length) return;
        html += '<p>' + paragraph.map((line) => '<span class="mdLine">' + inlineMarkdown(line) + '</span>').join('') + '</p>';
        paragraph = [];
      }

      function flushList() {
        if (!listItems.length) return;
        html += '<ol>' + listItems.map((item) => '<li>' + inlineMarkdown(item) + '</li>').join('') + '</ol>';
        listItems = [];
      }

      for (const rawLine of lines) {
        const line = rawLine.trim();

        if (!line) {
          flushParagraph();
          flushList();
          continue;
        }

        const heading = line.match(/^(#{1,3})\\s+(.+)$/);
        if (heading) {
          flushParagraph();
          flushList();
          const level = heading[1].length;
          html += '<h' + level + '>' + inlineMarkdown(heading[2]) + '</h' + level + '>';
          continue;
        }

        const orderedItem = line.match(/^\\d+[.)]\\s+(.+)$/);
        if (orderedItem) {
          flushParagraph();
          listItems.push(orderedItem[1]);
          continue;
        }

        flushList();
        paragraph.push(line);
      }

      flushParagraph();
      flushList();
      return html;
    }

    function getFirstHeading(markdown) {
      const match = markdown.match(/^#\\s+(.+)$/m);
      return match ? match[1].trim() : '${escapeHtml(hall.name)}';
    }

    async function loadMarkdown() {
      try {
        const response = await fetch(markdownPath + '?t=' + Date.now(), { cache: 'no-store' });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const markdown = await response.text();
        if (markdown === lastMarkdown) return;
        lastMarkdown = markdown;
        const title = getFirstHeading(markdown);

        contentEl.innerHTML = renderMarkdown(markdown);
        pageTitleEl.textContent = title;
        document.title = title + ' - 汉传佛教寺院殿堂介绍';
      } catch (error) {
        contentEl.innerHTML = '<h1>${escapeHtml(hall.name)}</h1><p class="summary">Markdown 内容读取失败。请通过本地服务器访问本页面，例如 http://localhost:8000/halls/${hall.id}.html。</p>';
        console.error('Failed to load Markdown:', error);
      }
    }

    loadMarkdown();
    setInterval(loadMarkdown, 2000);
  </script>
</body>
</html>
`;
}

fs.mkdirSync(path.join(root, 'halls'), { recursive: true });
fs.mkdirSync(path.join(root, 'content'), { recursive: true });

for (const hall of pages) {
  const hallImages = hall.images || [hall.image];
  const imageCountClass = `imageCount${Math.min(hallImages.length, 4)}`;
  const imageMarkup = hallImages.map((image, index) => renderImage(hall, image, index)).join('\n');
  const imageBlock = renderImageBlock(hall, imageCountClass, imageMarkup);

  const md = `# ${hall.name}

${hall.summary}

## 常见位置

${hall.position}

## 常见供奉

${hall.deities}

## 殿堂功能

${hall.function}

## 象征意义

${hall.meaning}

## 简要说明

${hall.intro}
`;

  const mdPath = path.join(root, 'content', `${hall.id}.md`);
  if (!fs.existsSync(mdPath)) {
    fs.writeFileSync(mdPath, md, 'utf8');
  }

  const page = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(hall.name)} - 汉传佛教寺院殿堂介绍</title>
  <meta name="description" content="${escapeHtml(hall.summary)}" />
  <link rel="canonical" href="../halls/${hall.id}.html" />
  <link rel="stylesheet" href="../styles.css" />
</head>
<body class="detailBody">
  <header class="detailTopbar">
    <a class="back" href="../index.html">← 返回寺院导览图</a>
    <span>${escapeHtml(hall.name)}</span>
  </header>
  <main class="detailPage">
${imageBlock}
    <article class="articleCard">
      <p class="eyebrow">Temple Hall</p>
      <h1>${escapeHtml(hall.name)}</h1>
      <p class="summary">${escapeHtml(hall.summary)}</p>
      <div class="infoGrid">
        <div><strong>常见位置</strong><span>${escapeHtml(hall.position)}</span></div>
        <div><strong>常见供奉</strong><span>${escapeHtml(hall.deities)}</span></div>
        <div><strong>殿堂功能</strong><span>${escapeHtml(hall.function)}</span></div>
        <div><strong>象征意义</strong><span>${escapeHtml(hall.meaning)}</span></div>
      </div>
      <h2>简要说明</h2>
      <p>${escapeHtml(hall.intro)}</p>
      <a class="mdLink" href="../content/${hall.id}.md">查看 Markdown 原文</a>
    </article>
  </main>${renderSoundScript(hall)}
</body>
</html>
`;

  fs.writeFileSync(path.join(root, 'halls', `${hall.id}.html`), renderMarkdownDrivenPage(hall, imageBlock), 'utf8');
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  '  <url><loc>./index.html</loc></url>',
  ...pages.map((hall) => `  <url><loc>./halls/${hall.id}.html</loc></url>`),
  '</urlset>',
].join('\n');

fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap, 'utf8');
