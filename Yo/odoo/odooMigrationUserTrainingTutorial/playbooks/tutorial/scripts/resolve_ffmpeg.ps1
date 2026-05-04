$ErrorActionPreference = 'SilentlyContinue'

function Write-ResolvedPath([string]$path) {
    if (-not [string]::IsNullOrWhiteSpace($path)) {
        [Console]::Out.Write($path.Trim())
        exit 0
    }
}

# 1) Fast path: ffmpeg already in PATH
$cmd = Get-Command ffmpeg -CommandType Application -ErrorAction SilentlyContinue
if ($cmd -and $cmd.Source) {
    Write-ResolvedPath $cmd.Source
}

# 2) Common install roots (winget + program files)
$roots = @()
if ($env:LOCALAPPDATA) {
    $roots += (Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages')
}
if ($env:ProgramFiles) {
    $roots += $env:ProgramFiles
}
$programFilesX86 = [Environment]::GetEnvironmentVariable('ProgramFiles(x86)')
if ($programFilesX86) {
    $roots += $programFilesX86
}

foreach ($root in $roots) {
    if (-not (Test-Path $root)) {
        continue
    }

    $ffmpeg = Get-ChildItem -Path $root -Recurse -File -Filter ffmpeg.exe -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($ffmpeg -and $ffmpeg.FullName) {
        Write-ResolvedPath $ffmpeg.FullName
    }
}

exit 1
