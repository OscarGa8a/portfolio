import sharp from 'sharp';

await Promise.all([
  sharp('public/favicon.svg').resize(32, 32).png({ compressionLevel: 9 }).toFile('public/favicon-32.png'),
  sharp('public/favicon.svg').resize(180, 180).png({ compressionLevel: 9 }).toFile('public/apple-touch-icon.png'),
]);

console.log('Generated Oscar Dev favicon assets.');
