const STORAGE_KEY = 'digital-pls-mvp-demo-v1';
const stages = ['引流/预约','到院分流','IDEAL评估','全面检查','医生诊断','方案确定','手术执行','术后随访','持续改进'];
const pillars = [
  ['临床卓越基础','检查、测量、手术质量与风险识别'],
  ['MDT 团队建设','跨专科、护理、咨询与管理协同'],
  ['标准化诊疗 SOP','术前、术中、术后流程与质控'],
  ['患者教育与体验','充分解释、共同决策和体验反馈'],
  ['透明价值沟通','费用说明、可选方案和自主选择'],
  ['口碑与患者触达','合规触达、随访与真实反馈']
];
const resources = [
  ['医院遴选打分表','内部候选医院初筛；地区经济只是参考，还需综合患者基数、真实需求、医院能力和区域辐射','Pilot Program · 院长/PLS BDM','在线评估','PLS项目项目目标医院遴选工具/index.html',['manager','bdm']],
  ['运营辅导研讨会议程','院方共创会议准备与现场安排','Pilot Program · 院长/BDM','可编辑网页','全国民营眼科医院_PLS项目运营辅导研讨会_通用议程模板/index.html',['manager','bdm']],
  ['诊疗中心 59 项核查','六大支柱正式基线与复评工具','能力建设 · 管理团队','交互工具','国际PLS诊疗中心核查评估系统/国际PLS诊疗中心核查评估系统.html',['doctor','nurse','manager','bdm']],
  ['90 天行动表','明确责任人、期限和阶段输出','运营与数据 · 各职能','网页模板','PLS项目初步共识议题与90天建议行动表-通用版/index.html',['doctor','nurse','consultant','manager','bdm']],
  ['术前视觉需求问卷','患者生活方式、视觉目标与顾虑','IDEAL · 咨询师/医生','在线表单','全自费白内障手术术前视觉需求问卷/index.html',['doctor','nurse','consultant']],
  ['术前心理预期复核','宣教护士初评、主诊医生复核','临床工作台 · 护士/医生','在线表单','全自费白内障手术术前心理红线评估量表/index.html',['doctor','nurse','consultant']],
  ['人工晶体匹配决策树','原页仅供内部销售培训；临床使用须另行审核','临床工作台 · 医生/培训','交互工具','全自费患者人工晶体匹配决策树/index.html',['doctor','bdm']],
  ['术后护理随访 SOP','D1、W1、M1、M3 视觉质量与体验','术后随访 · 护士/医生','在线表单','AIOLIS_PCIOL_RLE术后护理随访SOP记录表/index.html',['doctor','nurse']],
  ['PLS 六大支柱核心内容','能力标准、流程和培训资料','资源库 · 全团队','知识库','六大支柱核心内容逐层展开网页/index.html',['doctor','nurse','consultant','manager','bdm']],
  ['JJSV 产品与技术概览','专业人员使用的产品及技术资料','资源库 · 医生/BDM','知识库','JJSV IOL flcac和LipiFlow概览/index.html',['doctor','bdm']]
];
function seed(){return {role:'院长/CEO',selected:'P001',mdtRole:'咨询师',competency:{},learning:{},inventory:demoInventory(),inventoryLookup:{model:'puresee',power:'+20.0 D',cylinder:''},patients:[
  {id:'P001',name:'患者 A',age:'58 岁',stage:4,priority:'电脑与中距离',concern:'希望改善工作和阅读体验，担心夜间眩光',glasses:'希望减少戴镜'},
  {id:'P002',name:'患者 B',age:'64 岁',stage:2,priority:'阅读与近距离',concern:'关注阅读舒适度',glasses:'愿意按需戴镜'},
  {id:'P003',name:'患者 C',age:'61 岁',stage:7,priority:'远距离与户外',concern:'术后需要定期随访',glasses:'尚需解释与讨论'}
],audit:['未评估','需改进','未评估','达标','需改进','未评估'],tasks:[
  {id:1,title:'完成六大支柱基线评估',owner:'院长/CEO',phase:'第 1–30 天',done:false},
  {id:2,title:'确认 IDEAL 患者交接节点',owner:'眼科医生',phase:'第 1–30 天',done:false},
  {id:3,title:'试运行术前需求问卷',owner:'咨询师',phase:'第 1–30 天',done:true},
  {id:4,title:'建立术后随访复盘机制',owner:'护士',phase:'第 31–60 天',done:false}
]};}
function load(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));if(!saved||!Array.isArray(saved.patients)||!Array.isArray(saved.tasks)||!Array.isArray(saved.audit))return seed();saved.competency ||= {};saved.learning ||= {};saved.mdtRole=mdtRoles[saved.mdtRole]?saved.mdtRole:'咨询师';if(!saved.inventory||!Array.isArray(saved.inventory.iol)||!Array.isArray(saved.inventory.consumables))saved.inventory=demoInventory();saved.inventoryLookup ||= {model:'puresee',power:'+20.0 D',cylinder:''};saved.patients.forEach(p=>{p.handoffs ||= {};featurePatient(p)});return saved}catch{return seed()}}
let state=load();
let viewedStage=null;
const $=s=>document.querySelector(s);
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));render()}
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2700)}
function current(){return state.patients.find(p=>p.id===state.selected)||state.patients[0]}
function navParent(view){if(['clinical','education','inventory'].includes(view))return'journey';if(['funnel','revenue','certification'].includes(view))return'ceo';if(view==='qa')return'resources';return view}
function nav(view){document.body.classList.toggle('intro-mode',view==='intro');if(view!=='intro'){try{sessionStorage.setItem('digital-pls-intro-seen','1')}catch{}}document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id===view));document.querySelectorAll('#mainNav button').forEach(el=>el.classList.toggle('active',el.dataset.view===navParent(view)));$('#mainNav').classList.remove('open');$('#menuButton').setAttribute('aria-expanded','false');if(['concept','inventory','ceo','funnel','revenue','education','certification','qa'].includes(view))history.replaceState(null,'','#'+view);else if(location.hash)history.replaceState(null,'',location.pathname+location.search);window.scrollTo({top:0,behavior:'smooth'})}
function renderHome(){
  const patient=current(),done=state.audit.filter(a=>a!=='未评估').length,open=state.tasks.filter(t=>!t.done).length;
  $('#metricPatients').textContent=state.patients.length;$('#metricTasks').textContent=open;$('#metricAudit').textContent=Math.round(done/6*100)+'%';$('#metricFollowup').textContent=state.patients.filter(p=>p.stage===7).length;
  $('#stageBars').innerHTML=[['待评估',state.patients.filter(p=>p.stage<3).length],['检查咨询',state.patients.filter(p=>p.stage>=3&&p.stage<=5).length],['手术安排',state.patients.filter(p=>p.stage===6).length],['随访关爱',state.patients.filter(p=>p.stage>=7).length]].map(([n,v])=>`<div class="stage-bar"><span>${n}</span><div class="track"><div class="fill" style="width:${Math.max(v/state.patients.length*100,3)}%"></div></div><b>${v}</b></div>`).join('');
  $('#homeSteps').innerHTML=stages.map((s,i)=>`<div class="step"><i>${i+1}</i><span>${s}</span></div>`).join('');
  $('#featuredPatient').innerHTML=`<div class="patient-summary"><div class="avatar">${esc(patient.name.slice(-1))}</div><div><strong>${esc(patient.name)} · ${esc(patient.age)}</strong><span>${esc(stages[patient.stage])} · ${esc(patient.id)}</span></div></div><div class="info-row"><span>视觉重点</span><b>${esc(patient.priority||'待填写')}</b></div><div class="info-row"><span>戴镜偏好</span><b>${esc(patient.glasses||'待讨论')}</b></div><div class="info-row"><span>当前环节</span><b>${esc(stages[patient.stage])}</b></div><button class="wide-button" data-go="journey">查看患者路径 →</button>`;
  $('#clinicalPreview').innerHTML=`<p class="preview-title">${esc(patient.name)} · 需要团队共同确认</p><div class="preview-item"><b>需求</b> ${esc(patient.priority||'待填写')}</div><div class="preview-item"><b>顾虑</b> ${esc(patient.concern||'待填写')}</div><div class="preview-item"><b>下一步</b> 医生结合检查结果解释可选方案</div><div class="callout"><strong>系统提示</strong><p>这里记录讨论重点，不生成自动诊断或产品推荐。</p></div>`;
  $('#pillarPreview').innerHTML=`<div class="ops-big">${done}/6</div><span class="muted">支柱已完成简版评估</span><div class="progress"><span style="width:${done/6*100}%"></span></div><div class="preview-item"><b>MDT 岗位能力</b> 七类岗位标准、自评与在线短测</div><div class="preview-item"><b>及格线</b> 80 分（演示）</div><button class="wide-button" data-go="capability">进入岗位能力 →</button>`;
  $('#taskPreview').innerHTML=state.tasks.filter(t=>!t.done).slice(0,3).map(t=>`<div class="preview-item"><b>○</b> ${esc(t.title)}<br><span class="muted">${esc(t.owner)} · ${esc(t.phase)}</span></div>`).join('')||'<p class="muted">当前没有待推进任务</p>';
  const roleDescriptions={'市场/客服':'合规触达','前台':'登记与分流','咨询师':'倾听需求','检查人员':'采集检查数据','眼科医生':'诊断与方案','手术护士':'规范执行','随访护士':'追踪体验','HR/培训经理':'建设能力','院长/CEO':'看质量与进展'};
  $('#roleCards').innerHTML=Object.entries(roleDescriptions).map(([n,v])=>`<div class="role-card"><b>${n}</b><span>${v}</span></div>`).join('');
  renderInventory();
}
function stockClass(qty){return qty===0?'empty':qty<=2?'low':''}
function renderInventory(){
  const stock=state.inventory,lookup=state.inventoryLookup,detailsOpen=$('.inventory-edit').open;
  const totalIol=stock.iol.reduce((sum,item)=>sum+item.qty,0);
  $('#homeInventorySummary').textContent=`IOL ${totalIol} 片 · Catalys / VERITAS 耗材可查（演示）`;
  if(!iolModels.some(item=>item.id===lookup.model))lookup.model=iolModels[0].id;
  $('#inventoryModel').innerHTML=iolModels.map(item=>`<option value="${item.id}">${esc(item.name)}</option>`).join('');$('#inventoryModel').value=lookup.model;
  const powers=[...new Set(stock.iol.filter(item=>item.model===lookup.model).map(item=>item.power))];
  if(!powers.includes(lookup.power))lookup.power=powers[0]||'';
  $('#inventoryPower').innerHTML=powers.map(power=>`<option value="${esc(power)}">${esc(power)}</option>`).join('');$('#inventoryPower').value=lookup.power;
  const isToric=lookup.model==='toric2';$('#inventoryCylinderWrap').hidden=!isToric;
  const cylinders=[...new Set(stock.iol.filter(item=>item.model===lookup.model&&item.power===lookup.power).map(item=>item.cylinder))];
  if(!isToric)lookup.cylinder='';else if(!cylinders.includes(lookup.cylinder))lookup.cylinder=cylinders[0]||'';
  $('#inventoryCylinder').innerHTML=cylinders.map(value=>`<option value="${esc(value)}">${esc(value)}</option>`).join('');$('#inventoryCylinder').value=lookup.cylinder;
  const match=findIolStock(stock,lookup.model,lookup.power,lookup.cylinder),qty=match?.qty??0,modelName=iolModels.find(item=>item.id===lookup.model)?.name||'';
  $('#inventoryResult').className=`inventory-result ${stockClass(qty)}`;
  $('#inventoryResult').innerHTML=match?`${esc(modelName)} ${esc(lookup.power)}${lookup.cylinder?' · '+esc(lookup.cylinder):''}<br><strong>${qty} 片</strong>${qty===0?'当前演示库存为 0，请核对库存或补货':qty<=2?'余量较低，建议核对补货安排':'当前演示余量'}`:'未找到该规格的演示库存记录';
  $('#inventoryPatient').textContent=`${current().name} · 查询不写入档案`;
  $('#iolStockRows').innerHTML=iolModels.map(model=>{const items=stock.iol.filter(item=>item.model===model.id),total=items.reduce((sum,item)=>sum+item.qty,0);return `<div class="inventory-line"><span>${esc(model.name)}<small>${items.length} 个演示规格</small></span><b class="${stockClass(total)}">${total} 片</b></div>`}).join('');
  $('#consumableRows').innerHTML=stock.consumables.map(item=>`<div class="inventory-line"><span>${esc(item.system)}<small>${esc(item.name)}</small></span><b class="${stockClass(item.qty)}">${item.qty} ${esc(item.unit)}</b></div>`).join('');
  $('#inventoryEditor').innerHTML=`<div class="inventory-editor-grid">${stock.iol.map((item,i)=>`<label class="inventory-editor-row"><span>${esc(iolModels.find(model=>model.id===item.model)?.name||item.model)}<br>${esc(item.power)}${item.cylinder?' · '+esc(item.cylinder):''}</span><input type="number" min="0" max="9999" step="1" value="${item.qty}" data-stock-type="iol" data-stock-index="${i}" aria-label="${esc(item.power)}库存片数"></label>`).join('')}${stock.consumables.map((item,i)=>`<label class="inventory-editor-row"><span>${esc(item.system)} · ${esc(item.name)}</span><input type="number" min="0" max="9999" step="1" value="${item.qty}" data-stock-type="consumables" data-stock-index="${i}" aria-label="${esc(item.name)}库存数量"></label>`).join('')}</div>`;
  $('.inventory-edit').open=detailsOpen;
}
function renderJourney(){
  $('#patientList').innerHTML=state.patients.map(p=>`<button class="patient-button ${p.id===state.selected?'active':''}" data-patient="${esc(p.id)}"><span class="avatar">${esc(p.name.slice(-1))}</span><span><b>${esc(p.name)}</b><small>${esc(p.age)} · ${esc(p.id)}</small></span><span class="badge">${esc(stages[p.stage])}</span></button>`).join('');
  const p=current();$('#patientCode').textContent=p.id;
  $('#patientDetail').innerHTML=`<div class="patient-summary"><div class="avatar">${esc(p.name.slice(-1))}</div><div><strong>${esc(p.name)} · ${esc(p.age)}</strong><span>当前：${esc(stages[p.stage])}</span></div></div><div class="timeline">${stages.map((s,i)=>`<button data-stage="${i}" class="${i===p.stage?'active':''}"><b>${String(i+1).padStart(2,'0')}</b>${esc(s)}</button>`).join('')}</div><div class="timeline-note"><b>患者表达</b><p>视觉重点：${esc(p.priority||'待填写')}<br>主要顾虑：${esc(p.concern||'待填写')}</p></div>`;
  renderHandoff(p);
}
function renderHandoff(p){
  const selected=viewedStage===null?p.stage:viewedStage,step=handoffSteps[selected],record=p.handoffs?.[selected];
  $('#handoffBoard').innerHTML=`<div class="handoff-grid"><div class="handoff-flow">${handoffSteps.map((h,i)=>`<button type="button" data-handoff-step="${i}" class="handoff-step ${i===selected?'selected':''}"><span class="step-number">${i+1}</span><span><strong>${esc(stages[i])}</strong><small>${esc(h.from)} → ${esc(h.to)}</small></span><em class="${p.handoffs?.[i]?'status-done':i===p.stage?'status-current':''}">${p.handoffs?.[i]?'已交接':i===p.stage?'进行中':'待处理'}</em></button>`).join('')}</div><div class="handoff-detail"><span class="eyebrow">第 ${selected+1} 步</span><h3>${esc(stages[selected])}</h3><dl><dt>本环节负责</dt><dd>${esc(step.from)}</dd><dt>下一位接手</dt><dd>${esc(step.to)}</dd><dt>要完成的工作</dt><dd>${esc(step.work)}</dd><dt>交接依据</dt><dd>${esc(step.evidence)}</dd></dl>${record?`<div class="handoff-record"><b>交接记录</b><p>${esc(record.note)}</p><small>${esc(record.by)} · ${esc(record.at)}</small></div>`:selected===p.stage?`<form id="handoffForm"><label for="handoffNote">交接备注（演示）</label><textarea id="handoffNote" name="note" rows="4" maxlength="500" required placeholder="记录已完成事项、需复核问题及下一步"></textarea><button class="primary" type="submit">完成交接 → ${esc(step.to)}</button></form>`:'<p class="muted">尚无此环节的演示交接记录。</p>'}<p class="handoff-boundary">角色切换仅用于演示视角，不构成身份验证或临床签名。</p></div></div>`;
}
function renderClinical(){const p=current();$('#clinicalPatientName').textContent=p.name;const f=$('#needsForm');f.elements.priority.value=p.priority||'';f.elements.concern.value=p.concern||'';f.elements.glasses.value=p.glasses||''}
function renderCapability(){const done=state.audit.filter(a=>a!=='未评估').length;$('#auditSummary').textContent=`${done}/6 已评估`;$('#pillarAssessment').innerHTML=pillars.map(([name,desc],i)=>`<div class="pillar-item"><strong>${i+1}. ${name}</strong><p>${desc}</p><label class="muted" for="pillar-${i}">当前状态</label><select id="pillar-${i}" data-audit="${i}"><option>未评估</option><option>达标</option><option>需改进</option><option>缺失</option></select></div>`).join('');state.audit.forEach((v,i)=>$(`#pillar-${i}`).value=v);renderMdt()}
function competencyFor(role){return state.competency[role] ||= {self:[0,0,0,0,0],quiz:null}}
function renderMdt(){
  const role=state.mdtRole,data=mdtRoles[role],record=competencyFor(role);
  $('#mdtRoleSelect').innerHTML=Object.keys(mdtRoles).map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join('');$('#mdtRoleSelect').value=role;
  $('#mdtRoleIntro').innerHTML=`<p>${esc(data.intro)}</p><div class="mdt-tags"><span>知识 ${data.standards.filter(s=>s[0]==='知识').length} 项</span><span>技能 ${data.standards.filter(s=>s[0]==='技能').length} 项</span><span>及格线 80 分</span></div>`;
  $('#selfAssessment').innerHTML=data.standards.map(([kind,label],i)=>`<div class="standard-row"><div><span class="standard-kind">${kind}</span><b>${esc(label)}</b></div><label>自评分<select data-self="${i}" aria-label="${esc(label)}自评分"><option value="0">未评</option>${[1,2,3,4,5].map(n=>`<option value="${n}">${n} 分</option>`).join('')}</select></label></div>`).join('');record.self.forEach((n,i)=>{const el=$(`[data-self="${i}"]`);if(el)el.value=String(n)});renderSelfResult();
  $('#quizQuestions').innerHTML=data.questions.map(([q,options],i)=>`<fieldset class="quiz-question"><legend>${i+1}. ${esc(q)}</legend>${options.map((text,j)=>`<label><input type="radio" name="q${i}" value="${j}" ${record.quiz?.answers?.[i]===j?'checked':''}> ${esc(text)}</label>`).join('')}</fieldset>`).join('');renderQuizResult();
}
function renderSelfResult(){const record=competencyFor(state.mdtRole),count=record.self.filter(n=>n>0).length,score=record.self.reduce((a,b)=>a+b,0)*4;$('#selfResult').innerHTML=count<5?`已评 ${count}/5 项 · 请完成全部项目后查看总分`: `自评 ${score} 分 · <strong class="${score>=80?'pass':'fail'}">${score>=80?'达到演示建议线':'建议补强'}</strong>`}
function renderQuizResult(){const result=competencyFor(state.mdtRole).quiz;if(!result){$('#quizResult').textContent='尚未提交短测';return}const questions=mdtRoles[state.mdtRole].questions;$('#quizResult').innerHTML=`最近一次：${result.score} 分 · <strong class="${result.score>=80?'pass':'fail'}">${result.score>=80?'及格':'未及格'}</strong><small>${esc(result.at)}</small>${result.score<100?`<details><summary>查看错题与正确答案</summary><ol>${questions.map(([q,opts,correct],i)=>result.answers[i]===correct?'':`<li>${esc(q)}<br>正确答案：${esc(opts[correct])}</li>`).join('')}</ol></details>`:''}`}
function renderOperations(){let done=state.tasks.filter(t=>t.done).length;$('#taskList').innerHTML=state.tasks.map(t=>`<label class="task-row ${t.done?'done':''}"><input type="checkbox" data-task="${t.id}" ${t.done?'checked':''}><span>${esc(t.title)}<small>${esc(t.owner)} · ${esc(t.phase)}</small></span></label>`).join('');$('#opsSummary').innerHTML=`<div class="ops-big">${done}/${state.tasks.length}</div><p class="muted">演示行动已完成</p><div class="progress"><span style="width:${state.tasks.length?done/state.tasks.length*100:0}%"></span></div><div class="ops-line">六大支柱已评估：<b>${state.audit.filter(a=>a!=='未评估').length}/6</b></div><div class="ops-line">患者旅程记录：<b>${state.patients.length}</b> 份演示档案</div>`}
function renderResources(){const query=$('#toolSearch').value.trim().toLowerCase(),role=$('#toolRoleFilter').value;const matched=resources.map((r,i)=>({r,i})).filter(({r})=>(role==='all'||r[5].includes(role))&&(!query||`${r[0]} ${r[1]} ${r[2]}`.toLowerCase().includes(query)));$('#toolCount').textContent=`${matched.length} / ${resources.length} 个工具`;$('#resourceGrid').innerHTML=matched.map(({r,i})=>{const [name,desc,where,type,path]=r,url=encodeURI(`tools/${path}`);return `<article class="resource-card"><small>${esc(where)}</small><h2>${esc(name)}</h2><p>${esc(desc)}</p><div class="tool-card-actions"><button class="wide-button" type="button" data-open-tool="${i}">站内查看 →</button><a href="${url}" target="_blank" rel="noopener">独立打开 ↗</a></div><span class="badge">${esc(type)} · 已收录</span></article>`}).join('')||'<p class="muted">未找到匹配工具，请调整搜索或岗位筛选。</p>'}
function openTool(index){const resource=resources[index];if(!resource)return;const url=encodeURI(`tools/${resource[4]}`);$('#toolViewerTitle').textContent=resource[0];$('#toolViewerNote').textContent=`${resource[2]} · 原工具独立运行，记录不会同步到 Digital PLS 患者档案。`;$('#toolOpenLink').href=url;$('#toolFrame').src=url;$('#toolFrame').title=resource[0];$('#toolViewer').hidden=false;$('#toolViewer').scrollIntoView({behavior:'smooth',block:'start'})}
function closeTool(){$('#toolFrame').removeAttribute('src');$('#toolViewer').hidden=true}
function render(){renderHome();renderJourney();renderClinical();renderCapability();renderOperations();renderResources();renderFeatures();if(typeof renderQa==='function')renderQa()}
document.addEventListener('click',e=>{const go=e.target.closest('[data-go]');if(go)nav(go.dataset.go);const item=e.target.closest('[data-view]');if(item)nav(item.dataset.view);const tool=e.target.closest('[data-open-tool]');if(tool)openTool(Number(tool.dataset.openTool));const roleTools=e.target.closest('[data-tools-role]');if(roleTools){$('#toolRoleFilter').value=roleTools.dataset.toolsRole;$('#toolSearch').value='';renderResources();nav('resources')}const patient=e.target.closest('[data-patient]');if(patient){state.selected=patient.dataset.patient;viewedStage=null;save()}const stage=e.target.closest('[data-stage],[data-handoff-step]');if(stage){viewedStage=Number(stage.dataset.stage??stage.dataset.handoffStep);renderJourney()}});
document.addEventListener('change',e=>{if(e.target.matches('[data-audit]')){state.audit[Number(e.target.dataset.audit)]=e.target.value;save();toast('能力评估已保存')}if(e.target.matches('[data-task]')){const task=state.tasks.find(t=>t.id===Number(e.target.dataset.task));task.done=e.target.checked;save()}if(e.target.id==='roleSelect'){state.role=e.target.value;save();toast(`已切换为${state.role}视角`)}if(e.target.id==='mdtRoleSelect'){state.mdtRole=e.target.value;save()}if(e.target.matches('[data-self]')){competencyFor(state.mdtRole).self[Number(e.target.dataset.self)]=Number(e.target.value);localStorage.setItem(STORAGE_KEY,JSON.stringify(state));renderSelfResult()}});
document.addEventListener('change',e=>{
  if(e.target.id==='inventoryModel'){state.inventoryLookup.model=e.target.value;state.inventoryLookup.power='';state.inventoryLookup.cylinder='';save()}
  if(e.target.id==='inventoryPower'){state.inventoryLookup.power=e.target.value;state.inventoryLookup.cylinder='';save()}
  if(e.target.id==='inventoryCylinder'){state.inventoryLookup.cylinder=e.target.value;save()}
  if(e.target.matches('[data-stock-type]')){const type=e.target.dataset.stockType,index=Number(e.target.dataset.stockIndex),qty=Number(e.target.value);if(e.target.value.trim()===''||!Number.isInteger(qty)||qty<0||qty>9999||!state.inventory[type]?.[index]){renderInventory();toast('请输入 0–9999 的整数');return}state.inventory[type][index].qty=qty;save();toast('演示库存已更新')}
});
document.addEventListener('submit',e=>{if(e.target.id==='handoffForm'){e.preventDefault();const p=current(),index=viewedStage===null?p.stage:viewedStage,note=e.target.elements.note.value.trim();if(index!==p.stage||!note)return;p.handoffs ||= {};p.handoffs[index]={note:note.slice(0,500),by:state.role,at:new Date().toLocaleString('zh-CN'),to:handoffSteps[index].to};if(index<stages.length-1)p.stage=index+1;viewedStage=null;save();toast('交接已记录，下一岗位可继续处理')}if(e.target.id==='quizForm'){e.preventDefault();const questions=mdtRoles[state.mdtRole].questions,answers=questions.map((_,i)=>{const picked=e.target.querySelector(`input[name="q${i}"]:checked`);return picked?Number(picked.value):null});if(answers.some(a=>a===null)){toast('请完成全部五道题');return}const score=answers.reduce((sum,a,i)=>sum+(a===questions[i][2]?20:0),0);competencyFor(state.mdtRole).quiz={score,answers,at:new Date().toLocaleString('zh-CN')};save();toast(score>=80?'短测及格':'短测未及格，可查看错题后重试')}});
$('#needsForm').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget,p=current();p.priority=f.elements.priority.value;p.concern=f.elements.concern.value.trim().slice(0,500);p.glasses=f.elements.glasses.value;save();toast('需求记录已保存（仅此浏览器）')});
$('#addIolStockForm').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget,model=f.elements.model.value,raw=f.elements.power.value.trim().match(/^([+-]?\d{1,2}(?:\.\d{1,2})?)\s*D?$/i),cylinder=model==='toric2'?f.elements.cylinder.value.trim():'';if(!raw){toast('请按 +21.5 D 的格式填写球镜度数');return}if(model==='toric2'&&!cylinder){toast('Toric II 请填写散光规格');return}const amount=Number(raw[1]),decimals=Math.max(1,(String(amount).split('.')[1]||'').length),power=`${amount>=0?'+':''}${amount.toFixed(decimals)} D`,qty=Number(f.elements.qty.value);if(!Number.isInteger(qty)||qty<0||qty>9999){toast('片数需为 0–9999 的整数');return}if(state.inventory.iol.some(item=>item.model===model&&item.power===power&&item.cylinder===cylinder)){toast('该规格已存在，请在维护列表调整数量');return}state.inventory.iol.push({model,power,cylinder,qty});state.inventoryLookup={model,power,cylinder};f.reset();save();toast('演示规格已添加，可立即查询')});
$('#taskForm').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget,title=f.elements.title.value.trim();if(!title)return;state.tasks.push({id:Date.now(),title,owner:f.elements.owner.value,phase:'待安排',done:false});f.reset();save();toast('行动事项已添加')});
$('#addPatientButton').addEventListener('click',()=>{const id='P'+String(Math.max(...state.patients.map(p=>Number(p.id.slice(1))||0))+1).padStart(3,'0');state.patients.push({id,name:'患者 '+id.slice(-1),age:'待填写',stage:0,priority:'',concern:'',glasses:'',handoffs:{},createdAt:localDate(),source:'现场登记',pauseReason:'',checks:clinicalChecks.map(()=>false),riskNote:'',doctorNote:'',reviewedAt:'',educationDone:[]});state.selected=id;viewedStage=null;save();toast('演示患者已创建，请勿输入真实个人信息')});
$('#exportButton').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString(),demoOnly:true},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='digital-pls-demo-data.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
$('#resetButton').addEventListener('click',()=>{if(!confirm('重置本浏览器中的全部演示记录？'))return;state=seed();viewedStage=null;$('#roleSelect').value=state.role;save();toast('演示数据已重置')});
$('#menuButton').addEventListener('click',()=>{const open=$('#mainNav').classList.toggle('open');$('#menuButton').setAttribute('aria-expanded',String(open))});
$('#toolSearch').addEventListener('input',renderResources);
$('#toolRoleFilter').addEventListener('change',renderResources);
$('#toolCloseButton').addEventListener('click',closeTool);
if(!Array.from($('#roleSelect').options).some(o=>o.value===state.role))state.role='院长/CEO';$('#roleSelect').value=state.role;$('#todayDate').textContent=new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(new Date());$('#inventory').appendChild($('.inventory-band'));render();if(['#concept','#inventory','#ceo','#funnel','#revenue','#education','#certification','#qa','#home'].includes(location.hash))nav(location.hash.slice(1));else{let seen=false;try{seen=sessionStorage.getItem('digital-pls-intro-seen')==='1'}catch{}if(seen)nav('home')}
