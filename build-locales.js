const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const zhDir = path.join(root, 'zh');
const enDir = path.join(root, 'EN');
const chineseSiteFiles = ['detail.html', 'detail.js', 'data.js', 'main.js', 'styles.css', 'sitemap.xml'];
const sharedDirs = ['assets', 'images', 'music'];

const englishNames = {
  shanmen: 'Mountain Gate',
  tianwang: 'Hall of Heavenly Kings',
  daxiong: 'Mahavira Hall',
  cangjing: 'Sutra Repository',
  futu: 'Seven-Tier Stupa',
  chanlingudao: 'Ancient Chan Forest Path',
  gulou: 'Drum Tower',
  zhonglou: 'Bell Tower',
  guanyin: 'Guanyin Hall',
  xifang: 'Western Three Sages Hall',
  zushi: "Patriarchs' Hall",
  wuguan: 'Five Contemplations Hall',
  huayan: 'Huayan Three Sages Hall',
  dizang: 'Ksitigarbha Hall',
  weituo: 'Rear Hall of the Hall of Heavenly Kings',
  qianshou: 'Rear Hall of Mahavira Hall - Thousand-Armed Avalokitesvara',
};

const extraEnglishPages = [
  {
    id: 'weituo',
    name: englishNames.weituo,
    image: 'images/weituo.png',
    imageLink: 'tianwang.html',
  },
  {
    id: 'qianshou',
    name: englishNames.qianshou,
    image: 'images/qianshouguanyin.png',
    imageLink: 'daxiong.html',
  },
];

function rmDir(target) {
  fs.rmSync(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  fs.mkdirSync(target, { recursive: true });
}

function copyDir(source, target) {
  if (!fs.existsSync(source)) return;
  fs.cpSync(source, target, { recursive: true });
}

function readChineseHalls() {
  const dataSource = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${dataSource}\nthis.HALLS = HALLS;`, context);
  return context.HALLS;
}

function getFirstHeading(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function getSummary(markdown) {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    return line.replace(/\*\*/g, '');
  }
  return 'A guide to this hall in a traditional Chinese Buddhist monastery.';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderChineseIndex() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>汉传佛教寺院结构导览</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="page">
    <section class="viewer" aria-label="寺院导览图">
      <div class="map" id="map">
        <img id="templeImage" src="assets/temple-clean.png" alt="汉传佛教寺院侧视俯瞰图" />
        <div id="hotspots"></div>
      </div>
    </section>
  </main>

  <script src="data.js"></script>
  <script src="main.js"></script>
</body>
</html>
`;
}

function renderChineseHome() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>&#27721;&#20256;&#20315;&#25945;&#23546;&#38498;&#32467;&#26500;&#23548;&#35272;</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="homeHeader">
    <span class="homeBrand">&#27721;&#20256;&#20315;&#25945;&#23546;&#38498;&#23548;&#35272;&#22270;</span>
    <nav class="languageSwitch" aria-label="Language selection">
      <a class="active" href="/zh/" aria-current="page">&#20013;&#25991;</a>
      <a href="/en/">English</a>
    </nav>
  </header>
  <main class="page">
    <section class="viewer" aria-label="&#23546;&#38498;&#23548;&#35272;&#22270;">
      <div class="map" id="map">
        <img id="templeImage" src="assets/temple-clean.png" alt="&#27721;&#20256;&#20315;&#25945;&#23546;&#38498;&#20391;&#35270;&#20463;&#30640;&#22270;" />
        <div id="hotspots"></div>
      </div>
    </section>
  </main>

  <script src="data.js"></script>
  <script src="main.js"></script>
</body>
</html>
`;
}

function renderEnglishIndex() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Chinese Buddhist Monastery Guide</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="homeHeader">
    <span class="homeBrand">Guide Map of Han Buddhism Temple</span>
    <nav class="languageSwitch" aria-label="Language selection">
      <a href="/zh/">Chinese</a>
      <a class="active" href="/en/" aria-current="page">English</a>
    </nav>
  </header>
  <main class="page">
    <section class="viewer" aria-label="Monastery guide map">
      <div class="map" id="map">
        <img id="templeImage" src="assets/temple-clean.png" alt="Overhead guide map of a Chinese Buddhist monastery" />
        <div id="hotspots"></div>
      </div>
    </section>
  </main>

  <script src="data.js"></script>
  <script src="main.js"></script>
</body>
</html>
`;
}

