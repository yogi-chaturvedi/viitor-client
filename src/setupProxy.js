const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
	  target: 'http://localhost:3030',
	  pathRewrite: {
		  "^/api": "/"
	  },
	  changeOrigin: true,
	  logLevel: "debug",
    })
  );
};
