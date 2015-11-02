describe('authService', function () {

    var authService;
    var $http;
    var serviceBase = 'http://lekiosktestapi.azurewebsites.net/';
    var testUser = {
        UserName : 'Johnny',
        Password : 'Montana',
        ConfirmPassword : 'Montana',
        Email: 'Johny@mont.ana'
    }
    var localStorage;

    beforeEach(function () {
        angular.mock.module('AngularAuthApp')
        angular.mock.inject(function (_authService_, $httpBackend, localStorageService) {
            authService = _authService_;
            $http = $httpBackend;
            localStorage = localStorageService;
            // $http.when('POST', serviceBase + 'api/account/register', testUser).respond({});
        })
    })

    afterEach(function () {
        $http.verifyNoOutstandingExpectation();
        $http.verifyNoOutstandingRequest();
    })

    describe('#saveRegistration', function () {
        it("Should have a saveRegistration method", function () {
            expect(authService.saveRegistration).to.be.a('function')
        })
        it("Should call register API", function () {
            response = {};
            $http.expectPOST(serviceBase + 'api/account/register').respond(200)
            authService.saveRegistration(testUser).then(function (r) {
                response = r;
            })
            $http.flush()
            expect(response.status).to.be.equal(200)
            expect(authService.authentication.isAuth).to.be.false
            //console.log(authService);
        })
    });

    describe('#login', function () {
        it('Should have a login method', function () {
            expect(expect(authService.login).to.be.a('function'))
        })
        it('Should fetch authentication token with refresh option and store data to localStorage', function () {
            response = {};
            $http.expectPOST(serviceBase + 'token').respond(200, { access_token: 'token', refresh_token: 'refresh' });
            authService.login({ userName: 'test', password: 'unit', useRefreshTokens: true }).then(function (r) {
                response = r;
            })
            //console.log(response);
            $http.flush();
            expect(response.access_token).to.be.equal('token');
            //console.log(localStorage.get('authorizationData'));
            expect(localStorage.get('authorizationData')).to.be.eql({ token: 'token', userName: 'test', refreshToken: 'refresh', useRefreshTokens: true })
            expect(authService.authentication.isAuth).to.be.true;
            expect(authService.authentication.userName).to.be.equal('test');
            expect(authService.authentication.useRefreshTokens).to.be.true;

        })
        it('Should fetch authentication token without refresh option and store data to localStorage', function () {
            response = {};
            $http.expectPOST(serviceBase + 'token').respond(200, { access_token: 'token' });
            authService.login({ userName: 'test', password: 'unit', useRefreshTokens: false }).then(function (r) {
                response = r;
            })
            $http.flush();
            expect(response.access_token).to.be.equal('token');
            //console.log(localStorage.get('authorizationData'));
            expect(localStorage.get('authorizationData')).to.be.eql({ token: 'token', userName: 'test', refreshToken: '', useRefreshTokens: false })
            expect(authService.authentication.isAuth).to.be.true;
            expect(authService.authentication.userName).to.be.equal('test');
            expect(authService.authentication.useRefreshTokens).to.be.false;
        })
        it('Should fail authentication', function () { 
            response = {};
            $http.expectPOST(serviceBase + 'token').respond(400, { error: "invalid_grant", error_description: "The user name or password is incorrect." });
            authService.login({}).then(undefined, function (r) {
                response = r;
            });
            $http.flush();
            //console.log(response);
            expect(response.error).to.be.equal("invalid_grant");
            expect(response.error_description).to.be.equal("The user name or password is incorrect.");
            expect(authService.authentication.isAuth).to.be.false;
        })
    })

    describe('#logout', function () {
        it('Should have a logout method', function () {
            expect(expect(authService.logOut).to.be.a('function'))
        })
        it('Should log out and remove data from localStorage', function () {
            authService.logOut();
            expect(authService.authentication.isAuth).to.be.false;
            expect(authService.authentication.username).to.be.undefined;
            expect(authService.authentication.useRefreshTokens).to.be.false;
            expect(localStorage.get('authorizationData')).to.be.null;
        })
    })

    describe('#misc', function () {
        it('Should have fillAuthData method', function () {
            expect(expect(authService.fillAuthData).to.be.a('function'))
        })
        it('Should fill authentication data from localStorage', function () {
            localStorage.set('authorizationData', { userName: "test", useRefreshTokens: true });
            authService.fillAuthData();
            expect(authService.authentication.isAuth).to.be.true;
            expect(authService.authentication.useRefreshTokens).to.be.true;
            expect(authService.authentication.userName).to.be.equal('test');
        })
    })

    describe('#refreshToken', function () {
        it('Should have refreshToken method', function () {
            expect(expect(authService.refreshToken).to.be.a('function'))
        })
        it('Should refresh token & fill new one in localStorage', function () {
            localStorage.set('authorizationData', { userName: "test", useRefreshTokens: true, refreshToken: 'oldToken' });
            $http.expectPOST(serviceBase + 'token').respond(200, {access_token: 'access', userName:'test', refresh_token: 'newToken'});
            response = {};
            authService.refreshToken({}).then(function (r) {
                response = r;
            });
            $http.flush();
            expect(response).to.be.eql({ access_token: 'access', userName: 'test', refresh_token: 'newToken' });
            expect(localStorage.get('authorizationData')).to.be.eql({ token: 'access', userName: 'test', refreshToken: 'newToken', useRefreshTokens: true });
        })
        it('Should logout if refreshToken failed', function () {
            localStorage.set('authorizationData', { userName: "test", useRefreshTokens: true, refreshToken: 'oldToken' });
            authService.authentication.isAuth = true;
            $http.expectPOST(serviceBase + 'token').respond(400, { error: 'Unkown error' });
            response = {};
            authService.refreshToken().then(undefined, function (r) {
                response = r;
            });
            $http.flush();
            expect(response.error).to.be.equal('Unkown error');
            expect(authService.authentication.isAuth).to.be.false;
        })
    })
    
    
})