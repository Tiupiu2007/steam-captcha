const app=document.getElementById('app');
const statusEl=document.getElementById('security-status');

let level=0;
let attempts=0;
let renderToken=0;
let advancing=false;
const started=Date.now();

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
{type:'fake',title:'Controllo dell’intelligenza',text:'Premi il pulsante qui sotto per dimostrare di non essere intelligente.',label:'PREMERMI',wrong:'Hai premuto il pulsante. Interessante definizione di intelligenza.'},
{type:'classify',title:'Verifica hardware',text:'Dimostra di saper distinguere un tostapane da un computer.',items:[['🍞','TOSTAPANE'],['💻','COMPUTER']],correct:1,weird:true},

{type:'choice',title:'Domanda importantissima',text:'Quale di queste azioni compierebbe un vero essere umano?',choices:['Continuare a fare CAPTCHA senza sapere perché','Chiudere questa pagina e vivere serenamente','Chiedersi perché esiste questa pagina','Tutte le precedenti, ma continuare comunque']},

{type:'wait',title:'Verifica della pazienza',text:'Non fare niente. Il sistema sta pensando.',seconds:4},
{type:'captcha',title:'Il sistema ha cambiato idea',text:'Ok, puoi cliccare.',label:'Clicca qui per favore',weird:true},

{type:'mini',game:'tapstorm',title:'Controllo di pazienza',text:'Tocca il pulsante cinque volte. Ogni volta cambierà idea.',weird:true},
{type:'mini',game:'sort',title:'Controllo dell’ordine',text:'Metti gli oggetti in ordine dal più leggero al più pesante.',weird:true},
{type:'mini',game:'math',title:'Controllo matematico',text:'Una domanda di matematica assolutamente necessaria.',weird:true},

{type:'intermission',title:'Una domanda',text:'Ma tu... non hai altro da fare?',message:'Hai intenzione di abbandonare questa verifica?',choices:['Sì','No','Forse','Non lo so','Preferisco continuare'],correct:1},

{type:'target',title:'Verifica di precisione',text:'Tocca tutti i bersagli prima che il sistema perda la pazienza.',count:4,weird:true},
{type:'mini',game:'battery',title:'Controllo energetico',text:'Il sistema ha perso energia. Riattiva il collegamento corretto.',weird:true},
{type:'fake',title:'IMPORTANTE',text:'Non premere il pulsante.',label:'Premimi',wrong:'Grazie. Era esattamente quello che non dovevi fare.'},
{type:'captcha',title:'Conseguenze',text:'A causa della verifica precedente, serve un altro CAPTCHA.',label:'Non sono un robot',weird:true},

{type:'intermission',title:'Domanda a risposta semplice',text:'Il sistema vuole una risposta estremamente chiara.',message:'Vuoi continuare?',choices:['No','No','No','No','NO'],correct:4},

{type:'captcha',title:'Richiesta approvata',text:'Hai scelto di continuare. Non possiamo farci niente.',label:'Non sono un robot',weird:true},

{type:'intermission',title:'PAUSA',text:'Fermati un secondo.',message:'Respira. Guarda fuori dalla finestra. Ricorda che tutto questo è per una verifica di sicurezza.',choices:['Ho bisogno di una pausa','Non mi interessa','Sì','No, continuiamo','Ho fatto una scelta di vita discutibile'],correct:3},

{type:'captcha',title:'Dopo la pausa',text:'Bentornato. Il CAPTCHA ti stava aspettando.',label:'Non sono un robot',weird:true},
{type:'mini',game:'catch',title:'Controllo meteorologico',text:'Tocca tutte le gocce prima che spariscano.',weird:true},
{type:'memory',title:'Verifica della memoria',text:'Memorizza la sequenza. Il sistema non accetta scuse.',weird:true},
{type:'moving',title:'Ancora lui',text:'Il pulsante ha deciso di non collaborare.',label:'CLICCAMI',weird:true},

{type:'intermission',title:'Avviso del personale',text:'Un tecnico ha chiesto di comunicarti una cosa.',message:'“Basta CAPTCHA.” Il tecnico è stato ignorato dal sistema.',choices:['Ascolto il tecnico','Continuo','Forse ascolto','Non ho mai ascoltato un tecnico','Continuare contro ogni buon senso'],correct:4},

