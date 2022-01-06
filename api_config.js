const i_session = require('./session');

function makeError(res, code, text) {
   res.writeHead(code);
   res.end(text);
}

function getAuth(req) {
   const au = req.headers.authorization;
   if (!au) return null;
   const obj = {};
   const aup = au.split(' ');
   obj.type = aup[0];
   try {
      const d = Buffer.from(aup[1] || '', 'base64').toString();
      const dp = d.split(':');
      obj.user = dp[0];
      obj.token = dp[1];
   } catch (err) {
      return null;
   }
   return obj;
}

function checkAuth(req) {
   const authObj = getAuth(req);
   if (!authObj || !authObj.user || !authObj.token) {
      return null;
   }
   if (!i_session.profile.checkAuthSession(authObj.user, authObj.token)) {
      return null;
   }
   return authObj;
}

const api = {
   get: (req, res, opt) => {
      const authObj = checkAuth(req);
      if (!authObj) return makeError(res, 401);
      const profileObj = Object.assign({}, i_session.profile.get(authObj.user));
      delete profileObj.pass;
      delete profileObj.session;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(profileObj));
   }, // get
};

module.exports = { api };
