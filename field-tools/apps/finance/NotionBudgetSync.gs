// Companion for the existing Apps Script project. No credentials in this file.
// Target is authoritative. Empty cells mean unset; numeric zero explicitly clears a budget.
function gambitBudgetPlan_(ss, monthKey, configuredYear) {
  if (!/^\d{4}-\d{2}$/.test(monthKey) || Number(monthKey.slice(5)) < 1 || Number(monthKey.slice(5)) > 12)
    throw new Error('Invalid budget month.');
  if (Number(monthKey.slice(0,4)) !== Number(configuredYear)) throw new Error('Target year does not match current year.');
  var target = getTargetSheet_(ss), settings = getSettingsSheet_(ss);
  if (!target) throw new Error('Target sheet not found.');
  var groups = [
    {type:'income',start:25,end:32,settings:'D5:F12',database:'272d787636c681b19ce0fdd39df80fd9'},
    {type:'expense',start:38,end:53,settings:'D16:F31',database:'272d787636c68119b88fd92c7dcb207a'}
  ];
  var result = {month:monthKey,updates:[],skipped:[]}, destinations = Object.create(null);
  groups.forEach(function(group) {
    var mappings = Object.create(null);
    settings.getRange(group.settings).getValues().forEach(function(row) {
      var key = normalizeHeader_(row[0]); if (!key) return;
      if (Object.prototype.hasOwnProperty.call(mappings,key)) throw new Error('Duplicate category mapping: '+key);
      mappings[key] = String(row[2] || '').replace(/-/g,'').trim().toLowerCase();
    });
    target.getRange(group.start,8,group.end-group.start+1,18).getValues().forEach(function(row,i) {
      var category = String(row[0] || '').trim(); if (!category) return;
      var properties = {}, values = {'Monthly Budget':row[5+Number(monthKey.slice(5))], 'Yearly Budget':row[5]};
      Object.keys(values).forEach(function(name) {
        var value = values[name]; if (value === '' || value === null || value === undefined) return;
        // getValues returns real numbers for numeric cells; reject text/errors rather than guessing money.
        if (typeof value !== 'number' || !isFinite(value) || value < 0) throw new Error('Invalid '+name+' at Target row '+(group.start+i));
        properties[name] = {number:value};
      });
      if (!Object.keys(properties).length) {result.skipped.push({category:category,reason:'empty_target'});return;}
      var id = mappings[normalizeHeader_(category)];
      if (!/^[a-f0-9]{32}$/i.test(id || '')) {result.skipped.push({category:category,reason:'missing_notion_id'});return;}
      if (destinations[id]) throw new Error('Multiple Target rows map to one Notion page: '+category);
      destinations[id] = true;
      result.updates.push({pageId:id,database:group.database,category:category,row:group.start+i,properties:properties});
    });
  });
  return result;
}
function gambitBudgetRequest_(method,path,body) {
  var token = PropertiesService.getScriptProperties().getProperty('NOTION_TOKEN') || (typeof NOTION_TOKEN !== 'undefined' ? NOTION_TOKEN : '');
  if (!token) throw new Error('Notion token is not configured in Apps Script.');
  var options = {method:method,headers:{Authorization:'Bearer '+token,'Notion-Version':'2022-06-28'},muteHttpExceptions:true};
  if (body) {options.contentType='application/json';options.payload=JSON.stringify(body);}
  var response = UrlFetchApp.fetch('https://api.notion.com/v1/'+path,options);
  var code = response.getResponseCode();
  if (code < 200 || code >= 300) throw new Error('Notion budget request failed (HTTP '+code+'). Retry on next run.');
  return JSON.parse(response.getContentText());
}
function gambitBudgetChanges_(item,page) {
  if (page.archived || page.in_trash || !page.parent || String(page.parent.database_id || '').replace(/-/g,'') !== item.database)
    throw new Error('Notion destination is outside the expected budget database: '+item.category);
  var changes = {};
  Object.keys(item.properties).forEach(function(name) {
    var property = (page.properties || {})[name];
    if (!property || property.type !== 'number') throw new Error('Budget property is not numeric: '+name);
    if (property.number !== item.properties[name].number) changes[name]=item.properties[name];
  });
  return changes;
}
function previewGambitNotionBudgets() { return gambitRunNotionBudgets_(false); }
function syncGambitNotionBudgets() { return gambitRunNotionBudgets_(true); }
function gambitRunNotionBudgets_(write) {
  var props = PropertiesService.getScriptProperties(), year = props.getProperty('GAMBIT_TARGET_YEAR');
  if (!/^\d{4}$/.test(year || '')) throw new Error('Set GAMBIT_TARGET_YEAR to the calendar year of the Target sheet.');
  var result = {checkedAt:new Date().toISOString(),dryRun:!write,changed:0,planned:0,status:'running'};
  var lock = LockService.getScriptLock(); lock.waitLock(15000);
  try {
    var plan = gambitBudgetPlan_(SpreadsheetApp.openById(SS_ID),Utilities.formatDate(new Date(),TZ,'yyyy-MM'),year);
    var pending = [];
    // Validate every destination before the first write. Never create a duplicate category page.
    plan.updates.forEach(function(item) {
      var changes = gambitBudgetChanges_(item,gambitBudgetRequest_('get','pages/'+item.pageId));
      if (Object.keys(changes).length) pending.push({item:item,properties:changes});
      Utilities.sleep(350);
    });
    result.month=plan.month;result.planned=pending.length;result.skipped=plan.skipped;
    result.changes=pending.map(function(change){return {category:change.item.category,row:change.item.row,properties:change.properties};});
    if (write) pending.forEach(function(change) {
      gambitBudgetRequest_('patch','pages/'+change.item.pageId,{properties:change.properties});result.changed++;
      Utilities.sleep(350);
    });
    result.status='complete';
    props.setProperty(write?'GAMBIT_NOTION_BUDGET_STATUS':'GAMBIT_NOTION_BUDGET_PREVIEW',JSON.stringify(result));
    Logger.log(JSON.stringify(result));return result;
  } catch (error) {
    result.status='error';result.message=String(error.message || error);
    props.setProperty(write?'GAMBIT_NOTION_BUDGET_STATUS':'GAMBIT_NOTION_BUDGET_PREVIEW',JSON.stringify(result));
    throw error;
  } finally {lock.releaseLock();}
}
function installGambitNotionBudgetTrigger() {
  previewGambitNotionBudgets();
  var existing = ScriptApp.getProjectTriggers().filter(function(t){return t.getHandlerFunction()==='syncGambitNotionBudgets';});
  if (existing.length) return 'Budget trigger already installed.';
  ScriptApp.newTrigger('syncGambitNotionBudgets').timeBased().everyMinutes(5).create();
  return 'Budget sync runs every 5 minutes.';
}