{type:'mini',game:'switches',title:'Controllo degli interruttori',text:'Imposta gli interruttori esattamente come richiesto.',weird:true},
{type:'fake',title:'Quasi finito',text:'Questa è probabilmente l’ultima verifica.',label:'PROBABILMENTE L’ULTIMO',wrong:'“Probabilmente” non è una garanzia.'},
{type:'mini',game:'balance',title:'Controllo dell’equilibrio',text:'Quale lato pesa di più? Il sistema vuole una risposta.',weird:true},
{type:'mini',game:'word',title:'Controllo linguistico',text:'Trova la parola che non c’entra niente.',weird:true},

{type:'intermission',title:'Test psicologico definitivo',text:'Cosa stai pensando in questo preciso momento?',message:'Scegli la risposta che descrive meglio la situazione.',choices:['Ma quanto manca?','Voglio sapere quanto manca','Perché ho iniziato?','Tutte e tre contemporaneamente','Non lo so più'],correct:3},

{type:'intermission',title:'Risultato del test',text:'Abbiamo analizzato la tua risposta.',message:'Diagnosi: continui a cliccare.',choices:['Sì','No','Forse','Non è una diagnosi','Accetto il mio destino'],correct:4},

{type:'mini',game:'maze',title:'Controllo di navigazione',text:'Porta il punto blu fino all’uscita usando i pulsanti.',weird:true},
{type:'mini',game:'slider',title:'Controllo di precisione',text:'Porta il cursore esattamente nella zona indicata.',weird:true},
{type:'reaction',title:'Verifica dei riflessi',text:'Aspetta che il riquadro diventi verde, poi toccalo immediatamente.',weird:true},
{type:'wait',title:'Controllo finale finale',text:'Questa volta non scherziamo.',seconds:3},
{type:'captcha',title:'Verifica finale',text:'Errore. Non era quella finale.',label:'Non sono un robot',weird:true},
{type:'mini',game:'lights',title:'Controllo delle luci',text:'Spegni tutte le luci. Nessuna domanda sul perché.',weird:true},

{type:'intermission',title:'ULTIMO AVVISO',text:'Il sistema sta diventando stanco.',message:'Anche il server vuole sapere quando finirai.',choices:['Andiamo avanti','No','Forse','Il server può aspettare','Andiamo avanti, ormai'],correct:4},

{type:'mini',game:'cups',title:'Controllo dei bicchieri',text:'Segui il bicchiere con la pallina. Il sistema giura di non barare.',weird:true},
{type:'mini',game:'riddle',title:'Controllo del buonsenso',text:'Risolvi l’enigma più inutile della giornata.',weird:true},
{type:'fake',title:'ULTIMISSIMO CAPTCHA',text:'Premi e sarà finita.',label:'FALLO FINIRE',wrong:'No. C’era ancora un CAPTCHA.'},
{type:'mini',game:'drag',title:'Controllo della consegna',text:'Trascina la chiave nella serratura. Anche il dito va bene.',weird:true},
{type:'odd',title:'Analisi visiva',text:'Una casella non appartiene alle altre. Trovala.',weird:true},
{type:'mini',game:'safe',title:'Controllo della cassaforte',text:'Gira la manopola fino alla combinazione indicata.',weird:true},
{type:'mini',game:'wires',title:'Controllo dei cavi',text:'Collega il cavo alla presa dello stesso colore.',weird:true},
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
function save(){}
function advance(token){
 if(token!==undefined && token!==renderToken)return;
 if(advancing)return;
 advancing=true;
 attempts++;level++;save();render()
}
function reset(){level=0;attempts=0;document.body.classList.remove('chaos');render()}
function captcha(label){
 return '<div class="captcha"><div class="check-row" id="captcha-click"><span class="checkbox" id="box"></span><span>'+label+'</span></div><div class="recaptcha-logo"><strong>↻</strong>human<br>verification</div></div>';
}

