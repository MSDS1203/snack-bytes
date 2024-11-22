/* TO DO: 
1. customize
3. replay
4. show high score
5. sound effects
*/

console.log("start");

// array of 4 suits and 13 possible card values
var suits = ["hearts", "diamonds", "clubs", "spades"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

var d = document;
console.log(document);
var deck = []; // holder for all cards
var stock = []; // deck to draw from
var discard = []; // cards not used from deck

// making slots for each suit
var hearts = [];
var diamonds = [];
var clubs = [];
var spades = [];

// game board
var slots = [];
slots[1] = slots[2] = slots[3] = slots[4] = slots[5] = slots[6] = slots[7] = [];
var table = [];
table['deck-pile'] = stock;
table['discard'] = discard;
table['hearts'] = hearts;
table['diamonds'] = diamonds;
table['clubs'] = clubs;
table['spades'] = spades;
table['pile-slots'] = slots;

// start game shown cards
var playedCards = '#discard .card,' + '#suit-slots .card,' + '#pile-slots .card:last-child';

// canvas features
var _timer = d.querySelector('#score .timer');
var _timerSpan = d.querySelector('#score .timer span');
var _moveCount = d.querySelector('#score .moves');
var _moveCountSpan = d.querySelector('#score .moves span');
var _score = d.querySelector('#score .score');
var _scoreSpan = d.querySelector('#score .score span');
var _playPause = d.querySelector('#play-pause');
var _gameBoard = d.querySelector('#table');
var _upper = d.querySelector('#table .upper-slots');
var _lower = d.querySelector('#table .lower-slots');
var _deckPile = d.querySelector('#deck-pile');
var _discardPile = d.querySelector('#discard');
var _suitSlots = d.querySelector('#suit-slots');
var _pileSlots = d.querySelector('#pile-slots');
var _autoWin = d.querySelector('#auto-win');

// other features
var clock = 0;
var time = 0;
var moves = 0
var currScore = 0;
var lastEventTime = 0;
var unplayedCards = [];

deck = getDeck(); // create deck
console.log(deck);
console.log("create deck");
deck = shuffle(deck); // shuffles deck
console.log("shuffle");
console.log(deck);
table = dealCards(deck, table); // deal deck
console.log("dealing");
renderTable(table, playedCards); // render table
console.log("rendering");
gamePlay(table); // start game
console.log("game start");


// event handlers
window.onresize = function(event) {
    sizeCards();
}

// FUNCTIONS

function getDeck() {
    // creates the deck of cards
    let makeDeck = [];
    for(let i = 0; i < suits.length; i++) {
        for(let x = 0; x < values.length; x++) {
            let card = {Value: values[x], Suit: suits[i]};
            makeDeck.push(card);
        }
    }
    return makeDeck;
}

function shuffle(deck) {
    // switches the places of 2 random cards 1000 times
    for(let i = 0; i < 1000; i++) {
        let place1 = Math.floor((Math.random() * deck.length));
        let place2 = Math.floor((Math.random() * deck.length));
        let temp = deck[place1];
        deck[place1] = deck[place2];
        deck[place2] = temp;
    }
    return deck;
}

function dealCards(deck, table) {
    table['deck-pile'] = deck;
    console.log(deck);
    var tab = table['pile-slots'];
    for ( var row = 1; row <= 7; row++ ) {
        for ( var pile = row; pile <= 7; pile++ ) {
            if ( row === 1 ) tab[pile] = [];
            move(table['deck-pile'], tab[pile], false);
        }
    }
    return table;
}

function move(from, to, pop, selectedCards = 1) {
    if( pop !== true ) {
        var card= from.shift();
        to.push(card);
    } else {
        while ( selectedCards ) {
            var card = from[from.length - selectedCards];
            from.splice(from.length - selectedCards, 1);
            to.push(card);
            selectedCards--;
        }
    }
    return;
}

function renderTable(table, playedCards) {
    // check for played cards and empty piles
    playedCards = checkForPlayedCards(playedCards);
    emptyPiles = checkForEmptyPiles(table)

    // update the game board
    update(table['deck-pile'], '#deck-pile ul', playedCards, true);
    update(table['discard'], '#discard ul', playedCards);
    update(table['hearts'], '#hearts ul', playedCards);
    update(table['diamonds'], '#diamonds ul', playedCards);
    update(table['clubs'], '#clubs ul', playedCards);
    update(table['spades'], '#spades ul', playedCards);
    var tab = table['pile-slots'];
    for ( var i = 1; i <= 7; i++ ) {
        update(tab[i], '#pile-slots li:nth-child('+i+') ul', playedCards, true);
    }

    // get unplayed cards
    unplayedCards = getUnplayedCards();
    sizeCards();

    // show table
    _gameBoard.style.opacity = '100';
    console.log(table);
    return;
}

function update(pile, selector, playedCards, append) {
    var e = d.querySelector(selector);
    var children = e.children;
    var grandparent = e.parentElement.parentElement;
    e.innerHTML = '';
    for ( var card in pile ) {
        card = pile[card];
        var html = getTemplate(card);
        createCard(card, selector, html, append);
    }

    flipCards(playedCards, 'up');
    var played = countPlayedCards(children);
    e.parentElement.dataset.played = played;
    
    if ( grandparent.id === 'pile-slot' || grandparent.id === 'suit-slots' ) {
        var playedAll = parseInt(grandparent.dataset.played);
        if ( isNaN(playedAll) ) playedAll = 0;
        grandparent.dataset.played = playedAll + played;
    }

    var unplayed = countUnplayedCards(children);
    e.parentElement.dataset.unplayed = unplayed;

    if ( grandparent.id === 'pile-slots' || grandparent.id === 'suit-slots' ) {
        var unplayedAll = parseInt(grandparent.dataset.unplayed);
        if( isNaN(unplayedAll) ) unplayedAll = 0;
        grandparent.dataset.unplayed = unplayedAll + unplayed;
    }
    return pile;
}

function getTemplate(card) {
    var value = card.Value;
    var suit = card.Suit;

    var html = d.querySelector('.template li[data-rank="'+value+'"]').innerHTML;

    html = html.replace('{{suit}}', suit);
    return html;
}

function createCard(card, selector, html, append) {
    var value = card.Value; // get value
    var suit = card.Suit; // get suit
    var temp = selector.includes('#spades');
    // get pile based on what the user clicks
    if (selector.includes('#deck-pile')) var p = 'deck-pile';
    if (selector.includes('#discard')) var p = 'discard';
    if (selector.includes('#hearts')) var p = 'hearts';
    if (selector.includes('#diamonds')) var p = 'diamonds';
    if (selector.includes('#clubs')) var p = 'clubs';
    if (temp) var p = 'spades';
    if (selector.includes('#pile-slots')) var p = 'pile-slots';
    var e = d.createElement('li'); // create li element for the selected pile/card
    e.className = 'card'; // add .card class to element
    e.dataset.value = value; // set value attribute
    e.dataset.suit = suit; // set suit attribute
    e.dataset.pile = p; // set pile attribute
    e.dataset.selected = 'false'; // set selected attribute
    e.innerHTML = html; // insert html to element
    // query for pile
    var pile = d.querySelector(selector);
    console.log(pile);
    // append to selected pile
    if ( append ) pile.appendChild(e);
    // or prepend to selected pile
    else pile.insertBefore(e, pile.firstChild);
    return;
}

function checkForPlayedCards(playedCards) {
    // query
    var eles = d.querySelectorAll('.card[data-played="true"]');
    for ( var e in eles ) {
        e = eles[e];
        if ( e.nodeType ) {
            var value = e.dataset.value;
            var suit = e.dataset.suit;
            playedCards += ', .card[data-rank="'+value+'"][data-suit="'+suit+'"]';
        }
    }
    return playedCards;
}

function checkForEmptyPiles(table) {
    // reset empty data on all piles
    var eles = d.querySelectorAll('.pile'); // query elements
    for ( var e in eles ) {
        e = eles[e];
        if ( e.nodeType ) {
            delete e.dataset.empty;
        }
    }
    // open pile to always have piles
    var emptyPiles = '#fake.pile';
    // check hearts pile
    if ( table['hearts'].length === 0 ) {
        emptyPiles += ', #suit-slots #hearts.pile';
    }
    // check diamonds pile
    if ( table['diamonds'].length === 0 ) {
        emptyPiles += ', #suit-slots #diamonds.pile';
    }
    // check clubs pile
    if ( table['clubs'].length === 0 ) {
        emptyPiles += ', #suit-slots #clubs.pile';
    }
    // check spades pile
    if ( table['spades'].length === 0 ) {
        emptyPiles += ', #suit-slots #spades.pile';
    }
    // check table slots
    var tab = table['pile-slots'];
    for ( var i = 1; i <= 7; i++ ) {
        if ( tab[i].length === 0 ) {
            emptyPiles += ', #pile-slots li:nth-child('+i+').pile';
        }
    }
    // mark piles as empty
    eles = d.querySelectorAll(emptyPiles); // query elements
    for ( var e in eles ) {
        e = eles[e];
        if ( e.nodeType ) {
            e.dataset.empty = 'true'; // mark as empty
        }
    }
    return emptyPiles;
}

function countPlayedCards(cards) {
    var played = 0;
    for ( var card in cards ) {
        card = cards[card];
        if ( card.nodeType ) {
            // check if card has been played
            if ( card.dataset.played === 'true' ) played++;
        }
    }
    return played;
}

function countUnplayedCards(cards) {
    var unplayed = 0;
    for ( var card in cards ) {
        card = cards[card];
        if ( card.nodeType ) {
            // check if card has been played
            if ( card.dataset.played !== 'true' ) unplayed++;
        }
    }
    return unplayed;
}

function flipCards(selectors, direction) {
    var eles = d.querySelectorAll(selectors); // query all elements
    for ( var e in eles ) { // loop through elements
        e = eles[e];
        if ( e.nodeType ) {
            switch( direction ) {
                case 'up' :
                    if ( e.dataset.played !== 'true' ) {
                        // flipping pile card
                        if ( e.dataset.pile === 'pile-slots' ) {
                            for ( var card in unplayedCards ) { // loop through unplayed cards
                                card = unplayedCards[card];
                                // add 5 to score if suit and value match
                                if ( e.dataset.value === card[0] && e.dataset.suit === card[1] ) 
                                    updateScore(5);
                            }
                        }
                        e.className += 'up'; // add class
                        e.dataset.played = 'true'; // mark as played
                    }
                    break;
                case 'down' :
                    e.className = 'card'; // reset class
                    delete e.dataset.played; // reset played data attribute
                default : break;
            }
        }
    }
    return;
}

function getUnplayedCards() {
    // reset array
    unplayedCards = [];
    // get all face down cards
    var eles = d.querySelectorAll('#pile-slots .card:not([data-played="true"])');
    for ( var e in eles ) {
        e = eles[e];
        if ( e.nodeType ) {
            unplayedCards.push( [ e.dataset.value, e.dataset.suit ] );
        }
    }
    return unplayedCards;
}

function sizeCards(selector = '.pile', ratio = 1.4) {
    var s = selector;
    var r = ratio;
    var e = d.querySelector(s); // query element
    var h = e.offsetWidth * r; // height of the card
    // set row heights
    _upper.style.height = h + 10 + 'px';
    _lower.style.height = h + 120 + 'px';
    // set height of cards
    var eles = d.querySelectorAll(s); // query all elements
    for ( var e in eles ) { // loop through elements
        e = eles[e];
        if ( e.nodeType ) e.style.height = h + 'px'; // set height in css
    }
}

function gamePlay(table) {
    // check for winning table
    if ( checkWin(table) ) return;
    // check for autowin
    checkAutoWin(table);
    // bind click events
    bindClick(
        '#deck-pile .card:first-child,' +
        '#discard .card:first-child,' +
        '#suit-slots .card:first-child,' +
        '#pile-slots .card[data-played="true"]'
    );
    // bind double click events
    bindClick(
        '#discard .card:first-child,' +
        '#pile-slots .card:last-child',
        'double'
    );
}

function bindClick(selectors, double) {
    var eles = d.querySelectorAll(selectors); // query all elements
    // loop through elements
    for ( var e in eles ) {
        e = eles[e];
        // add event listener
        if ( e.nodeType ) {
            if ( !double ) e.addEventListener('click', select);
            else e.addEventListener('dblclick', select);
        }
    }
    return;
}

function unbindClick(selectors, double) {
    var eles = d.querySelectorAll(selectors); // query all elements
    // loop through elements
    for ( var e in eles ) {
        e = eles[e];
        // remove event listener
        if ( e.nodeType ) {
            if ( !double ) e.removeEventListener('click', select);
            else e.removeEventListener('dblclick', select);
        }
    }
    return;
}

// click handler: select
var clicks = 0; // set counter for counting clicks
var clickDelay = 200; // set delay for double click
var clickTimer = null; // set timer for timeout function
function select(event) {
    // prevent default
    event.preventDefault();
    // start timer
    if ( _timer.dataset.action !== 'start' ) {
        timer('start');
    }
    // if timestamp matches return false
    var time = event.timeStamp; // get timestamp
    if ( time === lastEventTime ){
        return false;
    }
    else{ 
        lastEventTime = time; // cache timestamp
    }
        // get variables
    var e = event.target; // get element
    var value = e.dataset.value; // get value
    var suit = e.dataset.suit; // get suit
    var pile = e.dataset.pile; // get pile
    var action = e.dataset.action; // get action
    // create card array
    if ( value && suit ) var card = [value,suit];
    // count clicks
    clicks++;
    // single click
    if ( clicks === 1 && event.type === 'click' ) {
        clickTimer = setTimeout(function() {
            // reset click counter
            clicks = 0;
            // if same card is clicked
            if ( e.dataset.selected === 'true' ) {
                // deselect card
                delete e.dataset.selected;
                delete _gameBoard.dataset.move;
                delete _gameBoard.dataset.selected;
                delete _gameBoard.dataset.source;
            }
            // if move in progress
            else if ( _gameBoard.dataset.move ) {
                // get selected
                var selected = _gameBoard.dataset.selected.split(',');
                // update table dataset with destination pile
                _gameBoard.dataset.to = e.closest('.pile').dataset.pile;
                // get destination card or pile
                if ( card ) var to = card;
                else var to = _gameBoard.dataset.to;
                // validate move
                if ( validateMove(selected, to) ) {
                    // make move
                    makeMove();
                    reset(table);
                    renderTable(table, playedCards);
                    gamePlay(table);
                } else {
                    reset(table);
                    renderTable(table, playedCards);
                    gamePlay(table);
                }
            }
            // if stock is clicked
            else if ( pile === 'deck-pile' ) {
                // if stock isn't empty
                if ( table['deck-pile'].length ) {
                    // move card from deck pile to discard
                    move(table['deck-pile'], table['discard']);
                    reset(table);
                    renderTable(table, playedCards);
                    // if empty, then bind click to deck pile element
                    if ( table['deck-pile'].length === 0 ) bindClick('#deck-pile .reload-icon');
                    // count move
                    countMove(moves++);
                    // return to play
                    gamePlay(table);
                }
            }
            // if stock reload icon is clicked
            else if ( action === 'reload' ) {
                // remove event listener
                unbindClick('#deck-pile .reload-icon');
                // reload deck pile
                if ( table['discard'].length ) {
                    table['deck-pile'] = table['discard']; // move discard to stock
                    table['discard'] = []; // empty discard
                }
                // render table
                renderTable(table, playedCards);
                // turn all deck cards face down
                flipCards('#deck-pile .card', 'down');
                // update score
                updateScore(-100);
                // return to play
                gamePlay(table);
            }
            // if no move is in progress
            else {
                // select card
                e.dataset.selected = 'true';
                _gameBoard.dataset.move = 'true';
                _gameBoard.dataset.selected = card;
                _gameBoard.dataset.source = e.closest('.pile').dataset.pile;
                // if ace is selected
                if ( value === 'A' ) {
                    bindClick('#suit-slots #'+suit+'s.pile[data-empty="true"]');
                }
                if ( value === 'K' ) {
                    bindClick('#pile-slots .pile[data-empty="true"]');
                }
            }
        }, clickDelay);
    }
    // double click
    else if ( event.type === 'doubleClick' ) {
        clearTimeout(clickTimer); // prevent single click
        clicks = 0; // reset click counter
        // select card
        e.dataset.selected = 'true';
        _gameBoard.dataset.move = 'true';
        _gameBoard.dataset.selected = card;
        _gameBoard.dataset.source = e.closest('.pile').dataset.pile;
        // get destination pile
        if ( card ) var to = card[1]+'s';
        // update table dataset with destination
        _gameBoard.dataset.to = to;
        // validate move
        if ( validateMove(card, to) ) {
            // make move
            makeMove();
            reset(table);
            renderTable(table, playedCards);
            gamePlay(table);
        } else {
            reset(table);
            renderTable(table, playedCards);
            gamePlay(table);
        }
    }
}

function validateMove(selected, to) {
    // if selected card exists
    if ( selected ) {
        var cardValue = parseValueAsInt(selected[0]);
        var cardSuit = selected[1];
    }
    // if destination is another card
    if ( to.constructor === Array ) {
        var toValue = parseValueAsInt(to[0]);
        var toSuit = to[1];
        var toPile = _gameBoard.dataset.to;
        // if destination pile is one of the suit slots
        if ( ['hearts', 'diamonds', 'clubs', 'spades'].indexOf(toPile) >= 0 ) {
            // if value is not the next in the sequence, invalid move
            if ( cardValue - toValue !== 1 ) return false;
            // if the card suit doesn't match the suit of the destination pile, invalid move
            if ( toSuit !== cardSuit ) return false;
        }
        // if the destination pile is one of the game board slots
        else {
            // if the value is not the next in the sequence, invalid move
            if( toValue - cardValue !== 1 ) return false;
            // if the destination suit and card suit are not different colors, invalid move
            if ( ( ( toSuit === 'hearts' || toSuit === 'diamonds' )
                 && ( cardSuit === 'hearts' || cardSuit === 'diamonds' ) )
                 || ( ( toSuit === 'spades' || toSuit === 'clubs' )
                 && ( cardSuit === 'spades' || cardSuit === 'clubs') ) ) {
                    return false;
            }
        }
        // otherwise allow the move
        return true
    }
    // if destination pile is one of the suit slots
    if ( ['hearts', 'diamonds', 'clubs', 'spades'].indexOf(toPile) >= 0 ) {
        // get last card in that pile
        var lastCard = d.querySelector('#'+to+' .card:first-child');
        if ( lastCard ) {
            var toValue = parseValueAsInt(lastCard.dataset.value);
            var toSuit = lastCard.dataset.suit;
        }
        // if suits don't match, invalid move
        if ( cardSuit !== toSuit ) return false;
        // if the card is an ace, valid move
        else if ( cardValue === 1 ) return true;
        // if the value isn't next in the sequence, invalid move
        else if ( cardValue - toValue !== 1 ) return false;
        // otherwise it is a valid move
        else return true;
    }
    // if the destination pile is one of the game board piles
    if ( to >= 1 && to <= 7 ) {
        // if value is not a King, invalid move
        if ( cardValue !== 13 ) return false;
        // otherwise, valid move
        else return true;
    }
}

function makeMove() {
    // get to and from piles
    var from = _gameBoard.dataset.from;
    var to = _gameBoard.dataset.to;
    // if from is the discard pile
    if ( from === 'discard' ) {
        // if to is suit slot
        if( isNaN(to) ) {
            move(table[from], table[to], true);
            updateScore(10); // score +10 points
        }
        // if to is pile slot
        else {
            move(table[from], table['pile-slots'][to], true);
            updateScore(5) // score +5 points
        }
    }
    // if pulling card from suit slot
    else if ( ['hearts', 'diamonds', 'clubs', 'spades'].indexOf(toPile) >= 0 ) {
        // only allow move to pile slots
        if( isNaN(to) ) return false;
        // if moving to pile slot
        else {
            move(table[from], table['pile-slots'][to], true);
            updateScore(-15) // score -15 points
        }
    }
    // if from is pile slots
    else {
        // if to is suit slot
        if ( isNaN(to) ) {
            move(table['pile-slots'][from], table[to], true);
            updateScore(10); // score +10 points
        }
        // if to is pile slot
        else {
            // get selected card
            var selected = d.querySelector('.card[data-selected]="true"');
            // get all cards stacked on selected card
            var selectedCards = [selected];
            while ( selected = selected['nextSibling'] ) {
                if ( selected.nodeType ) selectedCards.push(selected);
            }
            // make the move
            move(
                table['pile-slots'][from],
                table['pile-slots'][to],
                true,
                selectedCards.length
            );
        }
    }
    //unbind click event
    unbindClick(
        '#deck-pile .card:first-child,' +
        '#discard .card:first-child,' +
        '#suit-slots #hearts.pile[data-empty="true"],' +
        '#suit-slots #diamonds.pile[data-empty="true"],' +
        '#suit-slots #clubs.pile[data-empty="true"],' +
        '#suit-slots #spades.pile[data-empty="true"],' +
        '#pile-slots .card[dara-played="true"],' +
        'pile-slots .pile[data-empty="true"]'
    );
    //unbind double click events
    unbindClick(
        '#discard .card:first-child' +
        '#pile-slots .card:last-child',
        'double'
    );
    // count moves
    countMove(moves++);
    return;
}

function parseValueAsInt(value) {
    // assign numerical value to face/letter cards
    switch (value) {
        case 'A' : value = '1'; break;
        case 'J' : value = '11'; break;
        case 'Q' : value = '12'; break;
        case 'K' : value = '13'; break;
        default: break;
    }
    return parseInt(value);
}

function parseIntAsValue(int) {
    // parse as integer
    var value = parseInt(int);
    // assign face/letter value to integer
    switch (value) {
        case '1' : value = 'A'; break;
        case '11' : value = 'J'; break;
        case '12' : value = 'Q'; break;
        case '13' : value = 'K'; break;
        default: break;
    }
    return value;
}

function reset(table) {
    delete _gameBoard.dataset.move;
    delete _gameBoard.dataset.selected;
    delete _gameBoard.dataset.source;
    delete _gameBoard.dataset.dest;
    delete _suitSlots.dataset.played;
    delete _suitSlots.dataset.unplayed;
    delete _pileSlots.dataset.played;
    delete _pileSlots.dataset.unplayed;
}

function timer(action) {
    // declare timer variables
    var minutes = 0;
    var seconds = 0;
    var gameplay = d.body.dataset.gameplay;
    // set timer attributes
    _timer.dataset.action = action;
    // switch case
    switch (action) {
        // start timer
        case 'start' :
            // looping function
            clock = setInterval(function() {
                // increment
                time++;
                // parse minutes and seconds
                minutes = parseInt(time / 60, 10);
                seconds = parseInt(time % 60, 10);
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                // output to display
                _timerSpan.textContent = minutes + ":" + seconds;
            }, 1000);
            // add dataset to body
            d.body.dataset.gameplay = 'active';
            // unbind click to play button
            if ( gameplay === 'paused' ) _playPause.removeEventListener('click', playTimer);
            // bind click to pause button
            _playPause.addEventListener('click', pauseTimer = function() {
                timer('pause');
            });
            break;
        // pause timer
        case 'pause' :
            clearInterval(clock);
            d.body.dataset.gameplay = 'paused';
            // unbind click to pause button
            // unbind click to play button
            if ( gameplay === 'active' ) _playPause.removeEventListener('click', pauseTimer);
            // bind click to play button
            _playPause.addEventListener('click', playTimer = function() {
                timer('start');
            });
            break;
        // stop timer
        case 'stop' :
            clearInterval(clock);
            d.body.dataset.gameplay = 'over';
            break;
        default : break;
    }
    return;
}

function countMove(moves) {
    // set move attribute
    _moveCount.dataset.moves = moves + 1;
    // output to display
    _moveCountSpan.textContent = moves + 1;
    return;
}

function updateScore(points) {
    // get score
    currScore = parseInt(_score.dataset.currScore) + points;
    // set min to 0
    currScore = currScore < 0 ? 0 : currScore;
    // parse as integer
    currScore = parseInt(currScore);
    // set score attribute
    _score.dataset.currScore = currScore;
    // output to display
    _score.children[1].textContent = currScore;
    return currScore;
}

function checkWin(table) {
    // if all suit slots are full
    if ( table['hearts'].length + table['diamonds'].length + table['clubs'].length + table['spades'].length === 52 ) {
        // stop timer
        timer('stop');
        return true;
    }
    else return false;
}

function checkAutoWin(table) {
    // if all cards on gameboard are flipped over and all discard cards are played
    if ( parseInt(_pileSlots.dataset.unplayed) + table['deck-pile'].length + table['discard'].length === 0 ) {
        // show autowin button
        _autoWin.style.display = 'block';
        // bind click to autowin button
        _autoWin.addEventListener('click', autoWin);
    }
    return;
}

function autoWin() {
    // hide autowin button
    _autoWin.style.display = 'none';
    // unbind click to autowin button
    _autoWin.removeEventListener('click', autoWin);
    //unbind click events
    unbindClick(
        '#deck-pile .card:first-child,' +
        '#discard .card:first-child,' +
        '#suit-slots .card:first-child,' +
        '#suit-slots #hearts.pile[data-empty="true"],' +
        '#suit-slots #diamonds.pile[data-empty="true"],' +
        '#suit-slots #clubs.pile[data-empty="true"],' +
        '#suit-slots #spades.pile[data-empty="true"],' +
        '#pile-slots .card[data-played="true",' +
        '#pile-slots .pile[data-empty="true"]'
    );
    // unbind double click events
    unbindClick(
        '#discard .card:first-child' +
        '#pile-slots .card:last-child',
        'double'
    );
    // reset table
    reset(table);
    renderTable(table);
    // animate cards to suit slots
    autoWinAnimation(table);
    // stop timer
    timer('stop');
}

function autoWinAnimation(table) {
    // set number of iterations
    var i = parseInt(_pileSlots.dataset.played);
    // run animation loop
    animationLoop();
}

function animationLoop() {
    // get lowest value card
    var lowCards = [];
    var eles = d.querySelectorAll('#pile-slots .card:last-child');
    for ( var e in eles ) {
        e = eles[e];
        if ( e.nodeType ) lowCards.push(parseValueAsInt(e.dataset.value));
    }
    // get lowest from lowCards array
    var lowValue = Math.min.apply(Math, lowCards);
    // parse int as value
    var cardValue = parseIntAsValue(lowValue);
    // get element with this value
    var e = d.querySelector('#pile-slots .card[data-rank"'+cardValue+'"]');
    // set up move
    var cardSuit = e.dataset.suit; // suit of card
    var arrCard = [cardValue, cardSuit]; // card array
    var to = cardSuit; // destination pile
    // make move
    if ( validateMove(arrCard, to) ) {
        // set from pile
        var from = e.parentElement.parentElement;
        _gameBoard.dataset.source = from.dataset.pile;
        // set to pile
        _gameBoard.dataset.to = to;
        // make move
        makeMove();
        reset(table);
        renderTable(table, playedCards);
    } else {
        reset(table);
        renderTable(table, playedCards);
    }
    // repeat faster
    setTimeout(function() {
        i--;
        if (i !== 0) animationLoop();
    }, 100);
}