angular.module('ufw', ['ionic', 'ufw.controllers', 'ufw.services', 'pascalprecht.translate'])

.run(function($ionicPlatform) {
    
    $ionicPlatform.ready(function() {
        
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
     
        if (typeof analytics !== 'undefined') {
            analytics.startTrackerWithId("UA-66802256-1");
        } else {
            console.log("Google Analytics Unavailable");
        }
          
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.info', {
        url: '/info',
        views: {
            'tab-info': {
                templateUrl: 'templates/tab-info.html',
                controller: 'InfoCtrl'
            }
        }
    })

    .state('tab.designers', {
        url: '/designers',
        views: {
            'tab-designers': {
                templateUrl: 'templates/tab-designers.html',
                controller: 'DesignersCtrl'
            }
        }
    })
    
    .state('tab.designer-detail', {
        url: '/designers/:designerId',
        views: {
            'tab-designers': {
                templateUrl: 'templates/designer-detail.html',
                controller: 'DesignersDetailCtrl'
            }
        }
    })

    .state('tab.schedule', {
        url: '/schedule',
        views: {
            'tab-schedule': {
                templateUrl: 'templates/tab-schedule.html',
                controller: 'ScheduleCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/info');

})

/**
 * Translates
 */
.config(['$translateProvider', function ($translateProvider) {
        
    /**
     * Disable HTML escaping
     */    
    $translateProvider.useSanitizeValueStrategy(null);
        
        
    $translateProvider.translations('uk', {
        'DESIGNERS': 'Дизайнери',
        'SCHEDULE': 'Розклад',
        'SCREENING_SCHEDULE': 'Розклад показів',
        'LOADING': 'Завантаження',
        'LOAD': 'Завантажити',
        'TODAY': 'сьогодні',
        'CONNECTION_ERROR': 'Помилка з\'єднання'
    });
 
     $translateProvider.translations('en', {
        'DESIGNERS': 'Designers',
        'SCHEDULE': 'Schedule',
        'SCREENING_SCHEDULE': 'Schedule',
        'LOAD': 'Load',
        'TODAY': 'today',
        'CONNECTION_ERROR': 'Connerction error'
    });
 
    $translateProvider.preferredLanguage('uk');
  
}]);