const dialogueLines=[
 'آج موسم کافی عجیب ہے۔',
 'مجھے نہیں معلوم یہ یہاں کیوں لکھا ہے۔',
 'کیا تم نے چائے پی ہے؟',
 'یہ بٹن شاید کچھ نہیں کرتا۔',
 'نظام نے کہا ہے کہ سب ٹھیک ہے۔',
 'ایک منٹ، میں یہ حساب دوبارہ کرتا ہوں۔',
 'یہ جگہ کافی خاموش ہے۔',
 'مجھے لگتا ہے کسی نے دروازہ کھلا چھوڑ دیا ہے۔',
 'کیا تمہیں بھی یہ آواز سنائی دے رہی ہے؟',
 'یہ ٹیسٹ بہت سنجیدہ لگ رہا ہے۔ شاید۔',
 'مجھے ابھی ایک بہت ضروری بات یاد آئی۔',
 'کمرے میں ایک بلی ہونی چاہیے۔',
 'یہ نمبر کہاں سے آیا؟',
 'براہ کرم کچھ دیر انتظار کریں۔',
 'میں خود بھی نہیں جانتا کہ ہم کیا کر رہے ہیں۔',
 'آج چائے کچھ زیادہ گرم تھی۔',
 'کیا کمپیوٹر کو بھی آرام کی ضرورت ہوتی ہے؟',
 'یہ سب کچھ معمول کے مطابق ہے۔',
 'مجھے شک ہے کہ یہ معمول ہے۔',
 'اچھا، اب ہم دوبارہ شروع کرتے ہیں۔',
 'یہاں کچھ عجیب ضرور ہے۔',
 'میں نے شاید غلط فائل کھول لی ہے۔',
 'تم ابھی تک یہاں ہو؟ دلچسپ۔',
 'کسی نے کہا تھا کہ جلدی نہ کرو۔',
 'یہ جملہ بالکل بے ترتیب ہے۔',
 'مجھے نہیں معلوم اگلا کیا ہوگا۔',
 'کیا تم نے کبھی سوچا ہے کہ پینگوئن کہاں رہتے ہیں؟',
 'نظام فی الحال مصروف ہے۔',
 'ایک چھوٹا سا مسئلہ ہے، لیکن فکر نہ کرو۔',
 'یہ سب بہت پراسرار ہو گیا ہے۔',
 'میں نے کچھ نہیں کہا۔',
 'کیا ہم بس ایسے ہی چلتے رہیں گے؟',
 'آج کا دن کافی لمبا ہے۔',
 'مجھے لگتا ہے سرور سو رہا ہے۔',
 'یہاں کوئی منطق تلاش نہ کرو۔',
 'ایک لمحہ، میں واپس آتا ہوں۔',
 'کیا یہ واقعی ضروری تھا؟',
 'مجھے ایک عجیب سا خیال آیا ہے۔',
 'سب کچھ ٹھیک ہے، غالباً۔',
 'یہ آخری جملہ نہیں ہے۔',
 'اب شاید کچھ دلچسپ ہونے والا ہے۔',
 'میں صرف دیکھ رہا ہوں کہ کیا ہوتا ہے۔',
 'یہاں بہت خاموشی ہے۔',
 'اچھا، پھر آگے بڑھتے ہیں۔',
 'مجھے امید ہے تمہیں یہ عجیب نہیں لگ رہا۔',
 'نظام نے دوبارہ سوچنا شروع کر دیا ہے۔',
 'یہ بات بعد میں سمجھ آئے گی۔',
 'کچھ بھی ہو سکتا ہے۔',
 'میں نے اس حصے کی منصوبہ بندی نہیں کی تھی۔',
 'ٹھیک ہے، اب بس چلتے ہیں۔',
 'مجھے لگتا ہے ہم قریب ہیں۔',
 'یا شاید نہیں۔',
 'خیر، اگلا دیکھتے ہیں۔',
 'io non capisce cosa succede qui',
 'tu cliccare ancora, molto strano',
 'sistema avere problema piccolo',
 'io penso questo non normale',
 'perche tu ancora qui?',
 'aspetta io controlla cosa fare',
 'questa pagina fare cose strane',
 'io non sapere italiano bene',
 'tu essere molto paziente',
 'forse verifica essere troppo lunga',
 'non fare domanda, sistema confuso',
 'io vedere pulsante, tu clicca',
 'questo essere ultimo? io non sicuro',
 'io avere idea ma idea non buona',
 'server non vuole parlare con me',
 'tu continua, io guarda soltanto',
 'molto bene, noi andare avanti',
 'io credo finire presto, forse',
 'questa cosa non avere senso',
 'tu essere umano? io non sapere'
];
function dialogueFor(){return dialogueLines[Math.floor(Math.random()*dialogueLines.length)];}

