# Gambit Finance: daily workspace

## Report and editing expansion — 9 September 2026

References: [Monarch Reports](https://help.monarch.com/hc/en-us/articles/21846787088916-Using-Reports), [Copilot recurring schedules](https://help.copilot.money/en/articles/3760068-creating-recurrings), [YNAB features](https://www.ynab.com/features). Applied patterns: separate spending/income/cash-flow report views, date/account filters, category breakdown with drilldown to transactions, real CSV export, named saving goals and anchored recurring schedules. The original monochrome design remains; Vela is excluded.

Calculations distinguish expense, debt repayments, saving contributions and transfers. Months without activity stay in the trend. Zero-denominator changes show no percentage. Net-worth history is not fabricated from transaction flows. Settings is the source of current account balances; Debt and Saves are flow ledgers.

New files: `finance-core.js` for calculations, `reports.js`/`reports.css` for analysis, `sheet-editor.js` for verified mutations, `planner.js` for goals/schedules and debt simulation. `GambitBridge.gs` extends the user's existing Apps Script. Installation instructions are in `SHEETS-CONNECTION.md`. None of the credentials from the pasted script are stored here.

The new Sheet-backed editing features require installation and redeployment of the extension plus the server-side key. They must not be described as live until that is verified. Existing CSV reading and report calculations work independently. No live financial writes were used for testing. Goal and recurring edits are supported; transfers, complete account/category CRUD and automatic background reminders are still gaps against a full subscription finance product.

Reviewed 6 September 2026. Preserve the existing monochrome palette, Be Vietnam Pro typography and Sheets transaction integration. Vela is excluded.

## References and decisions

- [Copilot Transactions](https://help.copilot.money/en/articles/9554412-transactions-tab-overview): searchable register, composable filters and transaction detail. The register now leads; graphs move to Reports. Search and export use the same filtered rows.
- [Copilot Dashboard](https://help.copilot.money/en/articles/6045480-dashboard-tab-overview): recent activity, budget context and upcoming commitments. Home prioritizes those three tasks.
- [Monarch Tracking](https://www.monarch.com/features/tracking): distinct accounts, transactions, net worth and overview. Gambit uses five main destinations with secondary planning and account tabs.
- [YNAB mobile spaces](https://support.ynab.com/en_us/spaces-in-the-mobile-app-S1iIZQoqgg) and [focused views](https://support.ynab.com/en_us/focused-views-a-guide-BksnNYqLh): category-centered planning. A monthly budget editor replaces the browser prompt and the empty-state detour to Sheets.
- Selection context: [TechRadar 2026 budgeting software](https://www.techradar.com/best/best-budgeting-software), [2026 personal finance software](https://www.techradar.com/best/best-personal-finance-software), [Copilot App Store](https://apps.apple.com/us/app/copilot-track-budget-money/id1447330651). These support the reference shortlist, not an objective universal ranking.

## Structure

Desktop uses a compact sidebar and one work area. Home has a monthly summary beside upcoming commitments; recent transactions and category budgets follow. Mobile uses the same five destinations with a stable bottom bar. Goals and recurring items live within Planning; debt lives within Accounts; connections live in Settings.

The theme is retained: black #000, panel #080808, raised #151515, border #242424, text #F4F4F4, secondary #A7A7A7. Existing display/body/monospace font roles are preserved. The distinctive element is the daily register grouped by date with a net total per day, with analysis kept in Reports.

## Data behavior

Transactions retain the existing /api/finance add contract. The companion GambitBridge adds revision-checked historical edits, deletes, monthly Target budgets and managed goals/recurring plans through /api/finance-v2. These controls require deploying and configuring the bridge; their presence is not evidence of a live write connection. Debt rows are repayments and Saves rows are contributions, not balances.

Monthly app budgets are stored under `finance_budget_YYYY_MM` through the existing `/api/cloud` endpoint and cached locally. A saved app budget overrides imported category limits only for its month. It does not modify the source spreadsheet. Cloud failure retains the local save and explicitly reports that it has not synced. The local development server persists its own copy; deployed cross-device persistence depends on the existing Cloudflare KV binding.

## Verification

Run `node --test scripts/finance-workspace.test.cjs` for composed filters, month isolation, plan validation, save/reload, failed sync, stale read protection and markup/script integrity. Browser QA covers desktop and mobile, routing, keyboard/dialog behavior, empty state, search/filter composition, date controls, report expansion and overflow. Do not create financial test transactions against the user's live Sheets.

## September 9 report expansion

Following Monarch Reports (https://help.monarch.com/hc/en-us/articles/21846787088916-Reports) and Copilot Cash Flow (https://help.copilot.money/en/articles/9682232-cash-flow-tab-overview), reports support drilldown, period comparison and focused analysis. Home and Reports now show a large accessible category donut, preserving all categories through a grouped remainder. Reports include allocation ribbons, category changes including disappeared categories, a daily spending calendar, device-local saved views, CSV and standalone SVG chart export with amounts and period. The existing monochrome palette is retained.

Current limits: no live bank sync, transfer entry, split transactions, account/category CRUD or background bill posting. Net worth history requires actual balance snapshots; no history is fabricated. Historical edits and planner writes await bridge deployment.

Validation: 40 automated checks passed across finance core, charts, bridge, API and workspace. Browser checks confirmed category keyboard drilldown and calendar detail against the same real ledger entry. A 375px viewport has no horizontal page overflow. No live financial test transactions were created.

## Daily workflow additions

The transaction register now supports full income/expense history, custom dates, inclusive amount bounds and oldest/newest order. Exports use the same filtered rows; monthly summary remains explicitly labelled. Similar-transaction entry prefills today’s date and requires a separate save. Device-local drafts restore on reopening and remain distinct from saved Sheet records. Reference: https://help.copilot.money/en/articles/9554412-transactions-tab-overview . Browser QA verified draft restore without submitting a financial transaction.

## Transfers and split allocations

Implemented companion ledgers for recorded wallet transfers and expense category allocations. Both are gated on authenticated snapshot feature flags. Transfer totals balance across accounts; Settings balances remain authoritative and are not automatically adjusted. Splits preserve original Sheet/Notion rows, apply only to exact unambiguous unchanged sources, and conserve original amounts. The register retains originals while category budgets/reports use allocations. Live deployment of the updated bridge remains required.
## Báo cáo năm — 13/09/2026

Tham khảo cấu trúc báo cáo Monarch (https://help.monarch.com/hc/en-us/articles/21846787088916-Reports) và YNAB (https://www.ynab.com/blog/ynab-reports-and-data): cơ cấu danh mục, xu hướng, dòng tiền, đi sâu vào giao dịch. Giữ bảng màu đơn sắc hiện có và các biểu đồ tròn/Sankey hiện hữu.

Thêm bộ chọn trọn năm, lối tắt Tổng kết năm, so sánh thu–chi theo quý, ngân sách năm so thực tế, bảng sắc độ danh mục x 12 tháng có chi tiết giao dịch. Sửa preset năm từ lũy kế đến tháng đang chọn thành 01/01–31/12. So sánh ngân sách chỉ cho tất cả tài khoản và đúng năm Target; ưu tiên M, nếu chưa có dùng tổng N:Y. Giao diện nêu rõ 0/trống là chưa đặt ngân sách theo bộ đọc Target hiện tại. Không giả định số dư từ dòng tiền và không dùng ngân sách năm khác.

Xác minh: 19 kiểm tra core/insights/year đạt; browser dùng giao dịch Sheet thật 20.000 Học tập tháng 8/2026, drilldown đúng abc; màn hình 390px không tràn ngang toàn trang, bảng tháng cuộn riêng. Chưa triển khai lên hosting.
