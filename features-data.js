const clinicalChecks = ['生物测量', '角膜地形图', '眼底 OCT', '眼表评估', '眼压'];
const learningTopics = {
  '咨询师':['视觉需求访谈与记录','常见眼病与危险信号转介','可选方案解释及知情边界'],
  '验光师':['屈光检查与数据质量','双眼视功能及用眼需求','异常测量结果复核'],
  '手术医生':['术前风险与适应证评估','共同决策和方案确认','手术质量与并发症复盘'],
  '前台/接待护士':['患者身份及流程核对','患者分流与沟通','异常症状及时升级'],
  '特殊检查技师':['设备校准与检查规范','生物测量和 OCT 质量','异常结果标记及交接'],
  '手术护士':['手术安全核查','器械耗材及无菌规范','术后交接与随访安排'],
  '术后随访护士':['随访节点与常见问题','危险信号转介','随访记录及闭环']
};
const educationTopics = [
  {id:'needs',stage:'术前',title:'说清自己的视觉需求',detail:'记录工作、阅读、驾驶等场景，以及担心和期望；带到医生面前讨论。'},
  {id:'checks',stage:'术前',title:'理解术前检查的作用',detail:'检查帮助团队了解眼部情况；结果是否足够及如何解释由临床团队判断。'},
  {id:'choices',stage:'方案讨论',title:'比较可选方案与局限',detail:'请医生解释适用性、可能的收益、限制、费用及替代选择，再作决定。'},
  {id:'followup',stage:'术后',title:'术后复查与症状反馈',detail:'按医嘱复查；如出现突发视力下降、明显疼痛等情况，及时联系医疗团队。'}
];
const funnelSteps = [['到院/建档',0],['完成初步筛查',1],['完成 IDEAL 评估',2],['医生诊断',4],['方案确定',5],['进入手术环节',6]];
function localDate(day = new Date().getDate()) { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`; }
function monthOf(value) { return typeof value === 'string' ? value.slice(0,7) : ''; }
