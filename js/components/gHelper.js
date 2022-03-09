/**
 * Helper functions
 *
 * @link       https://mickeyuk.github.io
 * @since      1.0.0
 */
function gHelper() { }

/**
 * Asynchronously loads something.
 * 
 * @param {*} callback 
 * @param {*} ms 
 * @param {*} triesLeft 
 * @returns 
 */
gHelper.asyncInterval = async function(callback, ms, triesLeft = 5) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
        if (await callback()) {
            resolve();
            clearInterval(interval);
        } else if (triesLeft <= 1) {
            reject();
            clearInterval(interval);
        }
        triesLeft--;
        }, ms);
    });
}

gHelper.isNumeric = function(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

/**
 * Clamps a value between a min and max.
 * 
 * @param {number} num  The number to clamp.
 * @param {number} min  The minimum value. 
 * @param {number} max  The maximum value. 
 * 
 * @returns {number}
 */
gHelper.clamp = function (num, min, max) {
    return Math.min(Math.max(num, min), max);
}