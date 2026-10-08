// Reproduce a temporary release config without changing the checked-in defaults.
import fs from 'node:fs';
import path from 'node:path';
const flags=process.argv.slice(2);
if(flags.some(flag=>flag!=='--without-analytics'))throw Error('Unknown option');
let config=fs.readFileSync('wrangler.toml','utf8');
const absolute=p=>path.resolve(p).replaceAll('\\','/');
config=config.replace('main = "src/worker.js"',`main = "${absolute('src/worker.js')}"`)
  .replace('directory = "./public"',`directory = "${absolute('public')}"`);
if(flags.includes('--without-analytics'))config=config.replace(/\[\[analytics_engine_datasets\]\][\s\S]*?dataset = "ferrapro_events"\r?\n/,'# Analytics Engine activation pending; no analytics binding in this release.\n');
fs.mkdirSync('output/seven-items',{recursive:true});
fs.writeFileSync('output/seven-items/wrangler-release.toml',config);
console.log('Prepared output/seven-items/wrangler-release.toml; nothing deployed.');