function miniMarkup(d){
 const g=d.game;
 if(g==='tapstorm')return '<div class="mini-panel"><button class="big-mini-button" id="tapstorm">TOCCA</button><div id="mini-msg" class="mini-msg">0 / 5</div></div>';
 if(g==='sort')return '<div class="sort-game" id="sort-game"></div><div id="mini-msg" class="mini-msg">Parti dal più leggero.</div>';
 if(g==='math')return '<div class="math-card"><strong>7 + 6 − 4 = ?</strong><div class="math-options" id="math-options"><button data-a="8">8</button><button data-a="9">9</button><button data-a="10">10</button></div></div><div id="mini-msg" class="mini-msg"></div>';
 if(g==='battery')return '<div class="battery-game"><div class="battery-icon">🔋</div><div class="battery-poles"><button data-p="minus">−</button><button data-p="plus">+</button></div><div id="mini-msg" class="mini-msg">Tocca − poi +.</div></div>';
 if(g==='catch')return '<div class="catch-game" id="catch-game"></div><div id="mini-msg" class="mini-msg">0 / 6</div>';
 if(g==='switches')return '<div class="switch-game" id="switch-game"></div><div id="mini-msg" class="mini-msg">Deve diventare: ON · OFF · ON · OFF</div>';
 if(g==='balance')return '<div class="balance-game"><div class="weights"><span>🍉 × 2</span><b>VS</b><span>🍎 × 7</span></div><div class="balance-buttons"><button data-a="left">SINISTRA</button><button data-a="right">DESTRA</button></div></div><div id="mini-msg" class="mini-msg"></div>';
 if(g==='word')return '<div class="word-game" id="word-game"></div><div id="mini-msg" class="mini-msg">Una parola è fuori posto.</div>';
 if(g==='maze')return '<div class="maze-game"><div id="maze-board" class="maze-board"></div><div class="maze-controls"><button data-m="up">▲</button><div><button data-m="left">◀</button><button data-m="down">▼</button><button data-m="right">▶</button></div></div></div><div id="mini-msg" class="mini-msg">Porta ● fino a ★.</div>';
 if(g==='slider')return '<div class="slider-game"><div class="slider-value">73%</div><input id="precision-slider" type="range" min="0" max="100" value="0"><button class="action" id="slider-ok">CONFERMA</button></div><div id="mini-msg" class="mini-msg">Imposta esattamente 73%.</div>';
 if(g==='lights')return '<div class="lights-game" id="lights-game"></div><div id="mini-msg" class="mini-msg">Spegni tutto.</div>';
 if(g==='cups')return '<div class="cups-game" id="cups-game"></div><div id="mini-msg" class="mini-msg">La pallina è sotto un bicchiere.</div>';
 if(g==='riddle')return '<div class="riddle-game"><div class="riddle">Cosa ha quattro gambe ma non cammina?</div><div class="riddle-options" id="riddle-options"><button data-a="sedia">Una sedia</button><button data-a="cane">Un cane</button><button data-a="robot">Un robot</button></div></div><div id="mini-msg" class="mini-msg"></div>';
 if(g==='drag')return '<div class="drag-game"><div id="key-drag" class="drag-item">🔑</div><div id="lock-drop" class="lock-drop">🔒</div></div><div id="mini-msg" class="mini-msg">Porta la chiave nella serratura.</div>';
 if(g==='safe')return '<div class="safe-game"><div class="safe-dial" id="safe-dial">0</div><div class="safe-buttons"><button data-d="-">−</button><button data-d="+">+</button></div><div class="safe-code">Codice: 3 → 1 → 7</div></div><div id="mini-msg" class="mini-msg">Raggiungi 3, poi 1, poi 7.</div>';
 if(g==='wires')return '<div class="wires-game" id="wires-game"></div><div id="mini-msg" class="mini-msg">Tocca prima un cavo, poi la presa dello stesso colore.</div>';
 return '';
}

