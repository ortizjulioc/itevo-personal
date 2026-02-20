const fs = require('fs');
const path = require('path');

// Find all page.tsx and layout.tsx with old params pattern
const { execSync } = require('child_process');

const output = execSync(
    `grep -rl 'params: { id: string' /Users/black3xp/Documents/NextJS/software-itevo/app --include="page.tsx" --include="layout.tsx"`,
    { encoding: 'utf8' }
).trim();

const files = output.split('\n').filter(Boolean);
console.log(`Found ${files.length} files to fix.`);

let fixedCount = 0;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    const before = content;

    // Case 1: params typed inline in function signature without Promise
    // Match: params: { id: string } or params: { id: string; billid: ... } etc. but NOT inside Promise<>
    content = content.replace(
        /\bparams\b\s*:\s*\{([^}]+)\}(?!\s*>)/g,
        function (match, inner) {
            // Skip if already in Promise context (preceded by Promise<)
            return match; // we'll handle function signatures separately
        }
    );

    // More precise: fix interface/type declarations for params in page/layout props
    // Pattern: { params: { id: string } } or { params: { id: string; other: string } }
    content = content.replace(
        /\bparams\s*:\s*\{\s*([^}]+)\s*\}(?!\s*>)/g,
        function (match, inner) {
            if (match.includes('Promise')) return match;
            return `params: Promise<{ ${inner.trim()} }>`;
        }
    );

    // Fix destructuring: const { id } = params → const { id } = await params
    // Only if we have async function
    content = content.replace(
        /const\s*(\{[^}]+\})\s*=\s*params\s*;/g,
        function (match, destructure) {
            return `const ${destructure} = await params;`;
        }
    );

    // Also handle: const { id } = params (without semicolon on same line)
    content = content.replace(
        /const\s+(\w+)\s*=\s*params\.(\w+)/g,
        function (match, varName, propName) {
            return `const ${varName} = (await params).${propName}`;
        }
    );

    // Fix function signature to be async if it now uses await params
    // Only add async to non-async functions that now have await params
    if (content.includes('await params') && !content.match(/export\s+async\s+function/)) {
        content = content.replace(
            /export\s+function\s+/g,
            'export async function '
        );
    }

    // Fix `params.id` access (without destructuring) — needs await first
    // This is less common but handle it
    content = content.replace(
        /(?<!await\s+)\bparams\.id\b/g,
        '(await params).id'
    );

    if (content !== before) {
        fs.writeFileSync(f, content, 'utf8');
        fixedCount++;
        console.log('FIXED:', f);
    } else {
        console.log('NO CHANGE:', f);
    }
});

console.log(`\nTotal fixed: ${fixedCount}/${files.length}`);