function renderEnglishDetailRedirect() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hall Introduction</title>
  <script>
    const id = new URLSearchParams(location.search).get('id') || 'shanmen';
    location.replace(\`halls/\${encodeURIComponent(id)}.html\`);
  </script>
</head>
<body>
  <a href="halls/shanmen.html">View Mountain Gate introduction</a>
</body>
</html>
`;
}

function renderEnglishData(halls) {
  const compact = halls.map((hall) => ({
    id: hall.id,
    name: englishNames[hall.id] || hall.id,
    x: hall.x,
    y: hall.y,
    w: hall.w,
    h: hall.h,
    image: hall.image,
    images: hall.images,
    imageLink: hall.imageLink,
    sound: hall.sound,
    soundLabel: hall.sound ? `Play ${englishNames[hall.id] || hall.id} sound` : undefined,
    soundHotspot: hall.soundHotspot,
  }));
  return `const HALLS = ${JSON.stringify(compact, null, 2)};\n`;
}

function renderMainScript() {
  return `const hotspotsLayer = document.getElementById('hotspots');

HALLS.forEach((hall) => {
  const a = document.createElement('a');
  a.className = 'hotspot';
  a.href = \`halls/\${encodeURIComponent(hall.id)}.html\`;
  a.style.left = \`\${hall.x}%\`;
  a.style.top = \`\${hall.y}%\`;
  a.style.width = \`\${hall.w}%\`;
  a.style.height = \`\${hall.h}%\`;
  a.setAttribute('aria-label', hall.name);
  a.innerHTML = \`<span>\${hall.name}</span>\`;
  hotspotsLayer.appendChild(a);
});
`;
}

function renderImage(hall, image, index) {
  const imageTag = `<img class="hallPhoto" src="../${image}" alt="${escapeHtml(hall.name)} image ${index + 1}" />`;
  if (!hall.sound) return `      ${imageTag}`;

  const hotspot = hall.soundHotspot || { x: 50, y: 50, w: 36, h: 36 };
  return `      <div class="soundImageWrap">
        ${imageTag}
        <span class="soundHotspot" role="button" tabindex="0" data-sound="../${hall.sound}" data-x="${hotspot.x}" data-y="${hotspot.y}" data-w="${hotspot.w}" data-h="${hotspot.h}" style="position:absolute;z-index:2;display:block;box-sizing:border-box;left:0;top:0;width:1px;height:1px;transform:translate(-50%,-50%);margin:0;padding:0;border:0;background:transparent;cursor:pointer;" aria-label="${escapeHtml(hall.soundLabel || `Play ${hall.name} sound`)}"></span>
      </div>`;
}

