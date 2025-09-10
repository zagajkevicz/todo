
#!/usr/bin/env node
// Simple console TODO manager
// Usage:
//   node 02_todo_cli.js add "Buy milk"
//   node 02_todo_cli.js list
//   node 02_todo_cli.js done 1
const fs = require('fs');
const path = require('path');
const DB = path.join(__dirname, 'todo.json');

function load() {
  if (!fs.existsSync(DB)) return [];
  return JSON.parse(fs.readFileSync(DB, 'utf8'));
}
function save(items) {
  fs.writeFileSync(DB, JSON.stringify(items, null, 2));
}

const [,, cmd, ...rest] = process.argv;
const items = load();

if (cmd === 'add') {
  const text = rest.join(' ').trim();
  if (!text) { console.log('Provide a task text'); process.exit(1); }
  items.push({ text, done:false, createdAt: new Date().toISOString() });
  save(items);
  console.log('Added:', text);
} else if (cmd === 'list') {
  if (!items.length) return console.log('(empty)');
  items.forEach((it, i) => {
    console.log(`${i+1}. [${it.done ? 'x' : ' '}] ${it.text}`);
  });
} else if (cmd === 'done') {
  const idx = parseInt(rest[0], 10) - 1;
  if (isNaN(idx) || !items[idx]) { console.log('Invalid id'); process.exit(1); }
  items[idx].done = true;
  save(items);
  console.log('Completed:', items[idx].text);
} else {
  console.log('Commands: add <text> | list | done <id>');
}
