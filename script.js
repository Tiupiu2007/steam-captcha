const app=document.getElementById('app');
const statusEl=document.getElementById('security-status');
const saved=Number(localStorage.getItem('hv_level')||'0');
let level=Math.max(0,Math.min(saved,13));
let attempts=Number(localStorage.getItem('hv_attempts')||'0');
const started=Number(localStorage.getItem('hv_started')||Date.now());
if(!localStorage.getItem('hv_started'))localStorage.setItem('hv_started',started);

const levels=[
 {title:'Verifica che sei umano',text:'Prima di continuare, conferma di non essere un robot.',label:'Non sono un robot'},
 {title:'Verifica aggiuntiva richiesta',text:'Il sistema richiede una seconda conferma della tua identità.',label:'Non sono un robot'},
 {title:'Controllo di sicurezza',text:'Per motivi di sicurezza è necessario ripetere la verifica.',label:'Non sono un robot'},
 {title:'Verifica ancora necessaria',text:'La verifica precedente è stata registrata. Procedi con il controllo successivo.',label:'Non sono un robot'},
 {title:'Controllo automatico',text:'Analisi del comportamento in corso. Conferma per continuare.',label:'Non sono un robot'},
 {title:'Verifica avanzata',text:'Il sistema ha bisogno di un ulteriore segnale di attività umana.',label:'Non sono un robot'},
 {title:'Anomalia rilevata',text:'Hai completato la verifica troppo velocemente. Dimostra di essere ancora qui.',label:'Non sono un robot'},
 {title:'Comportamento sospettosamente umano',text:'Il sistema ha rilevato un livello di umanità superiore al previsto.',label:'Non sono un robot'},
 {title:'Analisi dell’utente',text:'Stiamo raccogliendo alcuni dati assolutamente necessari.',stats:true},
 {title:'Controllo cognitivo',text:'Sei arrivato fin qui volontariamente. Questo è già sospetto.',choices:['Perché me lo stai chiedendo?','Non lo so','Voglio il mio regalo']},
 {title:'Verifica della pazienza',text:'Questa verifica non dovrebbe richiedere così tanto tempo.',label:'Continuare comunque'},
 {title:'Ultimo controllo',text:'Grazie per la collaborazione. Probabilmente.',label:'NON SONO UN ROBOT'},
 {title:'Errore di sistema',text:'Impossibile determinare se sei umano. Il controllo continuerà comunque.',label:'Riprova'},
 {final:true}
];

function elapsed(){return Math.max(1,Math.round((Date.now()-started)/1000))}
function save(){localStorage.setItem('hv_level',level);localStorage.setItem('hv_attempts',attempts)}
function advance(){attempts++;level++;save();render()}
function captcha(label,disabled=false){
 return '<div class="captcha"><div class="check-row" id="captcha-click"><span class="checkbox" id="box"></span><span>'+label+'</span></div><div class="recaptcha-logo"><strong>↻</strong>human<br>verification</div></div>';
}
function render(){
 const d=levels[level];
 if(d.final){document.body.classList.add('chaos');statusEl.textContent='VERIFICATION COMPLETE';app.innerHTML='<div class="card final weird"><div class="small">HUMAN VERIFICATION™</div><div class="big">Verifica completata.</div><p>Hai appena passato una quantità completamente inutile di CAPTCHA.</p><div class="secret">IL CAPTCHA ERA IL GIOCO.</div><p>Non dovevi dimostrare di essere umano.<br><b>Dovevi dimostrare che avresti continuato a cliccare.</b></p><p class="small">Il tuo premio non è memorizzato qui. Vai dal proprietario del sito.</p><button class="action" id="again">Ricominciamo? (assolutamente no)</button></div>';document.getElementById('again').onclick=()=>{level=0;attempts=0;save();document.body.classList.remove('chaos');render()};return}
 statusEl.textContent=level<7?'SECURE CONNECTION':level<11?'ADDITIONAL SECURITY CHECK':'SYSTEM ANALYSIS';
 let body='<div class="progress" style="--progress:'+Math.max(8,(level+1)/levels.length*100)+'%"><i></i></div><div class="card '+(level>=9?'weird':'')+'"><div class="small">VERIFICATION '+String(level+1).padStart(2,'0')+'</div><h1>'+d.title+'</h1><p>'+d.text+'</p>';
 if(d.stats)body+='<div class="stats"><div class="stat"><b>'+attempts+'</b><span>TENTATIVI</span></div><div class="stat"><b>'+elapsed()+'s</b><span>TEMPO</span></div><div class="stat"><b>99.8%</b><span>UMANITÀ</span></div></div>'+captcha('Confermo di essere una persona');
 else if(d.choices)body+='<div class="choices">'+d.choices.map((x,i)=>'<button class="choice" data-i="'+i+'">'+x+'</button>').join('')+'</div>';
 else body+=captcha(d.label);
 body+='</div>';app.innerHTML=body;
 if(d.choices)document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>advance());
 else {const c=document.getElementById('captcha-click');c.onclick=()=>{document.getElementById('box').classList.add('done');document.getElementById('box').textContent='✓';setTimeout(advance,250)}}
}
render();