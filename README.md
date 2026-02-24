# Justrite Superstore – Roster System

A production-grade mobile-first staff roster and task management system for Justrite Superstore Ile-Ife.

## Features

- **Staff Login** – Staff ID + 4-digit PIN (default: 1234)
- **Auto Roster Engine** – Monthly roster generation with alternating Sunday schedules, off-day logic, and Long Hour auto-triggering
- **Roster Approval** – Draft → Approved → Published workflow with admin password protection
- **Staff Directory** – Full CRUD for staff management with department/shift assignment
- **Assignment Engine** – Sequential chain tasks with step-locking, comments, and completion tracking
- **WhatsApp Sharing** – Generate and share personalized schedule messages per staff
- **ICS Calendar Export** – Export weekly or monthly schedule to Apple/Google/Outlook Calendar
- **Profile Management** – Change display name and PIN

## Login

- **Admin**: ID = `ADMIN`, PIN = `1234`
- **Staff**: ID = `S001`–`S031`, PIN = `1234`
- Approval password: `justrt2024`

## Deploy to Vercel

1. Push this repo to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Set framework to **Create React App**
4. Deploy — the `vercel.json` handles SPA routing

## Tech Stack

- React 18 (Create React App)
- No backend, no database — all state in React + localStorage
- Mobile-first, optimized for iPhone Safari & Android Chrome
- Primary colors: Yellow `#F5A623` + Blue `#1A3C6E`
