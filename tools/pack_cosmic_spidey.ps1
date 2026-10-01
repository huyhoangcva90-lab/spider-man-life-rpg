# Pipeline Script: Pack Marvel Cosmic Invasion Spider-Man Assets for Spidey Life RPG
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Add-Type -AssemblyName System.Drawing

$srcDir = "c:\Users\huyklgl\Documents\antigravity\serene-galileo\Spider-Man"
$spideyDir = Join-Path $srcDir "01 [Default]"
$destDir = "C:\Users\huyklgl\Documents\antigravity\spider-man-life-rpg\assets\spideytracker"
$outSheetPng = Join-Path $destDir "cosmic-spidey-sheet.png"
$outWebPng = Join-Path $destDir "cosmic-web-vfx.png"
$outJson = "C:\Users\huyklgl\Documents\antigravity\spider-man-life-rpg\data\cosmic-spidey-map.json"

if (-not (Test-Path -LiteralPath $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}
$dataDir = [System.IO.Path]::GetDirectoryName($outJson)
if (-not (Test-Path -LiteralPath $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

Write-Host ">>> Packing Marvel Cosmic Invasion Spider-Man Sprites..."

# Định nghĩa danh sách file cho từng animation state
$animDefs = [ordered]@{
    "idle" = @{
        files = @("Idle_00.png","Idle_01.png","Idle_02.png","Idle_03.png","Idle_04.png","Idle_05.png","Idle_06.png","Idle_07.png")
        fps = 7
        loop = $true
        motion = "breathe"
    }
    "combat_idle" = @{
        files = @("Idle_00.png","Idle_01.png","Idle_02.png","Idle_03.png")
        fps = 6
        loop = $true
        motion = "guard"
    }
    "run" = @{
        files = @("Sprint_00.png","Sprint_01.png","Sprint_02.png","Sprint_03.png","Sprint_04.png","Sprint_05.png","Sprint_06.png","Sprint_07.png")
        fps = 12
        loop = $false
        motion = "run"
    }
    "jump" = @{
        files = @("Jump.png","Jumpapex_00.png","Jumpapex_02.png","Jumpapex_04.png","Jumpfall.png","Land_00.png")
        fps = 10
        loop = $false
        motion = "jump"
    }
    "dodge" = @{
        files = @("Dodge_00.png","Dodge_01.png","Dodge_02.png","Dodge_03.png","Dodge_04.png","Dodge_05.png","Dodge_06.png")
        fps = 14
        loop = $false
        motion = "dodge"
    }
    "attack_01" = @{
        files = @("Attack1_00.png","Attack1_01.png","Attack1_02-03.png","Attack1_04.png")
        fps = 12
        loop = $false
        motion = "strike"
        vfx = @("THWIP-PUNCH!", "impact")
    }
    "attack_02" = @{
        files = @("Attack2_00.png","Attack2_01.png","Attack2_02.png","Attack2_03.png","Attack2_04.png","Attack2_05.png","Attack2_06.png")
        fps = 13
        loop = $false
        motion = "uppercut"
        vfx = @("SPIDER-KICK!", "slash")
    }
    "attack_03" = @{
        files = @("Attack3_00.png","Attack3_01.png","Attack3_02.png","Attack3_03.png","Attack3_04.png","Attack3_05.png","Attack3_06.png","Attack3_07.png")
        fps = 14
        loop = $false
        motion = "spin"
        vfx = @("COMBO FINISH!", "impact")
    }
    "ranged_attack" = @{
        files = @("Power1start_00.png","Power1_00.png","Power1_01.png","Power1_02-03.png","Power1end_00.png","Power1end_01.png")
        fps = 12
        loop = $false
        motion = "recoil"
        vfx = @("THWIP!", "web")
    }
    "skill_01" = @{
        files = @("Attacksprinting_00.png","Attacksprinting_01.png","Attacksprinting_02.png","Attacksprinting_03.png","Attacksprinting_04.png","Attacksprinting_05.png")
        fps = 13
        loop = $false
        motion = "skill"
        vfx = @("SPIDER DASH!", "electric")
    }
    "skill_02" = @{
        files = @("Power2start_00.png","Power2_00.png","Power2_01.png","Power2_02-03.png","Power2end_00.png")
        fps = 12
        loop = $false
        motion = "skill"
        vfx = @("WEB UPPERCUT!", "web")
    }
    "skill_03" = @{
        files = @("Attackswinging_00.png","Attackswinging_01.png","Attackswinging_02.png","Attackswinging_03.png","Attackswinging_04_08_12_16_20_24.png","Attackswinging_05_09_13_17_21_25.png")
        fps = 14
        loop = $false
        motion = "skill"
        vfx = @("WEB SWING SLAM!", "impact")
    }
    "ultimate" = @{
        files = @("Special_00.png","Special_01.png","Special_02.png","Special_03.png","Special_04.png","Special_05.png","Special_06.png","Special_07.png","Special_08.png","Special_09.png","Special_10.png","Special_11.png")
        fps = 15
        loop = $false
        motion = "ultimate"
        vfx = @("MAXIMUM SPIDER!", "ultimate")
    }
    "hurt" = @{
        files = @("Hitstun_00.png","Hitstun_01.png")
        fps = 8
        loop = $false
        motion = "hurt"
        vfx = @("UGH!", "hurt")
    }
    "knockback" = @{
        files = @("Kd_00.png","Kd_01.png","Kd_02.png","Kd_03.png","Kd_04.png","Kd_05.png","Kdfall.png")
        fps = 11
        loop = $false
        motion = "knockback"
        vfx = @("CRASH!", "hurt")
    }
    "KO" = @{
        files = @("Down.png","Downbounce_00.png","Downbounce_01.png","Downbounce_02.png","Downbounce_03.png")
        fps = 7
        loop = $false
        motion = "ko"
        vfx = @("K.O.", "ko")
    }
    "victory" = @{
        files = @("Selectscreen_00.png","Selectscreen_02.png","Selectscreen_04.png","Selectscreen_06.png","Selectscreen_08.png","Selectscreen_10.png","Selectscreenend.png")
        fps = 7
        loop = $true
        motion = "victory"
        vfx = @("EXCELSIOR!", "victory")
    }
}

# Tính tổng số frame cần ghép
$allFrames = @()
foreach ($animName in $animDefs.Keys) {
    $anim = $animDefs[$animName]
    foreach ($f in $anim.files) {
        $full = [System.IO.Path]::Combine($spideyDir, $f)
        if (-not [System.IO.File]::Exists($full)) {
            Write-Warning "File not found: $f"
            # Thử tìm file thay thế
            $cand = Get-ChildItem -LiteralPath $spideyDir -Filter "$([System.IO.Path]::GetFileNameWithoutExtension($f))*.png" | Select-Object -First 1
            if ($cand) { $full = $cand.FullName }
        }
        $allFrames += [pscustomobject]@{
            anim = $animName
            fileName = $f
            path = $full
        }
    }
}

Write-Host ("Total selected frames: {0}" -f $allFrames.Count)

# Quy chuẩn kích thước ô: 256 x 256 pixel gốc (đảm bảo 100% pixel-perfect)
$cellW = 256
$cellH = 256
$cols = 10
$rows = [int][Math]::Ceiling($allFrames.Count / [double]$cols)
$sheetW = $cols * $cellW
$sheetH = $rows * $cellH

Write-Host ("Creating Atlas: {0}x{1} ({2} columns x {3} rows)" -f $sheetW, $sheetH, $cols, $rows)

$atlas = New-Object System.Drawing.Bitmap($sheetW, $sheetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($atlas)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half

$animStateMap = [ordered]@{}

for ($i = 0; $i -lt $allFrames.Count; $i++) {
    $item = $allFrames[$i]
    $c = $i % $cols
    $r = [int][Math]::Floor($i / $cols)
    $destX = $c * $cellW
    $destY = $r * $cellH

    if ([System.IO.File]::Exists($item.path)) {
        $frameBmp = New-Object System.Drawing.Bitmap($item.path)
        # Vẽ vào đúng ô 256x256
        $srcRect = New-Object System.Drawing.Rectangle(0, 0, [Math]::Min($frameBmp.Width, $cellW), [Math]::Min($frameBmp.Height, $cellH))
        $destRect = New-Object System.Drawing.Rectangle($destX, $destY, $srcRect.Width, $srcRect.Height)
        $g.DrawImage($frameBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
        $frameBmp.Dispose()
    }

    if (-not $animStateMap.Contains($item.anim)) {
        $def = $animDefs[$item.anim]
        $animStateMap[$item.anim] = [ordered]@{
            fps = $def.fps
            loop = $def.loop
            motion = $def.motion
            vfx = $def.vfx
            frames = @()
        }
    }
    $animStateMap[$item.anim].frames += ,@($destX, $destY)
}

$g.Dispose()
$atlas.Save($outSheetPng, [System.Drawing.Imaging.ImageFormat]::Png)
$atlas.Dispose()
Write-Host ("Saved Spider-Man Atlas to: {0}" -f $outSheetPng)

# Đóng gói Web & Projectile VFX
Write-Host ">>> Packing Web & Projectile VFX..."
$webFiles = @(
    "PowerProjectileActive_00.png",
    "PowerProjectileActive_01.png",
    "PowerProjectileActive_02.png",
    "PowerProjectileActive_03.png",
    "PowerProjectileActive_04.png",
    "PowerProjectileActive_05.png",
    "PowerProjectileDeath_00.png",
    "PowerProjectileDeath_01.png",
    "PowerProjectileDeath_02.png",
    "PowerProjectileDeath_03.png",
    "PowerProjectileDeath_04.png",
    "PowerProjectileDeath_05.png",
    "Webtipend_00.png",
    "Webtipend_01.png",
    "Webtipend_02.png",
    "Webtipend_03.png"
)

$webCell = 64
$webCols = 8
$webRows = [int][Math]::Ceiling($webFiles.Count / [double]$webCols)
$webAtlas = New-Object System.Drawing.Bitmap(($webCols * $webCell), ($webRows * $webCell), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$wg = [System.Drawing.Graphics]::FromImage($webAtlas)
$wg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor

for ($wIdx = 0; $wIdx -lt $webFiles.Count; $wIdx++) {
    $wf = $webFiles[$wIdx]
    $wPath = [System.IO.Path]::Combine($srcDir, $wf)
    if ([System.IO.File]::Exists($wPath)) {
        $wBmp = New-Object System.Drawing.Bitmap($wPath)
        $wc = $wIdx % $webCols
        $wr = [int][Math]::Floor($wIdx / $webCols)
        # Giữ tỉ lệ hoặc canh giữa ô 64x64
        $scale = [Math]::Min($webCell / [double]$wBmp.Width, $webCell / [double]$wBmp.Height)
        $dw = [int][Math]::Round($wBmp.Width * $scale)
        $dh = [int][Math]::Round($wBmp.Height * $scale)
        $dx = ($wc * $webCell) + [int][Math]::Round(($webCell - $dw) / 2)
        $dy = ($wr * $webCell) + [int][Math]::Round(($webCell - $dh) / 2)
        $wg.DrawImage($wBmp, (New-Object System.Drawing.Rectangle($dx, $dy, $dw, $dh)), (New-Object System.Drawing.Rectangle(0, 0, $wBmp.Width, $wBmp.Height)), [System.Drawing.GraphicsUnit]::Pixel)
        $wBmp.Dispose()
    }
}
$wg.Dispose()
$webAtlas.Save($outWebPng, [System.Drawing.Imaging.ImageFormat]::Png)
$webAtlas.Dispose()
Write-Host ("Saved Web VFX Sheet to: {0}" -f $outWebPng)

# Ghi file JSON cấu hình
$jsonOutput = [ordered]@{
    meta = @{
        name = "Marvel Cosmic Invasion Spider-Man Sprite Atlas"
        author = "Cosmic Sprite Pipeline"
        cellWidth = $cellW
        cellHeight = $cellH
        sheetWidth = $sheetW
        sheetHeight = $sheetH
        columns = $cols
        rows = $rows
        totalFrames = $allFrames.Count
    }
    states = $animStateMap
}

$jsonStr = $jsonOutput | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($outJson, $jsonStr, [System.Text.Encoding]::UTF8)
Write-Host ("Exported animation mapping to: {0}" -f $outJson)
Write-Host ">>> Cosmic Sprite Pipeline completed successfully!"
