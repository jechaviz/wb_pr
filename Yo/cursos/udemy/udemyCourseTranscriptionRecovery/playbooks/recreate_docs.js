const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\git\\wb_pr\\projects\\Yo\\cursos\\udemy\\udemyCourseTranscriptionRecovery\\playbooks';
const outputDir = path.join(baseDir, 'output');
const docsDir = path.join(outputDir, 'docs');
const metadataPath = path.join(baseDir, 'course_metadata.json');

if (!fs.existsSync(metadataPath)) {
  console.error('Metadata file not found. Run analyze_course.js first.');
  process.exit(1);
}

const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

// Create docs directory
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const modules = {
  'General': '00_introduccion',
  'CRM': '01_crm',
  'ventas': '02_ventas',
  'compras': '03_compras',
  'inventarios': '04_inventarios',
  'contabilidad': '05_contabilidad',
  'proyectos': '06_proyectos',
  'Manufactura': '07_manufactura'
};

const sidebarGroups = {};

// Helper to sanitize title for filename
const sanitizeFilename = (text) => text.replace(/[^a-z0-0]/gi, '_').toLowerCase().substring(0, 50);

metadata.forEach(item => {
  let moduleKey = 'General';
  for (const key in modules) {
    if (item.module.toLowerCase().includes(key.toLowerCase())) {
      moduleKey = key;
      break;
    }
  }

  const moduleFolder = modules[moduleKey];
  const modulePath = path.join(docsDir, moduleFolder);

  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
  }

  const safeTitle = sanitizeFilename(item.title);
  const mdFilename = `${item.id}_${safeTitle}.md`;
  const mdPath = path.join(modulePath, mdFilename);
  const txtPath = path.join(outputDir, `${item.id} - Curso completo de Odoo 19 _ 18 Para implementadores 2025.txt`);

  if (fs.existsSync(txtPath)) {
    let content = fs.readFileSync(txtPath, 'utf-8');
    // Simple conversion: wrap in a title
    const mdContent = `# ${item.title}\n\n${content}`;
    fs.writeFileSync(mdPath, mdContent);
  }

  if (!sidebarGroups[moduleKey]) sidebarGroups[moduleKey] = [];
  sidebarGroups[moduleKey].push({
    title: item.title,
    path: `${moduleFolder}/${mdFilename}`
  });
});

// Helper to truncate and sanitize title for the sidebar
const formatSidebarTitle = (text, id) => {
  let clean = text.replace(/\[|\]|\(|\)|\*|_|"|'/g, '').trim();
  if (!clean || clean.length < 5) clean = `Lección ${id}`;
  if (clean.length > 55) {
    clean = clean.substring(0, 52) + '...';
  }
  // Capitalize first letter
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

// Generate _sidebar.md
let sidebarContent = '- [**Inicio**](README.md)\n\n';
for (const [moduleName, folder] of Object.entries(modules)) {
  if (sidebarGroups[moduleName]) {
    sidebarContent += `- **${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}**\n`;
    sidebarGroups[moduleName].forEach(lecture => {
      const displayTitle = formatSidebarTitle(lecture.title, lecture.id || '');
      sidebarContent += `  - [${displayTitle}](${lecture.path})\n`;
    });
    sidebarContent += '\n';
  }
}
fs.writeFileSync(path.join(docsDir, '_sidebar.md'), sidebarContent);

// Generate README.md
const readmeContent = `# Curso Completo de Odoo 19 / 18 Para Implementadores 2025\n\nBienvenido a la documentación del curso. Aquí encontrarás todas las transcripciones organizadas por módulos.\n\nUtiliza la barra lateral para navegar por las secciones.`;
fs.writeFileSync(path.join(docsDir, 'README.md'), readmeContent);

// Generate index.html with a premium custom theme
const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Curso Odoo 2025</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
  <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify/lib/themes/vue.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --theme-color: #714B67; /* Odoo Purple */
      --accent-color: #017E84; /* Odoo Teal */
      --bg-color: #f8f9fa;
      --sidebar-bg: #ffffff;
      --text-color: #212529;
    }
    
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background-color: var(--bg-color);
        color: var(--text-color);
    }
    
    /* Sleek Typography */
    h1, h2, h3, h4, h5 {
        font-family: 'Outfit', sans-serif;
        font-weight: 700;
        letter-spacing: -0.02em;
    }
    
    h1 {
        background: linear-gradient(135deg, var(--theme-color) 0%, var(--accent-color) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
    }

    /* Modern Sidebar */
    .sidebar {
        background-color: var(--sidebar-bg);
        box-shadow: 2px 0 20px rgba(0,0,0,0.04);
        border-right: none;
        padding-top: 20px;
    }
    .sidebar-nav {
        margin-top: 20px;
    }
    .sidebar h1 {
        font-size: 1.5rem;
        font-weight: 800;
        margin-left: 15px;
    }
    .sidebar ul li a {
        font-size: 0.95rem;
        padding: 8px 15px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 8px;
        margin: 2px 10px;
        color: #495057;
    }
    .sidebar ul li a:hover {
        background-color: rgba(113, 75, 103, 0.05);
        color: var(--theme-color);
        transform: translateX(4px);
    }
    .sidebar ul li.active > a {
        background-color: rgba(113, 75, 103, 0.1);
        color: var(--theme-color);
        font-weight: 600;
    }
    
    /* Premium Content Area */
    .markdown-section {
        max-width: 900px;
        padding: 40px 60px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.03);
        margin-top: 40px;
        margin-bottom: 60px;
        transition: transform 0.3s ease;
    }
    .markdown-section:hover {
        transform: translateY(-2px);
    }
    
    /* Search Bar Aesthetics */
    .search input[type=search] {
        background: #f1f3f5;
        border: 2px solid transparent;
        border-radius: 12px;
        padding: 12px;
        transition: all 0.3s ease;
    }
    .search input[type=search]:focus {
        background: white;
        border-color: var(--theme-color);
        box-shadow: 0 0 0 4px rgba(113, 75, 103, 0.1);
    }

    /* Custom Glassmorphism active element */
    .docsify-pagination-container {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e9ecef;
    }
  </style>
</head>
<body>
  <div id="app">Cargando...</div>
  <script>
    window.$docsify = {
      name: 'Curso Odoo 2025',
      repo: '',
      loadSidebar: true,
      subMaxLevel: 2,
      search: 'auto',
      themeColor: '#714B67',
      pagination: {
        previousText: 'Anterior',
        nextText: 'Siguiente',
        crossChapter: true,
        crossChapterText: true,
      },
      copyCode: {
        buttonText : 'Copiar',
        errorText  : 'Error',
        successText: 'Copiado'
      }
    }
  </script>
  <!-- Docsify v4 -->
  <script src="//cdn.jsdelivr.net/npm/docsify@4"></script>
  <script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js"></script>
  <script src="//cdn.jsdelivr.net/npm/docsify-pagination/dist/docsify-pagination.min.js"></script>
  <script src="//cdn.jsdelivr.net/npm/docsify-copy-code/dist/docsify-copy-code.min.js"></script>
</body>
</html>`;
fs.writeFileSync(path.join(docsDir, 'index.html'), indexHtml);

console.log('Docsify site generated successfully in output/docs');
