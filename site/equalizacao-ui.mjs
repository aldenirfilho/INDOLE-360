import {parseHistory,equalize} from './equalization.mjs';
const $=id=>document.getElementById(id),number=id=>$(id).value.trim()===''?null:Number($(id).value);
const fmt=n=>new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2}).format(n);
const labels={product:'Produto · 30%',people:'Pessoas · 30%',impact:'Impacto · 30%',reserve:'Reserva · 10%'};
let scenario=null;
function render(){
 const parsed=parseHistory($('history').value),credited=Object.fromEntries(Object.keys(labels).map(k=>[k,number('credited-'+k)]));
 const input={rows:parsed.rows,start:number('start'),end:number('end'),credited,floorRate:number('floor-rate')};
 const result=parsed.error?parsed:equalize(input);
 $('scenario-download').disabled=!!result.error;
 if(result.error){scenario=null;$('eq-result').replaceChildren();const p=document.createElement('p');p.className='eq-error';p.textContent=result.error;$('eq-result').append(p);return;}
 scenario={version:'2.1.0',type:'hypothetical_scenario_not_audited',unit:'million',currency:'UM',input,result,limitations:['Exige mesma entidade, moeda, unidade e perímetro.','Não somar janelas sobrepostas.','Não representa obrigação tributária ou certificação.','Aportes inseridos pelo usuário não foram verificados.']};
 let html=`<span class="eq-label">Lucro líquido somado · janela ${input.start}–${input.end}</span><div class="eq-total">${fmt(result.totalProfit)} <small>milhões de UM</small></div><p class="small">Receita somada: ${fmt(result.revenue)} milhões de UM. Base não negativa: ${fmt(result.base)} milhões de UM.</p>`;
 if(!result.targets)html+='<div class="eq-warning">Sem lucro agregado positivo: o modelo não define alocações. Receita, isoladamente, não vira obrigação neste cenário.</div>';
 else html+=`<div class="eq-bar" role="img" aria-label="Alvos hipotéticos: 30% produto, 30% pessoas, 30% impacto, 10% reserva"><span></span><span></span><span></span><span></span></div><table class="eq-table"><caption>Destinação hipotética · milhões de UM</caption><thead><tr><th>Destino</th><th>Alvo</th><th>Já atribuído</th><th>Restante</th></tr></thead><tbody>${Object.keys(labels).map(k=>`<tr><td>${labels[k]}</td><td>${fmt(result.targets[k])}</td><td>${fmt(credited[k])}</td><td>${fmt(result.remaining[k])}</td></tr>`).join('')}</tbody></table><p class="small">Impacto proposto / receita: ${result.impactRevenue===null?'N/D':fmt(result.impactRevenue)+'%'}. O restante é uma diferença de cenário, não uma dívida. Excesso num destino não cobre outro automaticamente.</p>`;
 if(input.floorRate>0)html+=`<div class="${result.floorConflict?'eq-warning':'notice'}">Piso exploratório de ${fmt(input.floorRate)}% da receita: ${fmt(result.floorAmount)} milhões de UM. ${result.floorConflict?'Ultrapassa a parcela de impacto do modelo. É necessário redesenhar a proposta; nenhuma parcela foi alterada.':'Cabe numericamente na parcela de impacto, sem comprovar viabilidade econômica.'}</div>`;
 html+='<p class="small"><strong>Dados iniciais fictícios.</strong> Para uma empresa real, concilie os aportes e a liquidez antes de interpretar os resultados.</p>';
 $('eq-result').innerHTML=html;
}
$('eq-form').addEventListener('submit',e=>{e.preventDefault();render()});
$('eq-form').addEventListener('input',render);
$('scenario-download').addEventListener('click',()=>{if(!scenario)return;const u=URL.createObjectURL(new Blob([JSON.stringify(scenario,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='indole360-cenario-equalizacao.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)});
render();
fetch('data/portfolios.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{const ul=document.createElement('ul');for(const c of d.companies){const li=document.createElement('li'),a=document.createElement('a');a.href='index.html#empresa='+encodeURIComponent(c.id);a.textContent=c.name;li.append(a,document.createTextNode(c.id==='microsoft'?' — demonstrações conciliadas; impacto parcial':' — não conciliado'));if(c.dossier){const dossier=document.createElement('a');dossier.href=c.dossier;dossier.textContent=' · Abrir dossiê';li.append(dossier)}ul.append(li)}$('portfolio-state').replaceChildren(ul)}).catch(()=>{$('portfolio-state').textContent='Estado indisponível. Consulte o catálogo e o arquivo JSON.'});
