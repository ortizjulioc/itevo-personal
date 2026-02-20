const fs = require('fs');
const files = [
    '/Users/black3xp/Documents/NextJS/software-itevo/app/api/account-payable/[id]/payments/[paymentId]/route.ts',
    '/Users/black3xp/Documents/NextJS/software-itevo/app/api/cash-register/[id]/cash-movements/[movementId]/route.ts',
    '/Users/black3xp/Documents/NextJS/software-itevo/app/api/cash-register/[id]/closure/[closureId]/route.ts',
    '/Users/black3xp/Documents/NextJS/software-itevo/app/api/course-branch/[id]/payment-plan/[paymentId]/route.ts',
    '/Users/black3xp/Documents/NextJS/software-itevo/app/api/courses/[id]/prerequisites/[prerequisiteId]/route.ts',
    '/Users/black3xp/Documents/NextJS/software-itevo/app/api/courses/[id]/schedules/[scheduleId]/route.ts',
    '/Users/black3xp/Documents/NextJS/software-itevo/app/api/invoices/[id]/items/[itemId]/route.ts',
    '/Users/black3xp/Documents/NextJS/software-itevo/app/api/students/[id]/student-scholarship/[idScholarship]/route.ts',
];

let fixedCount = 0;
files.forEach(f => {
    if (!fs.existsSync(f)) { console.log('NOT FOUND:', f); return; }
    let content = fs.readFileSync(f, 'utf8');
    const before = content;

    // Wrap params type in Promise<> if not already wrapped
    content = content.replace(/\{ params \}: \{ params: (\{[^}]+\}) \}/g, function (match, inner) {
        if (match.includes('Promise')) return match;
        return '{ params }: { params: Promise<' + inner + '> }';
    });

    // Replace const destructuring of params without await → with await
    content = content.replace(/const (\{[^}]+\}) = params;/g, function (match, destructure) {
        return 'const ' + destructure + ' = await params;';
    });

    if (content !== before) {
        fs.writeFileSync(f, content, 'utf8');
        fixedCount++;
        console.log('FIXED:', f);
    } else {
        console.log('NO CHANGE:', f);
    }
});
console.log('Total fixed:', fixedCount);
