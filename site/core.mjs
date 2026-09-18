/** ÍNDOLE 360° 1.1 — pure, independently testable calculations. */
export const VERSION = '2.1.0';
export const DIMENSIONS = [
 ['H1','H','Humanos e funcionários','honra'],['H2','O','Obras sociais verificadas','honra'],
 ['H3','N','Natureza e bem-estar animal','honra'],['H4','R','Retidão jurídica','honra'],
 ['H5','A','Autenticidade da comunicação','honra'],['M1','M','Mercado e consumidor','merito'],
 ['M2','É','Evolução do produto','merito'],['M3','R','Reinvestimento produtivo','merito'],
 ['M4','I','Integridade e governança','merito'],['M5','T','Trajetória e reparação','merito'],
 ['M6','O','Oferta e acesso','merito']
].map(([id,letter,label,axis])=>({id,letter,label,axis}));
export const finite = value => typeof value === 'number' && Number.isFinite(value);
export const validScore = value => finite(value) && value >= 0 && value <= 10;
export const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function safeURL(value) {
 try { const u=new URL(value); return u.protocol==='https:' && !u.username && !u.password ? u.href : null; } catch { return null; }
}
export function score(values={}) {
 const calculate=axis=>{
  const ds=DIMENSIONS.filter(d=>d.axis===axis);
  return ds.every(d=>validScore(values[d.id])) ? ds.reduce((n,d)=>n+values[d.id],0)/ds.length : null;
 };
 const honra=calculate('honra'),merito=calculate('merito');
 return {honra,merito,total:honra!==null&&merito!==null?(honra+merito)*5:null,coverage:DIMENSIONS.filter(d=>validScore(values[d.id])).length};
}
export function band(total) {
 if(!finite(total))return {label:'Dados insuficientes',tone:'neutral'};
 if(total>=75)return {label:'Desempenho favorável',tone:'green'};
 if(total>=55)return {label:'Em construção',tone:'yellow'};
 if(total>=35)return {label:'Pontos de atenção',tone:'orange'};
 return {label:'Preocupações relevantes',tone:'red'};
}
export function publicScore(company,sources={}) {
 const accepted={};
 const criticalClear=company.review?.criticalIssuesResolved===true && !(company.criticalFlags||[]).some(f=>!f || typeof f==='string' || f.resolved!==true);
 if(!criticalClear)return {...score({}),blocked:'Revisão de pendências críticas necessária'};
 for(const d of DIMENSIONS){
  const r=company.ratings?.[d.id];
  if(company.review?.status==='reviewed' && r?.reviewed===true && typeof r.justification==='string' && r.justification.trim() && Array.isArray(r.sources) && r.sources.length && r.sources.every(id=>sources[id]&&safeURL(sources[id].url))) accepted[d.id]=r.value;
 }
 return score(accepted);
}
export function ratio(numerator,denominator) {return finite(numerator)&&finite(denominator)&&denominator>0?numerator/denominator*100:null;}
export function strictSum(values) {return values.length&&values.every(finite)?values.reduce((a,b)=>a+b,0):null;}
export function financialRatios(row) {
 const dividends=strictSum([row.dividends,row.jcp]);
 return {payout:ratio(dividends,row.profit),shareholderReturn:ratio(strictSum([row.dividends,row.jcp,row.buybacks]),row.profit),researchIntensity:ratio(row.research,row.revenue),socialEffort:ratio(row.socialOwn,row.profit)};
}
export function sumYears(rows,key='profit',expectedYears=null) {
 const years=rows.map(r=>r.year),unique=new Set(years);
 const compatible=['currency','unit','scope'].every(k=>new Set(rows.map(r=>r[k]??null)).size<=1);
 const validPeriods=years.every(y=>Number.isInteger(y))&&unique.size===rows.length;
 const known=rows.filter(r=>finite(r[key]));
 const complete=Array.isArray(expectedYears)&&expectedYears.length>0&&expectedYears.length===new Set(expectedYears).size&&expectedYears.length===rows.length&&expectedYears.every(y=>unique.has(y))&&known.length===rows.length&&validPeriods&&compatible;
 return {total:validPeriods&&compatible&&known.length?known.reduce((a,r)=>a+r[key],0):null,known:known.length,expected:expectedYears?.length??null,complete};
}
export function litigationRate(active,employees){return finite(active)&&active>=0&&finite(employees)&&employees>0?active*1000/employees:null;}
export function reviewAge(date,now=new Date()) {
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))return null;
 const stamp=new Date(date+'T00:00:00Z');
 if(Number.isNaN(stamp.getTime())||stamp.toISOString().slice(0,10)!==date)return null;
 return Math.floor((now.getTime()-stamp.getTime())/86400000);
}
export function redemption(current,historic,acts=[],trajectory=null,reviewed=false,criticalPending=true){
 const delta=finite(current)&&finite(historic)?current-historic:null;
 const distinct=new Set(acts.filter(a=>a?.verified===true&&safeURL(a.source)&&reviewAge(a.date)!==null&&reviewAge(a.date)>=0&&typeof a.id==='string'&&a.id).map(a=>a.id));
 return {delta,eligible:reviewed===true&&!criticalPending&&validScore(trajectory)&&trajectory>=8&&delta!==null&&delta>=15&&distinct.size>=3};
}
export function makePrompt(name,perspective='consumidor',mode='TURBO') {
 const target=String(name).trim().slice(0,160);
 return `ÍNDOLE 360° — protocolo editorial v1.1\nAlvo: ${target || '[ORGANIZAÇÃO]'}\nPerspectiva: ${perspective}\nModo: ${mode}\n\nAvalie conduta, excelência, propósito declarado e impacto demonstrado. Não diagnostique a índole de pessoas. Pesquise fontes públicas atuais; sem navegação disponível, declare essa limitação. Os papéis de cartógrafo, contador, auditor social, ambiental, trabalho, consumidor, acusação/defesa, propaganda, reparação, revisão crítica e síntese são etapas de revisão, não agentes independentes realmente executados.\n\n1. IDENTIDADE: diferencie marca, subsidiária e controladora. Confirme razão social, registro, país, tickers/bolsas, espécie de ação, ISIN, controlador, free float, auditor e modelo de dividendos, com fonte e data. Não confunda marca com procedência de cada produto.\n2. DINHEIRO: série anual de 5–10 anos, moeda, unidade, exercício fiscal, padrão contábil e perímetro. Separe lucro, caixa operacional, investimentos, dividendos/JCP, recompras, P&D, pessoas e social. Some só exercícios anuais não sobrepostos; diga quantos anos faltam. Não trate despesas já deduzidas do lucro como destinação adicional; não faça pizza que some a 100%. P&D pode ser despesa ou ativo: evite dupla contagem.\n3. SOCIAL: separe verba própria, incentivo fiscal, recursos de terceiros, anunciado e executado. Informe benefício fiscal efetivo conhecido, beneficiários, metodologia de contagem e resultados independentes. Origem do dinheiro e eficácia do projeto são eixos distintos.\n4. IMPACTOS: direitos humanos, salários, segurança, fornecedores, natureza, biodiversidade, bem-estar animal, consumidor, acesso e qualidade. Denominadores comparáveis: apenas ações trabalhistas ativas × 1.000 / empregados com vínculo e perímetro equivalentes. Casos de consumidor precisam de denominador próprio; não normalizar todos os processos por empregados nem usar volume como prova de culpa.\n5. JURÍDICO: órgão, jurisdição, datas do fato e da decisão, acusação, defesa, status, eventual recurso, trânsito em julgado, valor devido/pago e fonte. Acordo não implica automaticamente confissão, condenação ou absolvição: leia as cláusulas. Distinguir arquivamento, absolvição e prescrição. Nunca afirme ter encontrado todos os processos.\n6. PROPAGANDA: confronte cada alegação com evidências. Relato da empresa não é asseguração independente. Não desqualifique fonte por ser crítica; examine método, interesse e corroboração.\n7. PLACAR: HONRA = média de H humanos; O obras sociais; N natureza/animais; R retidão; A autenticidade. MÉRITO = média de M consumidor; É evolução; R reinvestimento; I governança; T trajetória; O acesso. Cada dimensão 0–10, justificada e com fonte. ÍNDICE = (HONRA + MÉRITO) × 5. Sem evidência, use null/NÃO ENCONTRADO, nunca zero. Só feche a nota global com as 11 dimensões sustentadas e revisão explícita de pendências críticas concluída. Bloqueie classificação favorável enquanto houver dano grave material não reparado. O modelo é editorial experimental, não validado cientificamente. Filantropia não neutraliza violações graves.\n8. TEMPO: histórico de 10 anos e atual de 24 meses; explicite eventual sobreposição. Compare o mesmo escopo e versão; delta não prova causalidade. T é definido por atos, não pelo próprio delta. Selo de reparação só com T≥8, delta≥15, 3 atos diferentes comprovados e revisão de pendências/reincidência. Eventos antigos materialmente relevantes não desaparecem por corte temporal.\n9. INDICADORES: payout = (dividendos + JCP)/lucro; distribuição ampliada = (dividendos + JCP + recompras)/lucro; P&D/receita; social próprio/lucro. Só calcule com denominador positivo e componentes conhecidos. Percentuais não são fatias de um mesmo total. Dividendos, juros e recompras não provam má conduta; em bancos, juros são operacionais.\n10. CALIBRAÇÃO: porte por receita, não por lucro acumulado. Mercado e receita são medidas distintas. Faixas T0–T4 são convenções; requisitos legais exigem fonte atual. Lente setorial e finalidade orientam relevância; metas de doação não são obrigações universais.\n\nSAÍDA: resumo em 5 linhas; identidade; dinheiro; impactos; casos com defesa e desfechos; propaganda; trajetória; 11 dimensões; conclusão cautelosa; lacunas; fontes diretas; datas do documento e da consulta. TURBO resume achados e remete ao dossiê, sem fingir caber todo o levantamento numa tela. Sugira 3 condições verificáveis de melhoria. Informe confiança/cobertura separadas de desempenho. Revisão sugerida em 90 dias, antecipada por fato relevante, sem garantir validade até lá. Não forneça recomendação de compra/venda de ativos. Não publique, monitore ou agende automaticamente. Não inclua dados pessoais sensíveis.`;
}