function render(){
 const token=++renderToken;
 advancing=false;
 const d=levels[level];
 if(!d||d.final){
   document.body.classList.add('chaos');statusEl.textContent='VERIFICATION COMPLETE';
   app.innerHTML='<div class="card final weird"><div class="small">HUMAN VERIFICATION™</div><div class="big">Verifica completata.</div><p>Hai appena superato una quantità completamente inutile di controlli.</p><div class="secret">IL CAPTCHA ERA IL GIOCO.</div><p>Non dovevi dimostrare di essere umano.<br><b>Dovevi dimostrare che avresti continuato a cliccare.</b></p><p>Il tuo premio non è memorizzato qui.</p><div class="reward">🎁 Vai dal proprietario del sito.<br><strong>La ricompensa ti aspetta lì.</strong></div><button class="action" id="again">Ricominciare sarebbe una pessima idea</button></div>';
   document.getElementById('again').onclick=reset;return;
 }
 statusEl.textContent=level<6?'SECURE CONNECTION':level<20?'ADDITIONAL SECURITY CHECK':'SYSTEM ANALYSIS';
 let body='<div class="card '+(d.weird?'weird':'')+'"><div class="talk-box"><div class="talk-name">NOOR</div><div id="talk-text"></div></div><div class="small">HUMAN VERIFICATION</div><h1>'+d.title+'</h1><p>'+d.text+'</p>';
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
 if(d.type==='classify')body+='<div class="mini-game classify-game">'+d.items.map((x,i)=>'<button class="mini-card" data-i="'+i+'"><span class="mini-icon">'+x[0]+'</span><span>'+x[1]+'</span></button>').join('')+'</div><div id="mini-msg" class="mini-msg">Seleziona quello corretto.</div>';
 if(d.type==='target')body+='<div class="target-game"><div class="target-area" id="target-area"></div><div class="mini-progress" id="target-progress">0 / '+d.count+'</div></div>';
 if(d.type==='memory')body+='<div class="memory-game" id="memory-game"></div><div id="memory-msg" class="mini-msg">Osserva la sequenza...</div>';
 if(d.type==='reaction')body+='<button class="reaction-game" id="reaction-game">ATTENDI...</button><div id="reaction-msg" class="mini-msg">Il sistema sta aspettando.</div>';
 if(d.type==='odd')body+='<div class="odd-game" id="odd-game"></div><div id="odd-msg" class="mini-msg">Trova quello diverso.</div>';
 if(d.type==='mini')body+=miniMarkup(d);
 body+='</div>';app.innerHTML=body;
 const talk=document.getElementById('talk-text');if(talk){const txt=dialogueFor(level);let ti=0;talk.textContent='';const typer=setInterval(()=>{talk.textContent+=txt[ti++]||'';if(ti>=txt.length)clearInterval(typer)},24);}

 if(d.type==='captcha'){document.getElementById('captcha-click').onclick=()=>{document.getElementById('box').classList.add('done');document.getElementById('box').textContent='✓';setTimeout(()=>advance(token),300)}}
 if(d.type==='intermission'){
   if(d.choices){
     document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{
       const selected=Number(b.dataset.i);
       if(selected===d.correct){
         b.classList.add('selected');
         setTimeout(()=>advance(token),250);
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
   if(input.value.trim()===d.phrase){msg.textContent='✓ Frase accettata. Mi vergogno di averla registrata.';msg.className='input-msg success';setTimeout(()=>advance(token),650)}
   else{msg.textContent='✗ No. Era difficile essere più precisi?';msg.className='input-msg error';input.focus()}
  };input.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('submit-phrase').click()})
 }
 if(d.type==='moving'){
  const b=document.getElementById('moving-button');let moves=0;
  const move=()=>{if(moves<5){moves++;b.style.left=(10+Math.random()*75)+'%';b.style.top=(10+Math.random()*70)+'%'}else{b.onclick=advance}};
  b.addEventListener('mouseenter',move);
  b.addEventListener('touchstart',e=>{if(moves<5){e.preventDefault();move()}else{e.preventDefault();advance(token)}},{passive:false});
  b.onclick=()=>{if(moves>=5)advance()};
 }
 if(d.type==='fake'){document.getElementById('trap').onclick=()=>{document.getElementById('trap-msg').textContent=d.wrong;document.getElementById('trap').textContent='...ok, puoi passare';setTimeout(()=>advance(token),950)}}
 if(d.type==='choice')document.querySelectorAll('.choice').forEach(b=>b.onclick=advance);
 if(d.type==='classify'){
  document.querySelectorAll('.mini-card').forEach(b=>b.onclick=()=>{
    const selected=Number(b.dataset.i),msg=document.getElementById('mini-msg');
    if(selected===d.correct){b.classList.add('correct');msg.textContent='✓ Identificazione corretta. Era un tostapane. Cioè, un computer. Il sistema è soddisfatto.';setTimeout(()=>advance(token),650)}
    else{b.classList.add('wrong');b.disabled=true;msg.textContent='✗ No. Questo è chiaramente un tostapane. O un computer. Riprova.'}
  });
 }
 if(d.type==='target'){
  const area=document.getElementById('target-area'),progress=document.getElementById('target-progress');let hit=0;
  const spawn=()=>{
    const t=document.createElement('button');t.className='target';t.textContent='×';
    t.style.left=(8+Math.random()*76)+'%';t.style.top=(8+Math.random()*76)+'%';
    t.onclick=()=>{hit++;t.remove();progress.textContent=hit+' / '+d.count;if(hit<d.count)spawn();else{progress.textContent='✓ Verifica superata';setTimeout(()=>advance(token),500)}};
    area.appendChild(t);
  };
  for(let i=0;i<2;i++)spawn();
 }
 if(d.type==='memory'){
  const grid=document.getElementById('memory-game'),msg=document.getElementById('memory-msg');let sequence=[],step=0,locked=true;
  const cells=Array.from({length:9},(_,i)=>{const b=document.createElement('button');b.className='memory-cell';b.dataset.i=i;b.textContent='';grid.appendChild(b);return b});
  while(sequence.length<4){const n=Math.floor(Math.random()*9);if(!sequence.includes(n))sequence.push(n)}
  sequence.forEach((n,i)=>setTimeout(()=>{cells[n].classList.add('show');setTimeout(()=>cells[n].classList.remove('show'),420)},i*650));
  setTimeout(()=>{locked=false;msg.textContent='Ora ripeti la sequenza.'},sequence.length*650+500);
  cells.forEach(b=>b.onclick=()=>{if(locked)return;const i=Number(b.dataset.i);if(i===sequence[step]){b.classList.add('good');step++;if(step===sequence.length){msg.textContent='✓ Memoria confermata. Inutile, ma impressionante.';setTimeout(()=>advance(token),650)}}else{step=0;msg.textContent='✗ Sequenza errata. Riparti da capo.';cells.forEach(x=>x.classList.remove('good'))}});
 }
 if(d.type==='reaction'){
  const b=document.getElementById('reaction-game'),msg=document.getElementById('reaction-msg');let active=false,done=false;
  b.onclick=()=>{if(!active||done){if(!active)msg.textContent='✗ Troppo presto. Anche il nulla richiede pazienza.';return}done=true;b.textContent='✓ PRESO';msg.textContent='Reazione registrata.';setTimeout(()=>advance(token),650)};
  const delay=1800+Math.random()*2500;
  setTimeout(()=>{active=true;b.textContent='CLICCA ORA';msg.textContent='ADESSO.';b.classList.add('ready')},delay);
 }
 if(d.type==='odd'){
  const grid=document.getElementById('odd-game'),msg=document.getElementById('odd-msg');const odd=Math.floor(Math.random()*9);
  for(let i=0;i<9;i++){const b=document.createElement('button');b.className='odd-cell';b.textContent=i===odd?'🔧':'🔩';b.onclick=()=>{if(i===odd){b.classList.add('correct');msg.textContent='✓ Elemento anomalo identificato.';setTimeout(()=>advance(token),600)}else{b.classList.add('wrong');msg.textContent='✗ No. Quello era perfettamente normale.'}};grid.appendChild(b)}
 }

 if(d.type==='mini'){
  const msg=document.getElementById('mini-msg'),g=d.game;
  if(g==='tapstorm'){let n=0;const b=document.getElementById('tapstorm');b.onclick=()=>{n++;b.textContent=['TOCCA','ANCORA','SICURO?','DAVVERO?','ULTIMO?'][Math.min(n,4)];msg.textContent=n+' / 5';if(n>=5){b.textContent='✓ OK';setTimeout(()=>advance(token),500)}}}
  if(g==='sort'){const items=[['🪶','PIUMA',1],['📱','TELEFONO',2],['🧱','MATTONE',3]],box=document.getElementById('sort-game');let n=1;items.sort(()=>Math.random()-.5);items.forEach(x=>{const b=document.createElement('button');b.className='sort-item';b.innerHTML='<span>'+x[0]+'</span>'+x[1];b.onclick=()=>{if(x[2]===n){b.classList.add('picked');n++;if(n===4){msg.textContent='✓ Ordine corretto.';setTimeout(()=>advance(token),550)}}else{msg.textContent='✗ Troppo presto. Guarda il peso.'}};box.appendChild(b)})}
  if(g==='math'){document.querySelectorAll('#math-options button').forEach(b=>b.onclick=()=>{const msg=document.getElementById('mini-msg');if(b.dataset.a==='9'){b.classList.add('picked');msg.textContent='✓ Matematica accettata.';setTimeout(()=>advance(token),550)}else{b.classList.add('bad');msg.textContent='✗ No. Il sistema ti giudica.'}})}
  if(g==='battery'){let seq=[];document.querySelectorAll('.battery-poles button').forEach(b=>b.onclick=()=>{seq.push(b.dataset.p);if(seq.length===1&&seq[0]==='minus')msg.textContent='Bene. Ora +.';else if(seq.length===2&&seq.join(',')==='minus,plus'){msg.textContent='✓ Energia ripristinata.';setTimeout(()=>advance(token),550)}else{seq=[];msg.textContent='✗ Hai collegato tutto al contrario. Riprova.'}})}
  if(g==='catch'){const area=document.getElementById('catch-game');let n=0;const spawn=()=>{const b=document.createElement('button');b.className='raindrop';b.textContent='💧';b.style.left=(8+Math.random()*80)+'%';b.style.top=(8+Math.random()*76)+'%';b.onclick=()=>{n++;b.remove();msg.textContent=n+' / 6';if(n<6)spawn();else{msg.textContent='✓ Pioggia terminata.';setTimeout(()=>advance(token),500)}};area.appendChild(b)};spawn();spawn()}
  if(g==='switches'){const box=document.getElementById('switch-game'),state=[0,0,0,0];[0,1,0,1].forEach((_,i)=>{const b=document.createElement('button');b.className='switch';b.textContent='OFF';b.onclick=()=>{state[i]^=1;b.textContent=state[i]?'ON':'OFF';if(state.join(',')==='1,0,1,0'){msg.textContent='✓ Configurazione corretta.';setTimeout(()=>advance(token),550)}};box.appendChild(b)})}
  if(g==='balance'){document.querySelectorAll('.balance-buttons button').forEach(b=>b.onclick=()=>{if(b.dataset.a==='right'){msg.textContent='✓ Destra pesa di più.';setTimeout(()=>advance(token),550)}else msg.textContent='✗ La sinistra sta chiaramente mentendo.'})}
  if(g==='word'){const words=['BANANA','MELA','PERA','SERVER'];const box=document.getElementById('word-game');words.sort(()=>Math.random()-.5);words.forEach(w=>{const b=document.createElement('button');b.className='word-item';b.textContent=w;b.onclick=()=>{if(w==='SERVER'){b.classList.add('picked');msg.textContent='✓ Hai trovato l’intruso.';setTimeout(()=>advance(token),550)}else msg.textContent='✗ Quella è frutta. Riprova.'};box.appendChild(b)})}
  if(g==='maze'){const board=document.getElementById('maze-board');let x=0,y=0;const draw=()=>{board.innerHTML='';for(let j=0;j<4;j++)for(let i=0;i<4;i++){const c=document.createElement('div');c.className='maze-cell';c.textContent=(i===x&&j===y)?'●':(i===3&&j===3)?'★':'';board.appendChild(c)}};draw();document.querySelectorAll('.maze-controls button').forEach(b=>b.onclick=()=>{const m=b.dataset.m;if(m==='up')y=Math.max(0,y-1);if(m==='down')y=Math.min(3,y+1);if(m==='left')x=Math.max(0,x-1);if(m==='right')x=Math.min(3,x+1);draw();if(x===3&&y===3){msg.textContent='✓ Uscita raggiunta.';setTimeout(()=>advance(token),550)}})}
  if(g==='slider'){const sl=document.getElementById('precision-slider'),val=document.querySelector('.slider-value');sl.oninput=()=>val.textContent=sl.value+'%';document.getElementById('slider-ok').onclick=()=>{if(Number(sl.value)===73){msg.textContent='✓ Precisione perfetta.';setTimeout(()=>advance(token),550)}else msg.textContent='✗ 73%. Non 72. Non 74.'}}
  if(g==='lights'){const box=document.getElementById('lights-game'),state=Array(6).fill(1);for(let i=0;i<6;i++){const b=document.createElement('button');b.className='light on';b.textContent='💡';b.onclick=()=>{state[i]^=1;b.classList.toggle('on');b.textContent=state[i]?'💡':'⚫';if(!state.includes(1)){msg.textContent='✓ Buio totale. Ottimo.';setTimeout(()=>advance(token),550)}};box.appendChild(b)}}
  if(g==='cups'){const box=document.getElementById('cups-game');let ball=Math.floor(Math.random()*3);for(let i=0;i<3;i++){const b=document.createElement('button');b.className='cup';b.textContent='🥤';b.dataset.i=i;b.onclick=()=>{if(Number(b.dataset.i)===ball){b.textContent='🥤🔴';msg.textContent='✓ Trovata.';setTimeout(()=>advance(token),650)}else{b.textContent='🥤';msg.textContent='✗ No. La pallina non era lì.'}};box.appendChild(b)}setTimeout(()=>{msg.textContent='Mescola... fatto. Scegli.'},700)}
  if(g==='riddle'){document.querySelectorAll('#riddle-options button').forEach(b=>b.onclick=()=>{if(b.dataset.a==='sedia'){msg.textContent='✓ Risposta accettata.';setTimeout(()=>advance(token),550)}else msg.textContent='✗ No. Le altre opzioni non hanno quattro gambe utili.'})}
  if(g==='drag'){const item=document.getElementById('key-drag'),drop=document.getElementById('lock-drop');let dragging=false;const start=e=>{dragging=true;e.preventDefault()};const move=e=>{if(!dragging)return;const p=e.touches?e.touches[0]:e;item.style.left=(p.clientX-item.parentElement.getBoundingClientRect().left-25)+'px';item.style.top=(p.clientY-item.parentElement.getBoundingClientRect().top-25)+'px'};const end=()=>{if(!dragging)return;dragging=false;const a=item.getBoundingClientRect(),b=drop.getBoundingClientRect();if(!(a.right<b.left||a.left>b.right||a.bottom<b.top||a.top>b.bottom)){msg.textContent='✓ Serratura aperta.';setTimeout(()=>advance(token),550)}else{item.style.left='18px';item.style.top='50%';msg.textContent='✗ Quasi. Portala nella serratura.'}};item.addEventListener('mousedown',start);item.addEventListener('touchstart',start,{passive:false});window.addEventListener('mousemove',move);window.addEventListener('touchmove',move,{passive:false});window.addEventListener('mouseup',end);window.addEventListener('touchend',end)}
  if(g==='safe'){let current=0,step=0;document.querySelectorAll('.safe-buttons button').forEach(b=>b.onclick=()=>{current=(current+(b.dataset.d==='+'?1:9))%10;document.getElementById('safe-dial').textContent=current;if([3,1,7][step]===current){step++;if(step===3){msg.textContent='✓ Cassaforte aperta.';setTimeout(()=>advance(token),650)}else msg.textContent='✓ Ora cerca il prossimo numero.'}else if(current===[3,1,7][step]){}else if(step>0){}})}
  if(g==='wires'){const box=document.getElementById('wires-game');let first=null;['🔴','🔵','🟡'].forEach((col,i)=>{const a=document.createElement('button');a.className='wire';a.textContent=col;a.dataset.c=col;a.onclick=()=>{if(!first){first=a;msg.textContent='Ora tocca la presa dello stesso colore.'}else{if(first.dataset.c===a.dataset.c&&first!==a){msg.textContent='✓ Collegamento riuscito.';setTimeout(()=>advance(token),550)}else{msg.textContent='✗ Colori diversi. Riprova.';first=null}}};box.appendChild(a);const p=document.createElement('button');p.className='socket';p.textContent='🔌'+col;p.dataset.c=col;p.onclick=()=>{if(first&&first.dataset.c===p.dataset.c){first.disabled=true;p.disabled=true;msg.textContent='✓ Collegamento riuscito.';first=null;setTimeout(()=>advance(token),550)}else if(first)msg.textContent='✗ Presa sbagliata.'};box.appendChild(p)})}
 }

 if(d.type==='wait'){
  let remaining=d.seconds;const t=document.getElementById('wait-text');
  const timerToken=token;const timer=setInterval(()=>{if(timerToken!==renderToken){clearInterval(timer);return}remaining--;if(remaining>0)t.textContent='Analisi in corso... '+remaining;else{clearInterval(timer);t.textContent='Analisi completata. In realtà non stavamo facendo niente.';setTimeout(()=>advance(timerToken),900)}},1000)
 }
}
if(level>=levels.length)level=0;
render();