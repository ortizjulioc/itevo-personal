// Fix client components: replace `await params` with `React.use(params)`
// and ensure React is imported
const fs = require('fs');

const files = [
    'app/(defaults)/students/[id]/page.tsx',
    'app/(defaults)/teachers/[id]/page.tsx',
    'app/(defaults)/users/[id]/page.tsx',
    'app/(defaults)/bills/[id]/page.tsx',
    'app/(defaults)/branches/[id]/page.tsx',
    'app/(defaults)/cash-boxes/[id]/page.tsx',
    'app/(defaults)/cash-registers/[id]/expenses/[movementid]/page.tsx',
    'app/(defaults)/cash-registers/[id]/page.tsx',
    'app/(defaults)/course-branch/[id]/page.tsx',
    'app/(defaults)/courses/[id]/page.tsx',
    'app/(defaults)/enrollments/[id]/page.tsx',
    'app/(defaults)/holidays/[id]/page.tsx',
    'app/(defaults)/invoices/[id]/bill/[billid]/page.tsx',
    'app/(defaults)/invoices/closed/[id]/page.tsx',
    'app/(defaults)/ncfranges/[id]/page.tsx',
    'app/(defaults)/products/[id]/page.tsx',
    'app/(defaults)/promotions/[id]/page.tsx',
    'app/(defaults)/roles/[id]/page.tsx',
].map(f => '/Users/black3xp/Documents/NextJS/software-itevo/' + f);

let fixedCount = 0;

files.forEach(f => {
    if (!fs.existsSync(f)) { console.log('NOT FOUND:', f); return; }
    let content = fs.readFileSync(f, 'utf8');
    const before = content;

    // 1. Replace `await params` with `React.use(params)` in destructuring
    content = content.replace(/const\s*(\{[^}]+\})\s*=\s*await\s+params\s*;/g, function (match, destructure) {
        return `const ${destructure} = React.use(params);`;
    });

    // 2. Replace `(await params).xxx` with `React.use(params).xxx`
    content = content.replace(/\(await\s+params\)\.(\w+)/g, function (match, prop) {
        return `React.use(params).${prop}`;
    });

    // 3. Undo the `async` keyword added to the function if it only has React.use() now
    // (client components don't need async for React.use)
    content = content.replace(/export\s+async\s+function\s+/g, 'export default function '.replace('export default ', 'export '));
    // More careful: only remove async if we actually added it and the function doesn't have other awaits
    if (!content.match(/\bawait\b/)) {
        content = content.replace(/export\s+async\s+function\s+/g, 'export function ');
    }

    // 4. Ensure React is imported
    if (content.includes('React.use(') && !content.match(/import\s+React/)) {
        // Add React import after 'use client'
        content = content.replace("'use client';", "'use client';\nimport React from 'react';");
        // or if it's on its own line
        content = content.replace("'use client'\n", "'use client'\nimport React from 'react'\n");
    }

    if (content !== before) {
        fs.writeFileSync(f, content, 'utf8');
        fixedCount++;
        console.log('FIXED:', f.split('/').slice(-3).join('/'));
    } else {
        console.log('NO CHANGE:', f.split('/').slice(-3).join('/'));
    }
});

console.log(`\nTotal fixed: ${fixedCount}/${files.length}`);
