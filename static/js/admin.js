const i_layout = require('./layout');
const i_util = require('./util');

(function () {

const env = {};
env.ui = {};
window._debug = env;

function parseHash() {
   const obj = {};
   (window.location.hash || '#').substring(1).split('&').forEach(
      function (kv) {
         const p = kv.split('=');
         obj[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
      }
   );
   return obj;
}

function auth() {
   const hashObj = parseHash();
   if (hashObj.user && hashObj.token) {
      window.localStorage.setItem('auth', JSON.stringify({
         user: hashObj.user,
         token: hashObj.token
      }));
      window.location.hash = '#';
   }
   const authObj = JSON.parse(
      window.localStorage.getItem('auth') || '{}'
   );
   if (!authObj.user || !authObj.token) {
      window.location = '/login.html';
      return;
   }

   i_util.Ajax({
      url: '/check/admin',
      method: 'POST',
      raw: `target=${authObj.user}&user=${authObj.user}&token=${authObj.token}`
   }).Req().then(function () {
      env.auth = authObj;
      console.log(`Welcome, ${env.auth.user}!`);
      assemble();
      event();
   }, function () {
      window.location = '/';
   });
}

function event() {
}

function assemble() {
   let div;
   const app = new i_layout.MainFrame();

   env.ui.service = document.createElement('div');
   env.ui.service.className = 'clr-row';
   app.ui.content.appendChild(env.ui.service);

   document.body.appendChild(app.GetDom());
}

(function startApp() {
   auth();
})();

})();
