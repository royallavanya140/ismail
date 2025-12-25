// Vercel Serverless Function to retrieve contact form submissions
// Protected with simple password authentication

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Check for authentication token
    // Try Authorization header first, then query parameter
    const authToken = req.headers.authorization?.replace('Bearer ', '') || 
                     req.query.token;

    // Get password from environment variable (set in Vercel dashboard)
    const dashboardPassword = process.env.DASHBOARD_PASSWORD || 'admin123';
    const expectedToken = Buffer.from(dashboardPassword).toString('base64');

    // Verify authentication
    if (!authToken || authToken !== expectedToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized. Invalid or missing authentication token.' 
      });
    }

    // Retrieve submissions from Vercel KV
    try {
      const { kv } = await import('@vercel/kv');
      const submissionsKey = 'contact_submissions';
      
      const submissions = await kv.get(submissionsKey) || [];
      
      // Return submissions (newest first)
      return res.status(200).json({
        success: true,
        count: submissions.length,
        submissions: submissions
      });

    } catch (kvError) {
      // If Vercel KV is not set up, return empty array
      console.error('Vercel KV not available:', kvError);
      console.error('KV Error details:', kvError.message);
      return res.status(200).json({
        success: true,
        count: 0,
        submissions: [],
        message: 'Vercel KV not configured. Please link your KV database to this project in Vercel dashboard.'
      });
    }

  } catch (error) {
    console.error('Error retrieving submissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}

