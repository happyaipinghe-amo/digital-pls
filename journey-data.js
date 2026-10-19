(function () {
  const script = document.currentScript;
  const root = new URL('.', script.src);
  const steps = [
    ['引流／预约','市场、客服、PLS团队','院外科普、社区活动、线上咨询及转介绍；记录来源、初步诉求与预约。','将来源、预约和前期沟通交给接待团队。'],
    ['到院分流','前台、接待护士、初诊医生','登记建档、基础初筛和急症识别；初步安排流程，不按支付能力确定路径。','交接准确身份、主诉及需优先处理的问题。'],
    ['IDEAL评估','咨询师／患者旅程管理师、患教专员、视光师','了解生活场景、视觉目标、戴镜接受度、预期与顾虑。','形成需求摘要，交医生结合检查判断。'],
    ['全面检查','视光师、特殊检查技师、医生','按临床需要完成检查和测量，核验数据质量，异常及时升级。','交接可靠报告、缺项及待复核异常。'],
    ['医生诊断','主诊医生、手术医生，必要时MDT','综合检查与需求判断适应证、风险和合理方案；必要时多学科讨论。','交接医生意见、方案边界和风险要点。'],
    ['方案确定','医生、咨询师／患者旅程管理师、收费／医保人员、患者及家属','说明获益、局限、替代方案和费用；复述确认、充分考虑、自主选择及正式知情同意。','交接医生确认的方案、费用与知情记录及预约。'],
    ['手术执行','手术医生、手术护士、病区／接待护士','术前身份、眼别和IOL核查，安全手术、术后观察、用药说明及出院交接。','将实际手术、医嘱、复诊和紧急联系安排交给随访团队。'],
    ['术后随访','医生、随访护士、咨询师／患者旅程管理师','评估恢复与视觉质量；不适先医学排查，再给予适应支持；问题和投诉及时升级处理。','交接结局、患者反馈、处理经过及未解决问题。'],
    ['持续改进','院长／CEO、质量负责人、MDT、HR／培训经理、PLS团队','汇总结局、体验及投诉，改进SOP和岗位培训，明确行动负责人、期限及验证方式。','用改进后的标准支持后续患者及长期视觉健康管理。']
  ].map(([name,roles,work,handoff],index)=>Object.freeze({id:index+1,name,roles,work,handoff}));
  window.plsJourney = Object.freeze(steps);
  // Assessment domains keep their original IDs and scoring; they are not sequential journey steps.
  window.plsJourneyAssessmentMap = Object.freeze(['1','2、3、5、6','4、5','5、6','7','7、8','8、9','8、9','1—9']);
  function reference() {
    const style=document.createElement('style');
    style.textContent='.journey-reference{margin:18px 0;padding:18px;border:1px solid #cddce7;background:#fff;color:#173653;font:16px/1.7 Arial,"Microsoft YaHei",sans-serif}.journey-reference summary{cursor:pointer;font-weight:700;color:#14345a}.journey-reference ol{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px;padding:16px 0 0;list-style:none;margin:0}.journey-reference li{min-width:0;border-top:2px solid #16868a;padding-top:9px}.journey-reference b{display:block}.journey-reference small{display:block;color:#526b7f}.journey-reference p{margin:8px 0}.journey-reference a{color:#0757ba}@media(max-width:760px){.journey-reference ol{grid-template-columns:1fr}}';
    document.head.appendChild(style);
    let hosts=[...document.querySelectorAll('[data-journey-reference]')];
    if(!hosts.length && /\/(tools|presentations)\//.test(location.pathname)) {
      const main=document.querySelector('main,.page,.container')||document.body;
      const host=document.createElement('section');main.appendChild(host);hosts=[host];
    }
    for(const host of hosts) host.innerHTML=`<details class="journey-reference"><summary>患者全流程统一口径：九环节与岗位交接</summary><p>顺序与《PLS医院患者全流程旅程》九环节培训课件一致。工具中的检查、患教、手术和随访子步骤，是对应环节的细化，不另算新的全流程环节。</p><ol>${steps.map(s=>`<li><b>${s.id}. ${s.name}</b><small>${s.roles}</small><p>${s.work}</p><small>${s.handoff}</small></li>`).join('')}</ol><p><strong>路径确认闸门在第5与第6环节之间：</strong>医生评估医学可行性后，经充分告知与患者自主选择确认标准诊疗或PLS个体化路径。第2环节仅初步分诊；第3—4环节按需评估，不构成手术、产品或支付方案确认。两条路径共享医疗安全与质量底线。</p><p>出院教育纳入第7环节；投诉响应纳入第8环节，汇总复盘纳入第9环节。院方可调整实际检查和就诊次序，急症优先处理，不应为套用演示顺序延误诊疗。</p><p>岗位合并不改变专业权限：“患者旅程管理师”承接咨询及协调职能，检查和护理仍须在各自资质与授权范围内执行。</p><p><a href="${new URL('patient-journey.png',root)}" target="_blank" rel="noopener">查看九环节全图</a> · <a href="${new URL('PLS医院患者全流程旅程_九环节一线员工培训.pptx',root)}">下载九环节培训课件</a></p></details>`;
    const modules=document.querySelector('.certification-modules .module-grid');
    if(modules) modules.innerHTML=steps.map(s=>`<article><b>${String(s.id).padStart(2,'0')} ${s.name}</b><p>${s.work}</p><small>${s.handoff}</small></article>`).join('');
    const assessmentHeading=document.querySelector('.certification-modules h2');
    if(assessmentHeading)assessmentHeading.textContent='患者全流程九环节与评价覆盖';
    if(typeof MODULES!=='undefined') {
      const table=document.querySelector('.module-summary');
      if(table){const guide=document.createElement('section');guide.className='journey-reference';guide.innerHTML='<b>九个能力评价维度与患者九环节的对应</b><p>以下编号是评价维度编号，不是患者旅程顺序。保留原有项目编号、权重及评分记录；同一维度可以覆盖多个环节。</p><ol>'+MODULES.map((m,i)=>`<li><b>${m.name}</b><small>对应患者环节：${window.plsJourneyAssessmentMap[i]}</small></li>`).join('')+'</ol>';table.before(guide);const header=table.querySelector('th');if(header)header.textContent='能力评价维度（非旅程顺序）';}
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',reference);else reference();
})();
