#  Planner Application

Planner je full-stack aplikacija za organizaciju obaveza. Ovaj projekat demonstrira integraciju React frontenda, Flask API-ja i PostgreSQL baze podataka unutar Docker ekosistema.

##  Tehnologije

- **Frontend:** [React.js](react.dev)
- **Backend:** [Python Flask](flask.palletsprojects.com)
- **Baza podataka:** [PostgreSQL](www.postgresql.org)
- **Orkestracija:** [Docker Compose](docs.docker.com)

##  Instalacija i pokretanje

Najlakši način da pokrenete projekat je korišćenjem Docker-a.

### Koraci za pokretanje:

1. **Klonirajte repozitorijum:**
   ```bash
   git clone github.com
   cd planner
 2. **Pokrenite aplikaciju**
   Sledeća komanda će izgraditi sve potrebne image-e i pokrenuti kontejnere:
   docker compose up --build
 3. **Pristupite aplikaciji**
   Frontend: http://localhost:5173
   Backend API: http://localhost:8001
