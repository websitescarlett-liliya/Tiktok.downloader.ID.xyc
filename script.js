let cur='customer';

// TAB LOGIN
function tab(t){
 cur=t;
 document.getElementById('fC').classList.toggle('hidden',t!='customer');
 document.getElementById('fO').classList.toggle('hidden',t!='owner');
 document.getElementById('tC').className = t=='customer'?'flex-1 bg-white text-black py-2 rounded-full font-bold text-xs':'flex-1 py-2 rounded-full text-xs opacity-60';
 document.getElementById('tO').className = t=='owner'?'flex-1 bg-white text-black py-2 rounded-full font-bold text-xs':'flex-1 py-2 rounded-full text-xs opacity-60';
}

// LOGIN - OWNER: Scarlett / glass5522
function login(r){
 let u = document.getElementById(r=='owner'?'o_u':'c_u').value.trim();
 let p = document.getElementById(r=='owner'?'o_p':'c_p').value.trim();
 if(!u) return alert('Isi nickname');
 if(r=='owner'){
   if(u!=='Scarlett' || p!=='glass5522') return alert('Owner salah! Harus Scarlett / glass5522');
 }
 localStorage.setItem('user',u);
 localStorage.setItem('role', r=='owner'?'Owner':'Customer');
 localStorage.setItem('login','1');

 let list = JSON.parse(localStorage.getItem('allUsers')||'[]');
 list.push({user:u, role:r, time:new Date().toLocaleString(), ua:navigator.userAgent.slice(0,50)});
 localStorage.setItem('allUsers',JSON.stringify(list));

 if(!localStorage.getItem('join')) localStorage.setItem('join', new Date().toLocaleDateString());
 if(!localStorage.getItem('total')) localStorage.setItem('total','0');
 check();
}

function check(){
 if(localStorage.getItem('login')=='1'){
  document.getElementById('auth').style.display='none';
  document.getElementById('editName').value = localStorage.getItem('user');
  let role = localStorage.getItem('role');
  let pb = document.getElementById('pb');
  pb.innerText = role;
  if(role=='Owner'){
   document.getElementById('ownerNav').classList.remove('hidden');
   pb.className='mt-3 inline-block px-3 py-1 rounded-full text-xs bg-yellow-400 text-black font-bold';
  }
  let users = JSON.parse(localStorage.getItem('allUsers')||'[]');
  document.getElementById('o_total').innerText = users.length;
  document.getElementById('o_down').innerText = localStorage.getItem('total')||0;
  document.getElementById('o_list').innerText = JSON.stringify(users,null,2);
 }
}

function nav(p){
 ['home','profile','settings','owner'].forEach(x=>{
   let el = document.getElementById('p-'+x);
   if(el) el.classList.add('hidden');
 });
 document.getElementById('p-'+p).classList.remove('hidden');
 if(p=='owner' && localStorage.getItem('role')!='Owner') return alert('Hanya Owner Scarlett!');
}

function sTab(t){
 ['colors','video','tools','api'].forEach(x=>{
   let el = document.getElementById('ss-'+x);
   if(el) el.classList.add('hidden');
 });
 document.getElementById('ss-'+t).classList.remove('hidden');
 document.querySelectorAll('.sActive,.sBtn').forEach(b=>b.className='sBtn');
 if(event) event.target.className='sActive';
}

function logout(){ localStorage.clear(); location.reload(); }

// PROFILE GALLERY
function setAv(src){ document.getElementById('avImg').src=src; localStorage.setItem('av',src); }
function changeAv(e){
 let r=new FileReader();
 r.onload=()=>{ document.getElementById('avImg').src=r.result; localStorage.setItem('av',r.result); };
 r.readAsDataURL(e.target.files[0]);
}
function saveProfile(){
 localStorage.setItem('user', document.getElementById('editName').value);
 alert('Profile disimpan!');
 check();
}

