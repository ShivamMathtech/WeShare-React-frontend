const [major, minor, patch] = process.versions.node.split('.').map(Number);
const supported = major === 22 && (minor > 22 || minor === 22 && patch >= 2) || major === 24 && minor >= 15 || major >= 26;
if (!supported) {
  console.error(`Node ${process.versions.node} is installed. Use Node 24.15+ LTS (recommended) or Node 22.22.2+ LTS. Then reopen the terminal.`);
  process.exit(1);
}
console.log(`Node ${process.versions.node} is ready.`);
