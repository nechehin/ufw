angular.module('ufw.controllers', [])

/* Filter for open links in native browser */
.filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_system', 'location=yes')\"");
        return $sce.trustAsHtml(newString);
    }
})

/**
 * add to object property lang sufix _{lang}
 * @returns {Function}
 */
.filter('lang', function ($translate) {
    return function (property) {
        return property + '_' + $translate.use();
    }
})

/**
 * Main slider
 */
.controller('InfoCtrl', function($scope, $ionicLoading, $ionicSlideBoxDelegate, 
     $translate, $ionicPopup, MainSlides) {
    
    if (typeof analytics !== 'undefined') {
        analytics.trackView('Main');
    }
    
    $scope.$on('$ionicView.enter', function() {
        if (typeof analytics !== 'undefined') { 
            analytics.trackEvent('Main', 'View'); 
        }
    });
    
    /**
     *  Language change
     */
    var langStoredKey = 'langIsStored';
  
    $scope.changeLanguage = function(lang) {
       
        if ($translate.use() === lang) {
            langPopup.close();
            return;
        }
        
        if (typeof analytics !== 'undefined') { 
            analytics.trackEvent('Language', 'Select', lang); 
        }
        
        $translate.use(lang);
        
        if (typeof langPopup !== 'undefined') {
            langPopup.close();
        }
        
        location.reload();        
    }

    if (typeof localStorage === 'undefined' || !localStorage.getItem(langStoredKey)) {
        
        var langPopup = $ionicPopup.show({
            templateUrl: 'templates/lang-popup.html',
            title: 'Select your language',
            scope: $scope
        });
        
        if (typeof localStorage !== 'undefined') {
            localStorage[langStoredKey] = true;
        }
    }
    
    /**
     * Load main screen
     */ 
    $scope.items = MainSlides.all();

    $scope.updateSlider = function() {
        
        // Start loading animation
        $ionicLoading.show({
            template: $translate.instant('LOADING') + '...'
        });

        MainSlides.load().then(function(){
            $scope.items = MainSlides.all();
            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide(); 
        });
    };
    
    $scope.updateSlider();
})

/**
 * Designers list
 * @param {type} $scope
 * @param {type} $ionicLoading
 * @param {type} Designers
 * @returns {undefined}
 */
