dev-server:
	poetry run uvicorn t4_game.main:app --reload --app-dir src

dev-web:
	cd src/fe-game && npm run dev