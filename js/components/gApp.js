/**
 * This handles data and core functionality for the game.
 *
 * @link       https://mickeyuk.github.io
 * @since      1.0.0
 */
function gApp() { }

/**
 * Default settings.
 */
 gApp.config = {
    lang: "en",
    volume: true
};

/**
 * The default generic sound effects.
 */
gApp.sounds = {
    "click": null,
    "whoosh": null
};

/**
 * il8n language support.
 */
gApp.lang = null;

/**
 * Player's total amount of money.
 */
gApp.money = 1000;

/**
 * Initial bet amount.
 */
gApp.bet = 0;

/**
 * The current pot.
 */
gApp.pot = 0;
 
/**
 * Number of times won.
 */
gApp.wins = 0;


/**
 * Win streak.
 */
gApp.bestStreak = 2;

/**
 * Highest total won.
 */
gApp.bestTotal = gApp.money;

/**
 * Can the player make bets?
 */
gApp.canBet = true;

/**
 * Made enough to cash out?
 */
gApp.canCashout = false;

/**
 * Multiplier for the win streak.
 */
gApp.multiplier = 1;

/**
 * Initializes the core app. Creates all the basic elements,
 * loads all the sounds and images.
 * 
 * @param {string} container The container to append the game to.
 */
gApp.Init = async function (container) {

    // Fetch language file
    return fetch(`lang/${gApp.config.lang}.json`)
    .then((res) => res.json())
        .then((translation) => {
        
            // Store language file
            gApp.lang = translation;

            // Initialize the UI
            var el = document.querySelector(container);
            gUI.Init(el);

            // Show loading screen
            gUI.LoadScreen();

            // Initialize default sound effects
            gApp.InitSounds();

    })
    .catch(() => {
        console.error(`Could not load ${gApp.config.lang}.json.`);
    });

}

/**
 * Toggles bet form functionality.
 */
gApp.ToggleBetForm = function () {

    gUI.betButton.innerHTML = 'Make Bet';

    if (gApp.canBet) {

        // Update max bet
        gUI.betInput.max = gApp.money;
        gUI.betInput.value = 0.10;

        // Enable form
        gUI.betForm.classList.remove("hidden");
        gUI.betButton.classList.remove("hidden");

    } else {

        // Stop bets
        gUI.betForm.classList.add("hidden");

        // Can cashout?
        if (gApp.canCashout) {

            // Payout button
            gUI.betButton.innerHTML = 'Cashout ' + gApp.pot + '$';

        } else {

            gUI.betButton.classList.add("hidden");

        }

    }

}

/**
 * Set the bet amount.
 */
gApp.SetBet = function () {

    //gUI.betInput.value = gHelper.clamp(parseFloat(gUI.betInput.value), 0.10, gApp.money).toFixed(2);
    if (gUI.betInput.value.length > 0 && !gHelper.isNumeric(gUI.betInput.value)) {
        gUI.betInput.value = 0.10.toFixed(2);
    }
    if (gUI.betInput.value > gApp.money) {
        gUI.betInput.value = gApp.money.toFixed(2);
    }
    if (gApp.money <= 0) { gUI.betInput.value = 0.10.toFixed(2); }

}

/**
 * Add to bet amount.
 * 
 * @param {number} amount   The amount to increase.
 */
gApp.AddBet = function (amount) {
    gUI.betInput.value = gHelper.clamp(parseFloat(gUI.betInput.value) + amount, 0.10, gApp.money).toFixed(2);
    if (gApp.money <= 0) { gUI.betInput.value = 0.10; }
}

/**
 * Add money to the pot and start.
 */
gApp.MakeBet = function () {

    // Can the player make bets?
    if (gApp.canBet) {

        // Update pot
        gApp.bet = parseFloat(gUI.betInput.value);
        gApp.pot += gApp.bet;
        gApp.money -= gApp.bet;

        // Update money value in appbar
        if (gUI.displayMoney) {
            gUI.title.innerHTML = gApp.money.toFixed(2) + '$';
            if (gApp.money <= 0) {
                gUI.title.classList.add("debt");
            } else {
                gUI.title.classList.remove("debt");
            }
        }
        
        // Player can make no more bets
        gApp.canBet = false;
        gUI.ToggleBetForm();

        // Start game
        game.NewRound();

    } else

    // Cashout
    if (gApp.canCashout) {
        
        game.Cashout();
            
    }

}

/**
 * Il8n language support.
 * 
 * @param {string} path    The JSON path.
 */
gApp._ = function (path) {
    
    var keys = path.split(".");
    var text = keys.reduce((obj, i) => obj[i], gApp.lang);

    return text;

}

/**
 * Initialises all the core sound effects.
 */
gApp.InitSounds = function () {
    gApp.sounds.click = new Audio("audio/click.wav");
    gApp.sounds.whoosh = new Audio("audio/whoosh.mp3");
}

/**
 * Plays a sound.
 * 
 * @param {Audio} sound     The sound to play.
 */
gApp.PlaySound = function (sound) {
    if (gApp.config.volume && sound) sound.play();
}

/**
 * Loads an image.
 * 
 * @param {*} path 
 * @returns 
 */
gApp.LoadImage = function (path) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = () => {
            console.log(`Loaded ${path}`);
            resolve(img);
        }
        img.onerror = () => reject(`Could not load image: ${path}`);
        img.src = path;
    });
}