# SPIDEY LIFE - POPULATE HP, ATK, DEF FOR BOSSES AND MINIONS
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$TOKEN = $env:NOTION_API_KEY
$BOSSES_DB  = "12b9c24c-0fa6-4eff-8d1b-199c7ee1b3c9"
$MINIONS_DB = "1daaee25-c8a8-4ea9-aa95-0460f9f8f2cd"

$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Notion-Version" = "2022-06-28"
    "Content-Type"  = "application/json; charset=utf-8"
}

function Get-BossStats($name, $threat) {
    # 1. Cosmic / God tier
    $cosmic = @("Thanos", "Galactus", "Knull", "Beyonder", "Dormammu", "Dark Phoenix", "Apocalypse", "Onslaught", 
                "Ego the Living Planet", "Mephisto", "Chthon", "Shuma-Gorath", "Surtur", "Korvac", "Master Mold", 
                "Nimrod", "Bastion", "Cassandra Nova", "Annihilus")
    foreach ($c in $cosmic) {
        if ($name -match [regex]::Escape($c)) {
            return @{ HP = 5000; ATK = 140; DEF = 90 }
        }
    }

    # 2. High tier Supervillains
    $high = @("Green Goblin", "Doctor Octopus", "Venom", "Carnage", "Doctor Doom", "Ultron", "Magneto", "Red Skull",
              "Ronan", "Gorr", "Kang", "High Evolutionary", "Super-Skrull", "Maestro", "Leader", "Abomination", 
              "Hela", "Loki", "M.O.D.O.K.", "Cull Obsidian", "Ebony Maw", "Corvus Glaive", "Proxima Midnight", "Red Hulk")
    foreach ($h in $high) {
        if ($name -match [regex]::Escape($h)) {
            return @{ HP = 1500; ATK = 75; DEF = 50 }
        }
    }

    # 3. Major Spider-Man Villains
    $major = @("Kraven", "Lizard", "Rhino", "Electro", "Mysterio", "Sandman", "Vulture", "Scorpion", "The Spot",
               "Mister Negative", "Kingpin", "Tombstone", "Hammerhead", "Morbius", "Shriek", "Hobgoblin", 
               "Hydro-Man", "Molten Man", "Taskmaster", "Prowler", "Tinkerer", "Scream", "Jackal", "Chameleon", 
               "Shocker", "Juggernaut", "Sabretooth", "Wenwu", "Whiplash", "Iron Monger", "Yellowjacket", "Killmonger")
    foreach ($m in $major) {
        if ($name -match [regex]::Escape($m)) {
            return @{ HP = 800; ATK = 45; DEF = 30 }
        }
    }

    # 4. Default / Street / Tech Villains
    return @{ HP = 400; ATK = 30; DEF = 18 }
}

function Get-MinionStats($name) {
    if ($name -match "Leviathan") {
        return @{ HP = 350; ATK = 35; DEF = 30 }
    }
    if ($name -match "Brute|Behemoth|Heavy|War Dog|Giant|Berserker") {
        return @{ HP = 200; ATK = 25; DEF = 20 }
    }
    if ($name -match "Shield|Sniper|Minigun|Whip|Jetpack|Infiltrator|Camo|Beastmaster|Gunner|RPG") {
        return @{ HP = 110; ATK = 20; DEF = 12 }
    }
    if ($name -match "Hologram") {
        return @{ HP = 40; ATK = 12; DEF = 5 }
    }
    # Standard Grunt
    return @{ HP = 60; ATK = 12; DEF = 6 }
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "UPDATING ALL BOSSES AND MINIONS STATS" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Fetch and Update Bosses
Write-Host "Fetching Bosses..."
$bosses = @()
$hasMore = $true
$cursor = $null
while ($hasMore) {
    $bodyObj = @{ page_size = 100 }
    if ($cursor) { $bodyObj["start_cursor"] = $cursor }
    $body = $bodyObj | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "https://api.notion.com/v1/databases/$BOSSES_DB/query" -Method Post -Headers $headers -Body $body
    $bosses += $res.results
    $hasMore = $res.has_more
    $cursor = $res.next_cursor
}
Write-Host "Total Bosses to update: $($bosses.Count)"

$countB = 0
foreach ($b in $bosses) {
    $tProp = $b.properties.PSObject.Properties | Where-Object { $_.Value.type -eq "title" } | Select-Object -First 1
    $name = ($tProp.Value.title | ForEach-Object { $_.plain_text }) -join ""
    $threat = $b.properties."Threat Level".select.name
    $stats = Get-BossStats $name $threat

    $updateBody = @{
        properties = @{
            "Max HP" = @{ number = $stats.HP }
            "ATK"    = @{ number = $stats.ATK }
            "DEF"    = @{ number = $stats.DEF }
        }
    } | ConvertTo-Json -Depth 5

    Invoke-RestMethod -Uri "https://api.notion.com/v1/pages/$($b.id)" -Method Patch -Headers $headers -Body $updateBody | Out-Null
    $countB++
    if ($countB % 10 -eq 0 -or $countB -eq $bosses.Count) {
        Write-Host "   Updated $countB / $($bosses.Count) Bosses..."
    }
    Start-Sleep -Milliseconds 150
}
Write-Host "Bosses update complete!" -ForegroundColor Green

# 2. Fetch and Update Minions
Write-Host "`nFetching Minions..."
$minions = @()
$hasMore = $true
$cursor = $null
while ($hasMore) {
    $bodyObj = @{ page_size = 100 }
    if ($cursor) { $bodyObj["start_cursor"] = $cursor }
    $body = $bodyObj | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "https://api.notion.com/v1/databases/$MINIONS_DB/query" -Method Post -Headers $headers -Body $body
    $minions += $res.results
    $hasMore = $res.has_more
    $cursor = $res.next_cursor
}
Write-Host "Total Minions to update: $($minions.Count)"

$countM = 0
foreach ($m in $minions) {
    $tProp = $m.properties.PSObject.Properties | Where-Object { $_.Value.type -eq "title" } | Select-Object -First 1
    $name = ($tProp.Value.title | ForEach-Object { $_.plain_text }) -join ""
    $stats = Get-MinionStats $name

    $updateBody = @{
        properties = @{
            "Max HP" = @{ number = $stats.HP }
            "ATK"    = @{ number = $stats.ATK }
            "DEF"    = @{ number = $stats.DEF }
        }
    } | ConvertTo-Json -Depth 5

    Invoke-RestMethod -Uri "https://api.notion.com/v1/pages/$($m.id)" -Method Patch -Headers $headers -Body $updateBody | Out-Null
    $countM++
    if ($countM % 10 -eq 0 -or $countM -eq $minions.Count) {
        Write-Host "   Updated $countM / $($minions.Count) Minions..."
    }
    Start-Sleep -Milliseconds 150
}
Write-Host "Minions update complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "ALL 213 BOSSES AND MINIONS UPDATED WITH HP, ATK, DEF!" -ForegroundColor Yellow
