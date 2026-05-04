import os
import re

output_dir = r"c:\git\wb_pr\projects\Yo\cursos\udemy\udemyCourseTranscriptionRecovery\playbooks\output"
files = [f for f in os.listdir(output_dir) if f.endswith(".txt") and " - " in f]

# Sort by numeric prefix
files.sort(key=lambda x: int(x.split(" - ")[0]) if x.split(" - ")[0].isdigit() else 0)

report = []

for filename in files:
    path = os.path.join(output_dir, filename)
    lecture_id = filename.split(" - ")[0]
    
    with open(path, "r", encoding="utf-8") as f:
        # Read first 5 lines
        lines = [f.readline().strip() for _ in range(5)]
        content = " ".join(lines)
        
        # Try to find "módulo de X"
        module_match = re.search(r"módulo de ([^,.\n]+)", content, re.IGNORECASE)
        module = module_match.group(1).strip() if module_match else "General"
        
        # Try to find a title-like sentence
        # Look for "vamos a ver X", "vamos a hablar de X", etc.
        title_match = re.search(r"vamos a (?:ver|hablar|aprender|empezar|explicar) (?:sobre |con |de |)(?:el |la |)([^,.\n]+)", content, re.IGNORECASE)
        title = title_match.group(1).strip() if title_match else "Untertitled Lecture"
        
        # Fallback for title if it's too generic
        if len(title) < 3 or title.lower() in ["este vídeo", "este nuevo vídeo", "esta parte"]:
             title = lines[1] if len(lines) > 1 and len(lines[1]) > 5 else lines[0]

        report.append({
            "id": lecture_id,
            "filename": filename,
            "module": module,
            "title": title,
            "first_line": lines[0],
            "second_line": lines[1]
        })

# Print a summary
print(f"Total files: {len(report)}")
for item in report:
    print(f"{item['id']} | {item['module'][:20]:20} | {item['title'][:40]:40}")
