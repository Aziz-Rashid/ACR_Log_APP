# ACR Logistics — Freight Manager

Web app for a US logistics company to run day-to-day freight operations: orders, fleet, brokers, customers and truck repairs, with reports that export to Excel and PDF.

**Live demo:** https://acr-test.vercel.app

## Features

- **Accounts and roles** — sign-up and login with Firebase Authentication (FirebaseUI); separate views for admins, mechanics and other users
- **Orders** — create, edit and delete freight orders
- **Fleet** — add and edit vehicles
- **Brokers and customers** — manage the companies the business works with
- **Mechanic dashboard** — log new repairs and track repair work per vehicle
- **Reports** — export data to Excel (ExcelJS) and PDF (html2pdf.js)
- **Maps** — Google Maps via `@googlemaps/js-api-loader`

## Tech stack

Next.js 10 · React · Material UI · Ant Design · Bootstrap · Firebase (Firestore, Auth) · SWR · ExcelJS · html2pdf.js · Google Maps JS API

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Create a `.env.local` file with your own Firebase, Google Maps and Twilio credentials. Never commit it — `.env` files are ignored in this repo.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |

## Project structure

```
src/
  components/   UI components
  config/       App configuration
  pages/        Routes: orders, fleet, brokers, customers, reports, mechanic dashboard, settings, auth
```
