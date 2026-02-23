import type { NextApiRequest, NextApiResponse } from 'next';
import app, { connectDB } from '../../server/app';

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB();
        // Disabling body parsing allows Express specifically to naturally stream and intercept multi-part payloads exactly as originally implemented.
        app(req, res);
    } catch (error) {
        console.error("Critical failure during App Handler invocation:", error);
        res.status(500).json({ success: false, message: "Internal Server API Error" });
    }
}