.controller('DesignersCtrl', function ($scope, $ionicLoading, $translate, Designers) {
    
    if (typeof analytics !== 'undefined') {
        analytics.trackView('Designers');
    }
    
    $scope.$on('$ionicView.enter', function() {
        if (typeof analytics !== 'undefined') { 
            analytics.trackEvent('Designers', 'List'); 
        }
    });

    $scope.items = Designers.all();

    if (!$scope.items.length) {
        
        // Start loading animation
        $ionicLoading.show({
            template: $translate.instant('LOADING') + '...'
        });
        
        Designers.load().then(function(){
            $scope.items = Designers.all();
            $ionicLoading.hide(); 
        });
    }

    // Pull for refresh
    $scope.doRefresh = function () {

        Designers.load().then(function(){
            $scope.items = Designers.all();
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    
})

.controller('DesignersDetailCtrl', function($scope, $stateParams, $ionicLoading, $translate, Designers) {

    if (typeof analytics !== 'undefined') {
        analytics.trackView('DesignersDetail');
    }
    
    $scope.$on('$ionicView.enter', function() {
        if (typeof analytics !== 'undefined') { 
            analytics.trackEvent('Designers', 'View', $scope.item.name); 
        }
    });

    $scope.item = Designers.get($stateParams.designerId);
    
    $ionicLoading.show({
        template: $translate.instant('LOADING') + '...'
    });
    
    $scope.stopLoading = function() {
        $ionicLoading.hide();
    }
})


/**
 * Format date in schedule day tab
 * @returns {Function}
 */
.filter('formatDate', function ($translate) {
    return function (text) {
        
        if (new Date(text).toDateString() === new Date().toDateString()) {
            return $translate.instant('TODAY') + ', ' + text;
        }

        return text;
    }
})

/**
 * Schedule page
 */
.controller('ScheduleCtrl', function($scope, $ionicSlideBoxDelegate, $timeout, 
    $ionicLoading, $ionicPopup, $translate, Schedule, Locations) {
    
    if (typeof analytics !== 'undefined') {
        analytics.trackView('Schedule');
    }
    
    $scope.$on('$ionicView.enter', function() {
        if (typeof analytics !== 'undefined') { 
            analytics.trackEvent('Schedule', 'List'); 
        }
    });
    
    /**
     * Check schedule updates
     * @returns {void}
     */
    function checkUpdates() {
        
        Schedule.load().then(function(){
            
            var days = Schedule.all();
            var needUpdate = false;
            

            if (days.length !== $scope.days.length) {
                needUpdate = true;
            }
            
            if (!needUpdate) {
                
                for (var i in days) {
                    
                    var day = days[i];

                    if (day.date !== $scope.days[i].date) {
                        needUpdate = true;
                        break;
                    }
                    
                    if (day.events.length !== $scope.days[i].events.length) {
                        needUpdate = true;
                        break;
                    }
                    
                    for (var n in day.events) {
                        
                        if (day.events[n].id !== $scope.days[i].events[n].id) {
                            needUpdate = true;
                            break;
                        }
                        
                        if (day.events[n].updated > $scope.days[i].events[n].updated) {
                            needUpdate = true;
                            break;
                        }
                    }
                    
                    if (!needUpdate) {
                        days[i] = $scope.days[i];
                    }

                }
            }
            
            if (needUpdate) {
                
                console.log('need update');
                
                $scope.days = days;
                $ionicSlideBoxDelegate.update();
                
                var d = new Date();
                var m = d.getMinutes();
                
                $ionicPopup.alert({
                    title: $translate.instant('SCHEDULE_UPDATED'),
                    template: $translate.instant('SCHEDULE_UPDATED_AT') + ' ' + d.getHours() + ':' + ( m < 10 ? '0' + m : m )
                });
   
            } else {
                console.log('do not update');
            }
        });
    };
    
    
    /**
     * Slide to today slide
     * @returns {void}
     */
    function slideToToday() {

        for (var i in $scope.days) {

            if (new Date($scope.days[i].date).toDateString() === new Date().toDateString()) {

                $timeout(function(){
                    $ionicSlideBoxDelegate.slide(i);
                }, 200);
                
                break;
            }
        }
    };
    
    
    /**
     * Return event style class
     * @param {object} event
     * @returns {String}
     */
    $scope.eventClass = function (event) {
        
        var currentTS = new Date().getTime();
        var startTS = new Date(event.start_at).getTime();
        var endTS = new Date(event.end_at).getTime();
        
        if (endTS < currentTS) {
            return 'past';
        }
        
        if (startTS < currentTS) {
            return 'current';
        }
        
        return '';
    }
    
    
    $scope.days = Schedule.all();
    
    if (!$scope.days.length) {
        
        // Start loading animation
        $ionicLoading.show({
            template: $translate.instant('LOADING') + '...'
        });
        
        Schedule.load().then(function(){
            
            $scope.days = Schedule.all();
            $ionicSlideBoxDelegate.update();
                        
            slideToToday();
            
            $ionicLoading.hide(); 
        });
    } else {
        
        slideToToday();
        checkUpdates();
    }
    
    // Set and then update locations
    Locations.load().then(function(){
        $scope.locations = Locations.all();
    });
    
    // Pull for refresh
    $scope.doRefresh = function () {

        Schedule.load().then(function(){
            $scope.days = Schedule.all();
            $ionicSlideBoxDelegate.update();
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    

    $scope.prevDay = function() {
        $ionicSlideBoxDelegate.previous();
    }
    
    $scope.nextDay = function() {
        $ionicSlideBoxDelegate.next();
    }
    
    $scope.getLocation = function(location_id) {
        var location = Locations.get(location_id);
        return location ? location.title : '';
    }
    
    
    setInterval(function() {
        
        if ( !('onLine' in navigator) || navigator.onLine) {
            checkUpdates();
        }
        
    }, 10000);
    
    
    $scope.$on('$ionicView.afterEnter', function(){
        $ionicSlideBoxDelegate.update();
    });
    
})

.controller('EventDetailCtrl', function($scope, $stateParams, Schedule, Locations) {

    if (typeof analytics !== 'undefined') {
        analytics.trackView('EventDetail');
    }
    
    $scope.$on('$ionicView.enter', function() {
        if (typeof analytics !== 'undefined') { 
            analytics.trackEvent('Schedule', 'View', $scope.event.title); 
        }
    });
  
    $scope.event    = Schedule.getEvent($stateParams.eventId);
    $scope.location = Locations.get($scope.event.location_id);
})

.controller('LocationCtrl', function($scope, $stateParams, $ionicLoading, $translate, Locations) {

    if (typeof analytics !== 'undefined') {
        analytics.trackView('LocationDetail');
    }
    
    $scope.$on('$ionicView.enter', function() {
        if (typeof analytics !== 'undefined') { 
            analytics.trackEvent('Schedule', 'Location', $scope.location.title); 
        }
    });
  
    $scope.location = Locations.get($stateParams.locationId);
    
    $ionicLoading.show({
        template: $translate.instant('LOADING') + '...'
    });
    
    $scope.stopLoading = function() {
        $ionicLoading.hide();
    }
});