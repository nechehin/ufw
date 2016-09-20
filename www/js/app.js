angular.module('ufw', ['ionic', 'ufw.controllers', 'ufw.services', 'pascalprecht.translate','ngCookies'])

.run(function($ionicPlatform) {
    
    $ionicPlatform.ready(function() {
        
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
     
        analytics.startTrackerWithId("UA-66802256-1");
        
    });
})

.config(function($stateProvider, $urlRouterProvider) {

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
    })
    
    .state('tab.event-detail', {
        url: '/schedule/:eventId',
        views: {
            'tab-schedule': {
                templateUrl: 'templates/event-detail.html',
                controller: 'EventDetailCtrl'
            }
        }
    })
    
    .state('tab.location-detail', {
        url: '/location/:locationId',
        views: {
            'tab-schedule': {
                templateUrl: 'templates/location-detail.html',
                controller: 'LocationCtrl'
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
        'CONNECTION_ERROR': 'Помилка з\'єднання',
        'SCHEDULE_UPDATED': 'Розклад оновлений',
        'SCHEDULE_UPDATED_AT': 'Розклад був оновлений о',
        'CLICK_TO_ZOOM': 'Натисніть для збільшення',
        'WHEN': 'Коли',
        'WHERE': 'Де'
    });
 
     $translateProvider.translations('en', {
        'DESIGNERS': 'Designers',
        'SCHEDULE': 'Schedule',
        'SCREENING_SCHEDULE': 'Schedule',
        'LOAD': 'Load',
        'TODAY': 'today',
        'CONNECTION_ERROR': 'Connerction error',
        'SCHEDULE_UPDATED': 'Schedule update',
        'SCHEDULE_UPDATED_AT': 'Schedule was updated at',
        'CLICK_TO_ZOOM': 'Zoom in',
        'WHEN': 'When',
        'WHERE': 'Location'
    });
 

    $translateProvider.preferredLanguage('uk');
    
    // remember language
    $translateProvider.useLocalStorage();
  
}])

.directive('compile', function ($compile) {
    // directive factory creates a link function
    return function (scope, element, attrs) {
        scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
        );
    }
})

.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                scope[attrs.imageonload]();
            });
        }
    };
});