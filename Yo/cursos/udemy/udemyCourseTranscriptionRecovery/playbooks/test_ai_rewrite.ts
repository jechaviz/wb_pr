import { GoogleGenAI } from '@google/genai';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Reemplazar la API key con la proveída por el usuario
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
    throw new Error('Set GEMINI_API_KEY or GOOGLE_API_KEY before running this test.');
}
const ai = new GoogleGenAI({ apiKey });

const baseDir = 'c:\\git\\wb_pr\\projects\\Yo\\cursos\\udemy\\udemyCourseTranscriptionRecovery\\playbooks';
const testFile = join(baseDir, 'output', '38606014 - Curso completo de Odoo 19 _ 18 Para implementadores 2025.txt');
const outputFile = join(baseDir, 'output', 'test_rewrite.md');

const promptTemplate = `
Eres un Technical Writer experto y diseñador instruccional. 
Tu objetivo es tomar la siguiente transcripción en bruto de un curso hablado sobre Odoo y reescribirla en un tutorial/documentación en Markdown puro, altamente estructurado y óptimo para lectura.

REGLAS ESTRICTAS:
1. Extrae el título real de la lección del contexto (no uses el nombre genérico del curso) y ponlo como H1 (# Título).
2. Elimina absolutamente todas las muletillas orales ("muy bien", "este video", "okay", "bueno", etc.).
3. Estructura el contenido con encabezados (##, ###) lógicos.
4. Si el profesor lista cosas o pasos, transfórmalos en listas con viñetas o numeradas.
5. Usa negritas para destacar conceptos clave, nombres de botones o módulos de Odoo.
6. Reescribe el texto para que fluya como un artículo técnico formal y directo, no como una conversación transcrita.
7. Devuelve SOLO el Markdown resultante, sin ninguna introducción tuya.

Transcripción a procesar:
{TRANSCRIPT}
`;

async function testRewrite() {
    console.log(`Leyendo archivo de prueba: ${testFile}`);
    try {
        const content = readFileSync(testFile, 'utf-8');
        console.log(`Longitud original: ${content.length} caracteres.`);

        const prompt = promptTemplate.replace('{TRANSCRIPT}', content);

        console.log('Enviando a Gemini para reescritura óptima...');
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2, // Low temperature for factual/structural rewriting
            }
        });

        const markdownContent = response.text || '';
        writeFileSync(outputFile, markdownContent);
        console.log(`\n✅ Archivo optimizado guardado en: ${outputFile}`);
        console.log('\n--- VISTA PREVIA DEL MARKDOWN ---');
        console.log(markdownContent.substring(0, 500) + '...\n-------------------------------');

    } catch (error) {
        console.error('Error durante la reescritura:', error);
    }
}

testRewrite();
