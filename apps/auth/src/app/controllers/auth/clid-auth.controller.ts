import { Request, Response } from 'express';
import { AccountService } from '../../services/AccountService';
import { JWTService } from '../../services/JWTService'; // Import the new JWTService

const clidAuthController = async (req: Request, res: Response) => {
    console.log('Received CLID authentication request:', req.body);
    const { clid } = req.body;

    try {
        const account = await AccountService.findAccountForClid(clid);
        console.log('Account found or created:', account); // Log the account information

        // Generate a JWT token for the authenticated user
        const token = JWTService.sign({ sub: account._id });
        console.log('Generated JWT token:', token); // Log the generated token

        return res.json({ message: 'Authentication successful', token });
    } catch (error) {
        console.error('Error during CLID authentication:', error); // Log any errors
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { clidAuthController };
