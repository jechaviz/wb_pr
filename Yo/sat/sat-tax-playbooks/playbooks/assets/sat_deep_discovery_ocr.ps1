param(
    [Parameter(Mandatory = $false)]
    [string]$ImagePath = "",
    [Parameter(Mandatory = $false)]
    [string]$Label = "",
    [Parameter(Mandatory = $false)]
    [string]$Url = ""
)

$ErrorActionPreference = "Stop"

function New-DeepResult {
    return [ordered]@{
        ok            = $true
        mode          = "deep_discovery"
        label         = $Label
        url           = $Url
        image_path    = $ImagePath
        timestamp_utc = ([DateTime]::UtcNow.ToString("o"))
        image_exists  = $false
        image_info    = [ordered]@{
            width  = 0
            height = 0
        }
        image_analysis = [ordered]@{
            mean_luma    = 0
            contrast     = 0
            dark_ratio   = 0
            bright_ratio = 0
            edge_density = 0
            sample_count = 0
            error        = ""
        }
        ocr = [ordered]@{
            available    = $false
            provider     = ""
            text         = ""
            text_preview = ""
            text_length  = 0
            lines        = @()
            error        = ""
        }
        keywords = [ordered]@{
            formulario_no_concluido = $false
            sin_operaciones         = $false
            vista_previa            = $false
            enviar_declaracion      = $false
            confirmar_aceptar       = $false
            acuse                   = $false
            error_detected          = $false
            captcha_detected        = $false
        }
    }
}

function Invoke-WinRtAsync {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Operation,
        [Parameter(Mandatory = $true)]
        [Type]$ResultType
    )

    if (-not $script:WinRtAsTaskMethod) {
        $script:WinRtAsTaskMethod = [System.WindowsRuntimeSystemExtensions].GetMethods() |
            Where-Object {
                $_.Name -eq "AsTask" -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1
            } |
            Select-Object -First 1
    }

    $generic = $script:WinRtAsTaskMethod.MakeGenericMethod($ResultType)
    $task = $generic.Invoke($null, @($Operation))
    $task.Wait()
    return $task.Result
}

function Analyze-Image {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    Add-Type -AssemblyName System.Drawing
    $bmp = [System.Drawing.Bitmap]::new($Path)
    try {
        $w = $bmp.Width
        $h = $bmp.Height
        $sx = [Math]::Max(1, [int][Math]::Floor($w / 220))
        $sy = [Math]::Max(1, [int][Math]::Floor($h / 220))

        $sum = 0.0
        $sumSq = 0.0
        $count = 0
        $dark = 0
        $bright = 0
        $edges = 0
        $edgeChecks = 0

        for ($y = 0; $y -lt $h; $y += $sy) {
            for ($x = 0; $x -lt $w; $x += $sx) {
                $p = $bmp.GetPixel($x, $y)
                $l = (0.2126 * $p.R) + (0.7152 * $p.G) + (0.0722 * $p.B)
                $sum += $l
                $sumSq += ($l * $l)
                $count += 1

                if ($l -lt 60) { $dark += 1 }
                if ($l -gt 210) { $bright += 1 }

                if (($x + $sx) -lt $w) {
                    $pr = $bmp.GetPixel($x + $sx, $y)
                    $lr = (0.2126 * $pr.R) + (0.7152 * $pr.G) + (0.0722 * $pr.B)
                    $edgeChecks += 1
                    if ([Math]::Abs($l - $lr) -ge 32) { $edges += 1 }
                }
                if (($y + $sy) -lt $h) {
                    $pd = $bmp.GetPixel($x, $y + $sy)
                    $ld = (0.2126 * $pd.R) + (0.7152 * $pd.G) + (0.0722 * $pd.B)
                    $edgeChecks += 1
                    if ([Math]::Abs($l - $ld) -ge 32) { $edges += 1 }
                }
            }
        }

        if ($count -eq 0) { $count = 1 }
        if ($edgeChecks -eq 0) { $edgeChecks = 1 }

        $mean = $sum / $count
        $variance = ($sumSq / $count) - ($mean * $mean)
        if ($variance -lt 0) { $variance = 0 }
        $contrast = [Math]::Sqrt($variance)

        return [ordered]@{
            width        = $w
            height       = $h
            mean_luma    = [Math]::Round($mean, 4)
            contrast     = [Math]::Round($contrast, 4)
            dark_ratio   = [Math]::Round(($dark / $count), 6)
            bright_ratio = [Math]::Round(($bright / $count), 6)
            edge_density = [Math]::Round(($edges / $edgeChecks), 6)
            sample_count = $count
            error        = ""
        }
    } finally {
        $bmp.Dispose()
    }
}

