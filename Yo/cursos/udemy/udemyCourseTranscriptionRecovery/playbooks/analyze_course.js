const fs = require('fs');
const path = require('path');

const outputDir = 'c:\\git\\wb_pr\\projects\\Yo\\cursos\\udemy\\udemyCourseTranscriptionRecovery\\playbooks\\output';
const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.txt') && f.includes(' - '));

// Sort by numeric prefix
files.sort((a, b) => {
    const idA = parseInt(a.split(' - ')[0]);
    const idB = parseInt(b.split(' - ')[0]);
    return idA - idB;
});

const report = [];

files.forEach(filename => {
    const filePath = path.join(outputDir, filename);
    const lectureId = filename.split(' - ')[0];

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const headerSnippet = lines.slice(0, 10).join(' ');

    // Try to find "módulo de X"
    const moduleMatch = headerSnippet.match(/módulo de ([^,.\n]+)/i);
    const module = moduleMatch ? moduleMatch[1].trim() : "General";

    // Try to find a title-like sentence
    const titleMatch = headerSnippet.match(/vamos a (?:ver|hablar|aprender|empezar|explicar) (?:sobre |con |de |)(?:el |la |)([^,.\n]+)/i);
    let title = titleMatch ? titleMatch[1].trim() : "Untertitled Lecture";

    // Fallback for title
    if (title.length < 3 || /este vídeo|este nuevo vídeo|esta parte/i.test(title)) {
        title = lines[1] && lines[1].length > 5 ? lines[1] : (lines[0] || "Lecture " + lectureId);
    }

    report.push({
        id: lectureId,
        module: module,
        title: title
    });
});

console.log(`Total files: ${report.length}`);
report.forEach(item => {
    console.log(`${item.id} | ${item.module.padEnd(20).substring(0, 20)} | ${item.title.padEnd(40).substring(0, 40)}`);
});

// Write to a temporary JSON for later use
fs.writeFileSync('c:\\git\\wb_pr\\projects\\Yo\\cursos\\udemy\\udemyCourseTranscriptionRecovery\\playbooks\\course_metadata.json', JSON.stringify(report, null, 2));
