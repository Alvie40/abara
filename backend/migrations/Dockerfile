FROM postgres:15-alpine

WORKDIR /app

COPY init.sql .

CMD ["sh", "-c", "until pg_isready -h ${PGHOST:-db} -U ${POSTGRES_USER:-postgres}; do sleep 1; done; psql -h ${PGHOST:-db} -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-abara} -f /app/init.sql"]