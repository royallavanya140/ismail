# Contact Form Dashboard Setup Guide

This guide will help you set up the secret dashboard to view contact form submissions on Vercel.

## Prerequisites

1. A Vercel account
2. Your project deployed on Vercel

## Setup Steps

### 1. Install Vercel KV (Redis Database)

Vercel KV provides persistent storage for your submissions.

1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **KV** (Redis)
5. Give it a name (e.g., `contact-submissions`)
6. Click **Create**

### 2. Link KV to Your Project

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. The KV connection string should be automatically available
3. Make sure `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set (Vercel does this automatically)

### 3. Set Dashboard Password

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add a new environment variable:
   - **Name**: `DASHBOARD_PASSWORD`
   - **Value**: Your secure password (e.g., `MySecurePassword123!`)
   - **Environment**: Production, Preview, Development (select all)
3. Click **Save**

### 4. Deploy Your Project

1. Push your changes to your Git repository:
   ```bash
   git add .
   git commit -m "Add contact form dashboard"
   git push
   ```

2. Vercel will automatically deploy your changes

### 5. Access the Dashboard

1. Once deployed, visit: `https://your-domain.vercel.app/dashboard.html`
2. Enter the password you set in `DASHBOARD_PASSWORD`
3. You'll see all contact form submissions

## API Endpoints

### POST `/api/submit-contact`
Handles contact form submissions. Called automatically by the contact form.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "contactNumber": "+1234567890",
  "message": "Hello, I'm interested in your services."
}
```

### GET `/api/get-submissions`
Retrieves all submissions (requires authentication).

**Headers:**
```
Authorization: Bearer <base64_encoded_password>
```

Or as query parameter:
```
/api/get-submissions?token=<base64_encoded_password>
```

## Security Notes

- The dashboard is protected by password authentication
- Passwords are base64 encoded (not encrypted) - use a strong password
- For production, consider implementing proper JWT authentication
- The dashboard automatically logs out after 30 minutes of inactivity

## Troubleshooting

### Submissions not saving?

1. Check that Vercel KV is properly set up
2. Verify environment variables are set correctly
3. Check Vercel function logs in the dashboard

### Can't access dashboard?

1. Verify `DASHBOARD_PASSWORD` environment variable is set
2. Make sure you're using the correct password
3. Check browser console for errors

### Functions not working?

1. Ensure `package.json` includes `@vercel/kv` dependency
2. Check that API routes are in the `/api` folder
3. Verify `vercel.json` configuration is correct

## Local Development

To test locally:

```bash
# Install dependencies
npm install

# Run Vercel dev server
npx vercel dev
```

Make sure to set environment variables in `.env.local`:
```
DASHBOARD_PASSWORD=your_password_here
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
```

## Features

- ✅ Secure password-protected dashboard
- ✅ Real-time submission viewing
- ✅ Statistics (total, today, week, month)
- ✅ Auto-refresh every 30 seconds
- ✅ Responsive design
- ✅ Persistent storage with Vercel KV
- ✅ IP address tracking
- ✅ Timestamp for each submission

