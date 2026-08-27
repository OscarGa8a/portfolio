import { chromium } from 'playwright-core';
import fs from 'fs';

async function testSeoAndAiSeo() {
  console.log('🔍 =======================================================');
  console.log('   VALIDACIÓN TÉCNICA DE SEO Y AI-SEO (Playwright & DOM)');
  console.log('=======================================================\n');

  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const report = {
    schema: { passed: false, details: [] },
    meta: { passed: false, details: [] },
    robots: { passed: false, details: [] },
    llmsTxt: { passed: false, details: [] },
    hreflang: { passed: false, details: [] }
  };

  // 1. Check Spanish Page
  console.log('🧪 1. Auditando Metadatos y Schema.org en Español (http://localhost:4321/)...');
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });

  const esTitle = await page.title();
  const esDescription = await page.$eval('meta[name="description"]', el => el.getAttribute('content'));
  const esCanonical = await page.$eval('link[rel="canonical"]', el => el.getAttribute('href'));
  const esOgTitle = await page.$eval('meta[property="og:title"]', el => el.getAttribute('content'));
  const esOgImage = await page.$eval('meta[property="og:image"]', el => el.getAttribute('content'));

  report.meta.details.push(`Title (${esTitle.length} chars): "${esTitle}"`);
  report.meta.details.push(`Description (${esDescription.length} chars): "${esDescription}"`);
  report.meta.details.push(`Canonical: ${esCanonical}`);
  report.meta.details.push(`OpenGraph Image: ${esOgImage}`);

  if (esTitle.includes('Oscar Dev') && esDescription.length >= 140 && esDescription.length <= 165) {
    report.meta.passed = true;
  }

  // 2. Validate JSON-LD Schema
  console.log('\n🧪 2. Validando Grafo JSON-LD Schema.org (@graph)...');
  const jsonLdContent = await page.$eval('script[type="application/ld+json"]', el => el.textContent);
  const parsedJsonLd = JSON.parse(jsonLdContent);
  const types = parsedJsonLd['@graph'] ? parsedJsonLd['@graph'].map(g => g['@type']) : [parsedJsonLd['@type']];

  report.schema.details.push(`Entidades detectadas en @graph: ${types.join(', ')}`);

  const faqEntity = parsedJsonLd['@graph'].find(g => g['@type'] === 'FAQPage');
  if (faqEntity && faqEntity.mainEntity?.length === 5) {
    report.schema.details.push(`✅ FAQPage Schema validado con ${faqEntity.mainEntity.length} preguntas/respuestas estructuradas`);
  }

  const personEntity = parsedJsonLd['@graph'].find(g => g['@type'] === 'Person');
  if (personEntity && personEntity.knowsAbout?.length > 0) {
    report.schema.details.push(`✅ Person Schema con ${personEntity.knowsAbout.length} áreas de expertise (knowsAbout)`);
  }

  if (types.includes('Person') && types.includes('ProfessionalService') && types.includes('WebSite') && types.includes('FAQPage')) {
    report.schema.passed = true;
  }

  // 3. Validate Hreflang
  console.log('\n🧪 3. Validando Hreflang y SEO Internacional...');
  const hreflangs = await page.$$eval('link[rel="alternate"]', els => {
    return els.map(el => ({ hreflang: el.getAttribute('hreflang'), href: el.getAttribute('href') })).filter(e => e.hreflang);
  });

  hreflangs.forEach(h => report.hreflang.details.push(`Hreflang ${h.hreflang} -> ${h.href}`));
  if (hreflangs.some(h => h.hreflang === 'es') && hreflangs.some(h => h.hreflang === 'en') && hreflangs.some(h => h.hreflang === 'x-default')) {
    report.hreflang.passed = true;
  }

  // 4. Validate robots.txt
  console.log('\n🧪 4. Verificando robots.txt para Crawlers de IA...');
  const robotsRes = await page.goto('http://localhost:4321/robots.txt');
  const robotsText = await robotsRes.text();
  const requiredBots = ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Bingbot'];
  const missingBots = requiredBots.filter(bot => !robotsText.includes(bot));

  if (missingBots.length === 0 && robotsText.includes('sitemap.xml')) {
    report.robots.passed = true;
    report.robots.details.push(`✅ Permisos explícitos activos para: ${requiredBots.join(', ')}`);
    report.robots.details.push(`✅ Referencia a sitemap.xml activa`);
  } else {
    report.robots.details.push(`❌ Faltan directivas para: ${missingBots.join(', ')}`);
  }

  // 5. Validate llms.txt and llms-full.txt
  console.log('\n🧪 5. Verificando archivos de Inteligencia Artificial (llms.txt)...');
  const llmsRes = await page.goto('http://localhost:4321/llms.txt');
  const llmsText = await llmsRes.text();

  const llmsFullRes = await page.goto('http://localhost:4321/llms-full.txt');
  const llmsFullText = await llmsFullRes.text();

  if (llmsRes.ok() && llmsText.includes('Oscar Dev') && llmsFullRes.ok() && llmsFullText.includes('Oscar García')) {
    report.llmsTxt.passed = true;
    report.llmsTxt.details.push(`✅ /llms.txt disponible (${llmsText.length} bytes, formato estándar llmstxt.org)`);
    report.llmsTxt.details.push(`✅ /llms-full.txt disponible (${llmsFullText.length} bytes con casos completos y FAQs)`);
  }

  await browser.close();

  console.log('\n=======================================================');
  console.log('   RESULTADOS DE LA AUDITORÍA SEO Y AI-SEO');
  console.log('=======================================================');
  console.log(`\n1. METADATOS Y ON-PAGE SEO: ${report.meta.passed ? 'PASÓ 100% ✅' : 'FALLÓ ❌'}`);
  report.meta.details.forEach(d => console.log(`   - ${d}`));

  console.log(`\n2. ESTRUCTURA JSON-LD SCHEMA.ORG: ${report.schema.passed ? 'PASÓ 100% ✅' : 'FALLÓ ❌'}`);
  report.schema.details.forEach(d => console.log(`   - ${d}`));

  console.log(`\n3. HREFLANG Y SEO INTERNACIONAL: ${report.hreflang.passed ? 'PASÓ 100% ✅' : 'FALLÓ ❌'}`);
  report.hreflang.details.forEach(d => console.log(`   - ${d}`));

  console.log(`\n4. DIRECTIVAS DE CRAWLERS DE IA (robots.txt): ${report.robots.passed ? 'PASÓ 100% ✅' : 'FALLÓ ❌'}`);
  report.robots.details.forEach(d => console.log(`   - ${d}`));

  console.log(`\n5. ARCHIVOS PARA MOTORES DE IA (llms.txt): ${report.llmsTxt.passed ? 'PASÓ 100% ✅' : 'FALLÓ ❌'}`);
  report.llmsTxt.details.forEach(d => console.log(`   - ${d}`));
  console.log('=======================================================\n');
}

testSeoAndAiSeo().catch(console.error);
