angular.module('starter.controllers', [])

/* Filter for open links in native browser */
.filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_system', 'location=yes')\"");
        return $sce.trustAsHtml(newString);
    }
})

/**
 * Main slider
 * @param {type} $scope
 * @returns {undefined}
 */
.controller('InfoCtrl', function($scope, $ionicLoading, $ionicSlideBoxDelegate, $sce, MainSlides) {
    
    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };

    $scope.items = MainSlides.all();
 
    $scope.updateSlider = function() {
        // Start loading animation
        $ionicLoading.show({
            template: 'Завантаження...'
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
.controller('DesignersCtrl', function ($scope, $ionicLoading, Designers) {

    $scope.items = Designers.all();

    if (!$scope.items.length) {
        
        // Start loading animation
        $ionicLoading.show({
            template: 'Завантаження...'
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

.controller('DesignersDetailCtrl', function($scope, $stateParams, Designers) {

    $scope.item = Designers.get($stateParams.designerId);

})


/**
 * Format date in schedule day tab
 * @returns {Function}
 */
.filter('formatDate', function () {
    return function (text) {
        
        if (new Date(text).toDateString() === new Date().toDateString()) {
            return 'сьогодні, ' + text;
        }

        return text;
    }
})

.controller('ScheduleCtrl', function($scope, $ionicPlatform, $ionicSlideBoxDelegate, 
    $timeout, $ionicLoading, $ionicPopup, Schedule) {
    
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
                    title: 'Розклад оновлений',
                    template: 'Розклад був оновлений о ' + d.getHours() + ':' + ( m < 10 ? '0' + m : m )
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
            template: 'Завантаження...'
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
    
    
    setInterval(function() {
        
        if ( !('onLine' in navigator) || navigator.onLine) {
            checkUpdates();
        }
        
    }, 5000);
    
    
    $scope.$on('$ionicView.afterEnter', function(){
        $ionicSlideBoxDelegate.update();
    });
    
});