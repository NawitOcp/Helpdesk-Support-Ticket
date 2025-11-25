# Project Setup Guide

## Complete Setup Instructions

### Step 1: Initialize Project

```bash
# Create project using Vite
npm create vite@latest helpdesk-frontend -- --template react
cd helpdesk-frontend
```

### Step 2: Install Dependencies

```bash
# Install core dependencies
npm install react-router-dom

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 3: Configure Tailwind CSS

Update `tailwind.config.js` with the provided configuration.

### Step 4: Create Directory Structure

```bash
# Create all required directories
mkdir -p src/routes
mkdir -p src/pages
mkdir -p src/features/tickets/components
mkdir -p src/features/tickets/api
mkdir -p src/features/tickets/utils
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/hooks
mkdir -p src/config
```

### Step 5: Copy All Files

Copy all the provided files to their respective locations as per the structure:

```
src/
├── main.jsx
├── App.jsx
├── index.css
├── routes/
│   └── router.jsx
├── pages/
│   ├── TicketsListPage.jsx
│   ├── TicketDetailPage.jsx
│   ├── TicketCreatePage.jsx
│   └── TicketEditPage.jsx
├── features/
│   └── tickets/
│       ├── components/
│       │   ├── TicketsTable.jsx
│       │   ├── TicketRow.jsx
│       │   ├── TicketFilters.jsx
│       │   ├── TicketStatusBadge.jsx
│       │   ├── TicketForm.jsx
│       │   └── Pagination.jsx
│       ├── api/
│       │   ├── ticketsApiClient.js
│       │   ├── useTicketsQuery.js
│       │   ├── useTicketDetailQuery.js
│       │   ├── useCreateTicketMutation.js
│       │   ├── useUpdateTicketMutation.js
│       │   └── useUpdateStatusMutation.js
│       └── utils/
│           ├── ticketStatusHelpers.js
│           └── ticketMappers.js
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   └── HeaderBar.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── TextArea.jsx
│       ├── Select.jsx
│       ├── Dropdown.jsx
│       └── Badge.jsx
├── hooks/
│   └── useQueryStringState.js
└── config/
    └── apiConfig.js
```

### Step 6: Update Configuration Files

Replace the root level files:
- `package.json`
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `index.html`
- `.gitignore`
- `.eslintrc.cjs` (optional)

### Step 7: Start Backend

Make sure your backend API is running on `http://localhost:5000`:

```bash
# In your backend directory
npm start
```

### Step 8: Start Frontend

```bash
# Install dependencies if not already done
npm install

# Start development server
npm run dev
```

The application should now be running at `http://localhost:3000`

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can change it in `vite.config.js`:

```javascript
server: {
  port: 3001, // Change to any available port
  // ...
}
```

### API Connection Issues

1. Check that backend is running on port 5000
2. Verify proxy configuration in `vite.config.js`
3. Check browser console for CORS errors
4. Verify API endpoints match backend implementation

### Module Not Found Errors

Make sure all dependencies are installed:

```bash
npm install
```

If issues persist, delete `node_modules` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Styles Not Working

1. Ensure `index.css` has the Tailwind directives
2. Check that `tailwind.config.js` content paths are correct
3. Restart the development server

## Verification Checklist

- [ ] All dependencies installed successfully
- [ ] Backend API running on port 5000
- [ ] Frontend starts without errors
- [ ] Can navigate to tickets list page
- [ ] Can create a new ticket
- [ ] Can view ticket details
- [ ] Can edit ticket information
- [ ] Can update ticket status
- [ ] Filters and sorting work correctly
- [ ] Pagination works correctly
- [ ] UI matches Figma design

## Next Steps

1. Test all features thoroughly
2. Review code for any adjustments needed for your specific backend
3. Customize styling if needed
4. Add additional features as required
5. Set up testing (optional)
6. Prepare for deployment

## Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Deployment

The `dist/` folder can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- etc.

Make sure to configure environment variables for production API URL if different from development.