function renderImageBlock(hall, imageCountClass, imageMarkup) {
  if (hall.imageLink) {
    return `    <a class="imageCard ${imageCountClass} imageCardLink" href="${escapeHtml(hall.imageLink)}" aria-label="View related page for ${escapeHtml(hall.name)}">
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
          console.warn('Audio playback was blocked by the browser or the file is unavailable.', error);
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

function renderMarkdownPage(hall, imageBlock, markdownFile, summary) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(hall.name)} - Chinese Buddhist Monastery Hall Guide</title>
  <meta name="description" content="${escapeHtml(summary)}" />
  <link rel="canonical" href="../halls/${hall.id}.html" />
  <link rel="stylesheet" href="../styles.css" />
</head>
<body class="detailBody">
  <header class="detailTopbar">
    <a class="back" href="../index.html">Back to Guide Map of Han Buddhism Temple</a>
    <span id="pageTitle">${escapeHtml(hall.name)}</span>
  </header>
  <main class="detailPage">
${imageBlock}
    <article class="articleCard">
      <p class="eyebrow">Temple Hall</p>
      <div id="markdownContent" class="markdownBody" aria-live="polite">
        <h1>${escapeHtml(hall.name)}</h1>
        <p class="summary">Loading Markdown content...</p>
      </div>
      <a class="mdLink" href="../content/${markdownFile}">View Markdown source</a>
    </article>
  </main>${renderSoundScript(hall)}

  <script>
    const markdownPath = '../content/${markdownFile}';
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
        document.title = title + ' - Chinese Buddhist Monastery Hall Guide';
      } catch (error) {
        contentEl.innerHTML = '<h1>${escapeHtml(hall.name)}</h1><p class="summary">Markdown content failed to load. Please open this page through the local server, for example http://localhost:3000/en/halls/${hall.id}.html.</p>';
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

function buildZh() {
  rmDir(zhDir);
  for (const file of chineseSiteFiles) {
    const source = path.join(root, file);
    if (fs.existsSync(source)) fs.copyFileSync(source, path.join(zhDir, file));
  }
  for (const dir of [...sharedDirs, 'halls', 'content']) {
    copyDir(path.join(root, dir), path.join(zhDir, dir));
  }
  fs.writeFileSync(path.join(zhDir, 'index.html'), renderChineseHome(), 'utf8');
}

function buildEn() {
  const chineseHalls = readChineseHalls();
  const halls = chineseHalls.map((hall) => ({
    ...hall,
    name: englishNames[hall.id] || hall.id,
    soundLabel: hall.sound ? `Play ${englishNames[hall.id] || hall.id} sound` : undefined,
  }));
  const pages = [...halls, ...extraEnglishPages];

  rmDir(enDir);
  for (const dir of sharedDirs) copyDir(path.join(root, dir), path.join(enDir, dir));
  fs.mkdirSync(path.join(enDir, 'content'), { recursive: true });
  fs.mkdirSync(path.join(enDir, 'halls'), { recursive: true });

  for (const page of pages) {
    const markdownSource = path.join(root, 'content', 'English', `${page.id}.md`);
    const markdownTarget = path.join(enDir, 'content', `${page.id}.md`);
    if (!fs.existsSync(markdownSource)) {
      throw new Error(`Missing English Markdown file: ${markdownSource}`);
    }
    const markdown = fs.readFileSync(markdownSource, 'utf8');
    const title = getFirstHeading(markdown, page.name);
    const hall = { ...page, name: title };
    const hallImages = hall.images || [hall.image];
    const imageCountClass = `imageCount${Math.min(hallImages.length, 4)}`;
    const imageMarkup = hallImages.map((image, index) => renderImage(hall, image, index)).join('\n');
    const imageBlock = renderImageBlock(hall, imageCountClass, imageMarkup);

    fs.copyFileSync(markdownSource, markdownTarget);
    fs.writeFileSync(
      path.join(enDir, 'halls', `${hall.id}.html`),
      renderMarkdownPage(hall, imageBlock, `${hall.id}.md`, getSummary(markdown)),
      'utf8',
    );
  }

  fs.writeFileSync(path.join(enDir, 'index.html'), renderEnglishIndex(), 'utf8');
  fs.writeFileSync(path.join(enDir, 'detail.html'), renderEnglishDetailRedirect(), 'utf8');
  fs.writeFileSync(path.join(enDir, 'detail.js'), '// English version uses static SEO-friendly pages under halls/*.html.\n', 'utf8');
  fs.writeFileSync(path.join(enDir, 'data.js'), renderEnglishData(halls), 'utf8');
  fs.writeFileSync(path.join(enDir, 'main.js'), renderMainScript(), 'utf8');
  fs.copyFileSync(path.join(root, 'styles.css'), path.join(enDir, 'styles.css'));
  fs.writeFileSync(
    path.join(enDir, 'sitemap.xml'),
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '  <url><loc>./index.html</loc></url>',
      ...pages.map((hall) => `  <url><loc>./halls/${hall.id}.html</loc></url>`),
      '</urlset>',
    ].join('\n'),
    'utf8',
  );
}

function writeRootRedirect() {
  fs.writeFileSync(
    path.join(root, 'index.html'),
    `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Temple Guide</title>
  <meta http-equiv="refresh" content="0; url=zh/" />
  <script>location.replace('zh/');</script>
</head>
<body>
  <a href="zh/">中文</a>
  <a href="en/">English</a>
</body>
</html>
`,
    'utf8',
  );
}

buildZh();
buildEn();
writeRootRedirect();
console.log('Built TempV02/zh and TempV02/EN. Use /zh/ and /en/ on the local server.');
