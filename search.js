let siteSearchIndex=[];
const searchViewNames={intro:'项目介绍',home:'CEO项目总览',concept:'认识PLS',capability:'医院能力诊断',operations:'90天建设',journey:'患者价值交付',clinical:'价值发现与临床协作',education:'患者教育',inventory:'库存与设备',ceo:'CEO驾驶舱',funnel:'患者价值旅程',revenue:'经营情景测算',resources:'知识与工具',qa:'决策Q&A',certification:'PLS三级能力认证'};
const searchNormalize=value=>String(value??'').toLowerCase().replace(/\s+/g,'');
const searchEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function searchExcerpt(text,max=105){const clean=String(text??'').replace(/\s+/g,' ').trim();return clean.length>max?clean.slice(0,max)+'…':clean}
function searchTerms(raw){return String(raw).trim().split(/\s+/).filter(Boolean).flatMap(part=>{const groups=part.match(/[a-z0-9]+|[\u3400-\u9fff]+/gi);return groups?.length>1?groups:[part]}).map(searchNormalize)}
function buildSiteSearchIndex(){
  const items=[];
  document.querySelectorAll('main .view').forEach(view=>{
    const viewId=view.id;if(!viewId||viewId==='qa'||viewId==='resources')return;
    const seen=new Set();
    view.querySelectorAll('h1,h2,h3').forEach((heading,index)=>{const title=heading.textContent.trim();if(!title||seen.has(title))return;seen.add(title);const host=heading.closest('section,article,.panel')||heading.parentElement;items.push({kind:'page',type:searchViewNames[viewId]||'网站内容',title,text:searchExcerpt(host?.textContent||title,180),view:viewId,target:heading.id||'',order:index})});
  });
  (typeof plsDecisionQa==='undefined'?[]:plsDecisionQa).forEach(q=>items.push({kind:'qa',type:`决策Q&A · Q${q.id}`,title:q.question,text:`${q.answer} ${q.management.join(' ')} ${q.dont.join(' ')}`,qaId:q.id,view:'qa'}));
  (typeof resources==='undefined'?[]:resources).forEach((r,index)=>items.push({kind:'tool',type:'网站工具',title:r[0],text:`${r[1]} ${r[2]} ${r[3]}`,toolIndex:index,view:'resources'}));
  if(typeof roleCourseCatalog!=='undefined')Object.entries(roleCourseCatalog).forEach(([role,levels])=>Object.entries(levels).forEach(([level,courses])=>courses.forEach((course,index)=>items.push({kind:'course',type:`${role} · ${level==='junior'?'初级':'中级'}`,title:course[0],text:course.slice(1).join(' '),role,level,courseIndex:index,view:'capability'}))));
  siteSearchIndex=items.map(item=>({...item,haystack:searchNormalize(`${item.type} ${item.title} ${item.text}`)}));
}
function searchHighlight(text,query){const safe=searchEscape(searchExcerpt(text)),parts=String(query).trim().split(/\s+/).filter(Boolean).sort((a,b)=>b.length-a.length);if(!parts.length)return safe;const pattern=parts.map(part=>part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');return safe.replace(new RegExp(`(${pattern})`,'ig'),'<mark>$1</mark>')}
function runSiteSearch(){
  const input=document.querySelector('#siteSearchInput'),results=document.querySelector('#siteSearchResults'),count=document.querySelector('#siteSearchCount');if(!input||!results)return;
  const raw=input.value.trim(),terms=searchTerms(raw);
  if(!terms.length){count.textContent=`可搜索 ${siteSearchIndex.length} 项本站内容`;results.innerHTML='<div class="site-search-empty">可搜索页面内容、决策问答、岗位课程和网站工具</div>';return}
  const matched=siteSearchIndex.filter(item=>terms.every(term=>item.haystack.includes(term))).sort((a,b)=>{const at=searchNormalize(a.title),bt=searchNormalize(b.title);return Number(bt.includes(terms[0]))-Number(at.includes(terms[0]))}).slice(0,30);
  count.textContent=`找到 ${matched.length}${matched.length===30?'+' :''} 项结果`;
  results.innerHTML=matched.map((item,index)=>`<button class="site-search-result" type="button" role="option" data-search-result="${index}" data-kind="${item.kind}"><span class="site-search-type">${searchEscape(item.type)}</span><span class="site-search-copy"><b>${searchHighlight(item.title,raw)}</b><small>${searchHighlight(item.text,raw)}</small></span></button>`).join('')||'<div class="site-search-empty">没有找到相关内容，请尝试更短的关键词，例如“眩光”“咨询师”“公式”。</div>';
  results.querySelectorAll('[data-search-result]').forEach(button=>button._searchItem=matched[Number(button.dataset.searchResult)]);
}
function openSiteSearch(){const panel=document.querySelector('#siteSearchPanel'),button=document.querySelector('#siteSearchButton');panel.hidden=false;button.setAttribute('aria-expanded','true');if(!siteSearchIndex.length)buildSiteSearchIndex();runSiteSearch();setTimeout(()=>document.querySelector('#siteSearchInput').focus(),40)}
function closeSiteSearch(){document.querySelector('#siteSearchPanel').hidden=true;document.querySelector('#siteSearchButton').setAttribute('aria-expanded','false')}
function flashSearchTarget(selector){setTimeout(()=>{const target=document.querySelector(selector);if(!target)return;target.scrollIntoView({behavior:'smooth',block:'center'});target.classList.remove('search-target-flash');void target.offsetWidth;target.classList.add('search-target-flash')},120)}
function activateSearchResult(item){
  closeSiteSearch();
  if(item.kind==='qa'){openQa(item.qaId);return}
  if(item.kind==='tool'){openTool(item.toolIndex);nav('resources');return}
  if(item.kind==='course'){state.courseRole=item.role;document.querySelector('#courseLevelFilter').value=item.level;save();nav('capability');flashSearchTarget('#courseGrid');return}
  nav(item.view);if(item.target)flashSearchTarget(`#${CSS.escape(item.target)}`)
}
document.addEventListener('click',event=>{if(event.target.closest('#siteSearchButton')){document.querySelector('#siteSearchPanel').hidden?openSiteSearch():closeSiteSearch();return}if(event.target.closest('#siteSearchClose')){closeSiteSearch();return}const result=event.target.closest('[data-search-result]');if(result){activateSearchResult(result._searchItem);return}if(!event.target.closest('#siteSearch'))closeSiteSearch()});
document.addEventListener('input',event=>{if(event.target.id==='siteSearchInput')runSiteSearch()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!document.querySelector('#siteSearchPanel')?.hidden)closeSiteSearch();if(event.key==='Enter'&&event.target.id==='siteSearchInput'){event.preventDefault();document.querySelector('[data-search-result]')?.click()}});
document.addEventListener('DOMContentLoaded',()=>setTimeout(buildSiteSearchIndex,0));
