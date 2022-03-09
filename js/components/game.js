/**
 * GAME SCRIPT
 *
 * @link       https://mickeyuk.github.io
 * @since      1.0.0
 */
function game() { }

/**
 * Skips the leaderboard form on start.
 */
game.skipForm = false;

/**
 * Free or playing for prizes.
 */
game.gameType = 'free';

/**
 * Player can draw another card.
 */
game.canDraw = true;

/**
 * Player can make a bet.
 */
game.canBet = true;

/**
 * Player needs to make prediction first.
 */
 game.canPredict = true;
 
/**
 * Player needs to make prediction first.
 */
game.canPlay = false;

/**
 * Did player win round?
 */
game.win = false;

/**
 * High or low
 */
game.prediction = 0;

/**
 * Player name
 */
game.playerName = '';

/**
 * Wallet address.
 */
game.playerWallet = '';

/**
 * Multiplier goal.
 */
 game.multiplierCount = 0;

/**
 * Multiplier goal.
 */
game.multiplierGoal = 5;

/**
 * Meme gif.
 */
game.ricardoGif = null;

/**
 * Creates a new instance of the game.
 * 
 * @param {string} container The container to append the game to.
 */
game.Init = function (container) {

    // Initialize sound effects
    gApp.sounds.draw = new Audio('audio/cards/draw.wav');
    gApp.sounds.lose = new Audio('audio/lose.wav');
    gApp.sounds.win = new Audio('audio/win.wav');
    gApp.sounds.ricardo = new Audio('audio/ricardo.wav');

    // Initialize the app
    gApp.Init(container).then(() => {
        
        // Base app initialized
        console.log('App initialized');

        // Setup cards
        gCards.Init().then(() => {

            // Load Ricardo gif
            game.ricardoGif = new Image();
            game.ricardoGif.src = 'img/ricardo.gif';
            
            // Finished loading
            gUI.HideModal();

            // New game options
            if (!game.skipForm) {

                // Start game options
                gUI.ShowModal(gApp._('modal.intro.title'), gApp._('modal.intro.content'), true, false);
    
                // Form
                var modalContent = document.getElementById('modal-content');
                var form = gUI.El('form', modalContent, 'new-game-form', ['game-form']);
                form.setAttribute('method', 'get');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                });
    
                // Wallet
                game.walletInput = gUI.InputText('BSC Wallet Address', null, null, null);
                game.walletInput.querySelector('input').setAttribute('required', '');
                form.appendChild(game.walletInput);
    
                // Name
                game.nameEl = gUI.InputText('Name', null, null, null);
                game.nameEl.querySelector('input').setAttribute('required', '');
                form.appendChild(game.nameEl);
    
                // Play for fun button
                var modalFooter = document.getElementById('modal-footer');
                var funBtn = gUI.ButtonSecondary('Play for Fun', () => {
                    game.Start('free');
                });
                modalFooter.appendChild(funBtn);
    
                // Continue button
                var continueBtn = gUI.ButtonPrimary('Continue', () => {
                    form.reportValidity();
                    if (form.checkValidity()) {
                        game.playerName = game.nameEl.querySelector('input').value;
                        game.playerWallet = game.walletInput.querySelector('input').value;
                        game.Start('paid');
                    }
                });
                modalFooter.appendChild(continueBtn);
    
            } else {

                game.Start('free');

            }

        });

    });

}

/**
 * Start the game.
 * 
 * @param {string} gameType The game type. 
 */
game.Start = function (gameType) {

    // Hide start form
    gUI.HideModal();

    // Set game type
    game.gameType = gameType;

    // New game
    game.NewGame();

}

/**
 * Starts a new game.
 */
game.NewGame = function () {

    // Get a new deck
    gCards.NewDeck();

    // Player cards row
    var row = gUI.Row('player-cards', '80%', '20px');
    gUI.gameFrame.appendChild(row);

    // Active card
    var col = gUI.Col('active-card');
    var card = gCards.Random();
    game.activeCard = card;
    col.appendChild(card.image);
    row.appendChild(col);

    // Deck
    var col = gUI.Col('card-deck');
    col.appendChild(gCards.Div());
    row.appendChild(col);

    // New game buttons
    var row = gUI.Row('new-game-buttons');
    gUI.gameFrame.appendChild(row);

    // Refresh/Draw button
    var btn = gUI.ButtonOutline('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.222 18.917c5.666-5.905-.629-10.828-5.011-7.706l1.789 1.789h-6v-6l1.832 1.832c7.846-6.07 16.212 4.479 7.39 10.085z"/></svg>',
        game.TakeCard);
    row.appendChild(btn);

}

