const app=document.getElementById('app');
const statusEl=document.getElementById('security-status');

let level=Number(localStorage.getItem('hv_level')||'0');
let attempts=Number(localStorage.getItem('hv_attempts')||'0');
const started=Number(localStorage.getItem('hv_started')||Date.now());
if(!localStorage.getItem('hv_started'))localStorage.setItem('hv_started',started);

const levels=[
  {type:'captcha',title:'Verifica che sei umano',text:'Prima di continuare, conferma di non essere un robot.',label:'Non sono un robot'},
  {type:'captcha',title:'Verifica aggiuntiva richiesta',text:'Il sistema richiede una seconda conferma della tua identità.',label:'Non sono un robot'},
  {type:'captcha',title:'Controllo di sicurezza',text:'Per motivi di sicurezza è necessario ripetere la verifica.',label:'Non sono un robot'},
  {type:'captcha',title:'Verifica ancora necessaria',text:'La verifica precedente è stata registrata. Procedi con il controllo successivo.',label:'Non sono un robot'},
  {type:'captcha',title:'Controllo automatico',text:'Analisi del comportamento in corso. Conferma per continuare.',label:'Non sono un robot'},
  {type:'captcha',title:'Verifica avanzata',text:'Il sistema ha bisogno di un ulteriore segnale di attività umana.',label:'Non sono un robot'},

  {type:'intermission',title:'ATTENZIONE',text:'Il sistema ha stabilito che sei disposto a fare qualsiasi cosa per ottenere il tuo regalo.',message:'Quindi adesso devi dimostrare di essere degno.',button:'Va bene, dimmi cosa devo fare'},

  {type:'password',title:'Protocollo di umanità',text:'Per continuare devi pronunciare la frase di sicurezza più stupida mai approvata da un essere umano.',phrase:'Sono un tostapane umano e non ho mai letto il README.',hint:'Scrivila ESATTAMENTE così. Sì, purtroppo è necessario.'},

  {type:'captcha',title:'Ottimo.',text:'Non so perché l’hai fatto. Ma hai superato il controllo.',label:'Non sono un robot',weird:true},

  {type:'moving',title:'Verifica dinamica',text:'Il sistema vuole verificare che tu sia in grado di inseguire un pulsante.',label:'NON SONO UN ROBOT'},

  {type:'fake',title:'Controllo dell’intelligenza',text:'Premi il pulsante qui sotto per dimostrare di essere intelligente.',label:'NON PREMERMI',wrong:'Hai premuto il pulsante. Interessante definizione di intelligenza.'},

  {type:'captcha',title:'Analisi comportamentale',text:'Abbiamo registrato la tua scelta precedente.',label:'Non sono un robot',weird:true},

  {type:'choice',title:'Domanda importantissima',text:'Quale di queste azioni compierebbe un vero essere umano?',choices:[
    'Continuare a fare CAPTCHA per una gift card',
    'Chiudere questa pagina e vivere serenamente',
    'Chiedersi perché esiste questa pagina',
    'Tutte le precedenti, ma continuare comunque'
  ]},

  {type:'wait',title:'Verifica della pazienza',text:'Non fare niente. Il sistema sta pensando.',seconds:4},

  {type:'captcha',title:'Il sistema ha cambiato idea',text:'Ok, puoi cliccare.',label:'Clicca qui per favore',weird:true},

  {type:'final'}
];

function elapsed(){return Math.max(1,Math.round((Date.now()-started)/1000))}
function save(){localStorage.setItem('hv_level',level);localStorage.setItem('hv_attempts',attempts)}
function advance(){attempts++;level++;save();render()}
function reset(){level=0;attempts=0;localStorage.removeItem('hv_started');localStorage.setItem('hv_started',Date.now());save();document.body.classList.remove('chaos');render()}

function captcha(label){
  return '<div class="captcha"><div class="check-row" id="captcha-click"><span class="checkbox" id="box"></span><span>'+label+'</span></div><div class="recaptcha-logo"><strong>↻</strong>human<br>verification</div></div>';
}

