/**
 * Create properties without lang sufix for multilang properties
 * 
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

        var items = ls.get(lsKey, []);
        
        items = storeTranslations(items, $translate.use());

        var sourceUrl = 'http://feeds.tochka.net/ufw/designers/';
        
        return {
            
            load: function() {

                return $http.get(sourceUrl, { timeout: 10000 }).then(function(response){
                    
                    items = response.data;
                    
                    ls.set(lsKey, items, 3600);
                    
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

        var days = ls.get(lsKey, []);
        
        for (var i in days) {
            days[i].events = storeTranslations(days[i].events, $translate.use());
        }

        var sourceUrl = 'http://feeds.tochka.net/ufw/schedule/';

        var errorShow = false;

        return {
            
            load: function(silent) {
                
                var silent = silent || false;

                return $http.get(sourceUrl, { timeout: 10000 }).then(function(response){
                    
                    days = response.data;
                    
                    for (var i in days) {
                        days[i].events = storeTranslations(days[i].events, $translate.use());
                    }
                    
                    ls.set(lsKey, days, 900);
                    
                    return days;
                    
                }, function(){
                    
                    if (silent) {
                        return;
                    }
                    
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

        var items = ls.get(lsKey, { uk: {}, en: {}})[ $translate.use() ];

        var sourceUrl = 'http://feeds.tochka.net/ufw/';

        return {
            
            load: function() {

                return $http.get(sourceUrl, { timeout: 10000 }).then(function(response){
                    
                    items = response.data[ $translate.use() ];
                    
                    ls.set(lsKey, response.data, 900);
                    
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

        var items = ls.get(lsKey, []);
        
        items = storeTranslations(items, $translate.use());

        var sourceUrl = 'http://feeds.tochka.net/ufw/locations/';
        
        return {
            
            load: function() {

                return $http.get(sourceUrl).then(function(response){
                    
                    items = response.data;
                    
                    ls.set(lsKey, items, 900);
                    
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
