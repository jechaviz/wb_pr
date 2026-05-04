import { GoogleGenAI } from '@google/genai';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
    throw new Error('Set GEMINI_API_KEY or GOOGLE_API_KEY before running this script.');
}
const ai = new GoogleGenAI({ apiKey });

const baseDir = 'c:\\git\\wb_pr\\projects\\Yo\\cursos\\udemy\\udemyCourseTranscriptionRecovery\\playbooks';
const outputDir = join(baseDir, 'output');
const docsDir = join(outputDir, 'docs');
const metadataPath = join(baseDir, 'course_metadata.json');

const modulesMap: Record<string, string> = {
    'General': '00_introduccion',
    'CRM': '01_crm',
    'ventas': '02_ventas',
    'compras': '03_compras',
    'inventarios': '04_inventarios',
    'contabilidad': '05_contabilidad',
    'proyectos': '06_proyectos',
    'Manufactura': '07_manufactura'
};

const promptTemplate = `
Eres un Technical Writer experto y diseñador instruccional. 
Tu objetivo es tomar la siguiente transcripción en bruto de un curso hablado sobre Odoo y reescribirla en un tutorial/documentación en Markdown puro, altamente estructurado y óptimo para lectura.

REGLAS ESTRICTAS:
1. Extrae el título real de la lección del contexto (no uses el nombre genérico del curso) y ponlo como H1 (# Título).
2. Elimina absolutamente todas las muletillas orales ("muy bien", "este video", "okay", "bueno", etc.).
3. Estructura el contenido con encabezados (##, ###) lógicos y separadores.
4. Si el profesor lista cosas o pasos, transfórmalos en listas con viñetas o numeradas.
5. Usa negritas para destacar conceptos clave, nombres de botones o módulos de Odoo.
6. Reescribe el texto para que fluya como un artículo técnico formal y directo, no como una conversación transcrita.
7. Devuelve SOLO el Markdown resultante, sin ninguna introducción tuya.

Transcripción a procesar:
{TRANSCRIPT}
`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function processAllFiles() {
    if (!existsSync(metadataPath)) {
        console.error('Metadata no encontrada.');
        return;
    }

    const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
    const sidebarGroups: Record<string, any[]> = {};

    console.log(`Iniciando reescritura de ${metadata.length} archivos mediante IA...\n`);

    const tasks: (() => Promise<void>)[] = [];

    for (let i = 0; i < metadata.length; i++) {
        const item = metadata[i];

        let moduleKey = 'General';
        for (const key in modulesMap) {
            if (item.module.toLowerCase().includes(key.toLowerCase())) {
                moduleKey = key;
                break;
            }
        }

        const moduleFolder = modulesMap[moduleKey];
        const modulePath = join(docsDir, moduleFolder);

        if (!existsSync(modulePath)) mkdirSync(modulePath, { recursive: true });

        const txtFilename = `${item.id} - Curso completo de Odoo 19 _ 18 Para implementadores 2025.txt`;
        const txtPath = join(outputDir, txtFilename);

        const mdFilename = `${item.id}_lesson.md`;
        const mdPath = join(modulePath, mdFilename);

        tasks.push(async () => {
            let finalTitle = item.title;

            if (existsSync(txtPath)) {
                let needsProcessing = !existsSync(mdPath);

                // If it exists, check if it was a raw fallback (meaning it doesn't have an AI H1 title other than the exact filename or lacks AI structure)
                if (existsSync(mdPath) && !needsProcessing) {
                    const existingContent = readFileSync(mdPath, 'utf-8');
                    // Raw fallback files start exactly with "# [Original Title]" and then immediately contain raw text without any Markdown formatting (no ##, no lists)
                    if (existingContent.split('\n').length > 5 && !existingContent.includes('## ')) {
                        needsProcessing = true;
                        console.log(`⚠️ [Regeneración Necesaria] ID: ${item.id} parece ser un fallback crudo.`);
                    }
                }

                if (needsProcessing) {
                    console.log(`⏳ [Procesando] ID: ${item.id}`);
                    const content = readFileSync(txtPath, 'utf-8');
                    const prompt = promptTemplate.replace('{TRANSCRIPT}', content);

                    // Robust retry logic for rate limits
                    let success = false;
                    let attempts = 0;
                    const maxAttempts = 5;

                    while (!success && attempts < maxAttempts) {
                        attempts++;
                        try {
                            const response = await ai.models.generateContent({
                                model: 'gemini-2.5-flash',
                                contents: prompt,
                                config: { temperature: 0.2 }
                            });

                            const markdownContent = response.text || '';
                            writeFileSync(mdPath, markdownContent);

                            const h1Match = markdownContent.match(/^#\s+(.+)$/m);
                            if (h1Match) {
                                finalTitle = h1Match[1].trim();
                            }

                            console.log(`✅ [Completado] ID: ${item.id}`);
                            success = true;
                            await delay(1000); // Standard spacing

                        } catch (error: any) {
                            if (error.status === 429 || error.message?.includes('429')) {
                                const backoff = attempts * 15000; // 15s, 30s, 45s...
                                console.log(`⏳ [Rate Limit] ID: ${item.id} - Esperando ${backoff / 1000}s (Intento ${attempts}/${maxAttempts})...`);
                                await delay(backoff);
                            } else {
                                console.error(`❌ [Error Grave] ID: ${item.id} - ${error.message}`);
                                if (!existsSync(mdPath)) { // Only absolute fallback on fatal errors
                                    writeFileSync(mdPath, `# ${item.title}\n\n${content}`);
                                }
                                break; // Break out on fatal non-429 error
                            }
                        }
                    }

                    if (!success && !existsSync(mdPath)) {
                        console.error(`⚠️ [Falló Tras Reintentos] ID: ${item.id} - Forzando fallback.`);
                        writeFileSync(mdPath, `# ${item.title}\n\n${content}`);
                    }

                } else {
                    console.log(`⏭️ [Omitiendo] ID: ${item.id}, ya optimizado.`);
                    const existingContent = readFileSync(mdPath, 'utf-8');
                    const h1Match = existingContent.match(/^#\s+(.+)$/m);
                    if (h1Match) {
                        finalTitle = h1Match[1].trim();
                    }
                }
            }

            if (!sidebarGroups[moduleKey]) sidebarGroups[moduleKey] = [];
            sidebarGroups[moduleKey].push({
                title: finalTitle,
                path: `${moduleFolder}/${mdFilename}`,
                id: item.id
            });
        });
    }

    const BATCH_SIZE = 10;
    for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
        console.log(`\n🚀 Iniciando lote ${Math.floor(i / BATCH_SIZE) + 1} (Archivos ${i + 1} a ${Math.min(i + BATCH_SIZE, tasks.length)})...`);
        const batch = tasks.slice(i, i + BATCH_SIZE).map(task => task());
        await Promise.all(batch);
        if (i + BATCH_SIZE < tasks.length) await delay(3000);
    }

    console.log('\nTodos los archivos procesados. Generando nuevo _sidebar.md...');

    let sidebarContent = '- [**Inicio**](README.md)\n\n';

    const formatSidebarTitle = (text: string, id: string) => {
        let clean = text.replace(/\[|\]|\(|\)|\*|_|"|'/g, '').trim();
        if (!clean || clean.length < 5) clean = `Lección ${id}`;
        if (clean.length > 55) clean = clean.substring(0, 52) + '...';
        return clean.charAt(0).toUpperCase() + clean.slice(1);
    };

    for (const [moduleName, folder] of Object.entries(modulesMap)) {
        if (sidebarGroups[moduleName]) {
            sidebarContent += `- **${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}**\n`;
            sidebarGroups[moduleName].forEach(lecture => {
                const displayTitle = formatSidebarTitle(lecture.title, lecture.id);
                sidebarContent += `  - [${displayTitle}](${lecture.path})\n`;
            });
            sidebarContent += '\n';
        }
    }

    writeFileSync(join(docsDir, '_sidebar.md'), sidebarContent);
    console.log('✅ Reescritura masiva completada y sidebar actualizado.');
}

processAllFiles();
