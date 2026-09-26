function featurePatient(p) { p.createdAt ||= localDate(1); p.source ||= '现场登记'; p.pauseReason ||= ''; p.checks ||= clinicalChecks.map(() => false); p.riskNote ||= ''; p.doctorNote ||= ''; p.reviewedAt ||= ''; p.educationDone ||= []; p.routing ||= {medical:'unknown',redFlag:'unknown',need:'unknown',informed:'unknown',decision:'pending',confirmedAt:''}; return p; }
function routingDecision(r) {
  if(r.redFlag==='yes'||r.medical==='no')return {id:'review',title:'暂不分流 · 医生优先复核',text:'先处理危险信号、诊断不明确或其他眼病问题，不能进入商业或常规路径选择。'};
  if(r.medical==='unknown'||r.redFlag==='unknown'||r.need==='unknown'||r.informed==='unknown')return {id:'pending',title:'信息未完整 · 保持共同候诊',text:'不要提前贴上“医保”或“高端”标签；补齐基础筛查、需求和知情沟通。'};
  if(r.medical==='yes'&&r.redFlag==='no'&&r.need==='yes'&&r.informed==='yes')return {id:'pls',title:'进入 PLS 深度评估通道',text:'开展必要的专项检查和医生方案讨论；这不是手术适应证、IOL 或成交结果的自动确认。'};
  return {id:'standard',title:'进入标准诊疗通道',text:'按常规医学需要继续诊疗，并依据当地医保政策确认报销范围；患者以后提出新需求时可以重新评估。'};
}
function renderRoutingGate(){
  const p=featurePatient(current()),r=p.routing,result=routingDecision(r),options=(value)=>`<option value="unknown" ${value==='unknown'?'selected':''}>待确认</option><option value="yes" ${value==='yes'?'selected':''}>是</option><option value="no" ${value==='no'?'selected':''}>否</option>`;
  $('#routingGateContent').innerHTML=`<div class="routing-logic"><div class="routing-why"><h3>为什么选在这里？</h3><div><b>太早：挂号或到院即分流</b><p>医学信息和真实视觉需求不足，容易按年龄、外观或支付能力误判。</p></div><div><b>太晚：全部专项检查后分流</b><p>占用检查、医生和咨询资源，也让患者承担不必要的时间和费用。</p></div><p class="routing-best"><b>建议：</b>到院先预识别；基础医学筛查 + IDEAL 简版需求访谈后正式确认路径。</p></div><form id="routingForm" class="routing-form"><h3>${esc(p.name)} · 四项确认</h3><label><span><b>1. 基础医学判断</b><small>已由合适医务人员确认主要眼部问题和下一步检查方向</small></span><select data-routing="medical">${options(r.medical)}</select></label><label><span><b>2. 医疗安全</b><small>是否发现危险症状、诊断不清或需优先处理的眼病？</small></span><select data-routing="redFlag">${options(r.redFlag)}</select></label><label><span><b>3. 视觉与生活需求</b><small>患者是否有基础复明之外的明确远、中、近或生活场景需求？</small></span><select data-routing="need">${options(r.need)}</select></label><label><span><b>4. 知情与自主意愿</b><small>在了解标准诊疗、可选路径、局限和费用后，是否愿意继续 PLS 深度评估？</small></span><select data-routing="informed">${options(r.informed)}</select></label></form></div><div class="routing-result ${result.id}"><span>当前建议路径</span><h3>${result.title}</h3><p>${result.text}</p><small>系统只提示工作路径，不判断医保资格、手术适应证或具体产品。最终由医院按医疗与医保规则确认。</small></div>`;
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
  $('#doctorBrief').innerHTML=`<div class="brief-summary"><p><b>患者：</b>${esc(p.name)} · ${esc(p.age)}</p><p><b>当前阶段：</b>${esc(stages[p.stage])}</p><p><b>视觉需求：</b>${esc(p.priority||'未记录')}</p><p><b>患者顾虑：</b>${esc(p.concern||'未记录')}</p><p><b>戴镜偏好：</b>${esc(p.glasses||'未记录')}</p><p><b>检查标记：</b>${p.checks.filter(Boolean).length}/${clinicalChecks.length} 完成</p><p><b>待补检查：</b>${esc(missing.join('、')||'无')}</p><p><b>需复核问题：</b>${esc(p.riskNote||'未记录')}</p><p><b>讨论记录：</b>${esc(p.doctorNote||'未记录')}</p><p><b>复核状态：</b>${p.reviewedAt?'已标记':'待医生复核'}</p></div><p class="muted">仅汇总演示记录；检查标记不等于真实结果，不能作为诊断或 IOL 选择依据。</p>`;
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
function renderCeo() {
  const cohort=state.patients.filter(p=>monthOf(p.createdAt)===monthOf(localDate())), atRisk=state.patients.filter(p=>p.riskNote || (p.stage>=4&&p.checks.some(v=>!v))), doneTasks=state.tasks.filter(t=>t.done).length;
  $('#ceoMetrics').innerHTML=[['本月演示入组',cohort.length,'按建档月份'],['进入手术环节',cohort.filter(p=>p.stage>=6).length,'本月入组患者'],['需复核',atRisk.length,'检查缺项或有复核问题'],['行动完成',`${doneTasks}/${state.tasks.length}`,'30/60/90天行动']].map(([label,value,note])=>`<div class="feature-metric"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('');
  $('#ceoQuality').innerHTML=`<div class="feature-row"><span>完整标记检查项</span><b>${state.patients.filter(p=>p.checks.every(Boolean)).length}/${state.patients.length}</b></div><div class="feature-row"><span>术后随访阶段</span><b>${state.patients.filter(p=>p.stage>=7).length}</b></div><div class="feature-row"><span>患者来源已记录</span><b>${state.patients.filter(p=>p.source).length}/${state.patients.length}</b></div><button class="wide-button" data-go="funnel">查看本月漏斗 →</button>`;
  $('#ceoPillars').innerHTML=state.audit.map((status,i)=>`<div class="feature-row"><span>${esc(pillars[i][0])}</span><b>${esc(status)}</b></div>`).join('');
  $('#ceoTraining').innerHTML=Object.keys(learningTopics).map(role=>`<div class="feature-row"><span>${esc(role)}</span><b>${trainingDone(role)?'演示达标':'待完成'}</b></div>`).join('')+'<button class="wide-button" data-go="capability">查看岗位能力 →</button>';
  $('#ceoActions').innerHTML=state.tasks.filter(t=>!t.done).slice(0,5).map(t=>`<div class="feature-row"><span>${esc(t.title)}</span><b>${esc(t.owner)}</b></div>`).join('')||'<p class="muted">暂无未完成行动。</p>';
}
function renderFunnel() {
  const cohort=state.patients.filter(p=>monthOf(p.createdAt)===monthOf(localDate())), total=cohort.length, surgery=cohort.filter(p=>p.stage>=6).length;
  $('#funnelPeriod').textContent=`${new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'long'}).format(new Date())} · 同一批演示患者`;
  $('#funnelDefinition').textContent='口径：本月建档患者的累计阶段进展；后续月份的进展仍计入其建档月份。样本很小，不代表医院真实转化率或临床质量。';
  $('#funnelSummary').innerHTML=`<div class="feature-metric"><span>本月建档</span><strong>${total}</strong><small>演示患者</small></div><div class="feature-metric"><span>进入手术环节</span><strong>${surgery}</strong><small>阶段 ≥ 手术执行</small></div><div class="feature-metric"><span>建档至手术</span><strong>${total?Math.round(surgery/total*100)+'%':'—'}</strong><small>${surgery}/${total}，仅演示</small></div>`;
  $('#funnelRows').innerHTML=funnelSteps.map(([label,min])=>{const count=cohort.filter(p=>p.stage>=min).length;return `<div class="funnel-row"><span>${esc(label)}</span><div class="funnel-track"><span style="width:${total?count/total*100:0}%"></span></div><b>${count}</b></div>`}).join('');
  const reasons={};cohort.forEach(p=>{if(p.pauseReason)reasons[p.pauseReason]=(reasons[p.pauseReason]||0)+1});
  $('#funnelReasons').innerHTML=Object.entries(reasons).map(([reason,count])=>`<div class="feature-row"><span>${esc(reason)}</span><b>${count}</b></div>`).join('')||'<p class="muted">本月入组的演示患者暂无暂缓记录。</p>';
}
function renderEducation() {
  const p=current(),filter=$('#educationStageFilter').value;
  $('#educationPatient').innerHTML=state.patients.map(item=>`<option value="${esc(item.id)}">${esc(item.name)} · ${esc(item.id)}</option>`).join('');$('#educationPatient').value=p.id;
  $('#educationGrid').innerHTML=educationTopics.filter(t=>filter==='all'||t.stage===filter).map(t=>`<article class="education-item"><small>${esc(t.stage)}</small><h2>${esc(t.title)}</h2><p>${esc(t.detail)}</p><button class="outline" data-education="${t.id}" type="button">${p.educationDone.includes(t.id)?'已记录讲解 ✓':'标记已讲解'}</button></article>`).join('');
  $('#educationStatus').textContent=`${p.name}：已讲解 ${p.educationDone.length}/${educationTopics.length} 项（仅演示记录）`;
}
function renderFeatures() { state.patients.forEach(featurePatient); renderRoleWork(); renderClinicalFeature(); renderLearning(); renderCeo(); renderFunnel(); renderEducation(); renderRoutingGate(); if(typeof renderQaContexts==='function')renderQaContexts(); $('#patientSource').value=current().source; $('#pauseReason').value=current().pauseReason; }
document.addEventListener('click',e=>{
  const patient=e.target.closest('[data-open-patient]');if(patient){state.selected=patient.dataset.openPatient;save();nav('journey')}
  const focus=e.target.closest('[data-routing-focus]');if(focus)setTimeout(()=>$('#routingGate').scrollIntoView({behavior:'smooth',block:'start'}),80);
  const education=e.target.closest('[data-education]');if(education){const p=current(),id=education.dataset.education;p.educationDone=p.educationDone.includes(id)?p.educationDone.filter(x=>x!==id):[...p.educationDone,id];save()}
  if(e.target.id==='reviewBriefButton'){const p=current();if(p.checks.every(Boolean)){p.reviewedAt=new Date().toLocaleString('zh-CN');save();toast('摘要复核状态已保存（演示）')}}
});
document.addEventListener('change',e=>{
  const p=current();
  if(e.target.matches('[data-clinical-check]')){p.checks[Number(e.target.dataset.clinicalCheck)]=e.target.checked;p.reviewedAt='';save()}
  if(e.target.id==='riskNote'||e.target.id==='doctorNote'){p[e.target.id]=e.target.value.trim().slice(0,300);p.reviewedAt='';save()}
  if(e.target.id==='patientSource'||e.target.id==='pauseReason'){p[e.target.id==='patientSource'?'source':'pauseReason']=e.target.value;save()}
  if(e.target.matches('[data-learning]')){roleLearning(state.mdtRole)[Number(e.target.dataset.learning)]=e.target.checked;save()}
  if(e.target.id==='educationPatient'){state.selected=e.target.value;save()}
  if(e.target.id==='educationStageFilter')renderEducation();
  if(e.target.matches('[data-routing]')){p.routing[e.target.dataset.routing]=e.target.value;const result=routingDecision(p.routing);p.routing.decision=result.id;p.routing.confirmedAt=result.id==='pending'?'':new Date().toLocaleString('zh-CN');save();toast('路径确认信息已保存（演示）')}
});
