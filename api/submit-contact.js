// Vercel Serverless Function to handle contact form submissions
// This stores submissions in Vercel KV (Redis)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, contactNumber, email, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !contactNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Create submission object
    const submission = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      firstName,
      lastName,
      contactNumber,
      email,
      message: message || '',
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
    };

    // Store submission using Vercel KV
    try {
      const { kv } = await import('@vercel/kv');
      const submissionsKey = 'contact_submissions';
      
      // Get existing submissions
      const existing = await kv.get(submissionsKey) || [];
      
      // Add new submission (limit to last 1000 submissions)
      const updated = [submission, ...existing].slice(0, 1000);
      
      // Store back
      await kv.set(submissionsKey, updated);
      
    } catch (kvError) {
      // If Vercel KV is not set up, log the submission
      // In production, you should set up Vercel KV
      console.error('Vercel KV not available, submission logged:', submission);
      console.error('KV Error details:', kvError.message);
      console.warn('Please link your KV database to this project in Vercel dashboard');
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been submitted successfully.',
      submissionId: submission.id
    });

  } catch (error) {
    console.error('Error processing submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}

