const plsTeamRoles = [
  {name:'PLS项目负责人',purpose:'让跨科服务线有资源、有责任人、有持续改进。',work:'任命核心成员与备岗；协调医疗、护理、检查、运营和财务；审批路径与制度；组织30/60/90天复盘。',output:'团队分工表、资源安排、审核后的SOP、复盘与整改清单。',handoff:'接收各岗位质量与流程问题，将改进任务交给明确责任人。',boundary:'不以经营目标替代医生医学判断；不以自费选择率作为唯一评价。'},
  {name:'临床主诊医生',purpose:'对医学适配、方案及临床处置负责。',work:'复核检查与视觉需求；判断适应证、风险及替代方案；讨论双眼策略；完成医疗告知；决定手术、暂缓或转诊；处理术后异常。',output:'医生确认的诊疗方案、风险与替代方案记录、正式医疗同意及复查处置记录。',handoff:'向旅程管理师交付可解释的方案要点；向护理团队交付手术计划；接收异常升级。',boundary:'最终方案由医生与患者充分沟通后确定；不能交由非医疗人员或系统自动决定。'},
  {name:'视觉质量评估角色',purpose:'提供准确、完整、可复核的检查与需求摘要。',work:'按授权完成验光、生物测量及角膜、眼表、眼底等检查；核验身份眼别与数据质量；标记缺项和不一致；整合旅程管理师记录的生活视觉需求。',output:'术前评估摘要、检查结果、质量标记与缺项清单；术后视觉功能数据。',handoff:'将可靠数据与需复核问题交主诊医生，向旅程管理师反馈检查安排。',boundary:'可由验光师与检查技师协作承担；不自行诊断或决定IOL方案。'},
  {name:'患者旅程管理师',purpose:'整合谈话、咨询、医助中的协调、患教与客服职能，保持连续联系。',work:'记录生活需求与顾虑；协调预约、检查和就诊；使用医院审核材料开展教育；在医生告知后确认患者理解；协调逐项费用解释；跟进签署准备、手术预约、复诊提醒和体验反馈。',output:'需求访谈、待解答问题、理解确认、费用疑问、预约与联系记录；随访完成追踪和问题升级记录。',handoff:'将需求交评估团队和医生；将确认后的预约与待办交护理团队；异常症状及时转医疗人员。',boundary:'不诊断、不决定方案、不替代医生医疗风险告知，不承诺脱镜；不承担超出资质的医疗操作。'},
  {name:'手术质量与护理协调角色',purpose:'把医生确认的计划落实为安全的围手术期和专业随访。',work:'协调术前准备和手术排程；核对患者、眼别、术式、IOL参数及耗材；完成安全清单、护理和出院指导；按医嘱安排专业复查，识别异常并升级。',output:'术前核查、手术与耗材记录、护理及出院交接、专业随访和异常处理记录。',handoff:'接收医生手术计划；向患者和旅程管理师交付用药、警示症状与复诊安排；向医生升级异常。',boundary:'护理由具备资质和授权人员执行；不得自行更改医生方案；服务提醒不能代替医疗复查。'},
  {name:'运营与合规支持角色',purpose:'让收费、数据、材料审核与改进都有依据。',work:'协调财务核对费用清单、医保及自费属性和取消退费；审核患教及传播材料；汇总匿名质量、体验、交接和随访数据；组织改进证据。',output:'审核后的收费说明与材料、匿名运行报表、问题清单及整改证据。',handoff:'向项目负责人提供复盘依据；向旅程管理师提供统一费用口径；向相关专业部门提交审核事项。',boundary:'可由运营、财务、医务及合规人员共同承担；保护隐私，不以营销承诺代替医疗证据。'}
];

document.querySelector('#teamRoleDetails').innerHTML = plsTeamRoles.map((r,i)=>`<details${i===3?' open':''}><summary>${i+1}. ${r.name}：${r.purpose}</summary><dl><dt>工作内容</dt><dd>${r.work}</dd><dt>交付记录</dt><dd>${r.output}</dd><dt>交接对象</dt><dd>${r.handoff}</dd><dt>职责边界</dt><dd>${r.boundary}</dd></dl></details>`).join('');

