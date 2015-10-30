describe('signupController', function () {

    var scope;
    var authService;
    var $q;

    beforeEach(function () {
        angular.mock.module('AngularAuthApp')
        angular.mock.inject(function ($controller, $rootScope, _authService_, _$q_) {
            scope = $rootScope.$new()
            authService = _authService_
            $q = _$q_
            $controller('signupController', {
                '$scope': scope
            })
        })
    })

    it('Should have a signUp method', function () {
        expect(scope.signUp).to.be.a('function');
    })
    it('Should signup user', function () {
        mock = sinon.mock(authService)
        q = $q.defer()
        mock.expects('saveRegistration').once().returns(q.promise)
        scope.signUp()
        q.resolve()
        scope.$apply()
        expect(scope.savedSuccessfully).to.be.true;
    })
    it('Should fail signup user', function () {
        mock = sinon.mock(authService)
        q = $q.defer()
        mock.expects('saveRegistration').once().returns(q.promise)
        scope.signUp()
        q.reject({ data: { modelState: [{ error: 'Unkown' }]}})
        scope.$apply()
        expect(scope.savedSuccessfully).to.be.false;
    })



})