/**
 * Start a new round once bet made.
 */
game.NewRound = function () {

    // Remove new game options
    document.getElementById('new-game-buttons').remove();

    // Resize player cards
    var playerCards = document.getElementById('player-cards');
    playerCards.style.width = '50%';

    var col = gUI.Col('prev-card');
    playerCards.prepend(col);

    // Add game cards
    var row = gUI.Row('game-cards', '80%', '20px');
    gUI.gameFrame.appendChild(row);

    // Add game buttons
    var row = gUI.Row('game-buttons', '100%', '20px');
    gUI.gameFrame.appendChild(row);

    // Low or same button
    var col = gUI.Col();
    row.appendChild(col);

    var lowBtn = gUI.ButtonPrimary('Low or Same', game.LowOrSame);
    lowBtn.id = 'low-btn';
    col.appendChild(lowBtn);
    lowBtn.addEventListener('click', () => {
        game.SetLow();
    });

    // Calculate odds
    gApp.wins = 1;
    var odds = game.CalculateOdds();
    gApp.wins = 0;

    var oddsEl = document.createElement('div');
    oddsEl.id = 'low-odds';
    oddsEl.classList.add('odds');
    oddsEl.innerHTML = '<b>Win:</b> ' + odds[0].toFixed(2) + '$';
    col.appendChild(oddsEl);

    // Selected
    var col = gUI.Col('predict-icon', '32px');
    row.appendChild(col);

    //var streakRow = gUI.Row('win-streak');
    //col.appendChild(streakRow);
    //streakRow.innerHTML = 'x2 Win Streak';

    // High button
    var col = gUI.Col();
    row.appendChild(col);

    var highBtn = gUI.ButtonSecondary('High or Same', game.LowOrSame);
    highBtn.id = 'high-btn';
    col.appendChild(highBtn);
    highBtn.addEventListener('click', () => {
        game.SetHigh();
    });

    var oddsEl = document.createElement('div');
    oddsEl.id = 'high-odds';
    oddsEl.classList.add('odds');
    oddsEl.innerHTML = '<b>Win:</b> ' + odds[1].toFixed(2) + '$';
    col.appendChild(oddsEl);

    // Deal cards
    game.Deal();

}

/**
 * Resets the game to the default state.
 */
game.Reset = function () {

    // Reset
    game.win = false;
    gApp.wins = 0;
    gApp.pot = 0;
    gApp.multiplier = 1;
    game.multiplierCount = 0;

    game.win = false;
    game.canDraw = true;
    game.canPredict = true;
    gApp.canCashout = false;
    gApp.canBet = true;

    // Reset UI
    gUI.ToggleBetForm();
    gUI.ToggleCashout();
    gUI.gameFrame.innerHTML = '';

}

/**
 * Creates a new card.
 * 
 * @returns {card}
 */
game.NewCard = function () {

    var activeCard = document.getElementById('active-card');
    var cardDeck = document.getElementById('card-deck');

    // Create new card
    var card = gCards.backImg.cloneNode(true);
    card.classList.add('card-dealt');
    card.classList.add('playing-card');

    card.addEventListener('animationend', () => {

        // Get random card
        var card = gCards.Random();
        activeCard.card = card;
        activeCard.lastChild.remove();

        // Card image
        var cardImg = card.image.cloneNode(true);
        cardImg.classList.add('card-turn');

        // Add card to active
        activeCard.appendChild(cardImg);

        // Set card
        game.activeCard = card;

        // Clearup
        cardImg.addEventListener('animationend', () => {
            activeCard.firstChild.remove();
            game.canDraw = true;
            cardDeck.classList.remove('card-deck-take');

            // Update odds
            game.ResetPrediction();

        });

    });

    return card;

}

/**
 * Draw a card.
 */
game.TakeCard = function () {

    if (!game.canDraw) return false;
    game.canDraw = false;

    // Sound
    gApp.PlaySound(gApp.sounds.draw);

    // Get new card
    var card = game.NewCard();

    // Add card to active
    var activeCard = document.getElementById('active-card');
    activeCard.appendChild(card);

    var cardDeck = document.getElementById('card-deck');
    cardDeck.classList.add('card-deck-take');

}

/**
 * Starts the game.
 */
