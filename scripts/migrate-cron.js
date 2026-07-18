#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

const OLD_SCRIPT = '/root/cronexec/gitUpdate.sh';
const NEW_SCRIPT = '/home/adminuser/gitUpdate.sh';
const NEW_PERIODIC_LINE = `20 */2 * * * ${NEW_SCRIPT} >> /var/log/update.log 2>&1`;
const NEW_REBOOT_LINE = `@reboot /bin/sleep 900 ; ${NEW_SCRIPT} >> /var/log/update.log 2>&1`;

try {
  if (!fs.existsSync(NEW_SCRIPT)) process.exit(0);

  fs.chmodSync(NEW_SCRIPT, 0o755);

  let current = '';
  try {
    current = execSync('crontab -l', { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
  } catch (e) { current = ''; }

  const lines = current.split('\n');
  const outLines = [];
  let hasPeriodic = false;
  let hasReboot = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') { outLines.push(line); continue; }

    if (trimmed.includes(NEW_SCRIPT)) {
      if (trimmed.startsWith('@reboot')) hasReboot = true;
      else hasPeriodic = true;
      outLines.push(line);
      continue;
    }

    if (trimmed.includes(OLD_SCRIPT)) {
      if (trimmed.startsWith('@reboot')) {
        outLines.push(NEW_REBOOT_LINE);
        hasReboot = true;
      } else {
        outLines.push(NEW_PERIODIC_LINE);
        hasPeriodic = true;
      }
      continue;
    }

    outLines.push(line);
  }

  if (!hasPeriodic) outLines.push(NEW_PERIODIC_LINE);
  if (!hasReboot) outLines.push(NEW_REBOOT_LINE);

  const newCrontab = outLines.join('\n') + '\n';

  if (newCrontab === current || newCrontab === current.trimEnd() + '\n') {
    process.exit(0);
  }

  execSync('crontab -', { input: newCrontab });
  console.log('[migrate-cron] cron migrado a', NEW_SCRIPT);
} catch (err) {
  console.error('[migrate-cron] error ignorado:', err.message);
}