function changeBg(){
 let m = document.getElementById('bgMode').value;
 let body = document.getElementById('body');
 let wrap = document.getElementById('bgVideoWrap');
 if(m=='black'){ body.style.background='#000'; wrap.classList.add('hidden'); }
 if(m=='gradient'){ body.style.background='linear-gradient(180deg,#000,#222)'; wrap.classList.add('hidden'); }
}
function uploadBg(e){
 let f=e.target.files[0]; if(!f) return;
 let url=URL.createObjectURL(f);
 let wrap = document.getElementById('bgVideoWrap');
 if(f.type.startsWith('video')){
   wrap.classList.remove('hidden');
   document.getElementById('bgVideo').src=url;
   document.getElementById('body').style.background='black';
 } else {
   document.getElementById('body').style.background=`url(${url}) center/cover no-repeat fixed`;
   wrap.classList.add('hidden');
 }
}

// DOWNLOAD - FIX UTAMA PAKAI TIKWM.COM
async function dl(){
 let url = document.getElementById('url').value.trim();
 if(!url) return alert('Paste link TikTok dulu');

 let res = document.getElementById('res');
 let r_cap = document.getElementById('r_cap');
 let r_img = document.getElementById('r_img');
 let r_user = document.getElementById('r_user');
 let r_like = document.getElementById('r_like');
 let b1 = document.getElementById('b1');
 let b3 = document.getElementById('b3');

 res.classList.remove('hidden');
 r_cap.innerText='Fetching dari tikwm.com...';
 res.scrollIntoView({behavior:'smooth'});

 try{
  // API ASLI TIKWM.COM - 100% TIKWM
  let tikApi = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&count=12&cursor=0&web=1&hd=1`;
  // PROXY BIAR GAK CORS TAPI TETEP HIT TIKWM
  let prox = `https://api.allorigins.win/raw?url=${encodeURIComponent(tikApi)}`;

  let r = await fetch(prox);
  let j = await r.json();

  if(j.code!== 0) throw new Error('TikWM limit');

  let d = j.data;
  r_img.src = d.cover;
  r_user.innerText = '@' + d.author.unique_id;
  r_cap.innerText = d.title || 'No caption';
  r_like.innerText = 'memek ' + (d.digg_count||0) + ' likes • kontol ' + (d.play_count||0);

  // MP4 & MP3 MUNCUL - INI FIX NYA
  b1.href = d.play;
  b1.download = 'TiktokID_MP4.mp4';
  b1.style.display = 'flex';
  b1.innerText = 'Download MP4';
  b1.classList.remove('hidden');

  b3.href = d.music;
  b3.download = 'TiktokID_MP3.mp3';
  b3.style.display = 'flex';
  b3.innerText = 'Download MP3';
  b3.classList.remove('hidden');

  let tot = parseInt(localStorage.getItem('total')||0)+1;
  localStorage.setItem('total',tot);
  document.getElementById('o_down').innerText = tot;

 }catch(e){
  console.error(e);
  r_cap.innerText='Gagal dari tikwm.com, coba proxy 2...';
  // FALLBACK PROXY 2 MASIH TIKWM.COM
  try{
    let tikApi2 = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    let prox2 = `https://corsproxy.io/?${encodeURIComponent(tikApi2)}`;
    let r2 = await fetch(prox2);
    let j2 = await r2.json();
    let d2 = j2.data;
    document.getElementById('r_img').src = d2.cover;
    document.getElementById('r_user').innerText = '@'+d2.author.unique_id;
    document.getElementById('r_cap').innerText = d2.title;
    document.getElementById('b1').href = d2.play;
    document.getElementById('b3').href = d2.music;
    document.getElementById('b1').classList.remove('hidden');
    document.getElementById('b3').classList.remove('hidden');
  }catch{
    r_cap.innerText='Gagal kontollah. Buka di Chrome (jangan di WA), atau coba link TikTok lain. TikWM kadang limit.';
  }
 }
}

// INIT
if(localStorage.getItem('av')) document.getElementById('avImg').src = localStorage.getItem('av');
check();

// AUTO PASTE
navigator.clipboard.readText().then(t=>{
 if(t && t.includes('tiktok.com')){
   document.getElementById('url').value = t;
 }
}).catch(()=>{});
