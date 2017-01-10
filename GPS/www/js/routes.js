angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('mainMenu.home', {
    url: '/home',
    views: {
      'tab1': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('mainMenu.cardReader', {
    url: '/card',
    views: {
      'tab4': {
        templateUrl: 'templates/cardReader.html',
        controller: 'cardReaderCtrl'
      }
    }
  })

  .state('mainMenu.fare', {
    url: '/fare',
    views: {
      'tab2': {
        templateUrl: 'templates/fare.html',
        controller: 'fareCtrl'
      }
    }
  })

  .state('mainMenu.settings', {
    url: '/settings',
    views: {
      'tab3': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('mainMenu.seat', {
    url: '/seat',
    views: {
      'tab5': {
        templateUrl: 'templates/seat.html',
        controller: 'seatCtrl',
        reload: true
      }
    }
  })

  .state('mainMenu', {
    url: '/gps',
    templateUrl: 'templates/mainMenu.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/gps/home')

  

});