game.StartGame = function () {

    if (gApp.canCashout) {

        game.Cashout();

    } else {

        gApp.canBet = false;

        // Remove new game options
        document.getElementById('new-game-buttons').remove();

        // Resize player cards
        var playerCards = document.getElementById('player-cards');
        playerCards.style.width = '80%';
        playerCards.style.marginBottom = '20px';

        var col = gUI.Col('prev-card');
        playerCards.prepend(col);
        
        // Add game cards
        var row = gUI.Row('game-cards', '60%', '20px');
        gUI.gameFrame.appendChild(row);
        game.Deal();

        // Add game buttons
        var row = gUI.Row('game-buttons', '80%', '20px');
        gUI.gameFrame.appendChild(row);

        // Low or same button
        var col = gUI.Col();
        row.appendChild(col);

        var lowBtn = gUI.ButtonPrimary('Low or Same', game.LowOrSame);
        lowBtn.id = 'low-btn';
        col.appendChild(lowBtn);
        lowBtn.addEventListener('click', () => {
            game.SetLow();
        });

        // Calculate odds
        var odds = game.CalculateOdds();
        console.log(odds);

        var oddsEl = document.createElement('div');
        oddsEl.id = 'low-odds';
        oddsEl.classList.add('odds');
        oddsEl.innerHTML = '<b>Win:</b> ' + odds[0].toFixed(2) + '$';
        col.appendChild(oddsEl);

        // Selected
        var col = gUI.Col();
        col.id = 'predict-icon';
        row.appendChild(col);
        col.style.maxWidth = '30px';
        col.innerHTML = '';

        // High button
        var col = gUI.Col();
        row.appendChild(col);

        var highBtn = gUI.ButtonSecondary('High or Same', game.LowOrSame);
        highBtn.id = 'high-btn';
        col.appendChild(highBtn);
        highBtn.addEventListener('click', () => {
            game.SetHigh();
        });

        var oddsEl = document.createElement('div');
        oddsEl.id = 'high-odds';
        oddsEl.classList.add('odds');
        oddsEl.innerHTML = '<b>Win:</b> ' + odds[1].toFixed(2) + '$';
        col.appendChild(oddsEl);

    }

}

/**
 * Calculate odds with current pot.
 * 
 * @returns {Array}
 */
game.CalculateOdds = function () {

    // Calculate odds
    var low = gHelper.clamp(Math.abs(14 - game.activeCard.value), 1, 14);
    var high = gHelper.clamp(Math.abs(2 - game.activeCard.value), 1, 14);
    return [
        low * (gApp.bet * gApp.wins),
        high * (gApp.bet * gApp.wins)
    ];

}

/**
 * Set low prediction
 */
game.SetLow = function () {

    if (game.canPredict) {

        // Toggle buttons
        var lowBtn = document.getElementById('low-btn');
        lowBtn.classList.remove('hidden');
        var highBtn = document.getElementById('high-btn');
        highBtn.classList.add('hidden');

        // Enable game cards
        var gameCards = document.getElementById('game-cards');
        gameCards.classList.remove('hidden');

        // Set icon
        var predictIcon = document.getElementById('predict-icon');
        predictIcon.innerHTML = gIcon.down;

        // Prediction made, can play
        game.prediction = 0;
        game.canPlay = true;

    }

}

/**
 * Set high prediction
 */
game.SetHigh = function () {

    if (game.canPredict) {

        // Toggle buttons
        var lowBtn = document.getElementById('low-btn');
        lowBtn.classList.add('hidden');
        var highBtn = document.getElementById('high-btn');
        highBtn.classList.remove('hidden');

        // Enable game cards
        var gameCards = document.getElementById('game-cards');
        gameCards.classList.remove('hidden');
        
        // Set icon
        var predictIcon = document.getElementById('predict-icon');
        predictIcon.innerHTML = gIcon.up;

        // Prediction made, can play
        game.prediction = 1;
        game.canPlay = true;

    }

}

/**
 * Let's see if we've won.
 * 
 * @param {HTMLElement} card 
 */
game.RevealCard = function (el) {

    // Sound effect
    gApp.PlaySound(gApp.sounds.draw);
    
    var card = el.target.parentNode;
    card.classList.add('card-flip');
    card.addEventListener('animationend', () => {

        if (card.classList.contains('card-flip')) {

            // Turn over card
            card.classList.remove('card-flip');
            card.classList.add('card-reveal');

            // Get random card
            card.innerHTML = '';
            var randomCard = gCards.Random();
            var cardImg = randomCard.image.cloneNode(true);
            card.appendChild(cardImg);
            game.selectedCard = randomCard;

            // Did we win?
            card.addEventListener('animationend', (e) => {
                
                // Stop player interaction
                game.canPlay = false;
                game.canPredict = false;
                var gameButtons = document.getElementById('game-buttons');
                gameButtons.classList.add('hidden');

                // Did we win
                game.Evaluate();

                // Next round or end
                setTimeout(() => {
                    game.NextRound();
                }, 2000);

            });

        }

    });

}

