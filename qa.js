let qaExpandAll=false,qaFocusId=null;
const qaEsc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function qaById(id){return plsDecisionQa.find(q=>q.id===Number(id))}
function qaDetails(q,open=false){return `<details class="qa-item" data-qa-item="${q.id}" ${open||qaExpandAll?'open':''}><summary><span class="qa-number">Q${q.id}</span><span><small>${qaEsc(q.category)}</small><b>${qaEsc(q.question)}</b><em>${q.roles.map(qaEsc).join(' · ')}</em></span></summary><div class="qa-answer"><section><h3>简明回答</h3><p>${qaEsc(q.answer)}</p></section><section><h3>管理要点</h3><ol>${q.management.map(x=>`<li>${qaEsc(x)}</li>`).join('')}</ol></section><section class="qa-dont"><h3>不能做什么</h3><ul>${q.dont.map(x=>`<li>${qaEsc(x)}</li>`).join('')}</ul></section><p class="qa-escalate">责任边界：涉及诊断、适应证和治疗方案由医生确认；涉及属地医保、收费、财税或对外传播时，由相应专业岗位完成复核。</p></div></details>`}
function renderQa(){
  const search=$('#qaSearch').value.trim().toLowerCase(),role=$('#qaRoleFilter').value,category=$('#qaCategoryFilter').value;
  const matched=plsDecisionQa.filter(q=>(role==='all'||q.roles.includes(role))&&(category==='all'||q.category===category)&&(!search||`${q.question} ${q.answer} ${q.management.join(' ')} ${q.dont.join(' ')}`.toLowerCase().includes(search)));
  $('#qaCount').textContent=`显示 ${matched.length} / ${plsDecisionQa.length} 个问题`;
  $('#qaList').innerHTML=matched.map(q=>qaDetails(q,q.id===qaFocusId)).join('')||'<p class="qa-empty">未找到匹配问题，请调整关键词或筛选条件。</p>';
  $('#qaExpandAll').textContent=qaExpandAll?'收起全部':'展开全部';
  if(qaFocusId){setTimeout(()=>{const el=document.querySelector(`[data-qa-item="${qaFocusId}"]`);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});qaFocusId=null},80)}
}
function openQa(id){qaFocusId=Number(id);$('#qaSearch').value='';$('#qaRoleFilter').value='all';$('#qaCategoryFilter').value='all';renderQa();nav('qa')}
function qaContextHtml(ids,title){const items=ids.map(qaById).filter(Boolean);return `<div class="context-qa-head"><div><span class="eyebrow">DECISION Q&A</span><h2>${qaEsc(title)}</h2></div><button class="text-button" type="button" data-go="qa">查看全部${plsDecisionQa.length}个问题 →</button></div><div class="context-qa-links">${items.map(q=>`<button type="button" data-qa="${q.id}"><span>Q${q.id} · ${qaEsc(q.category)}</span><b>${qaEsc(q.question)}</b></button>`).join('')}</div>`}
function ensureQaPanel(parentId,panelId){const parent=$(parentId);if(!parent)return null;let panel=$(`#${panelId}`);if(!panel){panel=document.createElement('section');panel.id=panelId;panel.className='panel context-qa';parent.appendChild(panel)}return panel}
function ensureQaPanelAfter(anchorId,panelId){const anchor=$(anchorId);if(!anchor)return null;let panel=$(`#${panelId}`);if(!panel){panel=document.createElement('section');panel.id=panelId;panel.className='panel context-qa';anchor.insertAdjacentElement('afterend',panel)}return panel}
function renderComplaintQa(){
  if(educationTab!=='support')return;
  const host=$('#educationExperience');if(!host)return;
  let panel=$('#qaContextComplaint');if(!panel){panel=document.createElement('section');panel.id='qaContextComplaint';panel.className='context-qa complaint-qa';host.appendChild(panel)}
  panel.innerHTML=qaContextHtml([15,16,17],'投诉、满意度与质量闭环');
}
function renderQaContexts(){
  const routing=ensureQaPanelAfter('#routingGate','qaContextRouting');if(routing)routing.innerHTML=qaContextHtml([7,13,1],'分流节点相关问题');
  const clinical=ensureQaPanel('#clinical','qaContextClinical');if(clinical)clinical.innerHTML=qaContextHtml([7,8,9,15],'临床工作台相关问题');
  const education=ensureQaPanel('#education','qaContextEducation');if(education)education.innerHTML=qaContextHtml([10,11,12],'患者教育相关问题');
  const ceo=ensureQaPanel('#ceo','qaContextCeo');if(ceo)ceo.innerHTML=qaContextHtml([3,4,6,17,20],'CEO与管理层相关问题');
  const roleMap={'院长/CEO':[20,3,6,17],'市场/客服':[20,18,19,3],'前台/接待护士':[10,12,13],'咨询师':[1,11,15],'验光师':[8,7,5],'特殊检查技师':[8,7,5],'手术医生':[7,8,15],'手术护士':[6,15,17],'术后随访护士':[15,16,17],'PLS BDM':[20,3,5,6]};
  renderComplaintQa();
  const work=$('#roleWorkItems');if(work){work.querySelector('.role-qa-item')?.remove();const ids=roleMap[state.role]||[3,6,10];work.insertAdjacentHTML('beforeend',`<div class="role-work-item role-qa-item"><b>本岗位决策Q&A</b><small>${ids.map(id=>'Q'+id).join('、')} · 经过审核的统一回答</small><button class="wide-button" type="button" data-qa="${ids[0]}">查看相关问题 →</button></div>`)}
}
document.addEventListener('click',e=>{const button=e.target.closest('[data-qa]');if(button)openQa(button.dataset.qa);if(e.target.id==='qaExpandAll'){qaExpandAll=!qaExpandAll;renderQa()}});
document.addEventListener('input',e=>{if(e.target.id==='qaSearch')renderQa()});
document.addEventListener('change',e=>{if(e.target.id==='qaRoleFilter'||e.target.id==='qaCategoryFilter')renderQa()});
