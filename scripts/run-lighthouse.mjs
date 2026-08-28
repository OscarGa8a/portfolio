import { chromium } from 'playwright-core';
import lighthouse from 'lighthouse';
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
  '.js': 'text/javascript',
  '.webp': 'image/webp'
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

async function runLighthouseAudit() {
  console.log('⚡ =======================================================');
  console.log('   AUDITORÍA OFICIAL LIGHTHOUSE & CORE WEB VITALS');
  console.log('=======================================================\n');

  const SERVER_PORT = 54321;
  const server = await startStaticServer(SERVER_PORT);
  console.log(`🌐 Servidor de producción en http://127.0.0.1:${SERVER_PORT}`);

  const DEBUG_PORT = 9222;
  const browser = await chromium.launch({
    args: [
      `--remote-debugging-port=${DEBUG_PORT}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu'
    ]
  });

  const targetUrl = `http://127.0.0.1:${SERVER_PORT}/`;

  try {
    // 1. Mobile Audit
    console.log('📱 1. Ejecutando Auditoría Mobile (Simulación 4G / Moto G Power)...');
    const mobileResult = await lighthouse(targetUrl, {
      port: DEBUG_PORT,
      output: 'json',
      logLevel: 'error',
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 412,
        height: 823,
        deviceScaleFactor: 1.75,
        disabled: false
      },
      throttlingMethod: 'simulate',
    });

    const mCats = mobileResult.lhr.categories;
    const mAudits = mobileResult.lhr.audits;

    console.log('\n--- 📱 RESULTADOS MOBILE ---');
    console.log(`🚀 Performance:    ${Math.round(mCats.performance.score * 100)} / 100`);
    console.log(`♿ Accessibility:  ${Math.round(mCats.accessibility.score * 100)} / 100`);
    console.log(`🛡️ Best Practices: ${Math.round(mCats['best-practices'].score * 100)} / 100`);
    console.log(`🔍 SEO:            ${Math.round(mCats.seo.score * 100)} / 100`);

    console.log('\n--- ⏱️ CORE WEB VITALS (MOBILE) ---');
    console.log(`- FCP (First Contentful Paint):    ${mAudits['first-contentful-paint']?.displayValue}`);
    console.log(`- LCP (Largest Contentful Paint):  ${mAudits['largest-contentful-paint']?.displayValue}`);
    console.log(`- TBT (Total Blocking Time):       ${mAudits['total-blocking-time']?.displayValue}`);
    console.log(`- CLS (Cumulative Layout Shift):   ${mAudits['cumulative-layout-shift']?.displayValue}`);
    console.log(`- Speed Index:                     ${mAudits['speed-index']?.displayValue}`);

    // 2. Desktop Audit
    console.log('\n💻 2. Ejecutando Auditoría Desktop...');
    const desktopResult = await lighthouse(targetUrl, {
      port: DEBUG_PORT,
      output: 'json',
      logLevel: 'error',
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false
      },
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0
      }
    });

    const dCats = desktopResult.lhr.categories;
    const dAudits = desktopResult.lhr.audits;

    console.log('\n--- 💻 RESULTADOS DESKTOP ---');
    console.log(`🚀 Performance:    ${Math.round(dCats.performance.score * 100)} / 100`);
    console.log(`♿ Accessibility:  ${Math.round(dCats.accessibility.score * 100)} / 100`);
    console.log(`🛡️ Best Practices: ${Math.round(dCats['best-practices'].score * 100)} / 100`);
    console.log(`🔍 SEO:            ${Math.round(dCats.seo.score * 100)} / 100`);

    console.log('\n--- ⏱️ CORE WEB VITALS (DESKTOP) ---');
    console.log(`- FCP: ${dAudits['first-contentful-paint']?.displayValue}`);
    console.log(`- LCP: ${dAudits['largest-contentful-paint']?.displayValue}`);
    console.log(`- TBT: ${dAudits['total-blocking-time']?.displayValue}`);
    console.log(`- CLS: ${dAudits['cumulative-layout-shift']?.displayValue}`);

    // Identify opportunities/diagnostics if any category < 100
    const issues = [];
    for (const [key, cat] of Object.entries(mCats)) {
      if (cat.score < 1) {
        issues.push({ cat: cat.title, score: Math.round(cat.score * 100) });
      }
    }

    console.log('\n=======================================================');
    if (issues.length === 0) {
      console.log('   🎉 RESULTADO PERFECTO: 100 / 100 EN TODAS LAS CATEGORÍAS');
    } else {
      console.log('   🔍 DIAGNÓSTICO PARA PERFECCIONAR A 100:');
      issues.forEach(i => console.log(`   - ${i.cat}: ${i.score}/100`));
    }
    console.log('=======================================================\n');

  } finally {
    await browser.close();
    server.close();
  }
}

runLighthouseAudit().catch(console.error);
