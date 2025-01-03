const fastify = require('fastify')({ logger: true });

fastify.get('/ping', (request, reply) => {
    reply.send('Hello World!');
});

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Fastify running at ${address}`);
});
