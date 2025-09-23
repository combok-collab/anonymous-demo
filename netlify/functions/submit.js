exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the incoming message
        const data = JSON.parse(event.body);
        const message = data.message;

        if (!message || message.trim() === '') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        // Capture metadata from headers
        const ip = event.headers['x-nf-client-connection-ip'] || 
                  event.headers['client-ip'] ||
                  event.headers['x-forwarded-for'] || 
                  'Unknown';

        const userAgent = event.headers['user-agent'] || 'Unknown';
        const referrer = event.headers['referer'] || 'Direct visit';
        const language = event.headers['accept-language'] || 'Unknown';
        
        // Get country from headers (Netlify provides this)
        const country = event.headers['x-country'] || 'Unknown';
        
        // Get more detailed information
        const timestamp = new Date().toISOString();
        
        const metadata = {
            timestamp: timestamp,
            ip: ip,
            userAgent: userAgent,
            referrer: referrer,
            language: language,
            country: country,
            // Additional headers that might be useful
            accept: event.headers['accept'],
            encoding: event.headers['accept-encoding']
        };

        // In a real application, you would save this to a database
        // For this demo, we'll just return the captured metadata
        console.log('Message received:', {
            message: message,
            metadata: metadata
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                success: true,
                message: 'Message received successfully',
                metadata: metadata
            })
        };

    } catch (error) {
        console.error('Error processing message:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to process message',
                details: error.message 
            })
        };
    }
};