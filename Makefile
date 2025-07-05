dev-server:
	poetry run uvicorn server.main:app --reload --app-dir src

dev-web:
	cd src/web && npm run dev