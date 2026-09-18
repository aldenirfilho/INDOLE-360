// Public statement arithmetic. Missing inputs block the check instead of becoming zero.
export function reconcile(finance, period) {
  if (!finance?.periods?.includes(period)) return null;
  const metric = id => finance.metrics.find(m => m.id === id)?.values?.[period];
  const sum = rows => Array.isArray(rows) && rows.length && rows.every(r => Number.isFinite(r?.values?.[period])) ? rows.reduce((a,r) => a + r.values[period],0) : null;
  const valueIds = ['cash_begin','cash_end','cfo','cfi','cff','fx_effect'];
  if (!valueIds.every(id => Number.isFinite(metric(id)))) return null;
  const checks = ['operating','investing','financing'].map((name,i) => {
    const calculated = sum(finance.cash_flow_bridges?.[name]);
    const reported = metric(['cfo','cfi','cff'][i]);
    return {id:name, calculated, reported, residual:calculated===null?null:calculated-reported};
  });
  const calculated = ['cash_begin','cfo','cfi','cff','fx_effect'].reduce((a,id)=>a+metric(id),0);
  checks.push({id:'cash',calculated,reported:metric('cash_end'),residual:calculated-metric('cash_end')});
  return {period,checks,balanced:checks.every(c=>c.residual===0)};
}
export function proposal(finance, periods) {
  if (!Array.isArray(periods) || !periods.length || new Set(periods).size!==periods.length) return null;
  const m=finance?.metrics?.find(x=>x.id==='net_income');
  if (!periods.every(p=>finance.periods.includes(p)&&Number.isFinite(m?.values?.[p]))) return null;
  const profit=periods.reduce((a,p)=>a+m.values[p],0),base=Math.max(0,profit);
  return {profit,base,product:base*.3,people:base*.3,impact:base*.3,reserve:base*.1,credited:null,adherence:null};
}
