function featurePatient(p) { p.createdAt ||= localDate(1); p.source ||= '现场登记'; p.pauseReason ||= ''; p.checks ||= clinicalChecks.map(() => false); p.riskNote ||= ''; p.doctorNote ||= ''; p.reviewedAt ||= ''; p.educationDone ||= []; p.desiredOutcome ||= ''; p.tradeoff ||= ''; p.teachBack ||= ''; p.routing ||= {medical:'unknown',redFlag:'unknown',need:'unknown',informed:'unknown',decision:'pending',confirmedAt:''}; return p; }
function routingDecision(r) {
  if(r.redFlag==='yes'||r.medical==='no')return {id:'review',title:'暂不确认路径 · 医生优先复核',text:'先处理危险信号、诊断不明确或其他眼病问题，再决定后续检查和诊疗路径。'};
  if(r.medical==='unknown'||r.redFlag==='unknown'||r.need==='unknown'||r.informed==='unknown')return {id:'pending',title:'信息未完整 · 保持共享候诊',text:'不要提前贴上“医保”“自费”或“高端”标签；先补齐基础筛查、真实需求和知情沟通。'};
  if(r.medical==='yes'&&r.redFlag==='no'&&r.need==='yes'&&r.informed==='yes')return {id:'pls',title:'继续个体化评估与共同决策',text:'第3—4环节按需完成评估检查，第5环节由医生判断；第6环节充分告知、理解复述和自主选择后，才确认具体方案与路径。当前演示不构成手术、IOL或付费方案确认。'};
  return {id:'standard',title:'进入基础诊疗路径',text:'按医学需要继续规范诊疗；医保资格和报销范围由医院按当地政策另行核对。患者提出新的视觉需求或条件变化时，可以重新评估。'};
}
function renderRoutingGate(){
  const p=featurePatient(current()),r=p.routing,result=routingDecision(r),options=(value)=>`<option value="unknown" ${value==='unknown'?'selected':''}>待确认</option><option value="yes" ${value==='yes'?'selected':''}>是</option><option value="no" ${value==='no'?'selected':''}>否</option>`;
  $('#routingGateContent').innerHTML=`<div class="routing-logic"><div class="routing-why"><h3>为什么选在这里？</h3><div><b>太早：挂号或到院即分流</b><p>医学信息和真实视觉需求不足，容易按年龄、外观或支付能力误判。</p></div><div><b>检查安排：按临床需要，避免重复或不必要项目</b><p>早期可以安排评估方向，但不能为节省资源提前确定手术或支付路径。</p></div><p class="routing-best"><b>建议：</b>第2环节只安排初步流程；第3—4环节按需评估与检查；第5环节医生诊断后，第6环节充分告知与自主选择，确认方案及路径。急症优先处理，实际就诊次序由医院安排。</p></div><form id="routingForm" class="routing-form"><h3>${esc(p.name)} · 四项准备检查（不代替正式确认）</h3><label><span><b>1. 基础医学判断</b><small>主要眼部问题和检查方向已由医生评估；最终适应证与方案仍须医生确认</small></span><select data-routing="medical">${options(r.medical)}</select></label><label><span><b>2. 医疗安全</b><small>是否发现危险症状、诊断不清或需优先处理的眼病？</small></span><select data-routing="redFlag">${options(r.redFlag)}</select></label><label><span><b>3. 视觉与生活需求</b><small>患者是否有基础复明之外的明确远、中、近或生活场景需求？</small></span><select data-routing="need">${options(r.need)}</select></label><label><span><b>4. 知情与自主意愿</b><small>患者知道两条路径都能获得规范诊疗、PLS深度评估可以选择且后续仍可改变决定后，是否愿意继续了解？</small></span><select data-routing="informed">${options(r.informed)}</select></label></form></div><div class="routing-result ${result.id}"><span>当前评估准备提示</span><h3>${result.title}</h3><p>${result.text}</p><small>系统只提示评估准备，不授予临床决策或签署权限，不判断医保资格、手术适应证或具体产品。空间动线只为流程、隐私与团队协作服务，不按收入或支付能力分区；最终由医院按医疗与医保规则确认。</small></div>`;
}
function roleMatches(owner, role) { const aliases = {'眼科医生':['手术医生'],'护士':['前台/接待护士','手术护士','术后随访护士'],'验光师/特殊检查技师':['验光师','特殊检查技师']}; return owner === role || (aliases[owner] || []).includes(role); }
function renderRoleWork() {
  const role=state.role, tasks=state.tasks.filter(t=>!t.done&&roleMatches(t.owner,role)), patients=state.patients.filter(p=>roleMatches(handoffSteps[p.stage]?.from||'',role));
  $('#roleWorkTitle').textContent=`${role} · 今日工作入口`;
  $('#roleWorkSubtitle').textContent='依据当前演示记录显示，角色切换不代表权限验证。';
  let cards=[...patients.slice(0,2).map(p=>`<div class="role-work-item"><b>${esc(p.name)} · ${esc(stages[p.stage])}</b><small>当前环节：${esc(handoffSteps[p.stage].work)}</small><button class="wide-button" data-open-patient="${esc(p.id)}">处理患者 →</button></div>`),...tasks.slice(0,2).map(t=>`<div class="role-work-item"><b>${esc(t.title)}</b><small>${esc(t.phase)} · 30/60/90天行动</small><button class="wide-button" data-go="operations">查看行动 →</button></div>`)];
  if(role==='院长/CEO') cards.unshift('<div class="role-work-item"><b>医院质量与进展</b><small>查看患者路径、六大支柱与团队学习</small><button class="wide-button" data-go="ceo">进入驾驶舱 →</button></div>');
  if(!cards.length) cards=['<div class="role-work-item"><b>暂无本岗位待办</b><small>可在患者旅程或行动清单中新增演示记录</small><button class="wide-button" data-go="journey">查看患者 →</button></div>'];
  $('#roleWorkItems').innerHTML=cards.join('');
}
function renderClinicalFeature() {
  const p=featurePatient(current());
  $('#clinicalCheckList').innerHTML=clinicalChecks.map((label,i)=>`<label class="check-row"><input type="checkbox" data-clinical-check="${i}" ${p.checks[i]?'checked':''}>${esc(label)}</label>`).join('');
  $('#riskNote').value=p.riskNote; $('#doctorNote').value=p.doctorNote;
  const missing=clinicalChecks.filter((_,i)=>!p.checks[i]);
  $('#doctorReviewResult').textContent=p.reviewedAt?`演示复核记录：${p.reviewedAt}`:missing.length?'完成全部检查标记后方可标记摘要已复核。':'检查项已标记完成，等待医生复核。';
  $('#reviewBriefButton').disabled=missing.length>0;
  $('#doctorBrief').innerHTML=`<div class="brief-summary"><p><b>患者：</b>${esc(p.name)} · ${esc(p.age)}</p><p><b>当前阶段：</b>${esc(stages[p.stage])}</p><p><b>视觉需求：</b>${esc(p.priority||'未记录')}</p><p><b>希望改善：</b>${esc(p.desiredOutcome||'未记录')}</p><p><b>患者顾虑：</b>${esc(p.concern||'未记录')}</p><p><b>戴镜偏好：</b>${esc(p.glasses||'未记录')}</p><p><b>可接受取舍：</b>${esc(p.tradeoff||'未记录')}</p><p><b>患者复述：</b>${esc(p.teachBack||'尚未完成')}</p><p><b>检查标记：</b>${p.checks.filter(Boolean).length}/${clinicalChecks.length} 完成</p><p><b>待补检查：</b>${esc(missing.join('、')||'无')}</p><p><b>需复核问题：</b>${esc(p.riskNote||'未记录')}</p><p><b>讨论记录：</b>${esc(p.doctorNote||'未记录')}</p><p><b>复核状态：</b>${p.reviewedAt?'已标记':'待医生复核'}</p></div><p class="muted">仅汇总演示记录；检查标记不等于真实结果，不能作为诊断或 IOL 选择依据。</p>`;
}
function roleLearning(role) { return state.learning[role] ||= [false,false,false]; }
function trainingDone(role) { return roleLearning(role).every(Boolean) && (state.competency[role]?.quiz?.score??0)>=80; }
function renderLearning() {
  const role=state.mdtRole, topics=learningTopics[role]||[], done=roleLearning(role), pass=state.competency[role]?.quiz?.score??null;
  $('#trainingOverview').textContent=`${Object.keys(learningTopics).filter(trainingDone).length}/${Object.keys(learningTopics).length} 岗位演示达标`;
  $('#learningRoleHeading').textContent=`${role} · 学习进度是岗位级演示记录，不代表个人认证。`;
  $('#learningModules').innerHTML=topics.map((title,i)=>`<label class="learning-row"><input type="checkbox" data-learning="${i}" ${done[i]?'checked':''}>${esc(title)}</label>`).join('');
  $('#learningProgress').textContent=`学习 ${done.filter(Boolean).length}/3 项 · 短测 ${pass===null?'未作答':pass+' 分'} · ${trainingDone(role)?'达到演示标准':'尚未达到演示标准'}（需学习完成且短测 ≥80 分）`;
}
function courseProgressKey(role,level,index){return `${role}|${level}|${index}`}
function renderCourseMap(){
  const roles=Object.keys(roleCourseCatalog),selected=roleCourseCatalog[state.courseRole]?state.courseRole:'咨询师',level=$('#courseLevelFilter').value||'all',catalog=roleCourseCatalog[selected];
  state.courseRole=selected;
  $('#courseRoleFilter').innerHTML=roles.map(role=>`<option value="${esc(role)}">${esc(role)}</option>`).join('');
  $('#courseRoleFilter').value=selected;
  const rows=[];['junior','intermediate'].forEach(courseLevel=>{if(level!=='all'&&level!==courseLevel)return;(catalog[courseLevel]||[]).forEach((course,index)=>rows.push({courseLevel,index,course}))});
  const all=[...(catalog.junior||[]).map((course,index)=>({courseLevel:'junior',index,course})),...(catalog.intermediate||[]).map((course,index)=>({courseLevel:'intermediate',index,course}))],completed=all.filter(item=>state.courseProgress[courseProgressKey(selected,item.courseLevel,item.index)]).length,quiz=state.competency[selected]?.quiz?.score;
  $('#courseSummary').innerHTML=`<div><strong>${all.length}</strong><span>岗位课程</span></div><div><strong>${catalog.junior.length}</strong><span>初级课程</span></div><div><strong>${catalog.intermediate.length}</strong><span>中级课程</span></div><div><strong>${completed}/${all.length}</strong><span>演示学习进度</span></div>`;
  const mappedMdt=mdtRoles[selected]?selected:Object.keys(courseRoleAliases).find(role=>courseRoleAliases[role]===selected),record=mappedMdt?state.competency[mappedMdt]:null,selfScore=record?.self?.length===5&&record.self.every(Boolean)?record.self.reduce((a,b)=>a+b,0)*4:null;
  $('#courseGap').innerHTML=`<div><b>自评结果</b>${selfScore===null?'尚未完成岗位自评':`${selfScore}分 · ${selfScore>=80?'巩固并进入中级培养':'优先补强低分能力项'}`}</div><div><b>知识短测</b>${quiz===undefined?'尚未参加岗位短测':`${quiz}分 · ${quiz>=80?'知识基础达标':'建议先完成初级课程'}`}</div><div><b>系统建议</b>${selfScore!==null&&selfScore<80?'先完成初级必修与场景演练':quiz!==undefined&&quiz>=80?'结合在岗观察选择中级课程':'完成评估后生成更精确建议'}</div>`;
  $('#courseGrid').innerHTML=rows.map(({courseLevel,index,course})=>{const [title,intro,content,format,assessment]=course,key=courseProgressKey(selected,courseLevel,index),done=!!state.courseProgress[key];return `<article class="course-card ${courseLevel}"><header><h3>${esc(title)}</h3><span class="course-level">${courseLevel==='junior'?'初级':'中级'}</span></header><p>${esc(intro)}</p><div class="course-meta"><span><b>主要内容：</b>${esc(content)}</span><span><b>学习形式：</b>${esc(format)}</span><span><b>达标要求：</b>${esc(assessment)}</span></div><div class="course-action"><label><input type="checkbox" data-course-progress="${esc(key)}" ${done?'checked':''}> 标记演示学习完成</label>${title.includes('IOL')?'<button type="button" class="outline" data-open-iol-tool>打开IOL公式工具 →</button>':''}</div></article>`}).join('');
}
const ceoSuccessKpis = [
  {
    "number": "01",
    "title": "个性化视觉目标达成率",
    "question": "患者最在意的生活需求解决了吗？",
    "definition": "术前记录并由医生确认主要视觉目标，术后在约定时间逐项核对。主要目标达成人数 ÷ 按期完成有效目标评价人数，同时报告应评人数和评价覆盖率。",
    "review": "结合患者报告的视觉质量、生活场景与必要的客观评估，不以视力表替代生活获益。目标与达成尺度在术前约定。",
    "owner": "临床主诊医生、视觉质量评估、患者旅程管理师"
  },
  {
    "number": "02",
    "title": "满意度与再选率",
    "question": "患者认可这次体验和治疗选择吗？",
    "definition": "满意度按统一问卷及尺度统计；再选率为表示仍愿意选择同一治疗方案人数 ÷ 有效回答人数。分别呈现两项结果、应答人数与覆盖率。",
    "review": "固定随访时间及问法。再次选择同一医院可另设问题，不能与治疗方案再选率合并。负向反馈与未应答情况一并复盘。",
    "owner": "患者旅程管理师、运营与合规支持"
  },
  {
    "number": "03",
    "title": "关键流程与随访闭环率",
    "question": "团队能否稳定交付并持续负责？",
    "definition": "分别统计关键流程按标准完成人数 ÷ 应完成人数、按期完成专业随访人数 ÷ 到期应随访人数、按期处置闭环问题数 ÷ 到期应处置问题数。",
    "review": "核对需求、医生方案、理解确认及交接证据。记录联系或提醒不等于专业随访完成，明确后续处置计划也须追踪执行。",
    "owner": "项目负责人、患者旅程管理师、手术质量与护理协调"
  },
  {
    "number": "04",
    "title": "医学适合患者的分层转化率",
    "question": "适合且有需求的患者在哪一步停下？",
    "definition": "在同一队列中，依次看完成评估、完成方案沟通、选择方案、完成手术的人数与相邻阶段转化率。每层标明分母、统计时间及未选择原因。",
    "review": "白内障与CLE分开，医疗适合性由医生确认。暂缓、转诊或选择基础方案不自动算服务失败，不能以建档到手术比例替代医学适合人群转化。",
    "owner": "临床主诊医生、患者旅程管理师、运营与合规支持"
  },
  {
    "number": "05",
    "title": "全自费有效营收",
    "question": "增长是否来自已完成的真实服务？",
    "definition": "按院区、白内障／CLE、术式及方案统计，采用财务确认的已完成服务对应收入，扣除退费，同时列示手术量及例均收入，明确按眼或按例。",
    "review": "与可比基线及预设目标对照，解释季节、价格、患者结构和获客投入变化。预收款及未来情景预测不等于已实现收入。",
    "owner": "运营与合规支持，财务复核"
  },
  {
    "number": "06",
    "title": "项目贡献利润",
    "question": "计入交付成本后，增长能持续吗？",
    "definition": "按启动前约定的财务口径，以有效收入扣除相关成本，包括耗材、获客、增加的服务与随访、退费和补救等支出，避免重复扣减。",
    "review": "一次性建设投入与持续运营成本分列，说明贡献利润与医院净利润的区别，按约定周期判断可持续性，不只看客单价。",
    "owner": "项目负责人、运营与合规支持，财务复核"
  }
];
function renderCeo() {
  $('#ceoKpiCards').innerHTML=ceoSuccessKpis.map(k=>`<article class="ceo-kpi-card"><span class="eyebrow">${esc(k.number)} / 核心KPI</span><h3>${esc(k.title)}</h3><p class="ceo-kpi-question">${esc(k.question)}</p><p class="ceo-pending">实际值：待采集　基线：待确认　目标：待院方设定</p><p><b>统计口径：</b>${esc(k.definition)}</p><p><b>复盘时关注：</b>${esc(k.review)}</p><p class="ceo-kpi-owner">责任角色：${esc(k.owner)}</p></article>`).join('');
  const cohort=state.patients.filter(p=>monthOf(p.createdAt)===monthOf(localDate())), atRisk=state.patients.filter(p=>p.riskNote || (p.stage>=4&&p.checks.some(v=>!v))), doneTasks=state.tasks.filter(t=>t.done).length;
  $('#ceoMetrics').innerHTML=[['本月演示建档',cohort.length,'仅表示建档记录'],['演示需复核记录',atRisk.length,'待医生核实，不是风险发生率'],['演示行动完成',`${doneTasks}/${state.tasks.length}`,'不代表项目结果达标']].map(([label,value,note])=>`<div class="feature-metric"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('');
  $('#ceoQuality').innerHTML=`<div class="feature-row"><span>演示检查项已全勾选</span><b>${state.patients.filter(p=>p.checks.every(Boolean)).length}/${state.patients.length}</b></div><div class="feature-row"><span>演示进入术后随访阶段</span><b>${state.patients.filter(p=>p.stage>=7).length}</b></div><div class="feature-row"><span>演示患者来源已记录</span><b>${state.patients.filter(p=>p.source).length}/${state.patients.length}</b></div><button class="wide-button" data-go="funnel">查看演示患者旅程</button>`;
  $('#ceoPillars').innerHTML=state.audit.map((status,i)=>`<div class="feature-row"><span>${esc(pillars[i][0])}</span><b>${esc(status)}</b></div>`).join('');
  $('#ceoTraining').innerHTML=Object.keys(learningTopics).map(role=>`<div class="feature-row"><span>${esc(role)}</span><b>${trainingDone(role)?'演示学习已完成':'待完成'}</b></div>`).join('')+'<button class="wide-button" data-go="capability">查看岗位能力</button>';
  $('#ceoActions').innerHTML=state.tasks.filter(t=>!t.done).slice(0,5).map(t=>`<div class="feature-row"><span>${esc(t.title)}</span><b>${esc(t.owner)}</b></div>`).join('')||'<p class="muted">演示中暂无未完成行动，仍需核验实际执行与结果。</p>';
}
function renderFunnel() {
  const cohort=state.patients.filter(p=>monthOf(p.createdAt)===monthOf(localDate())), total=cohort.length, surgery=cohort.filter(p=>p.stage>=6).length;
  $('#funnelPeriod').textContent=`${new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'long'}).format(new Date())} · 同一批演示患者`;
  $('#funnelDefinition').textContent='口径：本月建立演示档案患者的九环节进展，含院外引流／预约；后续月份的进展仍计入其建档月份。该页面用于发现流程断点，不把进入手术环节等同于项目成功。样本很小，不代表医院真实转化率或临床质量。';
  $('#funnelSummary').innerHTML=`<div class="feature-metric"><span>本月建档</span><strong>${total}</strong><small>演示患者</small></div><div class="feature-metric"><span>进入手术环节</span><strong>${surgery}</strong><small>当前阶段为手术执行或后续环节</small></div><div class="feature-metric"><span>建档至手术</span><strong>${total?Math.round(surgery/total*100)+'%':'—'}</strong><small>${surgery}/${total}，仅演示</small></div>`;
  $('#funnelRows').innerHTML=funnelSteps.map(([label,min])=>{const count=cohort.filter(p=>p.stage>=min).length;return `<div class="funnel-row"><span>${esc(label)}</span><div class="funnel-track"><span style="width:${total?count/total*100:0}%"></span></div><b>${count}</b></div>`}).join('');
  const reasons={};cohort.forEach(p=>{if(p.pauseReason)reasons[p.pauseReason]=(reasons[p.pauseReason]||0)+1});
  $('#funnelReasons').innerHTML=Object.entries(reasons).map(([reason,count])=>`<div class="feature-row"><span>${esc(reason)}</span><b>${count}</b></div>`).join('')||'<p class="muted">本月入组的演示患者暂无暂缓记录。</p>';
}
function renderEducation() {
  const p=current(),filter=$('#educationStageFilter').value;
  $('#educationPatient').innerHTML=state.patients.map(item=>`<option value="${esc(item.id)}">${esc(item.name)} · ${esc(item.id)}</option>`).join('');$('#educationPatient').value=p.id;
  $('#educationGrid').innerHTML=educationTopics.filter(t=>filter==='all'||t.stage===filter).map(t=>`<article class="education-item"><small>${esc(t.stage==='术前'?'第3—4环节：IDEAL评估／全面检查':t.stage==='方案讨论'?'第5—6环节：医生诊断／方案确定':'第7—8环节：出院交接／术后随访')}</small><h2>${esc(t.title)}</h2><p>${esc(t.detail)}</p><button class="outline" data-education="${t.id}" type="button">${p.educationDone.includes(t.id)?'已记录讲解 ✓':'标记已讲解'}</button></article>`).join('');
  $('#educationStatus').textContent=`${p.name}：已讲解 ${p.educationDone.length}/${educationTopics.length} 项（仅演示记录）`;
}
function renderFeatures() { state.patients.forEach(featurePatient); renderRoleWork(); renderClinicalFeature(); renderLearning(); renderCourseMap(); renderCeo(); renderFunnel(); renderEducation(); renderRoutingGate(); if(typeof renderQaContexts==='function')renderQaContexts(); $('#patientSource').value=current().source; $('#pauseReason').value=current().pauseReason; }
document.addEventListener('click',e=>{
  const patient=e.target.closest('[data-open-patient]');if(patient){state.selected=patient.dataset.openPatient;save();nav('journey')}
  const focus=e.target.closest('[data-routing-focus]');if(focus)setTimeout(()=>$('#routingGate').scrollIntoView({behavior:'smooth',block:'start'}),80);
  const spaceFocus=e.target.closest('[data-space-flow-focus]');if(spaceFocus)setTimeout(()=>$('#spaceFlowCapability').scrollIntoView({behavior:'smooth',block:'start'}),80);
  const education=e.target.closest('[data-education]');if(education){const p=current(),id=education.dataset.education;p.educationDone=p.educationDone.includes(id)?p.educationDone.filter(x=>x!==id):[...p.educationDone,id];save()}
  if(e.target.id==='reviewBriefButton'){const p=current();if(p.checks.every(Boolean)){p.reviewedAt=new Date().toLocaleString('zh-CN');save();toast('摘要复核状态已保存（演示）')}}
  if(e.target.closest('[data-open-iol-tool]')){const index=resources.findIndex(r=>r[0]==='IOL计算公式导航与临床选择');if(index>=0){openTool(index);nav('resources')}}
});
document.addEventListener('change',e=>{
  const p=current();
  if(e.target.matches('[data-clinical-check]')){p.checks[Number(e.target.dataset.clinicalCheck)]=e.target.checked;p.reviewedAt='';save()}
  if(e.target.id==='riskNote'||e.target.id==='doctorNote'){p[e.target.id]=e.target.value.trim().slice(0,300);p.reviewedAt='';save()}
  if(e.target.id==='patientSource'||e.target.id==='pauseReason'){p[e.target.id==='patientSource'?'source':'pauseReason']=e.target.value;save()}
  if(e.target.matches('[data-learning]')){roleLearning(state.mdtRole)[Number(e.target.dataset.learning)]=e.target.checked;save()}
  if(e.target.id==='educationPatient'){state.selected=e.target.value;save()}
  if(e.target.id==='educationStageFilter')renderEducation();
  if(e.target.id==='courseRoleFilter'){state.courseRole=e.target.value;save()}
  if(e.target.id==='courseLevelFilter')renderCourseMap();
  if(e.target.matches('[data-course-progress]')){state.courseProgress[e.target.dataset.courseProgress]=e.target.checked;save()}
  if(e.target.matches('[data-routing]')){p.routing[e.target.dataset.routing]=e.target.value;const result=routingDecision(p.routing);p.routing.decision=result.id;p.routing.confirmedAt=result.id==='pending'?'':new Date().toLocaleString('zh-CN');save();toast('路径确认信息已保存（演示）')}
});
