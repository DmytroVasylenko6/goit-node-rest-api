import * as authControllers from '../authControllers.js';
import * as authServices from '../../services/authServices.js';
import { sequelize } from '../../db/Sequelize.js';

jest.mock('../../services/authServices.js');
jest.mock('nanoid', () => ({
	nanoid: jest.fn(() => 'mocked-nanoid-id'),
}));
const mockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

describe('authControllers', () => {
	afterAll(async () => {
		await sequelize.close();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('registerController', () => {
		it('should register user and return user data', async () => {
			const req = { body: { email: 'test@mail.com', password: '123456' } };
			const res = mockRes();
			authServices.registerUser.mockResolvedValue({ email: 'test@mail.com', subscription: 'starter' });

			await authControllers.registerController(req, res);

			expect(authServices.registerUser).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({
				user: { email: 'test@mail.com', subscription: 'starter' },
			});
		});
	});

	describe('loginController', () => {
		it('should login user and return token and user', async () => {
			const req = { body: { email: 'test@mail.com', password: '123456' } };
			const res = mockRes();
			const user = { email: 'test@mail.com', subscription: 'starter', avatarURL: '/avatars/1.png' };
			authServices.loginUser.mockResolvedValue({ token: 'token123', user });

			await authControllers.loginController(req, res);

			expect(authServices.loginUser).toHaveBeenCalledWith(req.body);
			expect(res.json).toHaveBeenCalledWith({ token: 'token123', user });
		});
	});

	describe('logoutController', () => {
		it('should logout user and return 204', async () => {
			const req = { user: { id: 'userId' } };
			const res = mockRes();
			authServices.logoutUser.mockResolvedValue();

			await authControllers.logoutController(req, res);

			expect(authServices.logoutUser).toHaveBeenCalledWith('userId');
			expect(res.status).toHaveBeenCalledWith(204);
			expect(res.json).toHaveBeenCalledWith({ message: 'Logout successfully' });
		});
	});

	describe('getCurrentController', () => {
		it('should return current user data', () => {
			const req = { user: { email: 'test@mail.com', subscription: 'starter', avatarURL: '/avatars/1.png' } };
			const res = mockRes();

			authControllers.getCurrentController(req, res);

			expect(res.json).toHaveBeenCalledWith({
				email: 'test@mail.com',
				subscription: 'starter',
				avatarURL: '/avatars/1.png',
			});
		});
	});
});