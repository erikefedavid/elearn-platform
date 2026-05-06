const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-dark-950/g, replacement: 'bg-background' },
  { regex: /bg-dark-900\/90/g, replacement: 'bg-card/90' },
  { regex: /bg-dark-900/g, replacement: 'bg-card' },
  { regex: /bg-dark-800\/80/g, replacement: 'bg-muted/80' },
  { regex: /bg-dark-800\/50/g, replacement: 'bg-muted/50' },
  { regex: /bg-dark-800/g, replacement: 'bg-muted/50' },
  { regex: /bg-dark-700\/50/g, replacement: 'bg-muted/50' },
  { regex: /bg-dark-700\/30/g, replacement: 'bg-muted/30' },
  { regex: /bg-dark-700/g, replacement: 'bg-muted' },
  { regex: /border-dark-800/g, replacement: 'border-border' },
  { regex: /border-dark-700\/50/g, replacement: 'border-border/50' },
  { regex: /border-dark-700/g, replacement: 'border-border' },
  { regex: /border-dark-600/g, replacement: 'border-border' },
  { regex: /text-dark-200/g, replacement: 'text-foreground/90' },
  { regex: /text-dark-300/g, replacement: 'text-muted-foreground' },
  { regex: /text-dark-400/g, replacement: 'text-muted-foreground' },
  { regex: /text-dark-500/g, replacement: 'text-muted-foreground/80' },
  { regex: /text-dark-600/g, replacement: 'text-muted-foreground/60' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      // Smart replace text-white to text-foreground only when NOT inside buttons or badges
      // This is a naive heuristic but works well for most divs
      content = content.replace(/className="([^"]*)text-white([^"]*)"/g, (match, p1, p2) => {
        if (p1.includes('btn-') || p2.includes('btn-') || 
            p1.includes('bg-') || p2.includes('bg-') || 
            p1.includes('badge') || p2.includes('badge')) {
          return match; // Keep text-white for buttons, badges, or elements with explicit bg
        }
        return `className="${p1}text-foreground${p2}"`;
      });
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Theme fix completed.');