/**
 * Calculates winnings.
 */
game.Evaluate = function () {

    // Get prediction
    if (
        (!game.prediction && game.selectedCard.value <= game.activeCard.value) ||
        (game.prediction && game.selectedCard.value >= game.activeCard.value)
    ) {

        // Multiplier?
        game.multiplierCount++;
        if (game.multiplierCount >= game.multiplierGoal) {
            game.multiplierCount = 0;
            gApp.multiplier++;
            gUI.multiplier.innerHTML = `x${gApp.multiplier} Score Multiplier!`;
            gUI.multiplier.classList.add('active');

            var ricardo = gUI.El('div', gUI.betFrame, 'ricardo');
            ricardo.appendChild(game.ricardoGif);
            gApp.PlaySound(gApp.sounds.ricardo);
            setTimeout(() => {
                ricardo.remove();
            }, 2500);

        }

        // Calculate money from odds
        var odds = game.CalculateOdds();

        // Win
        gApp.PlaySound(gApp.sounds.win);
        game.win = true;
        gApp.wins += (1 * gApp.multiplier);

        // Add to pot
        gApp.pot += odds[game.prediction];

        // Update score
        gUI.score.innerHTML = gApp.wins;

    } else {

        // Lose
        gApp.PlaySound(gApp.sounds.lose);
        game.win = false;
        gApp.wins = 0;

        // Empty pot
        gApp.pot = 0;

    }

}

/**
 * Deals out 3 cards.
 */
game.Deal = function () {

    var row = document.getElementById('game-cards');
    row.innerHTML = '';
    row.classList.add('hidden');
    var cardDiv = gCards.Div();
    for (var i = 0; i < 3; i++) {

        var col = gUI.Col('game-card');
        row.appendChild(col);

        var card = gCards.Div();
        col.appendChild(card);
        card.addEventListener('click', (e) => {
            if (game.canPlay) {
                game.canPlay = false;
                game.RevealCard(e);
            }
        });

    }

}

/**
 * Reset prediction buttons.
 */
game.ResetPrediction = function () {

    var odds = game.CalculateOdds();
    var lowOdds = document.getElementById('low-odds');
    if (lowOdds) lowOdds.innerHTML = '<b>Win:</b> ' + odds[0].toFixed(2) + '$';
    var highOdds = document.getElementById('high-odds');
    if (highOdds) highOdds.innerHTML = '<b>Win:</b> ' + odds[1].toFixed(2) + '$';;
    
    var gameButtons = document.getElementById('game-buttons');
    if (gameButtons) gameButtons.classList.remove('hidden');
    var lowBtn = document.getElementById('low-btn');
    if (lowBtn) lowBtn.classList.remove('hidden');
    var highBtn = document.getElementById('high-btn');
    if (highBtn) highBtn.classList.remove('hidden');
    
}

/**
 * Next round or end game.
 */
game.NextRound = function () {

    // Did player win?
    if (game.win) {

        // Take a new card
        game.TakeCard();

        // Deal out another 3 cards
        game.Deal();

        // Play again
        win = false;
        game.canPredict = true;
        game.canPlay = false;

        // Can cashout
        gApp.canCashout = true;
        gUI.ToggleCashout();

    } else {

        // Reset
        game.Reset();

        // Reset game
        game.NewGame();

    }

}

/**
 * Player takes winnings.
 */
game.Cashout = function () {

    // Take winning
    gApp.money += gApp.pot;
    gApp.pot = 0;
    gUI.title.innerHTML = gApp.money.toFixed(2) + '$';

    // Update leaderboard
    if (game.gameType = 'paid') game.UpdateLeaderboard();

    // Reset
    game.Reset();

    // Reset game
    game.NewGame();

}

/**
 * Update leaderboard.
 */
game.UpdateLeaderboard = function () {

    // Get leaderboard
    var leaderboard = document.getElementById('leaderboard');
    
    // Beaten your own score?
    if (gApp.wins > gApp.bestStreak) {
     
        // Update streak
        gApp.bestTotal = gApp.money;
        gApp.bestStreak = gApp.wins;

        // Update leaderboard
        console.log("New best score!");
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", gApp.processUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            name: game.playerName,
            wallet: game.playerWallet,
            wins: gApp.wins,
            money: gApp.money,
            token: game.token
        }));
        xhr.onload = function() {
            console.log("Leaderboard updated!");
            //console.log(this.responseText);
        }
        
    }

}