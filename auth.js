const DIGITAL_PLS_USERS = [
  'liang yan',
  'wang dong',
  'admin',
  'chen biao',
  'fan xiaoqing',
  'luo yujuan',
  'liu shuting',
  'hui hubert',
  'lu joyce',
  'li taotao',
  'yu yanping',
  'zhang luxi',
  'zhang lei',
  'du sha',
  'chen peiyu',
  'chen yonghong',
  'wang shuihong',
  'feng xusheng',
  'zhao qiaoxuan',
  'li zheng',
  'ji xueying',
  'ma ming',
  'cao lin',
  'yu jinfang',
  'qiao min',
  'yang yuxin',
  'tian tian',
  'shen xiaofei',
  'lu yi',
  'sun yuting',
  'zhang chunjie',
  'li yufan',
  'xia lin',
  'su guosheng',
  'li yuefan',
  'zhang youzhen',
  'cai wenjin',
  'nie chenqi',
  'guo zhengyan',
  'luo li',
  'zhong min',
  'yang ping',
  'fan mengting',
  'zhang yongwei',
  'cai yiyu',
  'su shuying',
  'zeng chao',
  'wang jing',
  'ye xiaoyan',
  'zhou kaili',
  'gao yunfan',
  'liu qiuge',
  'yuan tangwei',
  'xu liming',
  'wang difeng',
  'xiao renxian',
  'chen xuanchi',
  'zhuo wenbin',
  'zhou nan',
  'chen hao',
  'yang ying',
  'lei ling',
  'zhang zhiwei',
  'li zhonghan',
  'deng weiyun',
  'an yingying',
  'he cao',
  'zhong lihua',
  'chen gao',
  'zhang xuejiao',
  'yu yangyang',
  'shen shangbin',
  'chen xianjun',
  'yang henggang',
  'wang teng',
  'wang chao',
  'zhang weibin',
  'sun tianfeng',
  'lin honghong',
  'xie xiang',
  'xiong hui',
  'sun jiao',
  'xu jinwei',
  'zhang borong',
  'mei luoli',
  'xu peiqi',
  'zhao qirui',
  'liu xiaomin',
  'zhao yanning'
];
const DIGITAL_PLS_PASSWORD = 'pls2026';
const AUTH_SESSION_KEY = 'digital-pls-auth-user';
const normalizeUsername = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');

function showAuthenticatedSite(username){
  document.body.classList.remove('auth-locked');
  const userLabel=document.querySelector('#signedInUser');
  if(userLabel)userLabel.textContent=username;
}

function lockDigitalPls(){
  document.body.classList.add('auth-locked');
  const form=document.querySelector('#loginForm');
  if(form)form.reset();
  const error=document.querySelector('#loginError');
  if(error)error.textContent='';
  const username=document.querySelector('#loginUsername');
  if(username)setTimeout(()=>username.focus(),0);
}

document.querySelector('#loginForm').addEventListener('submit',event=>{
  event.preventDefault();
  const username=normalizeUsername(event.currentTarget.elements.username.value);
  const password=event.currentTarget.elements.password.value;
  const error=document.querySelector('#loginError');
  if(!DIGITAL_PLS_USERS.includes(username)||password!==DIGITAL_PLS_PASSWORD){
    error.textContent='用户名或密码不正确，请重新输入。';
    event.currentTarget.elements.password.value='';
    event.currentTarget.elements.password.focus();
    return;
  }
  sessionStorage.setItem(AUTH_SESSION_KEY,username);
  error.textContent='';
  showAuthenticatedSite(username);
});

document.querySelector('#logoutButton').addEventListener('click',()=>{
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  lockDigitalPls();
});

const authenticatedUser=normalizeUsername(sessionStorage.getItem(AUTH_SESSION_KEY));
if(DIGITAL_PLS_USERS.includes(authenticatedUser))showAuthenticatedSite(authenticatedUser);
else lockDigitalPls();
