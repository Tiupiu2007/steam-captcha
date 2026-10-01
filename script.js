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

{type:'intermission',title:'ATTENZIONE',text:'Il sistema ha stabilito che sei disposto a fare qualsiasi cosa per ottenere il tuo regalo.',message:'Quindi adesso devi dimostrare di essere degno.',choices:['Sì','No','Forse','Assolutamente sì','Preferirei non rispondere'],correct:0},

{type:'password',title:'Protocollo di umanità',text:'Per continuare devi pronunciare la frase di sicurezza più stupida mai approvata da un essere umano.',phrase:'questo sito è stato fatto da NOOR',hint:'Scrivila ESATTAMENTE così. Sì, purtroppo è necessario.'},
{type:'captcha',title:'Ottimo.',text:'Non so perché l’hai fatto. Ma hai superato il controllo.',label:'Non sono un robot',weird:true},
{type:'moving',title:'Verifica dinamica',text:'Il sistema vuole verificare che tu sia in grado di inseguire un pulsante.',label:'NON SONO UN ROBOT'},
{type:'fake',title:'Controllo dell’intelligenza',text:'Premi il pulsante qui sotto per dimostrare di essere intelligente.',label:'NON PREMERMI',wrong:'Hai premuto il pulsante. Interessante definizione di intelligenza.'},
{type:'captcha',title:'Analisi comportamentale',text:'Abbiamo registrato la tua scelta precedente.',label:'Non sono un robot',weird:true},

{type:'choice',title:'Domanda importantissima',text:'Quale di queste azioni compierebbe un vero essere umano?',choices:['Continuare a fare CAPTCHA senza sapere perché','Chiudere questa pagina e vivere serenamente','Chiedersi perché esiste questa pagina','Tutte le precedenti, ma continuare comunque']},

{type:'wait',title:'Verifica della pazienza',text:'Non fare niente. Il sistema sta pensando.',seconds:4},
{type:'captcha',title:'Il sistema ha cambiato idea',text:'Ok, puoi cliccare.',label:'Clicca qui per favore',weird:true},

{type:'captcha',title:'Controllo 16',text:'Ancora una verifica.',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Controllo 17',text:'Siamo quasi sicuramente sicuri.',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Controllo 18',text:'Grazie per la collaborazione. Crediamo.',label:'Non sono un robot',weird:true},

{type:'intermission',title:'Una domanda',text:'Ma tu... non hai altro da fare?',message:'Hai intenzione di abbandonare questa verifica?',choices:['Sì','No','Forse','Non lo so','Preferisco continuare'],correct:1},

