import { expect } from 'chai';
import { ILoginRepository } from '../../Data/Interfaces/ILoginRepository';
import { LoginService } from '../../Business/Service/LoginService';
import { LoginModel } from '../../Business/Models/LoginModel';
import { UnauthorizedError } from '../../Errors/UnauthorizedError';
import { LoginRepository } from '../../Data/Repository/LoginRepository';
import sinon from 'sinon';
import { NotFoundError } from '../../Errors/NotFoundError';


/**
 * @author Roan Slingerland
 */
describe('Login', () => {
    let loginService: LoginService;
    let loginRepository: ILoginRepository;
    let getUserCredentialsByEmailStub: sinon.SinonStub;

    beforeEach(() => {
        loginRepository = new LoginRepository();
        getUserCredentialsByEmailStub = sinon.stub(loginRepository, 'getUserCredentialsByEmail').resolves(null);
        loginService = new LoginService(loginRepository);
    });

    afterEach(() => {
        sinon.restore();
    })

    describe('LoginService', () => {
        it('Should throw an NotFoundError if an unexisting user tries to login', async () => {
            const invalidData = new LoginModel('doesntexist@email.com', 'invalid-password');
            loginRepository.getUserCredentialsByEmail(invalidData.email);

            try {
                await loginService.login(invalidData);
            } catch(error: any) {
                expect(error).to.be.instanceOf(NotFoundError);
                expect(error.message).to.equal('User not found.');
            }
        });
    });
});
