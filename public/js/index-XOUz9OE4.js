const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["js/emojiApp-DLO6D-1P.js","js/vue-router-D8lCIdEx.js","js/@vue-C2EdfbEr.js","js/element-plus-CP22kRUN.js","js/lodash-es-S0Y0Up6J.js","js/@vueuse-C3gO89KF.js","js/@element-plus-8ICTiaGh.js","js/@sxzz-D_chPuIy.js","js/@ctrl-r5W6hzzQ.js","js/dayjs-BC8lxUvW.js","js/async-validator-9PlIezaS.js","js/memoize-one-BdPwpGay.js","js/normalize-wheel-es-BQoi3Ox2.js","js/@floating-ui-58V2siOx.js","css/element-plus-CPTBpdD2.css","js/_plugin-vue_export-helper-DlAUqK2U.js","css/emojiApp-CnZGtL76.css","js/emojiPngToGif-DYRj9pkX.js","js/cropperjs-Dl0XFk7j.js","css/cropperjs-CwOW9WHn.css","css/emojiPngToGif-BY-kNIPS.css","js/gifOverlayList-Dr5tRd2f.js","css/gifOverlayList-BXn6jgkK.css","js/gifOverlayEditor-BPEQRqwV.js","css/gifOverlayEditor-DRsBqf2X.css"])))=>i.map(i=>d[i]);
import{H as P,u as E,o as w,at as b,d as O,af as f,r as y}from"./@vue-C2EdfbEr.js";import{c as L}from"./pinia-DkiZ30Kz.js";import{R as $,c as A,a as R}from"./vue-router-D8lCIdEx.js";import{a as S}from"./axios-Dq7h7Pqt.js";import{i as j}from"./element-plus-CP22kRUN.js";import{Q as C}from"./@element-plus-8ICTiaGh.js";import"./lodash-es-S0Y0Up6J.js";import"./@vueuse-C3gO89KF.js";import"./@sxzz-D_chPuIy.js";import"./@ctrl-r5W6hzzQ.js";import"./dayjs-BC8lxUvW.js";import"./async-validator-9PlIezaS.js";import"./memoize-one-BdPwpGay.js";import"./normalize-wheel-es-BQoi3Ox2.js";import"./@floating-ui-58V2siOx.js";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&e(s)}).observe(document,{childList:!0,subtree:!0});function i(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function e(t){if(t.ep)return;t.ep=!0;const o=i(t);fetch(t.href,o)}})();const M={__name:"App",setup(n){return(a,i)=>(w(),P(E($)))}},q="modulepreload",D=function(n){return"/emoji-app/"+n},v={},h=function(a,i,e){let t=Promise.resolve();if(i&&i.length>0){let s=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),l=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));t=s(i.map(c=>{if(c=D(c),c in v)return;v[c]=!0;const u=c.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":q,u||(d.as="script"),d.crossOrigin="",d.href=c,l&&d.setAttribute("nonce",l),document.head.appendChild(d),u)return new Promise((_,x)=>{d.addEventListener("load",_),d.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(s){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=s,window.dispatchEvent(r),!r.defaultPrevented)throw s}return t.then(s=>{for(const r of s||[])r.status==="rejected"&&o(r.reason);return a().catch(o)})},T=A({history:R("/emoji-app"),routes:[{path:"/",name:"/",component:()=>h(()=>import("./emojiApp-DLO6D-1P.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]))},{path:"/gifOverlay/emojiPngToGif",name:"/gifOverlay/emojiPngToGif",component:()=>h(()=>import("./emojiPngToGif-DYRj9pkX.js"),__vite__mapDeps([17,6,2,18,19,15,3,4,5,7,8,9,10,11,12,13,14,20]))},{path:"/gifOverlay/gifOverlayList",name:"/gifOverlay/gifOverlayList",component:()=>h(()=>import("./gifOverlayList-Dr5tRd2f.js"),__vite__mapDeps([21,1,2,15,3,4,5,6,7,8,9,10,11,12,13,14,22]))},{path:"/gifOverlay/gifOverlayEditor",name:"/gifOverlay/gifOverlayEditor",component:()=>h(()=>import("./gifOverlayEditor-BPEQRqwV.js"),__vite__mapDeps([23,1,2,15,3,4,5,6,7,8,9,10,11,12,13,14,24]))}]});Date.prototype.Format=function(n){const a={"M+":this.getMonth()+1,"d+":this.getDate(),"D+":this.getDate(),"h+":this.getHours(),"H+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(Y+)/.test(n)?n=n.replace(RegExp.$1,String(this.getFullYear()).substr(4-RegExp.$1.length)):/(y+)/.test(n)&&(n=n.replace(RegExp.$1,String(this.getFullYear()).substr(4-RegExp.$1.length)));for(const[i,e]of Object.entries(a)){const t=new RegExp(`(${i})`);t.test(n)&&(n=n.replace(t,t.exec(n)[0].length===1?e:String(e).padStart(2,"0")))}return n};const U="/api",I=(n={})=>{const a={timeout:3e4,validateStatus:e=>e>=200&&e<=500,withCredentials:!0,baseURL:U},i=S.create({...a,...n});return i.interceptors.request.use(e=>e,e=>{var t,o,s,r,l;return console.error("请求拦截器错误:",{url:(t=e==null?void 0:e.config)==null?void 0:t.url,method:(o=e==null?void 0:e.config)==null?void 0:o.method,headers:(s=e==null?void 0:e.config)==null?void 0:s.headers,params:(r=e==null?void 0:e.config)==null?void 0:r.params,data:(l=e==null?void 0:e.config)==null?void 0:l.data,message:e.message}),Promise.reject(e)}),i.interceptors.response.use(e=>{const{status:t,data:o,config:s}=e;return t!==200?(console.warn(`响应错误: ${t}`,o,{url:s.url,method:s.method,headers:s.headers,params:s.params,data:s.data}),Promise.reject((o==null?void 0:o.message)||"未知错误")):e},e=>{var t,o,s,r,l;return console.error("响应拦截器错误:",{url:(t=e==null?void 0:e.config)==null?void 0:t.url,method:(o=e==null?void 0:e.config)==null?void 0:o.method,headers:(s=e==null?void 0:e.config)==null?void 0:s.headers,params:(r=e==null?void 0:e.config)==null?void 0:r.params,data:(l=e==null?void 0:e.config)==null?void 0:l.data,message:e.message}),Promise.reject(e.message||"网络错误")}),i},g=I();window.$https=(n,a,i,e,t,o=void 0)=>e===1?k(n,a,i,e,t):e===2?V(n,a,i,e,t):e===3?H(n,a,i,e,t,o):e===4?F(n,a,i,e,t):e===5?z(n,a,i,e,t):new Promise((s,r)=>{s("不支持的请求")});function k(n,a,i,e,t){return g({url:n,method:a,headers:t,params:{...i}})}function V(n,a,i,e,t){return g({url:n,method:a,headers:t,data:i})}function H(n,a,i,e,t,o){return g({url:n,method:a,headers:t,params:{...i},responseType:"arraybuffer",httpsAgent:o,onDownloadProgress:s=>{const{loaded:r,total:l}=s,c=Math.round(r*100/l);console.log(`下载进度: ${c}%`)},onUploadProgress:s=>{const{loaded:r,total:l}=s,c=Math.round(r*100/(l||0));console.log(`上传进度: ${c}%`)}})}function F(n,a,i,e,t){return g({url:n,method:a,headers:t,data:i,responseType:"stream",onDownloadProgress:o=>{const{loaded:s,total:r}=o,l=Math.round(s*100/r);console.log(`下载进度: ${l}%`)},onUploadProgress:o=>{const{loaded:s,total:r}=o,l=Math.round(s*100/(r||0));console.log(`上传进度: ${l}%`)}})}function z(n,a,i,e,t){return g({url:n,method:a,headers:t,data:i,responseType:"arraybuffer",onDownloadProgress:o=>{const{loaded:s,total:r}=o,l=Math.round(s*100/r);console.log(`下载进度: ${l}%`)},onUploadProgress:o=>{const{loaded:s,total:r}=o,l=Math.round(s*100/(r||0));console.log(`上传进度: ${l}%`)}})}const B=O({name:"MyLoadingComponent",setup(n,{expose:a}){const i=y(!1),e=y("");return a({open:s=>{e.value=s,i.value=!0},close:()=>{i.value=!1}}),{visible:i,msg:e}},render(){return this.visible?f("div",{class:"global-my-loading"},[f("div",{class:"my-loading-overlay"}),f("div",{class:"my-loading-content"},[f("div",{class:"my-loading-spinner"}),f("p",{class:"my-loading-text"},this.msg)])]):null}});function Y(){const n=document.createElement("style");n.textContent=`
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
    `.trim(),document.head.appendChild(n)}const G={install(n){var t;Y();const a=document.createElement("div");document.body.appendChild(a);const i=b(B);i.mount(a);const e=(t=i._instance)==null?void 0:t.exposed;window.$myLoading={open:o=>{e==null||e.open(o)},close:()=>{e==null||e.close()}}}},p=b(M);p.use(L());p.use(T);p.use(G);for(const[n,a]of Object.entries(C))p.component(n,a);p.use(j);p.mount("#app");
