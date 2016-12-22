var app=angular.module('linkositoryApp',['ui.router','toaster','mgcrea.ngStrap','app.constants','app.controllers',
                                        'app.factory','app.service','app.directives']);

app.config(function($datepickerProvider) {
  angular.extend($datepickerProvider.defaults, {placement:'bottom',dateFormat: 'dd-MM-yyyy',autoclose: true });
});

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
        .state('logout', {
            url: '/edit/:id',
            templateUrl: 'templates/edit-bookmark.html',
            controller:'EditController'
        })
        .state('list', {
            url: '/list',
            templateUrl: 'templates/list.html',
            controller:'ListController'
        })
        .state('edit', {
            url: '/edit/:id',
            templateUrl: 'templates/edit-bookmark.html',
            controller:'EditController'
        });
});
