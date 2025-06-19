const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["js/emojiApp-BzEJhHV2.js","js/vue-router-D8lCIdEx.js","js/@vue-C2EdfbEr.js","js/element-plus-CP22kRUN.js","js/lodash-es-S0Y0Up6J.js","js/@vueuse-C3gO89KF.js","js/@element-plus-8ICTiaGh.js","js/@sxzz-D_chPuIy.js","js/@ctrl-r5W6hzzQ.js","js/dayjs-BC8lxUvW.js","js/async-validator-9PlIezaS.js","js/memoize-one-BdPwpGay.js","js/normalize-wheel-es-BQoi3Ox2.js","js/@floating-ui-58V2siOx.js","css/element-plus-CPTBpdD2.css","js/pinia-DkiZ30Kz.js","js/axios-Dq7h7Pqt.js","css/emojiApp-CnZGtL76.css","js/emojiPngToGif-CuUDnDS0.js","js/cropperjs-Dl0XFk7j.js","css/cropperjs-CwOW9WHn.css","css/emojiPngToGif-BY-kNIPS.css","js/gifOverlayList-BWDHmvTu.js","css/gifOverlayList-BXn6jgkK.css","js/gifOverlayEditor-DVbuK2Oz.js","css/gifOverlayEditor-DRsBqf2X.css"])))=>i.map(i=>d[i]);
import{H as P,u as E,o as w,at as _,d as O,af as f,r as y}from"./@vue-C2EdfbEr.js";import{c as j}from"./pinia-DkiZ30Kz.js";import{R as L,c as $,a as A}from"./vue-router-D8lCIdEx.js";import{a as R}from"./axios-Dq7h7Pqt.js";import{i as S}from"./element-plus-CP22kRUN.js";import{Q as C}from"./@element-plus-8ICTiaGh.js";import"./lodash-es-S0Y0Up6J.js";import"./@vueuse-C3gO89KF.js";import"./@sxzz-D_chPuIy.js";import"./@ctrl-r5W6hzzQ.js";import"./dayjs-BC8lxUvW.js";import"./async-validator-9PlIezaS.js";import"./memoize-one-BdPwpGay.js";import"./normalize-wheel-es-BQoi3Ox2.js";import"./@floating-ui-58V2siOx.js";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&e(i)}).observe(document,{childList:!0,subtree:!0});function s(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function e(t){if(t.ep)return;t.ep=!0;const n=s(t);fetch(t.href,n)}})();const M={__name:"App",setup(o){return(a,s)=>(w(),P(E(L)))}},q="modulepreload",D=function(o){return"/emoji-app/"+o},v={},h=function(a,s,e){let t=Promise.resolve();if(s&&s.length>0){let i=function(l){return Promise.all(l.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));t=i(s.map(l=>{if(l=D(l),l in v)return;v[l]=!0;const u=l.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${m}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":q,u||(d.as="script"),d.crossOrigin="",d.href=l,c&&d.setAttribute("nonce",c),document.head.appendChild(d),u)return new Promise((b,x)=>{d.addEventListener("load",b),d.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${l}`)))})}))}function n(i){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=i,window.dispatchEvent(r),!r.defaultPrevented)throw i}return t.then(i=>{for(const r of i||[])r.status==="rejected"&&n(r.reason);return a().catch(n)})},T=(o,a)=>{const s=o.__vccOpts||o;for(const[e,t]of a)s[e]=t;return s},U={};function k(o,a){return" main "}const I=T(U,[["render",k]]),V=$({history:A("/emoji-app"),routes:[{path:"/",name:"home",component:I},{path:"/emoji-app",name:"/emoji-app",component:()=>h(()=>import("./emojiApp-BzEJhHV2.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]))},{path:"/emoji-app/gifOverlay/emojiPngToGif",name:"/emoji-app/gifOverlay/emojiPngToGif",component:()=>h(()=>import("./emojiPngToGif-CuUDnDS0.js"),__vite__mapDeps([18,6,2,19,20,3,4,5,7,8,9,10,11,12,13,14,15,1,16,21]))},{path:"/emoji-app/gifOverlay/gifOverlayList",name:"/emoji-app/gifOverlay/gifOverlayList",component:()=>h(()=>import("./gifOverlayList-BWDHmvTu.js"),__vite__mapDeps([22,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,23]))},{path:"/emoji-app/gifOverlay/gifOverlayEditor",name:"/emoji-app/gifOverlay/gifOverlayEditor",component:()=>h(()=>import("./gifOverlayEditor-DVbuK2Oz.js"),__vite__mapDeps([24,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,25]))}]});Date.prototype.Format=function(o){const a={"M+":this.getMonth()+1,"d+":this.getDate(),"D+":this.getDate(),"h+":this.getHours(),"H+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(Y+)/.test(o)?o=o.replace(RegExp.$1,String(this.getFullYear()).substr(4-RegExp.$1.length)):/(y+)/.test(o)&&(o=o.replace(RegExp.$1,String(this.getFullYear()).substr(4-RegExp.$1.length)));for(const[s,e]of Object.entries(a)){const t=new RegExp(`(${s})`);t.test(o)&&(o=o.replace(t,t.exec(o)[0].length===1?e:String(e).padStart(2,"0")))}return o};const H="/api",F=(o={})=>{const a={timeout:3e4,validateStatus:e=>e>=200&&e<=500,withCredentials:!0,baseURL:H},s=R.create({...a,...o});return s.interceptors.request.use(e=>e,e=>{var t,n,i,r,c;return console.error("请求拦截器错误:",{url:(t=e==null?void 0:e.config)==null?void 0:t.url,method:(n=e==null?void 0:e.config)==null?void 0:n.method,headers:(i=e==null?void 0:e.config)==null?void 0:i.headers,params:(r=e==null?void 0:e.config)==null?void 0:r.params,data:(c=e==null?void 0:e.config)==null?void 0:c.data,message:e.message}),Promise.reject(e)}),s.interceptors.response.use(e=>{const{status:t,data:n,config:i}=e;return t!==200?(console.warn(`响应错误: ${t}`,n,{url:i.url,method:i.method,headers:i.headers,params:i.params,data:i.data}),Promise.reject((n==null?void 0:n.message)||"未知错误")):e},e=>{var t,n,i,r,c;return console.error("响应拦截器错误:",{url:(t=e==null?void 0:e.config)==null?void 0:t.url,method:(n=e==null?void 0:e.config)==null?void 0:n.method,headers:(i=e==null?void 0:e.config)==null?void 0:i.headers,params:(r=e==null?void 0:e.config)==null?void 0:r.params,data:(c=e==null?void 0:e.config)==null?void 0:c.data,message:e.message}),Promise.reject(e.message||"网络错误")}),s},g=F();window.$https=(o,a,s,e,t,n=void 0)=>e===1?z(o,a,s,e,t):e===2?B(o,a,s,e,t):e===3?Y(o,a,s,e,t,n):e===4?G(o,a,s,e,t):e===5?N(o,a,s,e,t):new Promise((i,r)=>{i("不支持的请求")});function z(o,a,s,e,t){return g({url:o,method:a,headers:t,params:{...s}})}function B(o,a,s,e,t){return g({url:o,method:a,headers:t,data:s})}function Y(o,a,s,e,t,n){return g({url:o,method:a,headers:t,params:{...s},responseType:"arraybuffer",httpsAgent:n,onDownloadProgress:i=>{const{loaded:r,total:c}=i,l=Math.round(r*100/c);console.log(`下载进度: ${l}%`)},onUploadProgress:i=>{const{loaded:r,total:c}=i,l=Math.round(r*100/(c||0));console.log(`上传进度: ${l}%`)}})}function G(o,a,s,e,t){return g({url:o,method:a,headers:t,data:s,responseType:"stream",onDownloadProgress:n=>{const{loaded:i,total:r}=n,c=Math.round(i*100/r);console.log(`下载进度: ${c}%`)},onUploadProgress:n=>{const{loaded:i,total:r}=n,c=Math.round(i*100/(r||0));console.log(`上传进度: ${c}%`)}})}function N(o,a,s,e,t){return g({url:o,method:a,headers:t,data:s,responseType:"arraybuffer",onDownloadProgress:n=>{const{loaded:i,total:r}=n,c=Math.round(i*100/r);console.log(`下载进度: ${c}%`)},onUploadProgress:n=>{const{loaded:i,total:r}=n,c=Math.round(i*100/(r||0));console.log(`上传进度: ${c}%`)}})}const W=O({name:"MyLoadingComponent",setup(o,{expose:a}){const s=y(!1),e=y("");return a({open:i=>{e.value=i,s.value=!0},close:()=>{s.value=!1}}),{visible:s,msg:e}},render(){return this.visible?f("div",{class:"global-my-loading"},[f("div",{class:"my-loading-overlay"}),f("div",{class:"my-loading-content"},[f("div",{class:"my-loading-spinner"}),f("p",{class:"my-loading-text"},this.msg)])]):null}});function K(){const o=document.createElement("style");o.textContent=`
.global-my-loading {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    pointer-events: all;
}

.my-loading-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 228, 240, 0.6); /* 可爱粉透明背景 */
}

.my-loading-content {
    position: relative;
    z-index: 2;
    background: #fff0f6;
    padding: 24px 32px;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(255, 192, 203, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.my-loading-spinner {
    border: 5px solid #ffe0eb;
    border-top: 5px solid #ff69b4;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    animation: cute-spin 1s linear infinite;
    margin-bottom: 12px;
}

@keyframes cute-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.my-loading-text {
    font-size: 16px;
    color: #d63384;
    font-weight: 600;
}
    `.trim(),document.head.appendChild(o)}const Q={install(o){var t;K();const a=document.createElement("div");document.body.appendChild(a);const s=_(W);s.mount(a);const e=(t=s._instance)==null?void 0:t.exposed;window.$myLoading={open:n=>{e==null||e.open(n)},close:()=>{e==null||e.close()}}}},p=_(M);p.use(j());p.use(V);p.use(Q);for(const[o,a]of Object.entries(C))p.component(o,a);p.use(S);p.mount("#app");export{T as _};
