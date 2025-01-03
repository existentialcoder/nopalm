import Koa from 'koa';
const app = new Koa();

app.use(async (ctx) => {
    if (ctx.path === '/ping' && ctx.method === 'GET') {
        ctx.body = 'Hello World!';
    } else {
        ctx.status = 404;
    }
});

app.listen(4000, () => {
    console.log('Koa running at http://localhost:4000');
});