function render(){
  const d=levels[level];

  if(d.final){
    document.body.classList.add('chaos');
    statusEl.textContent='VERIFICATION COMPLETE';
    app.innerHTML='<div class="card final weird"><div class="small">HUMAN VERIFICATION™</div><div class="big">Verifica completata.</div><p>Hai appena superato una quantità completamente inutile di controlli.</p><div class="secret">IL CAPTCHA ERA IL GIOCO.</div><p>Non dovevi dimostrare di essere umano.<br><b>Dovevi dimostrare che avresti continuato a cliccare.</b></p><p>Il tuo premio non è memorizzato qui.</p><div class="reward">🎁 Vai dal proprietario del sito.<br><strong>La ricompensa ti aspetta lì.</strong></div><button class="action" id="again">Ricominciare sarebbe una pessima idea</button></div>';
    document.getElementById('again').onclick=reset;
    return;
  }

  statusEl.textContent=level<6?'SECURE CONNECTION':level<10?'ADDITIONAL SECURITY CHECK':'SYSTEM ANALYSIS';
  let body='<div class="card '+(d.weird?'weird':'')+'"><div class="small">HUMAN VERIFICATION</div><h1>'+d.title+'</h1><p>'+d.text+'</p>';

  if(d.type==='captcha') body+=captcha(d.label);

  if(d.type==='intermission'){
    body+='<div class="message dramatic">'+d.message+'</div><button class="action" id="continue">'+d.button+'</button>';
  }

  if(d.type==='password'){
    body+='<div class="phrase-box"><code>'+d.phrase+'</code></div><input id="phrase" class="text-input" autocomplete="off" placeholder="Scrivi la frase qui..."><div id="phrase-msg" class="input-msg">'+d.hint+'</div><button class="action" id="submit-phrase">Conferma umanità</button>';
  }

  if(d.type==='moving'){
    body+='<div class="moving-area"><button class="moving-button" id="moving-button">'+d.label+'</button></div>';
  }

  if(d.type==='fake'){
    body+='<button class="action trap" id="trap">'+d.label+'</button><div id="trap-msg"></div>';
  }

  if(d.type==='choice'){
    body+='<div class="choices">'+d.choices.map((x,i)=>'<button class="choice" data-i="'+i+'">'+x+'</button>').join('')+'</div>';
  }

  if(d.type==='wait'){
    body+='<div class="wait-box"><div class="spinner"></div><span id="wait-text">Analisi in corso...</span></div>';
  }

  body+='</div>';
  app.innerHTML=body;

  if(d.type==='captcha'){
    const c=document.getElementById('captcha-click');
    c.onclick=()=>{
      const box=document.getElementById('box');
      box.classList.add('done');box.textContent='✓';
      setTimeout(advance,350);
    };
  }

  if(d.type==='intermission')document.getElementById('continue').onclick=advance;

  if(d.type==='password'){
    const input=document.getElementById('phrase');
    document.getElementById('submit-phrase').onclick=()=>{
      const msg=document.getElementById('phrase-msg');
      if(input.value.trim()===d.phrase){msg.textContent='✓ Frase accettata. Mi vergogno di averla registrata.';msg.className='input-msg success';setTimeout(advance,700)}
      else{msg.textContent='✗ No. Era difficile essere più precisi?';msg.className='input-msg error';input.focus()}
    };
    input.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('submit-phrase').click()});
  }

  if(d.type==='moving'){
    const b=document.getElementById('moving-button');
    let moves=0;
    b.onclick=advance;
    b.addEventListener('mouseenter',()=>{
      if(moves<5){
        moves++;
        b.style.left=(10+Math.random()*75)+'%';
        b.style.top=(10+Math.random()*70)+'%';
      }
    });
  }

  if(d.type==='fake'){
    const b=document.getElementById('trap');
    b.onclick=()=>{
      document.getElementById('trap-msg').textContent=d.wrong;
      b.textContent='...ok, puoi passare';
      setTimeout(advance,1100);
    };
  }

  if(d.type==='choice')document.querySelectorAll('.choice').forEach(b=>b.onclick=advance);

  if(d.type==='wait'){
    let remaining=d.seconds;
    const t=document.getElementById('wait-text');
    const timer=setInterval(()=>{
      remaining--;
      if(remaining>0)t.textContent='Analisi in corso... '+remaining;
      else{clearInterval(timer);t.textContent='Analisi completata. In realtà non stavamo facendo niente.';setTimeout(advance,1000)}
    },1000);
  }
}

if(level>=levels.length)level=0;
render();
