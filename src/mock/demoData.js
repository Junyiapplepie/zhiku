export const workflowSteps = ['理解问题', '检索知识库', '分析竞品数据', '生成回答']

export const chartPayload = {
  result_header: ['月份', 'AION RT', 'MONA M03'],
  result_data: [
    ['3月', 58, 49], ['4月', 64, 57], ['5月', 71, 66],
    ['6月', 69, 74], ['7月', 78, 82], ['8月', 86, 79],
  ],
}

export const answerMarkdown = `### 核心结论

如果更看重 **空间、舒适性与补能成本**，AION RT 更均衡；如果偏好 **智能驾驶体验和运动化设计**，小鹏 MONA M03 的产品特征更鲜明。

### 关键差异

- **价格与定位：** 两车主力版本处在 12–15 万元区间，AION RT 更偏家用舒适，MONA M03 更强调年轻化与智能化。
- **续航与补能：** AION RT 650 版本标称续航更长；两车实际表现都会受到温度、路况和驾驶习惯影响。
- **智能体验：** MONA M03 在高阶辅助驾驶和车机交互上更突出，AION RT 的空间和乘坐配置更完整。

下面是基于近六个月公开数据整理的关注度趋势，可切换不同视图查看。`

export const initialSessions = [
  { id: 'demo-1', title: 'AION RT 与小鹏 MONA M03 对比', time: '今天 10:24', question: 'AION RT 和小鹏 MONA M03 怎么选？请从价格、续航和智能化对比。', answer: answerMarkdown, chart: chartPayload },
  { id: 'demo-2', title: '800V 高压平台技术原理', time: '昨天 16:38', question: '800V 高压平台有哪些优势？', answer: '### 技术要点\n\n800V 平台的核心价值在于降低同等功率下的电流，从而减少线束损耗并提高快充效率。', chart: null },
  { id: 'demo-3', title: '新能源购置税政策解读', time: '09 月 21 日', question: '解读新能源购置税政策', answer: '### 政策摘要\n\n新能源汽车购置税政策采用分阶段减免方式，购车前应结合开票时间和车辆目录状态判断。', chart: null },
]

export const adminUsers = [
  { name: '林晓宇', account: 'lin.xy', org: '产品中心', role: '产品管理员', permissions: ['问答-技术', '问答-竞品'] },
  { name: '陈以安', account: 'chen.ya', org: '智能网联部', role: '普通用户', permissions: ['问答-技术'] },
  { name: '周子墨', account: 'zhou.zm', org: '市场洞察部', role: '数据分析师', permissions: ['问答-竞品', '智能问数'] },
  { name: '许清和', account: 'xu.qh', org: '战略规划部', role: '部门管理员', permissions: ['问答-政策', '问答-竞品'] },
  { name: '苏念', account: 'su.n', org: '数字化平台部', role: '系统管理员', permissions: ['全部权限'] },
]