{type:'captcha',title:'Perfetto.',text:'La tua risposta è stata registrata. Il sistema sembra soddisfatto.',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Verifica 21',text:'Questa volta davvero.',label:'NON SONO UN ROBOT',weird:true},
{type:'fake',title:'IMPORTANTE',text:'Non premere il pulsante.',label:'Premimi',wrong:'Grazie. Era esattamente quello che non dovevi fare.'},
{type:'captcha',title:'Conseguenze',text:'A causa della verifica precedente, serve un altro CAPTCHA.',label:'Non sono un robot',weird:true},

{type:'intermission',title:'Domanda a risposta semplice',text:'Il sistema vuole una risposta estremamente chiara.',message:'Vuoi continuare?',choices:['No','No','No','No','NO'],correct:4},

{type:'captcha',title:'Richiesta approvata',text:'Hai scelto di continuare. Non possiamo farci niente.',label:'Non sono un robot',weird:true},

{type:'intermission',title:'PAUSA',text:'Fermati un secondo.',message:'Respira. Guarda fuori dalla finestra. Ricorda che tutto questo è per una verifica di sicurezza.',choices:['Ho bisogno di una pausa','Non mi interessa','Sì','No, continuiamo','Ho fatto una scelta di vita discutibile'],correct:3},

{type:'captcha',title:'Dopo la pausa',text:'Bentornato. Il CAPTCHA ti stava aspettando.',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Verifica 27',text:'Il sistema non ha commenti.',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Verifica 28',text:'Nemmeno noi sappiamo perché.',label:'Non sono un robot',weird:true},
{type:'moving',title:'Ancora lui',text:'Il pulsante ha deciso di non collaborare.',label:'CLICCAMI',weird:true},

{type:'intermission',title:'Avviso del personale',text:'Un tecnico ha chiesto di comunicarti una cosa.',message:'“Basta CAPTCHA.” Il tecnico è stato ignorato dal sistema.',choices:['Ascolto il tecnico','Continuo','Forse ascolto','Non ho mai ascoltato un tecnico','Continuare contro ogni buon senso'],correct:4},

{type:'captcha',title:'Verifica 31',text:'Il tecnico non conta.',label:'Non sono un robot',weird:true},
{type:'fake',title:'Quasi finito',text:'Questa è probabilmente l’ultima verifica.',label:'PROBABILMENTE L’ULTIMO',wrong:'“Probabilmente” non è una garanzia.'},
{type:'captcha',title:'Verifica 33',text:'Era una garanzia pessima.',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Verifica 34',text:'Sei ancora qui.',label:'Non sono un robot',weird:true},

{type:'intermission',title:'Test psicologico definitivo',text:'Cosa stai pensando in questo preciso momento?',message:'Scegli la risposta che descrive meglio la situazione.',choices:['Ma quanto manca?','Voglio sapere quanto manca','Perché ho iniziato?','Tutte e tre contemporaneamente','Non lo so più'],correct:3},

{type:'intermission',title:'Risultato del test',text:'Abbiamo analizzato la tua risposta.',message:'Diagnosi: continui a cliccare.',choices:['Sì','No','Forse','Non è una diagnosi','Accetto il mio destino'],correct:4},

{type:'captcha',title:'Verifica 37',text:'Il tuo destino richiede un CAPTCHA.',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Verifica 38',text:'Sì.',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Verifica 39',text:'Ancora.',label:'Non sono un robot',weird:true},
{type:'wait',title:'Controllo finale finale',text:'Questa volta non scherziamo.',seconds:3},
{type:'captcha',title:'Verifica finale',text:'Errore. Non era quella finale.',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Verifica finale 2',text:'Adesso dovrebbe essere quella finale.',label:'Non sono un robot',weird:true},

{type:'intermission',title:'ULTIMO AVVISO',text:'Il sistema sta diventando stanco.',message:'Anche il server vuole sapere quando finirai.',choices:['Andiamo avanti','No','Forse','Il server può aspettare','Andiamo avanti, ormai'],correct:4},

{type:'captcha',title:'Verifica 44',text:'Il server ringrazia.',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Verifica 45',text:'Non c’è più niente da dire.',label:'Non sono un robot',weird:true},
{type:'fake',title:'ULTIMISSIMO CAPTCHA',text:'Premi e sarà finita.',label:'FALLO FINIRE',wrong:'No. C’era ancora un CAPTCHA.'},
{type:'captcha',title:'Verifica 47',text:'...seriamente?',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Verifica 48',text:'Ok.',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Verifica 49',text:'Basta.',label:'Non sono un robot',weird:true},
{type:'captcha',title:'Verifica 50',text:'Sei arrivato fino a qui. Questa volta clicca.',label:'NON SONO UN ROBOT',weird:true},
{type:'final'}
];

function deviceSummary(){
 const info=[
  'Browser: '+navigator.userAgent.split(' ').pop(),
  'Lingua: '+navigator.language,
  'Sistema: '+(/Windows/i.test(navigator.userAgent)?'Windows':/Mac/i.test(navigator.userAgent)?'macOS':/Linux/i.test(navigator.userAgent)?'Linux':'sistema non identificato'),
  'Risoluzione: '+screen.width+'×'+screen.height,
  'Fuso orario: '+Intl.DateTimeFormat().resolvedOptions().timeZone,
  'CPU logiche dichiarate: '+(navigator.hardwareConcurrency||'non disponibile')
 ];
 return info.join('<br>');
}

function elapsed(){return Math.max(1,Math.round((Date.now()-started)/1000))}
function save(){localStorage.setItem('hv_level',level);localStorage.setItem('hv_attempts',attempts)}
function advance(){attempts++;level++;save();render()}
function reset(){level=0;attempts=0;localStorage.setItem('hv_started',Date.now());save();document.body.classList.remove('chaos');render()}
function captcha(label){
 return '<div class="captcha"><div class="check-row" id="captcha-click"><span class="checkbox" id="box"></span><span>'+label+'</span></div><div class="recaptcha-logo"><strong>↻</strong>human<br>verification</div></div>';
}

function render(){
 const d=levels[level];
 if(!d||d.final){
   document.body.classList.add('chaos');statusEl.textContent='VERIFICATION COMPLETE';
   app.innerHTML='<div class="card final weird"><div class="small">HUMAN VERIFICATION™</div><div class="big">Verifica completata.</div><p>Hai appena superato una quantità completamente inutile di controlli.</p><div class="secret">IL CAPTCHA ERA IL GIOCO.</div><p>Non dovevi dimostrare di essere umano.<br><b>Dovevi dimostrare che avresti continuato a cliccare.</b></p><p>Il tuo premio non è memorizzato qui.</p><div class="reward">🎁 Vai dal proprietario del sito.<br><strong>La ricompensa ti aspetta lì.</strong></div><button class="action" id="again">Ricominciare sarebbe una pessima idea</button></div>';
   document.getElementById('again').onclick=reset;return;
 }
 statusEl.textContent=level<6?'SECURE CONNECTION':level<20?'ADDITIONAL SECURITY CHECK':'SYSTEM ANALYSIS';
 let body='<div class="card '+(d.weird?'weird':'')+'"><div class="small">HUMAN VERIFICATION</div><h1>'+d.title+'</h1><p>'+d.text+'</p>';
 if(d.type==='captcha')body+=captcha(d.label);
 if(d.type==='intermission'){
   body+='<div class="message dramatic">'+d.message+'</div>';
   if(d.choices){
     body+='<div class="choices">'+d.choices.map((x,i)=>'<button class="choice" data-i="'+i+'">'+x+'</button>').join('')+'</div>';
   }else{
     body+='<button class="action" id="continue">'+d.button+'</button>';
   }
 }
 if(d.type==='password')body+='<div class="phrase-box"><code>'+d.phrase+'</code></div><input id="phrase" class="text-input" autocomplete="off" placeholder="Scrivi la frase qui..."><div id="phrase-msg" class="input-msg">'+d.hint+'</div><button class="action" id="submit-phrase">Conferma umanità</button>';
 if(d.type==='moving')body+='<div class="moving-area"><button class="moving-button" id="moving-button">'+d.label+'</button></div>';
 if(d.type==='fake')body+='<button class="action trap" id="trap">'+d.label+'</button><div id="trap-msg"></div>';
 if(d.type==='choice')body+='<div class="choices">'+d.choices.map((x,i)=>'<button class="choice" data-i="'+i+'">'+x+'</button>').join('')+'</div>';
 if(d.type==='wait')body+='<div class="wait-box"><div class="spinner"></div><span id="wait-text">Analisi in corso...</span></div>';
 body+='</div>';app.innerHTML=body;
 if(d.type==='captcha'){document.getElementById('captcha-click').onclick=()=>{document.getElementById('box').classList.add('done');document.getElementById('box').textContent='✓';setTimeout(advance,300)}}
 if(d.type==='intermission'){
   if(d.choices){
     document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{
       const selected=Number(b.dataset.i);
       if(selected===d.correct){
         b.classList.add('selected');
         setTimeout(advance,250);
       }else{
         b.textContent='✗ Risposta rifiutata';
         b.disabled=true;
       }
     });
   }else{
     document.getElementById('continue').onclick=advance;
   }
 }
 if(d.type==='password'){
  const input=document.getElementById('phrase');document.getElementById('submit-phrase').onclick=()=>{
   const msg=document.getElementById('phrase-msg');
   if(input.value.trim()===d.phrase){msg.textContent='✓ Frase accettata. Mi vergogno di averla registrata.';msg.className='input-msg success';setTimeout(advance,650)}
   else{msg.textContent='✗ No. Era difficile essere più precisi?';msg.className='input-msg error';input.focus()}
  };input.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('submit-phrase').click()})
 }
 if(d.type==='moving'){
  const b=document.getElementById('moving-button');let moves=0;b.onclick=advance;
  b.addEventListener('mouseenter',()=>{if(moves<5){moves++;b.style.left=(10+Math.random()*75)+'%';b.style.top=(10+Math.random()*70)+'%'}})
 }
 if(d.type==='fake'){document.getElementById('trap').onclick=()=>{document.getElementById('trap-msg').textContent=d.wrong;document.getElementById('trap').textContent='...ok, puoi passare';setTimeout(advance,950)}}
 if(d.type==='choice')document.querySelectorAll('.choice').forEach(b=>b.onclick=advance);
 if(d.type==='wait'){
  let remaining=d.seconds;const t=document.getElementById('wait-text');
  const timer=setInterval(()=>{remaining--;if(remaining>0)t.textContent='Analisi in corso... '+remaining;else{clearInterval(timer);t.textContent='Analisi completata. In realtà non stavamo facendo niente.';setTimeout(advance,900)}},1000)
 }
}
if(level>=levels.length)level=0;
render();