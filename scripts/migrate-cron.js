#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

const OLD_SCRIPT = '/root/cronexec/gitUpdate.sh';
const NEW_SCRIPT = '/home/adminuser/gitUpdate.sh';
const NEW_CRON_LINE = `20 */2 * * * ${NEW_SCRIPT} >> /var/log/update.log 2>&1`;

try {
  if (!fs.existsSync(NEW_SCRIPT)) process.exit(0);

  fs.chmodSync(NEW_SCRIPT, 0o755);

  let current = '';
  try {
    current = execSync('crontab -l', { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
  } catch (e) { current = ''; }

  if (current.includes(NEW_SCRIPT)) process.exit(0);

  const lines = current.split('\n')
    .filter(l => l.trim() !== '' && !l.includes(OLD_SCRIPT));
  lines.push(NEW_CRON_LINE);

  execSync('crontab -', { input: lines.join('\n') + '\n' });
  console.log('[migrate-cron] cron migrado a', NEW_SCRIPT);
} catch (err) {
  console.error('[migrate-cron] error ignorado:', err.message);
}
