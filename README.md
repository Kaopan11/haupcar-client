# HAUPCAR Car Client

React app for company cars. This app talks only to the Node API. It does not talk to Supabase.

Start the API in `haupcar-server` first. The client calls `http://localhost:3000/api`.

## Stack

- React, TypeScript, Vite
- Ant Design, React Router
- axios

## Setup

1. Use Node.js 20 or newer.
2. Copy the env file:

```bash
cp .env.example .env
```

3. `.env` has one value:

| Name | What to put |
| --- | --- |
| `VITE_API_URL` | `http://localhost:3000/api` |

The `/api` part is required. The app requests `/cars`, so the full path is `http://localhost:3000/api/cars`.

4. Install packages:

```bash
npm install
```

Do not commit `.env`.

On the server, `CORS_ORIGIN` must be `http://localhost:5173`.

## Run

In `haupcar-server`:

```bash
npm run dev
```

In this folder:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

| Path | Page |
| --- | --- |
| `/` | Car list. Delete asks you to confirm. |
| `/cars/new` | Add a car. |
| `/cars/:id/edit` | Edit a car. A missing id shows Car not found. |

Other commands:

```bash
npm run build
npm run preview
npm run lint
```

`npm run preview` serves the files from `npm run build`.

## Folder layout

```
src/api             axios calls
src/types           car fields
src/pages           list, add, and edit screens
src/components      the shared car form
```
