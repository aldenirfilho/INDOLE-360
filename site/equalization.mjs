import {finite,safeURL,reviewAge} from './core.mjs';
import {model} from './model.mjs';

// Histórico por janela fixa, mesma entidade, moeda e unidade. Não calcula tributos.
export function parseHistory(text){
  if(typeof text!=='string'||!text.trim())return {error:'Informe pelo menos um exercício.'};
  const rows=[];
  for(const line of text.trim().split(/\r?\n/)){
    const cells=line.split(';').map(x=>x.trim());
    if(cells.length!==3||!/^\d{4}$/.test(cells[0]))return {error:'Use ano;lucro;receita, uma linha por exercício.'};
    const read=s=>/^-?\d+(?:[.,]\d+)?$/.test(s)?Number(s.replace(',','.')):NaN;
    const row={year:Number(cells[0]),profit:read(cells[1]),revenue:read(cells[2])};
    if(!finite(row.profit)||!finite(row.revenue)||row.revenue<0)return {error:'Valores precisam ser números; receita não pode ser negativa. Não use separadores de milhar.'};
    rows.push(row);
  }
  return {rows};
}
export function equalize({rows,start,end,credited,floorRate=0}){
  if(!Number.isInteger(start)||!Number.isInteger(end)||start<1900||end>2200||end<start||end-start>99)return {error:'Defina uma janela válida de até 100 exercícios.'};
  if(!Array.isArray(rows)||rows.some(r=>!r||typeof r!=='object')||rows.length!==end-start+1||new Set(rows.map(x=>x.year)).size!==rows.length)return {error:'A janela deve estar completa, sem exercícios duplicados.'};
  const sorted=[...rows].sort((a,b)=>a.year-b.year);
  if(sorted.some((r,i)=>r.year!==start+i||!finite(r.profit)||!finite(r.revenue)||r.revenue<0))return {error:'Há exercício ausente, fora da janela ou valor inválido.'};
  const keys=['product','people','impact','reserve'];
  if(!credited||keys.some(k=>!finite(credited[k])||credited[k]<0))return {error:'Informe os quatro valores já atribuídos; desconhecido não equivale a zero.'};
  if(!finite(floorRate)||floorRate<0||floorRate>100)return {error:'O piso experimental deve estar entre 0 e 100%.'};
  const totalProfit=sorted.reduce((s,r)=>s+r.profit,0),revenue=sorted.reduce((s,r)=>s+r.revenue,0);
  if(!finite(totalProfit)||!finite(revenue))return {error:'Soma fora do limite numérico.'};
  const base=Math.max(0,totalProfit),targets=model(base),floorAmount=revenue*(floorRate/100),creditedTotal=keys.reduce((s,k)=>s+credited[k],0);
  if(!finite(floorAmount)||!finite(creditedTotal))return {error:'Valores fora do limite numérico.'};
  if(!targets)return {base,totalProfit,revenue,targets:null,remaining:null,impactRevenue:null,floorAmount,floorConflict:floorRate>0&&revenue>0};
  const remaining=Object.fromEntries(keys.map(k=>[k,Math.max(0,targets[k]-credited[k])]));
  const intensity=revenue>0?(targets.impact/revenue)*100:null;
  return {base,totalProfit,revenue,targets,remaining,impactRevenue:finite(intensity)?intensity:null,floorAmount,floorConflict:floorAmount>targets.impact,creditedTotal};
}

// Filtro documental, não parecer de auditoria nem confirmação automática de impacto.
export function ownContribution(record){
  if(!record||!['product','people','impact','reserve'].includes(record.destination))return null;
  const nums=['executed','thirdParty','taxBenefit','returned'];
  if(nums.some(k=>!finite(record[k])||record[k]<0))return null;
  if(!['executed','verified','outcome_evaluated'].includes(record.stage)||record.fundingReconciled!==true||record.evidenceReviewed!==true||record.additionalToBaseline!==true||record.preProfitExpense!==false||record.mandatoryReparation!==false||!safeURL(record.evidenceURL))return null;
  const age=reviewAge(record.reviewDate);
  if(typeof record.reviewer!=='string'||!record.reviewer.trim()||age===null||age<0)return null;
  const own=record.executed-record.thirdParty-record.taxBenefit-record.returned;
  return own<0?null:own;
}
export function portfolioTotal(records){
  if(!Array.isArray(records)||records.length===0||records.some(r=>!r||typeof r!=='object'))return null;
  const ids=records.map(r=>r.allocationId);
  if(ids.some(x=>typeof x!=='string'||!x.trim())||new Set(ids).size!==ids.length)return null;
  for(const k of ['entity','window','currency','unit','baseId'])if(records.some(r=>typeof r[k]!=='string'||!r[k].trim()||r[k]!==records[0][k]))return null;
  const transactions=new Map();
  for(const r of records){
    if(typeof r.transactionId!=='string'||!r.transactionId.trim()||!finite(r.transactionAmount)||r.transactionAmount<=0||!finite(r.allocationShare)||r.allocationShare<=0||r.allocationShare>1||!finite(r.executed))return null;
    if(Math.abs(r.executed-r.transactionAmount*r.allocationShare)>Math.max(1,Math.abs(r.executed))*1e-10)return null;
    const previous=transactions.get(r.transactionId)||{amount:r.transactionAmount,share:0};
    if(previous.amount!==r.transactionAmount||previous.share+r.allocationShare>1+1e-10)return null;
    transactions.set(r.transactionId,{amount:r.transactionAmount,share:previous.share+r.allocationShare});
  }
  const values=records.map(ownContribution);
  const total=values.some(x=>x===null)?null:values.reduce((a,b)=>a+b,0);
  return finite(total)?total:null;
}

// Alternativa prospectiva: série integral desde uma origem fixa. Não é dívida legal.
export function newProfitBase(rows){
  if(!Array.isArray(rows)||!rows.length||rows.some(r=>!r||typeof r!=='object'))return null;
  const sorted=[...rows].sort((a,b)=>a.year-b.year);
  if(sorted.some((r,i)=>!Number.isInteger(r.year)||!finite(r.profit)||(i>0&&r.year!==sorted[i-1].year+1)))return null;
  let cumulative=0,recognized=0;
  const result=[];
  for(const r of sorted){
    cumulative+=r.profit;
    if(!finite(cumulative))return null;
    const high=Math.max(recognized,cumulative,0);
    result.push({year:r.year,cumulative,recognized:high,newBase:high-recognized});
    recognized=high;
  }
  return result;
}
