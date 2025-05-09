.DEFAULT_GOAL := help

SHELL := /bin/bash

help:  ## Mostra os comandos disponíveis
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "🛠️  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

up:  ## Sobe os containers localmente
	docker compose up --build

down:  ## Derruba todos os containers
	docker compose down

restart:  ## Reinicia os containers
	docker compose down && docker compose up --build -d

logs:  ## Mostra os logs do backend no Omen
	ssh omen 'docker compose logs -f backend'

db:  ## Acessa o banco de dados no Omen
	ssh omen 'docker exec -it pso-db psql -U postgres -d pso'

git:  ## Salva alterações no Git e envia para o GitHub
	@read -p "📝 Mensagem do commit: " msg; \
	git add . && git commit -m "$$msg" || true; \
	git push -u origin HEAD

deploy:  ## Commita e faz deploy para o Omen
	@echo "💾 Salvando alterações no Git antes do deploy..."
	@read -p "📝 Mensagem do commit: " msg; \
	git add . && git commit -m "$$msg" || true; \
	git push -u origin HEAD
	./scripts/deploy.sh

status:  ## Mostra o status dos containers local
	docker compose ps

clean:  ## Remove containers, volumes e rede
	docker compose down -v --remove-orphans
	@docker volume prune -f
	@docker network prune -f
	@docker system prune -f
	@docker builder prune -f
	@docker image prune -f
	@docker container prune -f
	@docker volume rm $(docker volume ls -qf dangling=true) || true
	@docker network rm $(docker network ls -qf dangling=true) || true

omen:  ## Acessa o Omen, entra no projeto e sobe o Docker
	ssh alvaro@192.168.86.76 'cd ~/apps/5pso && sudo systemctl start docker && bash'
