# Timely

Timely is a full-stack task and deadline manager for small businesses. The React frontend lives in this directory and communicates with the Express/MongoDB API in `../timely-backend`.

## Documentation

- [Intern project guide](docs/PROJECT_GUIDE.md) — indexed overview of the architecture, folders, APIs, data flow, reminder lifecycle, project iterations, and contribution workflow.

## Quick start

Start the backend first:

```powershell
cd ..\timely-backend
npm install
npm run dev
```

Then start the frontend in another terminal:

```powershell
cd ..\timely-frontend
npm install
npm run dev
```

Development requests use `VITE_API_URL=http://localhost:5050/api/v1` from `.env.development`.

## Frontend checks

```powershell
npm run lint
npm run build
```
