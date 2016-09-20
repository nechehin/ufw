var analytics = {};

analytics.startTrackerWithId = function(id) {
    
    if (typeof ga === 'undefined') {
        console.log('startTrackerWithId: GA not available');
        return;
    }
    
    ga.startTrackerWithId(id);
    
    console.log('startTrackerWithId', id);
};

analytics.trackView = function(view) {
    
    if (typeof ga === 'undefined') {
        console.log('trackView: GA not available');
        return;
    }
    
    ga.trackView(view);
    
    console.log('trackView', view);
};

analytics.trackEvent = function(category, action, label) {
    
    if (typeof ga === 'undefined') {
        console.log('trackEvent: GA not available');
        return;
    }
    
    ga.trackEvent(category, action, label);
    
    console.log('trackEvent', arguments);
};