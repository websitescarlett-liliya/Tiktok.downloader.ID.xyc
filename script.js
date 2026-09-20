let cur='customer';
function tab(t){cur=t;fC.classList.toggle('hidden',t!='customer');fO.classList.toggle('hidden',t!='owner');tC.className=t=='customer'?'flex-1 bg-white text-black py-2 rounded-full font-bold text-xs':'flex-1 py-2 rounded-full text-xs opacity-60';tO.className=t=='owner'?'flex-1 bg-white text-black py-2 rounded-full font-bold text-xs':'flex-1 py-2 rounded-full text-xs opacity-60';}
function login(r){
 let u=document.getElementById(r=='owner'?'o_u':'c_u').value.trim();
 let p=document.getElementById(r=='owner'?'o_p':'c_p').value.trim();
 if(!u) return alert('Isi nickname');
 if(r=='owner'){ if(u!=='Scarlett' || p!=='glass5522') return alert('Owner salah! Harus Scarlett / glass5522'); }
 localStorage.setItem('user',u);localStorage.setItem('role',r=='owner'?'Owner':'Customer');localStorage.setItem('login','1');
 let list=JSON.parse(localStorage.getItem('allUsers')||'[]'); list.push({user:u,role:r,time:new Date().toLocaleString()}); localStorage.setItem('allUsers',JSON.stringify(list));
 if(!localStorage.getItem('join')) localStorage.setItem('join',new Date().toLocaleDateString());
 localStorage.setItem('total',localStorage.getItem('total')||0); check();
}
function check(){
 if(localStorage.getItem('login')=='1'){
  auth.style.display='none'; editName.value=localStorage.getItem('user');
  let role=localStorage.getItem('role'); pb.innerText=role;
  if(role=='Owner'){ ownerNav.classList.remove('hidden'); pb.className='mt-3 inline-block px-3 py-1 rounded-full text-xs bg-yellow-400 text-black font-bold';}
  let users=JSON.parse(localStorage.getItem('allUsers')||'[]'); o_total.innerText=users.length; o_down.innerText=localStorage.getItem('total'); o_list.innerText=JSON.stringify(users,null,2);
 }
}
function nav(p){['home','profile','settings','owner'].forEach(x=>document.getElementById('p-'+x).classList.add('hidden'));document.getElementById('p-'+p).classList.remove('hidden'); if(p=='owner' && localStorage.getItem('role')!='Owner') return alert('Hanya Owner Scarlett!');}
function sTab(t){['colors','video','tools','api'].forEach(x=>{document.getElementById('ss-'+x).classList.add('hidden');}); document.getElementById('ss-'+t).classList.remove('hidden'); document.querySelectorAll('.sActive,.sBtn').forEach(b=>b.className='sBtn'); event.target.className='sActive';}
function logout(){localStorage.clear();location.reload();}
function setAv(src){avImg.src=src; localStorage.setItem('av',src);}
function changeAv(e){let r=new FileReader(); r.onload=()=>{avImg.src=r.result; localStorage.setItem('av',r.result);}; r.readAsDataURL(e.target.files[0]);}
function saveProfile(){localStorage.setItem('user',editName.value); alert('Profile disimpan!');}
function changeBg(){let m=bgMode.value; if(m=='black'){body.style.background='#000'; bgVideoWrap.classList.add('hidden');} if(m=='gradient'){body.style.background='linear-gradient(180deg,#000,#222)';}}
function uploadBg(e){
 let f=e.target.files[0]; if(!f) return; let url=URL.createObjectURL(f);
 if(f.type.startsWith('video')){bgVideoWrap.classList.remove('hidden'); bgVideo.src=url; body.style.background='black';}
 else{body.style.background=`url(${url}) center/cover no-repeat`; bgVideoWrap.classList.add('hidden');}
}
async function dl(){
 let url=document.getElementById('url').value.trim(); if(!url) return alert('Paste link');
 res.classList.remove('hidden'); r_cap.innerText='Loading...';
 try{
  let api=`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
  let prox=`https://api.allorigins.win/raw?url=${encodeURIComponent(api)}`;
  let r=await fetch(prox); let j=await r.json();
  let d=j.data; r_img.src=d.cover; r_user.innerText='@'+d.author.unique_id; r_cap.innerText=d.title; r_like.innerText='❤️ '+d.digg_count;
  b1.href=d.play; b3.href=d.music; let tot=parseInt(localStorage.getItem('total')||0)+1; localStorage.setItem('total',tot); o_down.innerText=tot;
 }catch(e){ r_cap.innerText='Gagal, buka di Chrome, jangan di WA preview';}
}
if(localStorage.getItem('av')) avImg.src=localStorage.getItem('av');
check();