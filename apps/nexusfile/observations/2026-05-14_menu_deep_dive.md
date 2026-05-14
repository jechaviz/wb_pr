# NexusFile Menu Deep Dive - 2026-05-14

This pass used installed NexusFile resources instead of destructive UI actions.
The live-click menu coverage remains intentionally conservative, but the
language/resource inventory exposes the full menu/dialog shape.

## Menus Covered

- Archivo: file execution, copy/move/delete/shred, rename, advanced rename,
  attributes/date, properties, empty file, shortcuts.
- Carpeta: tree, favorites, history, parent/root/last destination, network
  folder, work folders, refresh.
- Editar: clipboard, path/name copies, selection, advanced select/deselect,
  find/search.
- Ver: chrome toggles, dual view, tabs, drive buttons, list styles, columns,
  sort, filter, hidden files, skins.
- Sistema: shell places, recycle/temp cleanup, command line.
- Archivo Comprimido: archive add/move/extract/auto-extract.
- Red: FTP quick connect/connect/disconnect/site manager/get/put, map/unmap
  network drive.
- Herramientas: viewer/editor, save list, split/join, disk copy, cleanup,
  synchronize/compare, options.

## Advanced Rename

Resource section `formAdvRename` defines a three-step flow:

1. Determinar Accion.
2. Aplicar Accion.
3. Previsualizar.

Action families: Insertar, Encontrar/Reemplazar, Eliminar, Case, Numeracion,
Cambiar Extension.

## FTP/SFTP Shape

Resource sections `formFTPQuickConnect`, `formFTPSiteManager`, and
`formFTPAttributes` define host, port, user, password, remote directory,
passive mode, server type, progress list, pause/abort, and Unix permission
editing. Local `ftpsite.ini` was inspected only as schema; passwords were not
persisted into notes.
