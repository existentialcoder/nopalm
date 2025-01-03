import fastify from 'fastify';
const app = fastify({ logger: true });

app.get('/ping', (request, reply) => {
    reply.send('Hello World!');
});

app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    console.log(`Fastify running at ${address}`);
});
