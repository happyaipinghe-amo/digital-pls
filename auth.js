const DIGITAL_PLS_USERS = [
  'admin','wang dong','liang yan','fan xiaoqing','chen yonghong',
  'wang shuihong','chen peiyu','zhang luxi','du sha','mei luoli',
  'zhang borong','xu peiqi','chen biao','hui hubert','luo yujuan',
  'liu shuting','yu yanping','jing tengyang','liu xiaomin'
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
