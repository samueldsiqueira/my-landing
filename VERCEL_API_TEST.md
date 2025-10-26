# Vercel API Integration Testing

This document explains how to test the Vercel API integration.

## Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Add your Vercel API token to `.env.local`:
```bash
NEXT_PUBLIC_VERCEL_TOKEN=your_vercel_token_here
```

3. (Optional) If using a team account, add your team ID:
```bash
NEXT_PUBLIC_VERCEL_TEAM_ID=your_team_id
```

## Testing the Integration

### Manual API Testing

You can test the Vercel API directly using curl:

```bash
# List all projects
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.vercel.com/v9/projects"

# Get deployments for a specific project
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=PROJECT_NAME&limit=1&target=production"
```

### Testing in the Application

1. Start the development server:
```bash
npm run dev
```

2. Open http://localhost:3000 in your browser

3. Navigate to the "Projects" section

4. The application will:
   - Fetch all Vercel projects from your account
   - Filter out the "my-landing" project
   - For each project, fetch the latest production deployment URL
   - Display project cards with:
     - Project name
     - Framework used
     - Link to Vercel deployment
     - Link to GitHub repository (if available)

## Expected Behavior

- If no token is configured: Projects section will show "Nenhum projeto encontrado."
- If token is invalid: Error will be logged to console and no projects will be displayed
- If token is valid: All your Vercel projects (except "my-landing") will be displayed with their production URLs

## API Endpoints Used

1. **GET /v9/projects** - Lists all projects in your account
   - Returns: Array of project objects with metadata

2. **GET /v6/deployments** - Gets deployments for a specific project
   - Query params:
     - `projectId`: Name of the project
     - `limit`: Number of results (1 for latest)
     - `target`: Deployment target (production)
   - Returns: Array of deployment objects with URLs

## Troubleshooting

### No projects showing up

1. Check that `NEXT_PUBLIC_VERCEL_TOKEN` is set in `.env.local`
2. Verify the token has the correct permissions
3. Check the browser console for error messages

### Projects showing but no URLs

1. Verify projects have production deployments in Vercel
2. Check if deployments are in "ready" state
3. Review console logs for API errors

### Token expired or invalid

1. Generate a new token at https://vercel.com/account/tokens
2. Update `.env.local` with the new token
3. Restart the development server
