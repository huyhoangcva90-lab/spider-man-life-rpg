# SPIDEY LIFE - NOTION TO GAME SYNC UTILITY
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$TOKEN = $env:NOTION_API_KEY
$CALENDAR_DB = "272d7876-36c6-81d9-ae35-d494508b25d0"
$HABITS_DB   = "272d7876-36c6-81a2-9bf8-e4d5e588e173"
$GOALS_DB    = "272d7876-36c6-8172-9e4d-f3566c0d933d"

$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Notion-Version" = "2022-06-28"
    "Content-Type"  = "application/json; charset=utf-8"
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "SPIDEY LIFE // NOTION LIVE SYNC ENGINE" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Fetch Habits
Write-Host "Fetching Habits from Notion..." -NoNewline
$habitsRaw = @()
$hasMore = $true
$cursor = $null
while ($hasMore) {
    $bodyObj = @{ page_size = 100 }
    if ($cursor) { $bodyObj["start_cursor"] = $cursor }
    $body = $bodyObj | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "https://api.notion.com/v1/databases/$HABITS_DB/query" -Method Post -Headers $headers -Body $body
    $habitsRaw += $res.results
    $hasMore = $res.has_more
    $cursor = $res.next_cursor
}
Write-Host " OK ($($habitsRaw.Count) habits)" -ForegroundColor Green

# 2. Fetch Master Calendar Tasks
Write-Host "Fetching Master Calendar Tasks from Notion..." -NoNewline
$calRaw = @()
$hasMore = $true
$cursor = $null
while ($hasMore) {
    $bodyObj = @{ page_size = 100 }
    if ($cursor) { $bodyObj["start_cursor"] = $cursor }
    $body = $bodyObj | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "https://api.notion.com/v1/databases/$CALENDAR_DB/query" -Method Post -Headers $headers -Body $body
    $calRaw += $res.results
    $hasMore = $res.has_more
    $cursor = $res.next_cursor
}
Write-Host " OK ($($calRaw.Count) tasks)" -ForegroundColor Green

# 3. Transform Habits
$habitsList = @()
foreach ($page in $habitsRaw) {
    $p = $page.properties
    $title = ($p.Name.title | ForEach-Object { $_.plain_text }) -join ""
    if ([string]::IsNullOrWhiteSpace($title)) { continue }

    $desc = ($p.Description.rich_text | ForEach-Object { $_.plain_text }) -join ""
    $outcome = ($p."What do I expect at the end?".rich_text | ForEach-Object { $_.plain_text }) -join ""
    
    $habitsList += [PSCustomObject]@{
        id          = $page.id
        name        = $title
        status      = if ($p.Status.status) { $p.Status.status.name } else { "In Progress" }
        priority    = if ($p.Priority.select) { $p.Priority.select.name } else { "Medium" }
        timeBlock   = if ($p.Timeblock.select) { $p.Timeblock.select.name } else { "All day" }
        outcome     = $outcome
        description = $desc
        category    = if ($p.Type.select) { $p.Type.select.name } else { "Good" }
        today       = [bool]$p.Today.checkbox
        yesterday   = [bool]$p.Yesterday.checkbox
        gameEnabled = [bool]$p."Game Enabled".checkbox
        xp          = if ($p."XP / Check".number) { $p."XP / Check".number } else { 1 }
        gold        = if ($p."Gold / Check".number) { $p."Gold / Check".number } else { 0 }
        sourceUrl   = $page.url
    }
}

# 4. Transform Master Calendar
$calList = @()
foreach ($page in $calRaw) {
    $p = $page.properties
    $title = ($p.Name.title | ForEach-Object { $_.plain_text }) -join ""
    if ([string]::IsNullOrWhiteSpace($title)) { continue }

    $dateVal = $null
    if ($p.Date.date) { $dateVal = $p.Date.date.start }
    elseif ($p.Start.date) { $dateVal = $p.Start.date.start }

    $doneVal = [bool]$p.Done.checkbox
    if (-not $doneVal -and $p.Status.status -and $p.Status.status.name -eq "Done") {
        $doneVal = $true
    }

    $priorityVal = "Medium"
    if ($p.Priority.multi_select -and $p.Priority.multi_select.Count -gt 0) {
        $priorityVal = ($p.Priority.multi_select | ForEach-Object { $_.name }) -join ", "
    }

    $typeVal = "Work"
    if ($p.Type.select) { $typeVal = $p.Type.select.name }

    $calList += [PSCustomObject]@{
        id          = $page.id
        title       = $title
        date        = $dateVal
        status      = if ($p.Status.status) { $p.Status.status.name } else { if ($doneVal) { "Done" } else { "Upcoming" } }
        done        = $doneVal
        type        = $typeVal
        priority    = $priorityVal
        gameEnabled = [bool]$p."Game Enabled".checkbox
        gameXp      = if ($p."Game XP".number) { $p."Game XP".number } else { 1 }
        sourceUrl   = $page.url
    }
}

# 5. Build Snapshot Structure
$snapshot = [PSCustomObject]@{
    metadata = [PSCustomObject]@{
        syncedAt         = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        version          = "5.1.0-live"
        systemPhilosophy = "One system, one truth. Zeus Workspace -> Habits + Master Calendar -> Spidey Life RPG"
    }
    sourceRegistries = [PSCustomObject]@{
        masterCalendar = $CALENDAR_DB
        habits         = $HABITS_DB
        goals          = $GOALS_DB
    }
    collections = [PSCustomObject]@{
        masterCalendar = $calList
        habits         = $habitsList
        goals          = @()
    }
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path
$targetFile = Join-Path $repoRoot "data\notion-snapshot.json"
$jsonString = $snapshot | ConvertTo-Json -Depth 10

[System.IO.File]::WriteAllText($targetFile, $jsonString, [System.Text.Encoding]::UTF8)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Sync completed successfully!" -ForegroundColor Green
Write-Host "   - Habits count: $($habitsList.Count)" -ForegroundColor White
Write-Host "   - Tasks count:  $($calList.Count)" -ForegroundColor White
Write-Host "   - Saved to:     data/notion-snapshot.json" -ForegroundColor Gray
Write-Host "==========================================" -ForegroundColor Cyan
