const fs = require('fs');
let code = fs.readFileSync('constants.ts', 'utf8');

let modified = code.replace(/id:\s*'([^']+)',([\s\S]*?)(speedLabel: '[^']+',[\s\S]*?modalities: \[.*?\])(\n\s*})/g, (match, id, middle, suffix, end) => {
    if (id.includes('-preview') || id.includes('-exp') || id.includes('-live') || id.includes('er-1.6') || id.includes('gemma')) {
        if (!match.includes('isExperimental:\ntrue') && !match.includes('isExperimental: true') && !match.includes('isExperimental : true')) {
            return `id: '${id}',${middle}${suffix},\n    isExperimental: true${end}`;
        }
    }
    return match;
});

fs.writeFileSync('constants.ts', modified, 'utf8');
