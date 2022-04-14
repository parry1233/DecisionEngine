const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app)
{
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin:true,
        })
    );
    app.use(
        '/staticdt',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin:true,
        })
    );
    app.use(
        '/ScoreCardEngine',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin:true,
        })
    );
    app.use(
        '/DecisionTreeJsmind',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin:true,
        })
    );
    app.use(
        '/DecisionTreeEngine',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin:true,
        })
    );
    app.use(
        '/RuleSetEngine',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin:true,
        })
    );
};