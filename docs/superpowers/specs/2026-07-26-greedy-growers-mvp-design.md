# Greedy Growers 英文 MVP 设计

## 1. 目标

在空项目中快速构建一个英文 Greedy Growers Roblox 玩家工具站。产品不重新发明页面或玩法，而是采用“一个母版 + 两个功能补丁”：

- 以 `greedygrowers.com` 为整体布局、导航、卡片和 Calculator 母版。
- 以 `greedygrowers.wiki/codes/` 的状态分层补强 Codes 页面。
- 以 `greedy-growers-wiki.wiki/seeds/list/` 与 `/seeds/best-seeds/` 的字段和验证状态补强 Seeds 页面。

最小成功结果是五个英文核心页面可公开访问、移动端可用、内容可被搜索引擎直接读取、工具可真实交互，并且不发布虚构游戏数据。

## 2. 固定范围

### 核心页面

1. `/`：首页工具导航和游戏状态。
2. `/codes`：Codes 状态、兑换步骤、失效原因和来源。
3. `/beginner-guide`：第一次收割的分步路线。
4. `/seeds`：种子列表、排序筛选、验证状态和两两比较。
5. `/calculator`：人工输入的收益与失败成本计算器。

### 辅助页面

- `/privacy`
- `/disclaimer`
- `/contact`

辅助页面不计入五个产品页面，也不扩展产品功能。

### 明确不做

- 多语言
- Tier List
- Discord Bot、社区投稿和社区投票
- 最佳收割时间算法和闪电概率曲线
- 风险偏好预设
- 用户系统和后台管理
- 暗亮主题切换
- 未经来源验证的 Codes、种子数值和游戏机制

## 3. 复制边界

允许复制同行的信息架构、区块顺序、表格字段、交互流程和通用视觉模式。所有代码在本项目内重新实现；所有正文重新组织和改写；不复制同行 Logo、正文、专有图片、埋点、广告代码或不可验证的数据。

游戏事实按以下优先级使用：Roblox 官方页面或接口 > 当前游戏内可复现信息 > 多个公开同行一致信息 > 单一社区线索。后两类必须显示来源和验证状态。

## 4. 页面设计

### 首页

复制 `greedygrowers.com` 的紧凑工具中心结构：顶部导航、左侧 Hero、右侧游戏状态、核心入口卡片、新手路线预览、Codes 状态、官方 Roblox CTA、FAQ 和 Footer。

状态区显示在线人数、访问量、最新游戏更新时间、最大服务器人数和本地最后检查时间。数据请求失败时显示已缓存数据；没有缓存时显示 `Temporarily unavailable`，不显示零值伪装成功。

### Codes

复制 `.com` 的完整信息顺序，并使用 `.wiki` 的状态卡视觉：当前答案、Active Codes、Expired Codes、How to Redeem、Why a Code May Not Work、来源与最后检查日期、相关页面和 FAQ。

初始状态为无已验证 Codes。只有数据文件中标记为 `verified` 的 Code 才能进入 Active 区域。

### Beginner Guide

复制 `.com` 的 First Harvest Route：打开官方游戏、在河边买种子、在个人地块种植、观察成长、闪电前收割。随后是观察要点、常见错误、下一步入口和来源边界。

每个步骤允许放官方封面或后续提供的游戏内截图；没有原创截图时不复制同行截图。

### Seeds

将 `wiki.wiki` 的 Seed List 和 Best Seeds 合并为一个页面。桌面端使用表格，移动端使用卡片。字段固定为：名称、类型、稀有度、来源、解锁条件、成本、收获价值、生长时间、适用阶段、验证状态、验证日期和说明。

支持按验证状态和适用阶段筛选，按名称、成本、收获价值和生长时间排序。两两比较只能展示现有字段差值；缺少任一数值时显示 `Not verified`，不进行推断。

### Calculator

复制 `greedygrowers.com/calculator` 的人工输入工具。输入：种子成本、成功收获价值、等待分钟、成功前失败次数。输出公式：

- 单次成功净收益：`harvestValue - seedCost`
- 单次成功每分钟收益：`(harvestValue - seedCost) / waitMinutes`
- 覆盖失败所需收获价值：`seedCost * (failedRuns + 1)`
- 风险调整后收益：`harvestValue - seedCost * (failedRuns + 1)`
- 风险调整后每分钟收益：`riskAdjustedProfit / (waitMinutes * (failedRuns + 1))`

所有输入必须为有限非负数，等待分钟必须大于零。非法输入显示字段错误且不产生结果。

## 5. 数据与组件

数据保存在版本库内的 JSON 文件：

- `src/data/site.json`：品牌、官方链接和更新时间。
- `src/data/codes.json`：Code、奖励、状态、来源和验证日期。
- `src/data/seeds.json`：Seeds 页全部字段。
- `src/data/sources.json`：来源名称、URL 和可信等级。

首页、Seeds 和 Calculator 不维护重复种子数据。共享组件负责 Header、Footer、SEO、状态卡、来源标签和 CTA。Calculator 与 Seeds 交互使用原生 TypeScript 客户端脚本，不引入 Preact 或新的状态库。

## 6. 技术方案

- Astro 静态生成公开页面。
- Tailwind CSS 负责样式。
- TypeScript 负责数据校验、计算和客户端交互。
- Cloudflare Pages 作为目标部署平台。
- Cloudflare Pages Function 代理 Roblox Games API，并以缓存头降低外部调用频率。
- 主要文字、导航和表格初始内容必须存在于服务器返回的 HTML 中；JavaScript 只增强筛选、比较、计算和实时状态。

## 7. 外部失败处理

- Roblox API 超时、限流或返回错误时，Function 返回明确的非 200 状态；前端保留构建时快照或显示不可用提示。
- JSON 数据在构建时执行结构校验；无效状态、非法 URL 或重复 Code 使构建失败。
- 缺失种子数值保持 `null`，页面显示 `Not verified`。
- 所有外链使用明确标签；官方和社区来源视觉区分。

## 8. SEO 决策

五个核心页面、Privacy、Disclaimer 和 Contact 均允许索引。每页拥有独立 title、description、canonical 和 Open Graph 信息。

站点生成 `sitemap-index.xml` 或 `sitemap-0.xml`、`robots.txt` 和 WebSite/Organization/BreadcrumbList JSON-LD。Seeds 使用可见内容对应的 ItemList；不为每颗种子使用 VideoGame 类型。不添加 SearchAction 和以富摘要为目标的 FAQPage。

## 9. 验证标准

- 所有公开路由返回 200，且能通过真实 `<a>` 链接到达。
- 核心正文和表格数据在禁用 JavaScript时仍可见。
- Calculator 公式、非法输入和零等待时间有自动测试。
- Seeds 排序、筛选、比较和缺失数值行为有自动测试。
- Roblox Function 的成功、超时和上游失败有测试或可重复的本地验证。
- Astro 构建、TypeScript 检查和测试全部通过。
- 375px 和 1440px 视口完成视觉检查，无横向溢出和遮挡。
- 内部链接无 404，Sitemap 中所有 URL 返回 200。
- 页面不包含虚构 Codes、虚构概率、同行正文或同行图片。

## 10. 上线指标

记录 `play_roblox_click`、`seed_filter_change`、`seed_compare` 和 `calculator_run`。上线后按第 14 天和第 28 天的 Search Console 查询、展示、点击、索引和工具事件决定是否增加 Tier List、自动填充种子或多语言。
