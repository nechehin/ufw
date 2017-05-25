var analytics = {};

/**
 * Init GA counter
 * 
 * @param {String} id
 * @returns {void}
 */
analytics.startTrackerWithId = function(id) {
    
    if (typeof ga === 'undefined') {
        console.log('startTrackerWithId: GA not available');
        return;
    }
    
    ga.startTrackerWithId(id);
    
    console.log('startTrackerWithId', id);
};

/**
 * Send trackView
 * 
 * @param {String} view
 * @returns {void}
 */
analytics.trackView = function(view) {
    
    if (typeof ga === 'undefined') {
        console.log('trackView: GA not available');
        return;
    }
    
    ga.trackView(view);
    
    console.log('trackView', view);
};

/**
 * Send trackEvent
 * 
 * @param {String} category
 * @param {String} action
 * @param {String} label
 * @returns {void}
 */
analytics.trackEvent = function(category, action, label) {
    
    if (typeof ga === 'undefined') {
        console.log('trackEvent: GA not available');
        return;
    }
    
    ga.trackEvent(category, action, label);
    
    console.log('trackEvent', arguments);
};