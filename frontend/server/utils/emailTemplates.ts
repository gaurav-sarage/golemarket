export const getOnboardingEmailTemplate = (name: string, type: 'customer' | 'seller', verifyUrl: string) => {
    const primaryColor = '#7c3aed'; // primary-600
    const secondaryColor = '#1f2937'; // gray-800

    const customerContent = {
        title: 'Welcome to Gole Market Hub!',
        hero: 'Your neighborhood, digitised.',
        benefit1: 'Shop from local favorites',
        benefit2: 'Fast local delivery',
        benefit3: 'Secure transactions',
        steps: [
            'Verify your account to start browsing.',
            'Discover authentic products from vetted local shops.',
            'Order your favorites and get them delivered to your doorstep.'
        ],
        cta: 'Activate Account'
    };

    const sellerContent = {
        title: 'Welcome, Partner!',
        hero: 'Start growing your business online today.',
        benefit1: 'Manage orders seamlessly',
        benefit2: 'Real-time analytics',
        benefit3: 'Digital storefront setup',
        steps: [
            'Verify your identity to unlock your dashboard.',
            'Set up your shop profile and business hours.',
            'Add your inventory and start receiving local orders.'
        ],
        cta: 'Activate Seller Account'
    };

    const content = type === 'customer' ? customerContent : sellerContent;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: ${secondaryColor}; margin: 0; padding: 0; background-color: #f9fafb; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
            .header { background: ${primaryColor}; padding: 60px 20px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; }
            .content { padding: 50px; }
            .greeting { font-size: 24px; font-weight: 800; margin-bottom: 24px; color: ${secondaryColor}; }
            .hero-text { font-size: 16px; color: #4b5563; margin-bottom: 40px; font-weight: 500; }
            .section-title { font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 20px; }
            .steps { margin-bottom: 40px; background: #f9fafb; padding: 30px; border-radius: 20px; }
            .step-item { display: flex; align-items: flex-start; margin-bottom: 20px; }
            .step-number { background: ${primaryColor}; color: #ffffff; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 10px; font-weight: 900; flex-shrink: 0; margin-top: 2px; }
            .step-text { font-size: 14px; font-weight: 600; color: #374151; }
            .cta-button { display: inline-block; background: ${primaryColor}; color: #ffffff !important; padding: 20px 40px; border-radius: 16px; text-decoration: none; font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 0.1em; box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.3); transition: transform 0.2s; }
            .footer { padding: 40px; text-align: center; font-size: 11px; color: #9ca3af; background: #f3f4f6; font-weight: 600; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>GOLE MARKET HUB</h1>
                <p style="opacity: 0.8; margin-top: 15px; font-weight: 800; font-size: 14px; letter-spacing: 0.2em;">${content.hero}</p>
            </div>
            <div class="content">
                <div class="greeting">Hello ${name},</div>
                <div class="hero-text">${content.title} Your account has been created successfully. To get started and explore the marketplace, please confirm your email address below.</div>
                
                <div class="section-title">Next Steps</div>
                <div class="steps">
                    ${content.steps.map((step, i) => `
                        <div class="step-item">
                            <span class="step-number">${i + 1}</span>
                            <span class="step-text">${step}</span>
                        </div>
                    `).join('')}
                </div>

                <div style="text-align: center; margin-bottom: 40px;">
                    <a href="${verifyUrl}" class="cta-button">${content.cta}</a>
                </div>
                
                <div style="border-top: 1px solid #f3f4f6; pt-30; margin-top: 40px; text-align: center;">
                    <p style="font-size: 11px; color: #9ca3af; font-weight: 600;">
                        BUTTON NOT WORKING? PASTE THIS LINK IN YOUR BROWSER:<br>
                        <a href="${verifyUrl}" style="color: ${primaryColor}; text-decoration: none;">${verifyUrl}</a>
                    </p>
                </div>
            </div>
            <div class="footer">
                &copy; 2026 GOLE MARKET HUB &bull; ALL RIGHTS RESERVED<br>
                POWERING THE HEART OF LOCAL COMMERCE
            </div>
        </div>
    </body>
    </html>
    `;
};