// Keep existing learning records available while consolidating the displayed responsibilities.
const plsRoleAliases = {'咨询师':'患者旅程管理师','手术医生':'临床主诊医生','验光师':'视觉质量评估角色','特殊检查技师':'视觉质量评估角色','手术护士':'手术质量与护理协调角色','术后随访护士':'手术质量与护理协调角色'};
for (const [oldName,newName] of Object.entries(plsRoleAliases)) {
  if (!mdtRoles[newName]) mdtRoles[newName] = mdtRoles[oldName];
  if (!roleCourseCatalog[newName] && roleCourseCatalog[oldName]) roleCourseCatalog[newName] = roleCourseCatalog[oldName];
  delete mdtRoles[oldName];
  if (learningTopics[oldName] && !learningTopics[newName]) learningTopics[newName]=learningTopics[oldName];
  Object.defineProperty(mdtRoles,oldName,{value:mdtRoles[newName],enumerable:false});
  if (roleCourseCatalog[newName] && roleCourseCatalog[oldName]) Object.defineProperty(roleCourseCatalog,oldName,{value:roleCourseCatalog[newName],enumerable:false,configurable:true});
}
if(roleCourseCatalog['患教专员']) Object.defineProperty(roleCourseCatalog,'患教专员',{value:roleCourseCatalog['患者旅程管理师'],enumerable:false});
document.querySelectorAll('option').forEach(option=>{if(plsRoleAliases[option.textContent]){option.textContent=plsRoleAliases[option.textContent];option.value=option.textContent;}});
const trainingHeading=document.querySelector('#patientDecisionTrainingTitle');
if(trainingHeading)trainingHeading.textContent='医生、患者旅程管理师与护理团队：理解患者选择';
for (const name of ['PLS项目负责人','运营与合规支持角色']) {
  const r=plsTeamRoles.find(item=>item.name===name);
  mdtRoles[name]={intro:r.purpose,standards:[['知识',r.boundary],['知识','统一患者路径、专业权限及异常升级制度'],['技能',r.work],['技能',r.output],['技能',r.handoff]],questions:[
    ['项目应以什么作为复盘依据？',['质量、患者体验和流程证据','仅自费选择率','仅产品销量'],0],
    ['最终医学方案由谁判断？',['主诊医生结合患者需求与检查','运营人员','收费人员'],0],
    ['岗位兼任前需要确认什么？',['资质授权、工作量与备岗','仅职位名称','仅销售经验'],0],
    ['费用沟通应依据什么？',['医院审核后的逐项费用清单','口头估价即可','统一保证报销'],0],
    ['发现重复交接缺漏应怎样处理？',['明确责任人与期限并验证整改','只增加宣传','删除记录'],0]
  ]};
}
for (const r of plsTeamRoles) mdtRoles[r.name].intro=`${r.purpose} ${r.boundary}`;
mdtRoles['视觉质量评估角色'].standards=[['知识','屈光、角膜、眼表及眼底对视觉和测量的影响'],['知识','各项检查目的、专业权限与异常转医规则'],['技能','按授权完成验光和特殊检查并核对身份眼别'],['技能','识别伪影、缺项及不一致数据，安排复核'],['技能','整合检查质量、需求摘要与异常交接医生']];
mdtRoles['患者旅程管理师'].standards=[['知识','PLS路径、常见视觉方案的获益与局限'],['知识','危险信号、专业边界及费用说明规则'],['技能','记录生活需求、预期与顾虑并确认患者理解'],['技能','协调检查、医生答疑、费用说明与签署准备'],['技能','追踪复诊、体验反馈和问题升级并闭环记录']];
mdtRoles['手术质量与护理协调角色'].standards=[['知识','手术安全、感控及专业随访要求'],['知识','用药、恢复过程与异常警示症状'],['技能','核对身份、眼别、手术计划、参数与耗材'],['技能','完成护理、出院指导及复诊交接'],['技能','记录专业随访结果并及时升级异常']];
handoffSteps.forEach(step=>{for(const key of ['from','to']){step[key]=step[key].replace('验光师/特殊检查技师','视觉质量评估角色').replace('市场/客服','运营与合规支持角色').replace('术后随访护士','手术质量与护理协调角色').replace('手术护士','手术质量与护理协调角色').replace('手术医生','临床主诊医生').replace('咨询师','患者旅程管理师').replace('院长/CEO','PLS项目负责人');}});
handoffSteps[7].work='护理团队按医嘱完成专业随访，记录视力、症状与患者报告体验；旅程管理师提醒复诊并追踪完成，异常及时转医。';

const teamEntries=[
  ['#home .project-roadmap','试点团队是否到位？','六类责任有负责人和备岗，每位患者有连续联系责任人，每个专业节点有执行人和交接证据。'],
  ['#journey .implementation-hub','患者全程联系与专业交接','患者旅程管理师贯穿全程；评估、医生与护理分别承担专业责任。下方交接板按责任角色显示工作与交接依据。'],
  ['#operations .organization-action-entry','团队建设的90天任务','第1–30天：明确责任人与备岗，完成培训和交接清单。第31–60天：试运行全程联系与异常升级，复盘缺漏。第61–90天：复评岗位能力，固化SOP并依据工作量调整配置。'],
  ['#ceo .review-sequence','团队运行复盘','核查岗位与备岗覆盖、交接缺漏、随访完成、异常闭环及患者理解。使用医院实际记录；本站不自动生成这些指标。'],
  ['#resources .qa-library-entry','团队组织与交接工具','查看六类角色职责、岗位对应与试点配置，下载团队分工表及患者交接清单。']
];
teamEntries.forEach(([selector,title,copy])=>{const target=document.querySelector(selector);if(target)target.insertAdjacentHTML('afterend',`<section class="team-entry"><h2>${title}</h2><p>${copy}</p><button class="outline" type="button" data-go="capability" data-team-focus>查看团队组织与分工 →</button></section>`);});
document.addEventListener('click',event=>{
  if(event.target.closest('[data-team-focus]')) requestAnimationFrame(()=>document.querySelector('#plsTeam').scrollIntoView({behavior:'smooth',block:'start'}));
  const download=event.target.closest('[data-team-download]');if(!download)return;
  const roles=download.dataset.teamDownload==='roles';
  const rows=roles?[['角色','责任人','备岗','服务时段','工作内容','交付记录','交接对象','职责边界'],...plsTeamRoles.map(r=>[r.name,'','','',r.work,r.output,r.handoff,r.boundary])]:[['节点','本环节负责','下一位接手','工作内容','交接依据','执行人','日期','未完成事项','升级对象与时限'],...handoffSteps.map((r,i)=>[i+1,r.from,r.to,r.work,r.evidence,'','','',''])];
  const csv='\uFEFF'+rows.map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=roles?'PLS团队分工表.csv':'PLS患者交接清单.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
