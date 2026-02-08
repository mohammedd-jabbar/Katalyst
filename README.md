# Katalyst Admin Dashboard

This is a lightweight admin interface designed to handle core product management workflows. It covers everything from secure authentication to full CRUD operations for a product catalog.

## Live Demo Link
[Visit Katalyst](https://katalystdahsboard.netlify.app/)

## The Stack

I chose these tools to keep the app scalable but easy to manage:

- **Frontend:** React + TypeScript for type safety.
- **Styling:** MUI for the heavy lifting on components, with Tailwind CSS handled the quick layout tweaks.
- **State & Data:** Zustand manages the auth session, while React Query handles the server state and caching.
- **Networking:** Axios, configured with interceptors for seamless token handling.

---

## Core Features

### 1. Authentication Flow

The app uses a robust JWT-based system to keep data secure.

- **Secure Login:** Uses React Hook Form paired with Zod for immediate, schema-based validation.
- **Token Management:** Implemented a full Access/Refresh token cycle.
- **Route Guarding:** Private routes automatically kick unauthenticated users back to the `/login` screen.
- **Custom Interceptors:** The Axios instance is pre-configured to inject global headers (`Language`, `storeId`, `ratio`) and the `Bearer` token into every request automatically.

### 2. Product Management

The dashboard is built around a comprehensive product workflow:

- **The Catalog:** A sortable table view featuring client-side filtering, search, and pagination.
- **Detailed Views:** Dedicated pages for viewing specific product info or jumping straight into the editor.
- **Creation Suite:** \* Includes dynamic lookups for categories, brands, and stores.
- **File Handling:** Integrated a file upload system that converts images to Base64 before submission, providing immediate feedback by displaying the filename post-upload.

- **Edit Constraints:** The edit flow is pre-populated with existing data. To maintain data integrity, specific fields (like initial quantity and pricing) are locked/disabled per the project requirements.

---

## Navigation & Routes

The app structure follows a standard RESTful pattern:

- `/login` – Entry point.
- `/products` – The main directory.
- `/products/new` – Product creation wizard.
- `/products/:id` – Deep dive into product details.
- `/products/:id/edit` – Updates and modifications.

---

## Getting Started

### Installation

Grab the dependencies first:

```bash
npm install

```

### Environment Config

You'll need a `.env` file in the root directory. Use these keys:

```bash
VITE_API_BASE_URL=your_api_endpoint_here
VITE_API_RATIO=1500
DEV=true

```

### Development

Fire up the local dev server:

```bash
npm run dev

```
