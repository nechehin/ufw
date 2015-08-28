angular.module('ufw.services', [])

        
    .factory('Designers', function ($http, $ionicPopup, $translate) {

        var lsKey = 'Designers';

        var items = JSON.parse(window.localStorage[lsKey] || '[]');

        var sourceUrl = 'http://feeds.tochka.net/ua/ufw/designers/';

        return {
            
            load: function() {

                return $http.get(sourceUrl).then(function(response){
                    
                    items = response.data;
                    
                    window.localStorage[lsKey] = JSON.stringify(items);
                    
                    return items;
                    
                }, function(){
                    
                    $ionicPopup.alert({
                        title: $translate.instant('CONNECTION_ERROR')
                    });
                    
                }); 
            },
            
            all: function () {
                return items;
            },
            
            get: function (designerId) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].id === parseInt(designerId)) {
                        return items[i];
                    }
                }
                return null;
            }
        };
    })
    
    .factory('Schedule', function ($http, $ionicPopup, $translate) {

        var lsKey = 'Schedule';

        var days = JSON.parse(window.localStorage[lsKey] || '[]');

        var sourceUrl = 'http://feeds.tochka.net/ufw/schedule/';

        var errorShow = false;

        return {
            
            load: function() {

                return $http.get(sourceUrl).then(function(response){
                    
                    days = response.data;
                    
                    window.localStorage[lsKey] = JSON.stringify(days);
                    
                    return days;
                    
                }, function(){
                    
                    if (errorShow) {
                        return;
                    }
                    
                    errorShow = true;
                    
                    $ionicPopup.alert({
                        title: $translate.instant('CONNECTION_ERROR')
                    }).then(function(){
                        errorShow = false;
                    });
                                        
                }); 
            },
            
            all: function () {
                return days;
            }
        };
    })
    
    .factory('MainSlides', function ($http, $ionicPopup, $translate) {

        var lsKey = 'MainSlides';

        var items = JSON.parse(window.localStorage[lsKey] || '{"uk":{},"en":{}}')[ $translate.use() ];

        var sourceUrl = 'http://feeds.tochka.net/ufw/';

        return {
            
            load: function() {

                return $http.get(sourceUrl).then(function(response){
                    
                    items = response.data[ $translate.use() ];
                    
                    window.localStorage[lsKey] = JSON.stringify(response.data);
                    
                    return items;
                    
                }, function(){
                    
                    $ionicPopup.alert({
                        title: $translate.instant('CONNECTION_ERROR')
                    });
                    
                }); 
            },
            
            all: function () {
                return items;
            }
        };
    });
