/* Original scalar models E051-E100. No external code, data table or solver. */
import {toSI} from './units.js';
export const constants=Object.freeze({G:6.67430e-11,R:8.31446261815324,kB:1.380649e-23,h:6.62607015e-34,c:299792458,e:1.602176634e-19,NA:6.02214076e23,F:96485.33212331002,epsilon0:8.8541878188e-12,mu0:1.25663706127e-6,sigma:5.670374419e-8});
// Preserve relative differences near equality without overflowing a/b at extremes.
function logRatio(a,b){const relative=(a-b)/b;return Math.abs(relative)<.5?Math.log1p(relative):Math.log(a)-Math.log(b);}
function check(value,rule,label){
 const good=rule==='positive'?value>0:rule==='nonnegative'?value>=0:rule==='nonzero'?value!==0:rule==='integer'?Number.isSafeInteger(value)&&value>0:rule==='unitInterval'?value>=0&&value<=1:rule==='openInterval'?value>0&&value<1:['incidentAngle','quarterTurn'].includes(rule)?value>=0&&value<=Math.PI/2:true;
 if(!good){const hints={positive:'0보다 커야 합니다.',nonnegative:'0 이상이어야 합니다.',nonzero:'0일 수 없습니다.',integer:'양의 안전한 정수여야 합니다.',unitInterval:'0~1 범위여야 합니다.',openInterval:'0보다 크고 1보다 작아야 합니다.',incidentAngle:'법선 기준 0~90° 범위여야 합니다.',quarterTurn:'각도는 0~90° 범위여야 합니다.'};throw Error(label+': '+hints[rule]);}
}
export function evaluate(tool,raw,confirmed=false){
 const x={};for(const f of tool.fields){const value=raw[f.key];if(!value)throw Error(f.label+': 값이 필요합니다.');try{x[f.key]=toSI(value.value,f.dimension,value.unit);check(x[f.key],f.constraint,f.label);}catch(e){throw Error(e.message.startsWith(f.label)?e.message:f.label+': '+e.message);}}
 if(tool.condition&&!confirmed)throw Error('적용 조건 확인란에 체크하세요.');
 const {G,R,h,c,epsilon0,mu0,F}=constants;let value,exactZero=false;
 switch(tool.id){
 case 'E051':value=Math.sqrt(2*G*x.m/x.r);if(value>=c)throw Error('이 뉴턴 중력 모델에서 광속 이상의 결과는 제공하지 않습니다.');break;
 case 'E052':if(Math.sqrt(G*x.m/x.r)>=c)throw Error('이 뉴턴 중력 모델에서 광속 이상의 결과는 제공하지 않습니다.');value=2*Math.PI*x.r/Math.sqrt(G*x.m/x.r);break;
 case 'E053':{const scale=Math.max(x.r1,x.r2),sum=x.r1/scale+x.r2/scale;const a=Math.sqrt(x.mu/x.r1),b=Math.sqrt(x.mu/x.r2);value=Math.abs(((x.r2-x.r1)/scale)/sum)*(a/(Math.sqrt(2*(x.r2/scale)/sum)+1)+b/(Math.sqrt(2*(x.r1/scale)/sum)+1));exactZero=x.r1===x.r2;break;}
 case 'E054':value=-(G*x.m/x.r)*x.small;break;
 case 'E055':value=(G*x.m/x.r)/x.r;break;
 case 'E056':value=(2*G/c**2)*x.m;break;
 case 'E057':if(x.v>=c)throw Error('상대 속력은 광속보다 작아야 합니다.');value=1/Math.sqrt(((c-x.v)/c)*(1+x.v/c));break;
 case 'E058':{if(x.v>=c)throw Error('상대 속력은 광속보다 작아야 합니다.');const s=Math.sqrt(((c-x.v)/c)*(1+x.v/c));value=(x.m*x.v)*x.v/(s*(1+s));exactZero=x.v===0;break;}
 case 'E059':value=h/x.p;break;
 case 'E060':value=Math.sqrt(3*R*x.t/x.m);if(value>=c)throw Error('분자 속력이 비상대론 기체 모델 범위를 벗어났습니다.');break;
 case 'E061':value=Math.sqrt(2*x.h/x.g);exactZero=x.h===0;break;
 case 'E062':exactZero=x.v===0||x.theta===0||x.theta===Math.PI/2;value=exactZero?0:(x.v/x.g)*x.v*Math.sin(2*x.theta);break;
 case 'E063':value=x.f*x.dt;exactZero=x.f===0;break;
 case 'E064':{const lo=Math.min(x.k1,x.k2),hi=Math.max(x.k1,x.k2);value=lo/(1+lo/hi);break;}
 case 'E065':{const scale=Math.max(x.m1,x.m2),a=x.m1/scale,b=x.m2/scale;if(a===0||b===0||(x.x1!==0&&a*x.x1===0)||(x.x2!==0&&b*x.x2===0))throw Error('계산 중 언더플로 또는 정밀도 손실이 발생했습니다. 입력 크기를 확인하세요.');value=(a*x.x1+b*x.x2)/(a+b);exactZero=(x.x1===0&&x.x2===0)||(a*x.x1!==0&&a*x.x1===-b*x.x2);break;}
 case 'E066':value=(x.v/x.g)*x.v/(2*x.mu);exactZero=x.v===0;break;
 case 'E067':value=Math.atan(x.mu);exactZero=x.mu===0;break;
 case 'E068':value=(x.k*x.x)*x.x/2;exactZero=x.x===0;break;
 case 'E069':if(x.inner>=x.d)throw Error('관 내경은 외경보다 작아야 합니다.');value=Math.PI/64*(x.d-x.inner)*(x.d+x.inner)*(x.d*x.d+x.inner*x.inner);break;
 case 'E070':value=(x.f/x.e)*(x.l*x.l*x.l)/(3*x.i);exactZero=x.f===0;break;
 case 'E071':if(x.beta*x.dt>.1)throw Error('이 앱의 작은 밀도변화 근사 범위는 βΔT ≤ 0.1입니다.');value=(x.g*x.beta*x.dt)*(x.l**3)/(x.nu*x.alpha);break;
 case 'E072':value=x.mu*x.cp/x.k;break;
 case 'E073':value=x.h*x.l/x.k;break;
 case 'E074':value=x.k/x.rho/x.cp;break;
 case 'E075':value=x.m*x.cp*x.dt;exactZero=x.dt===0;break;
 case 'E076':value=x.n*R*x.t*logRatio(x.v2,x.v1);exactZero=x.v1===x.v2;break;
 case 'E077':if(x.gamma<=1)throw Error('비열비 γ는 1보다 커야 합니다.');value=x.t1*Math.exp(((x.gamma-1)/x.gamma)*logRatio(x.p2,x.p1));break;
 case 'E078':{const diff=x.a-x.b;if(diff===0)value=x.a;else value=diff/(Math.abs(diff/x.b)<.5?Math.log1p(diff/x.b):Math.log(x.a)-Math.log(x.b));break;}
 case 'E079':value=x.rho*x.g*x.v;exactZero=x.v===0;break;
 case 'E080':{if(x.theta<0||x.theta>Math.PI)throw Error('접촉각은 0~180° 범위여야 합니다.');exactZero=x.theta===Math.PI/2;value=exactZero?0:2*x.sigma*Math.cos(x.theta)/x.rho/x.g/x.r;break;}
 case 'E081':value=(Math.abs(x.q)/x.r)/x.r/(4*Math.PI*epsilon0);exactZero=x.q===0;break;
 case 'E082':value=x.v*(x.n2/x.n1);exactZero=x.v===0;break;
 case 'E083':{const xl=2*Math.PI*x.freq*x.l,xc=1/(2*Math.PI*x.freq*x.c);value=Math.hypot(x.r,xl-xc);exactZero=x.r===0&&xl===xc;break;}
 case 'E084':if(Math.abs(x.phase)>Math.PI)throw Error('위상차는 −180~180° 범위여야 합니다.');exactZero=x.v===0||x.i===0||Math.abs(x.phase)===Math.PI/2;value=exactZero?0:x.v*x.i*Math.cos(x.phase);break;
 case 'E085':value=Math.sqrt(1/(Math.PI*x.freq*mu0*x.mur*x.sigma));break;
 case 'E086':value=1+x.rf/x.rg;break;
 case 'E087':value=1/Math.hypot(1,2*Math.PI*x.freq*x.r*x.c);break;
 case 'E088':{const scale=Math.max(x.n1,x.n2),a=x.n1/scale,b=x.n2/scale;value=((a-b)/(a+b))**2;exactZero=x.n1===x.n2;break;}
 case 'E089':value=x.lambda*(x.l/x.d);break;
 case 'E090':{const sine=x.order*(x.lambda/x.d);if(sine>1+16*Number.EPSILON)return{kind:'absent-order',message:'이 입력에서는 지정한 회절차수가 존재하지 않습니다.'};value=Math.asin(Math.min(1,sine));break;}
 case 'E091':value=20*logRatio(x.p,x.pref)/Math.LN10;exactZero=x.p===x.pref;break;
 case 'E092':if(Math.abs(x.vo)>=x.c||Math.abs(x.vs)>=x.c)throw Error('음원과 관측자의 매질 기준 속력은 음속보다 작아야 합니다.');value=x.freq*((x.c+x.vo)/(x.c-x.vs));break;
 case 'E093':value=3-Math.log10(x.h);exactZero=x.h===1000;break;
 case 'E094':{const correction=(R*x.t/(x.n*F))*Math.log(x.q);value=x.e0-correction;exactZero=x.e0===correction;break;}
 case 'E095':value=x.a*Math.exp(-x.lambda*x.t);exactZero=x.a===0;break;
 case 'E096':value=x.kh*x.p;exactZero=x.p===0;break;
 case 'E097':{value=(x.rhop-x.rhof)*x.g*(x.d*x.d)/(18*x.mu);exactZero=x.rhop===x.rhof;const re=x.rhof*Math.abs(value)*x.d/x.mu;if(!Number.isFinite(re)||re>=.1)throw Error('이 스톡스 모델은 계산된 입자 레이놀즈수 Re < 0.1에서만 사용합니다.');break;}
 case 'E098':value=x.cd*x.a*Math.sqrt(2*x.dp/x.rho);exactZero=x.cd===0||x.dp===0;break;
 case 'E099':value=Math.hypot(x.c1*x.u1,x.c2*x.u2);exactZero=(x.c1===0||x.u1===0)&&(x.c2===0||x.u2===0);break;
 case 'E100':if(x.x2>x.x1)throw Error('뒤쪽 피크 진폭은 첫 피크 진폭보다 클 수 없습니다.');value=logRatio(x.x1,x.x2)/x.n;exactZero=x.x1===x.x2;break;
 default:throw Error('계산 모델을 찾을 수 없습니다.');
 }
 if(!Number.isFinite(value))throw Error('계산값이 브라우저 수치 표현 범위를 벗어났습니다. 입력 크기와 단위를 확인하세요.');
 if(value===0&&!exactZero)throw Error('계산 중 언더플로 또는 정밀도 손실이 발생했습니다. 입력 크기를 확인하세요.');
 return {kind:'number',value:Object.is(value,-0)?0:value};
}
