/**
 * Local storage with ttl
 */
ls = {};

/**
 * Get data from localStorage
 * 
 * @param {string} key
 * @param {mixed} defaultValue
 * @returns {mixed}
 */
ls.get = function(key, defaultValue) {

    var defaultValue = defaultValue || null;
    
    if (!('localStorage' in window)) {
        return defaultValue;
    }
    
    if (typeof window.localStorage[key] === 'undefined') {
        return defaultValue;
    }
    
    var data = JSON.parse(window.localStorage[key]);

    if (typeof data.ts !== 'number') {
        return defaultValue;
    }
    
    if (data.ts < Date.now()/1000) {
        return defaultValue;
    }
    
    return data.value;
};


/**
 * Set data to localStorage
 * 
 * @param {string} key
 * @param {mixed} value
 * @param {int} ttl Time to leave in seconds
 * @returns {boolean}
 */
ls.set = function(key, value, ttl) {
    
    if (!('localStorage' in window)) {
        return false;
    }
    
    window.localStorage[key] = JSON.stringify({
        ts: Math.round(Date.now()/1000) + ttl,
        value: value
    });
    
    return true;
};