function Run-WindowsOcr {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    Add-Type -AssemblyName System.Runtime.WindowsRuntime
    $null = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
    $null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]
    $null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime]
    $null = [Windows.Globalization.Language, Windows.Globalization, ContentType = WindowsRuntime]

    $file = Invoke-WinRtAsync -Operation ([Windows.Storage.StorageFile]::GetFileFromPathAsync($Path)) -ResultType ([Windows.Storage.StorageFile])
    $stream = Invoke-WinRtAsync -Operation ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) -ResultType ([Windows.Storage.Streams.IRandomAccessStream])
    $decoder = Invoke-WinRtAsync -Operation ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) -ResultType ([Windows.Graphics.Imaging.BitmapDecoder])
    $softwareBitmap = Invoke-WinRtAsync -Operation ($decoder.GetSoftwareBitmapAsync()) -ResultType ([Windows.Graphics.Imaging.SoftwareBitmap])

    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
    if (-not $engine) {
        $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("es-MX"))
    }
    if (-not $engine) {
        $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("en-US"))
    }
    if (-not $engine) {
        throw "Windows OCR engine is unavailable."
    }

    $ocrRes = Invoke-WinRtAsync -Operation ($engine.RecognizeAsync($softwareBitmap)) -ResultType ([Windows.Media.Ocr.OcrResult])
    $text = [string]$ocrRes.Text
    $preview = if ($text.Length -gt 2000) { $text.Substring(0, 2000) } else { $text }
    $lines = @()
    foreach ($ln in $ocrRes.Lines) {
        $lines += [ordered]@{
            text = [string]$ln.Text
        }
    }

    return [ordered]@{
        available    = $true
        provider     = "Windows.Media.Ocr"
        text         = $text
        text_preview = $preview
        text_length  = $text.Length
        lines        = $lines
        error        = ""
    }
}

try {
    $result = New-DeepResult

    if ([string]::IsNullOrWhiteSpace($ImagePath) -or -not (Test-Path -LiteralPath $ImagePath)) {
        $result.ok = $false
        $result.error = "image_not_found"
        $result | ConvertTo-Json -Compress -Depth 8
        exit 0
    }

    $result.image_exists = $true

    try {
        $analysis = Analyze-Image -Path $ImagePath
        $result.image_info.width = $analysis.width
        $result.image_info.height = $analysis.height
        $result.image_analysis = $analysis
    } catch {
        $result.image_analysis.error = $_.Exception.Message
    }

    try {
        $ocr = Run-WindowsOcr -Path $ImagePath
        $result.ocr = $ocr
    } catch {
        $result.ocr.error = $_.Exception.Message
    }

    $txt = [string]$result.ocr.text
    $txtL = $txt.ToLowerInvariant()
    $result.keywords.formulario_no_concluido = $txtL.Contains("formulario no concluido")
    $result.keywords.sin_operaciones = $txtL.Contains("sin operaciones")
    $result.keywords.vista_previa = $txtL.Contains("vista previa")
    $result.keywords.enviar_declaracion = $txtL.Contains("enviar declar")
    $result.keywords.confirmar_aceptar = ($txtL.Contains("aceptar") -or $txtL.Contains("confirmar"))
    $result.keywords.acuse = $txtL.Contains("acuse")
    $result.keywords.error_detected = $txtL.Contains("error")
    $result.keywords.captcha_detected = $txtL.Contains("captcha")

    $result | ConvertTo-Json -Compress -Depth 8
    exit 0
} catch {
    $fallback = [ordered]@{
        ok            = $false
        mode          = "deep_discovery"
        label         = $Label
        url           = $Url
        image_path    = $ImagePath
        timestamp_utc = ([DateTime]::UtcNow.ToString("o"))
        error         = $_.Exception.Message
    }
    $fallback | ConvertTo-Json -Compress -Depth 6
    exit 0
}
