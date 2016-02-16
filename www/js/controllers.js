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
    
    if (!$scope.items.length) {
        $scope.updateSlider();
    }
})

/**
 * Designers list
 * @param {type} $scope
 * @param {type} $ionicLoading
 * @param {type} Designers
 * @returns {undefined}
 */
.controller('DesignersCtrl', function ($scope, $ionicLoading, $translate, Designers) {
    
    var isLoading = false;
    
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
        
        isLoading = true;
        
        // Start loading animation
        $ionicLoading.show({
            template: $translate.instant('LOADING') + '...'
        });
        
        Designers.load().then(function(){
            $scope.items = Designers.all();
            $ionicLoading.hide(); 
            isLoading = false;
        });
    }

    // Pull for refresh
    $scope.doRefresh = function (withLoadIndicator) {
        
        var withLoadIndicator = withLoadIndicator || false;
        
        if (isLoading) {
            return false;
        }
        
        isLoading = true;
        
        if (withLoadIndicator) {
            $ionicLoading.show({
                template: $translate.instant('LOADING') + '...'
            });
        }

        Designers.load().then(function(){
            
            $scope.items = Designers.all();
            $scope.$broadcast('scroll.refreshComplete');
            
            if (withLoadIndicator) {
                $ionicLoading.hide();
            }
            
            isLoading = false;
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
.controller('ScheduleCtrl', function($scope,  $timeout, $ionicLoading, $ionicPopup, 
    $translate, Schedule, Locations) {
    
    var alertVisible = false;
    var isLoading = false;
    
    if (typeof analytics !== 'undefined') {
        analytics.trackView('Schedule');
    }
    
    $scope.$on('$ionicView.enter', function() {
        if (typeof analytics !== 'undefined') { 
            analytics.trackEvent('Schedule', 'List'); 
        }
    });
    
    $scope.showPager = false;

    $scope.sliderOptions = {
        loop: false,
        pagination: false,
        prevButton: '.prev-day',
        nextButton: '.next-day',
        onInit: function(swiper){
            $scope.slider = swiper;
        }
    };
    

    
    /**
     * Check schedule updates
     * @returns {void}
     */
    function checkUpdates() {
        
        if (isLoading) {
            return;
        }
        
        isLoading = true;
        
        Schedule.load(true).then(function(){
            
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
                $scope.slider.update();
                
                var d = new Date();
                var m = d.getMinutes();
                
                if (!alertVisible) {
                    
                    alertVisible = true;

                    $ionicPopup.alert({
                        title: $translate.instant('SCHEDULE_UPDATED'),
                        template: $translate.instant('SCHEDULE_UPDATED_AT') + ' ' + d.getHours() + ':' + ( m < 10 ? '0' + m : m )
                    }).then(function(){
                        alertVisible = false;
                    });

                }
                
            } else {
                console.log('do not update');
            }
            
            isLoading = false;
            
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
                    $scope.slider.slideTo(i);
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
    
    
    $scope.loadSchedule = function() {
        
        if (isLoading) {
            return;
        }
        
        isLoading = true;
     
        // Start loading animation
        $ionicLoading.show({
            template: $translate.instant('LOADING') + '...'
        });
        
        Schedule.load().then(function(){
            
            $scope.days = Schedule.all();
            
            $ionicLoading.hide(); 
            
            $scope.slider.update();

            $timeout(function(){
                slideToToday();
            }, 200);            
            
            isLoading = false;
            
        });
        
    }
    
    $scope.days = Schedule.all();
    
    if (!$scope.days.length) {
        
        $scope.loadSchedule();
        
    } else {
        
        slideToToday();
        checkUpdates();
    }
    
    // Set and then update locations
    Locations.load().then(function(){
        $scope.locations = Locations.all();
    });
    
    
    $scope.getLocation = function(location_id) {
        var location = Locations.get(location_id);
        return location ? location.title : '';
    }
    
    
    setInterval(function() {
        
        if ( !('onLine' in navigator) || navigator.onLine) {
            checkUpdates();
        }
        
    }, 20000);
    
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

.controller('LocationCtrl', function($scope, $state, $ionicHistory, $stateParams, $ionicLoading, 
    $translate, $ionicScrollDelegate, $ionicPopup, Locations) {

    if (typeof analytics !== 'undefined') {
        analytics.trackView('LocationDetail');
    }
    
    $scope.$on('$ionicView.enter', function() {
        if (typeof analytics !== 'undefined') { 
            analytics.trackEvent('Schedule', 'Location', $scope.location.title); 
        }
    });
  
  
    $ionicLoading.show({
        template: $translate.instant('LOADING') + '...'
    });
    
    
    $scope.location = Locations.get($stateParams.locationId);    
    
    if (!$scope.location) {
        
        Locations.load().then(function(){
            
            $scope.location = Locations.get($stateParams.locationId);
      
            if (!$scope.location) {
                
                $ionicLoading.hide();
          
                $ionicPopup.alert({
                    title: 'Location not found ('
                }).then(function(){
                    
                    // Go to parent view on error
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    
                    $state.go('tab.schedule');
                });
                
            }
            
        });
    }    
    
    
    /**
     * Map image loaded event handler
     * 
     * @returns {void}
     */
    $scope.stopLoading = function() {
        
        document.getElementById('location-map').style.width = (screen.width * 2) + "px";
        
        $ionicLoading.hide();
        $ionicScrollDelegate.$getByHandle('mapzoom').resize();
    }
    
});