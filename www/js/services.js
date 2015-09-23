/**
 * Create properties without lang sufix for multilang properties
 * @param {object} items
 * @param {string} lang
 * @returns {object}
 */
function storeTranslations(items, lang) {
            
    var langSufix = '_' + lang;

    for (var i in items) {
        for (var property in items[i]) {
            if (property.indexOf(langSufix) >= 0) {
                items[i][property.replace(langSufix, '')] = items[i][property];
            }
        }
    }
    
    return items;
}

angular.module('ufw.services', [])

        
    .factory('Designers', function ($http, $ionicPopup, $translate) {

        var lsKey = 'Designers';

        var items = JSON.parse(window.localStorage[lsKey] || '[]');
        
        items = storeTranslations(items, $translate.use());

        var sourceUrl = 'http://feeds.tochka.net/ufw/designers/';
        
        return {
            
            load: function() {

                return $http.get(sourceUrl).then(function(response){
                    
                    items = response.data;
                    
                    window.localStorage[lsKey] = JSON.stringify(items);
                    
                    items = storeTranslations(items, $translate.use());
                    
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
        
        for (var i in days) {
            days[i].events = storeTranslations(days[i].events, $translate.use());
        }

        var sourceUrl = 'http://feeds.tochka.net/ufw/schedule/';

        var errorShow = false;

        return {
            
            load: function() {

                return $http.get(sourceUrl).then(function(response){
                    
                    days = response.data;
                    
                    for (var i in days) {
                        days[i].events = storeTranslations(days[i].events, $translate.use());
                    }
                    
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
            },
            
            getEvent: function(id) {
                for (var i in days) {
                    for (var n in days[i].events) {
                        if (days[i].events[n].id == id) {
                            return days[i].events[n];
                        }
                    }
                }
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
    })
    
    .factory('Locations', function ($http, $ionicPopup, $translate) {

        var lsKey = 'Locations';

        var items = JSON.parse(window.localStorage[lsKey] || '[]');
        
        items = storeTranslations(items, $translate.use());

        var sourceUrl = 'http://feeds.tochka.net/ufw/locations/';
        
        return {
            
            load: function() {

                return $http.get(sourceUrl).then(function(response){
                    
                    items = response.data;
                    
                    window.localStorage[lsKey] = JSON.stringify(items);
                    
                    items = storeTranslations(items, $translate.use());
                    
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
            
            get: function (locationId) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].id === parseInt(locationId)) {
                        return items[i];
                    }
                }
                return null;
            }
        };
    });
