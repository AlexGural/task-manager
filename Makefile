.PHONY: up build down restart logs clean test test-e2e test-all seed

# Docker
up:
	docker-compose up -d
	@echo "✅ http://localhost:3000"
	@echo "📚 http://localhost:3000/api/doc"

build:
	docker-compose up -d --build
	@echo "✅ http://localhost:3000"

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f app

clear:
	docker-compose down -v
	docker-compose -f docker-compose.test.yml down -v
	-docker rmi task-manager-app task-manager-app-test 2>/dev/null || true

# Testing
test:
	docker-compose exec app npm run test

test-e2e:
	docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from app-test
	docker-compose -f docker-compose.test.yml down -v

test-all: test test-e2e

# Seeding
seed:
	docker-compose exec app npm run seed

seed-dev:
	docker-compose exec app npm run seed:dev
