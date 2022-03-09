/**
 * Handles all the stuff for playing cards.
 *
 * @link       https://mickeyuk.github.io
 * @since      1.0.0
 */
function gCards() { }

/**
 * The playing cards.
 */
gCards.cards = [];

/**
 * The deck of cards.
 */
gCards.deck = [];

/**
 * The card deck back image.
 */
gCards.backImg = null;

/**
 * Initializes the deck of cards.
 */
gCards.Init = function () {

    // For each suit
    var cards = [];
    var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
    for (var i = 0; i < suits.length; i++) {

        // Value cards
        for (var j = 2; j <= 10; j++) {

            // Create a new card
            var card = {
                suit: suits[i],
                value: j,
                name: j,
                imageUrl: `img/cards/${j}_of_${suits[i]}.png`,
                image: null
            };
            cards.push(card);

        }

        // Jack
        var card = {
            suit: suits[i],
            value: 11,
            name: 'jack',
            imageUrl: `img/cards/jack_of_${suits[i]}2.png`,
            image: null
        };
        cards.push(card);

        // Queen
        var card = {
            suit: suits[i],
            value: 12,
            name: 'queen',
            imageUrl: `img/cards/queen_of_${suits[i]}2.png`,
            image: null
        };
        cards.push(card);

        // King
        var card = {
            suit: suits[i],
            value: 13,
            name: 'king',
            imageUrl: `img/cards/king_of_${suits[i]}2.png`,
            image: null
        };
        //card.image.classList.add('playing-card');
        cards.push(card);

        // Ace
        var card = {
            suit: suits[i],
            value: 14,
            name: 'ace',
            imageUrl: `img/cards/ace_of_${suits[i]}.png`,
            image: null
        };
        cards.push(card);

    }

    // Add cards
    gCards.cards = cards;

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            gCards.loadImages().then(() => {
                resolve();
            });
        }, 500);
    });

}

/**
 * Loads all the card images.
 * 
 * @returns {Promise}
 */
gCards.loadImages = function () {

    var promises = [];

    // For each card
    for (var i = 0; i < gCards.cards.length; i++) {

        // Create a new image
        var img = new Image();
        img.classList.add('playing-card');

        // Add the image to the card
        gCards.cards[i].image = img;

        // Add the image to the promise
        promises.push(new Promise(function (resolve, reject) {

            // When the image is loaded
            img.onload = function () {
                resolve();
            }

            // Set the image source
            img.src = gCards.cards[i].imageUrl;

        }));

    }

    // Back image
    gCards.backImg = new Image();
    gCards.backImg.classList.add('playing-card');
    promises.push(new Promise(function (resolve, reject) {
        gCards.backImg.onload = function () {
            resolve();
        }
        gCards.backImg.src = 'img/cards/back.png';
    }))

    // Return the promise
    return Promise.all(promises);

}

/**
 * Creates a new deck.
 */
gCards.NewDeck = function () {
    gCards.deck = gCards.cards.slice();
}

/**
 * Shuffles the deck of cards.
 */
gCards.Shuffle = function () {
    if (gCards.deck.length == 0) return false;
    gCards.deck.sort(function () { return 0.5 - Math.random() });
}

/**
 * Returns a random card from the deck.
 * 
 * @returns {Card}
 */
gCards.Random = function () {
    if (gCards.deck.length == 0) return false;
    var card = gCards.deck[Math.floor(Math.random() * gCards.deck.length)];
    return card;
}

/**
 * Takes a card from the deck.
 * 
 * @returns {Card}
 */
gCards.Take = function () {

    // Take a card from the deck
    var card = gCards.deck.shift();

    // Return the card
    return card;

}

/**
 * Return card HTML element.
 * 
 * @param {Card} card 
 */
gCards.Div = function (card = null) {
    
    var div = document.createElement('div');
    div.classList.add('playing-card');
    if (card) {
        div.appendChild(card.image);
    } else {
        div.appendChild(gCards.backImg.cloneNode(true));
    }

    return div;

}