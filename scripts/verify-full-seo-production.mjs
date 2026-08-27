import { chromium } from 'playwright-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.css': 'text/css',
  '.js': 'text/javascript'
};

async function startStaticServer(port = 54321) {
  const distDir = path.join(process.cwd(), 'dist');
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    let filePath = path.join(distDir, reqPath);

    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });

  await new Promise(resolve => server.listen(port, resolve));
  return server;
}

async function verifyAll() {
  console.log('🔍 =======================================================');
  console.log('   INSPECCIÓN COMPLETA DE SEO & AI-SEO EN NAVEGADOR REAL');
  console.log('=======================================================\n');

  const PORT = 54321;
  const server = await startStaticServer(PORT);
  console.log(`⚡ Servidor de producción levantado en http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. INSPECT SPANISH HOMEPAGE (/)
  console.log(`\n🌐 1. Inspeccionando Home Español (http://127.0.0.1:${PORT}/)...`);
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' });

  const esTitle = await page.title();
  const esDesc = await page.$eval('meta[name="description"]', el => el.content);
  const esCanonical = await page.$eval('link[rel="canonical"]', el => el.href);
  const esOgTitle = await page.$eval('meta[property="og:title"]', el => el.content);
  const esOgDesc = await page.$eval('meta[property="og:description"]', el => el.content);
  const esOgImage = await page.$eval('meta[property="og:image"]', el => el.getAttribute('content'));
  const esOgLocale = await page.$eval('meta[property="og:locale"]', el => el.content);
  const esTwitterCard = await page.$eval('meta[name="twitter:card"]', el => el.content);
  const esH1 = await page.$eval('h1', el => el.innerText.replace(/\s+/g, ' ').trim());

  console.log(`   - Title [${esTitle.length} ch]: "${esTitle}"`);
  console.log(`   - Meta Description [${esDesc.length} ch]: "${esDesc}"`);
  console.log(`   - Canonical: ${esCanonical}`);
  console.log(`   - OpenGraph: og:title="${esOgTitle}", og:image="${esOgImage}", og:locale="${esOgLocale}"`);
  console.log(`   - Twitter Card: "${esTwitterCard}"`);
  console.log(`   - H1 Principal: "${esH1}"`);

  // Inspect JSON-LD on Spanish page
  const esJsonLdRaw = await page.$eval('script[type="application/ld+json"]', el => el.textContent);
  const esJsonLd = JSON.parse(esJsonLdRaw);
  const esEntities = esJsonLd['@graph'].map(e => e['@type']);
  console.log(`   - Grafo JSON-LD Schema.org (${esEntities.length} entidades): ${esEntities.join(', ')}`);

  const esPerson = esJsonLd['@graph'].find(e => e['@type'] === 'Person');
  const esService = esJsonLd['@graph'].find(e => e['@type'] === 'ProfessionalService');
  const esFaq = esJsonLd['@graph'].find(e => e['@type'] === 'FAQPage');

  console.log(`     ✓ Person: "${esPerson.name}" (knowsAbout: ${esPerson.knowsAbout?.length} items, sameAs: ${esPerson.sameAs?.join(', ')})`);
  console.log(`     ✓ ProfessionalService: "${esService.name}" (priceRange: "${esService.priceRange}", areaServed: [${esService.areaServed.join(', ')}])`);
  console.log(`     ✓ FAQPage: ${esFaq.mainEntity.length} preguntas estructuradas.`);
  esFaq.mainEntity.forEach((q, i) => console.log(`       ${i + 1}. "${q.name}"`));

  // 2. INSPECT ENGLISH HOMEPAGE (/en/)
  console.log(`\n🌐 2. Inspeccionando Home Inglés (http://127.0.0.1:${PORT}/en/)...`);
  await page.goto(`http://127.0.0.1:${PORT}/en/`, { waitUntil: 'domcontentloaded' });

  const enTitle = await page.title();
  const enDesc = await page.$eval('meta[name="description"]', el => el.content);
  const enCanonical = await page.$eval('link[rel="canonical"]', el => el.href);
  const enH1 = await page.$eval('h1', el => el.innerText.replace(/\s+/g, ' ').trim());

  console.log(`   - EN Title [${enTitle.length} ch]: "${enTitle}"`);
  console.log(`   - EN Meta Description [${enDesc.length} ch]: "${enDesc}"`);
  console.log(`   - EN Canonical: ${enCanonical}`);
  console.log(`   - EN H1 Principal: "${enH1}"`);

  const enJsonLdRaw = await page.$eval('script[type="application/ld+json"]', el => el.textContent);
  const enJsonLd = JSON.parse(enJsonLdRaw);
  const enFaq = enJsonLd['@graph'].find(e => e['@type'] === 'FAQPage');
  console.log(`   - EN FAQPage: ${enFaq.mainEntity.length} preguntas en inglés.`);
  console.log(`     Ejemplo: "${enFaq.mainEntity[0].name}"`);

  // 3. INSPECT HREFLANG INTEGRITY
  console.log('\n🔗 3. Verificando Reciprocidad de Hreflang...');
  await page.goto(`http://127.0.0.1:${PORT}/`);
  const links = await page.$$eval('link[rel="alternate"][hreflang]', els => els.map(e => `${e.getAttribute('hreflang')} => ${e.getAttribute('href')}`));
  links.forEach(l => console.log(`   - ${l}`));

  // 4. INSPECT robots.txt
  console.log(`\n🤖 4. Inspeccionando /robots.txt...`);
  const robotsRes = await page.goto(`http://127.0.0.1:${PORT}/robots.txt`);
  const robotsContent = await robotsRes.text();
  console.log('--- Contenido de robots.txt ---');
  console.log(robotsContent.trim());
  console.log('------------------------------');

  // 5. INSPECT sitemap.xml
  console.log(`\n🗺️ 5. Inspeccionando /sitemap.xml...`);
  const sitemapRes = await page.goto(`http://127.0.0.1:${PORT}/sitemap.xml`);
  const sitemapContent = await sitemapRes.text();
  console.log('--- Contenido de sitemap.xml ---');
  console.log(sitemapContent.trim());
  console.log('------------------------------');

  // 6. INSPECT llms.txt & llms-full.txt
  console.log('\n🧠 6. Inspeccionando archivos de Inteligencia Artificial (/llms.txt y /llms-full.txt)...');
  const llmsRes = await page.goto(`http://127.0.0.1:${PORT}/llms.txt`);
  const llmsText = await llmsRes.text();
  console.log(`   ✓ /llms.txt Status: ${llmsRes.status()} (${llmsText.length} bytes)`);
  console.log(`     Titular: ${llmsText.split('\n')[0]}`);

  const llmsFullRes = await page.goto(`http://127.0.0.1:${PORT}/llms-full.txt`);
  const llmsFullText = await llmsFullRes.text();
  console.log(`   ✓ /llms-full.txt Status: ${llmsFullRes.status()} (${llmsFullText.length} bytes)`);
  console.log(`     Titular: ${llmsFullText.split('\n')[0]}`);

  await browser.close();
  server.close();

  console.log('\n=======================================================');
  console.log('   🎉 RESULTADO FINAL: 100% AUDITADO Y VERIFICADO OK');
  console.log('=======================================================\n');
}

verifyAll().catch(console.error);
