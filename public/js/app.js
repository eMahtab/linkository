var app=angular.module('linkositoryApp',['ui.router','toaster','mgcrea.ngStrap','app.constants','app.controllers',
                                        'app.factory']);

app.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
});

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'templates/index.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller:'LoginController'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'templates/signup.html',
            controller:'SignupController'
        })
        .state('list', {
            url: '/list',
            templateUrl: 'templates/list.html',
            controller:'ListController'
        });
});
