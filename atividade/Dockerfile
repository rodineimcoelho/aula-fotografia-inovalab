FROM node:22-bookworm-slim
WORKDIR /app
COPY --chown=node:node atividade ./atividade
RUN mkdir -p /data && chown node:node /data
WORKDIR /app/atividade
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3001 DATA_DIR=/data
USER node
EXPOSE 3001
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://127.0.0.1:3001/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.mjs"]
