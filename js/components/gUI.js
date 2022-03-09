/**
 * Handles all the base UI stuff for the games.
 *
 * @link       https://mickeyuk.github.io
 * @since      1.0.0
 */
function gUI() { }

/**
 * The playable game area.
 */
gUI.gameFrame = null;

/**
 * Shortcut bet button amounts.
 */
gUI.betButtons = [1, 10, 50, 100];

/**
 * Number of shortcut bet buttons per row
 */
gUI.betButtonsPerRow = 2;

/**
 * Displays player balance in the appbar.
 */
gUI.displayMoney = true;

/**
 * Is sidebar open?
 */
gUI.sidebarActive = false;

/**
 * Initializes the game UI.
 * 
 * @param {HTMLElement} el The game container element.
 */
gUI.Init = async function (el) {

    // Game
    gUI.gameEl = gUI.El('div', el, 'game');

    // Main game container
    gUI.container = gUI.El('div', gUI.gameEl, 'game-main');
    //gUI.container.style.visibility = 'hidden';

    // Game frame
    var gameFrame = gUI.El('div', gUI.container, 'game-frame');
    gUI.gameFrame = gUI.El('div', gameFrame, 'game-frame-inner');

    // Bet frame
    gUI.betFrame = gUI.El('div', gUI.container, 'bet-frame');

    // Initialize win frame
    gUI.InitWinFrame();

    // Initialize bet form
    gUI.InitBetForm();

    // Initialize modal
    gUI.InitModal();

    // Initialize appbar
    gUI.InitAppbar();

    // Initialize sidebar
    gUI.InitSidebar();

}

/**
 * Initializes the appbar.
 */
gUI.InitAppbar = function () {

    // App bar
    var appbar = gUI.El('div', gUI.gameEl, 'game-appbar');

    // Header
    var header = gUI.El('div', appbar, 'game-header', ['game-header']);

    // Icon & Title
    var icon = gUI.El('a', header, 'game-app-icon', ['game-app-icon', 'game-btn']);
    gUI.title = gUI.El('a', header, 'game-title', ['game-title', 'game-btn']);

    // Display money?
    if (gUI.displayMoney) {
        icon.innerHTML = gIcon.money;
        gUI.title.innerHTML = gApp.money + ' $';
        icon.classList.add('money');
        gUI.title.classList.add('money');
    } else {
        icon.innerHTML = gIcon.game;
        gUI.title.innerHTML = gApp._('game.name');
    }

    // Game options
    var options = gUI.El('div', appbar, 'game-options', ['game-options']);

    // How to play button
    var howToPlay = gUI.El('a', options, 'game-btn', ['game-btn']);
    howToPlay.innerHTML = gIcon.help;
    howToPlay.addEventListener('click', () => {
        gUI.ShowModal(gApp._('modal.how_to_play.title'), gApp._('modal.how_to_play.content'));
        gUI.modalFooter.innerHTML = '';
        gUI.modalFooter.appendChild(gUI.ButtonPrimary('Got It!', gUI.HideModal));
    });

    // Menu button
    var menu = gUI.El('a', options, 'game-btn', ['game-btn']);
    menu.innerHTML = gIcon.menu;
    menu.onclick = gUI.ToggleSidebar;

}

/**
 * Initializes the sidebar.
 */
gUI.InitSidebar = function () {

    // Create sidebar
    gUI.sidebar = gUI.El('div', gUI.gameEl, 'game-sidebar');
    gUI.sidebarOptions = gUI.El('div', gUI.sidebar, 'game-sidebar-options');

    // --- Defaults ---

    // Sound toggle button
    gUI.AddSidebarOption(
        gIcon.sound,
        'Volume',
        () => {
            gApp.config.volume = !gApp.config.volume;
        },
        true,
        true
    );

    // How to play button
    gUI.AddSidebarOption(
        gIcon.help,
        'How to Play',
        () => {
            gUI.ShowModal(gApp._('modal.how_to_play.title'), gApp._('modal.how_to_play.content'))
            gUI.modalFooter.innerHTML = '';
            gUI.modalFooter.appendChild(gUI.ButtonPrimary('Got It!', gUI.HideModal));
        }
    );

    // Leaderboard
    /*
    gUI.AddSidebarOption(
        gIcon.star,
        'Leaderboard',
        () => {
            gUI.ShowLeaderboard();
        }
    );
    */

}

/**
 * Show the leaderboard.
 */
gUI.ShowLeaderboard = function () {

    // Show modal
    var modal = gUI.ShowModal('Leaderboard', '');
    modal.classList.add('wide');
    gUI.modalContent.innerHTML = '';
    gUI.modalFooter.innerHTML = '';
    gUI.modalFooter.appendChild(gUI.ButtonSecondary('Close', gUI.HideModal));
    
}

/**
 * Initializes the modal window.
 */
gUI.InitModal = function () {

    // Modal container
    var container = gUI.El('div', gUI.gameEl, 'game-modal-container');

    // Modal
    var modalContainer = gUI.El('div', container, "game-modal", ['game-modal']);
    var modal = gUI.El('div', modalContainer, null, ['game-modal-content']);
    var header = gUI.El('div', modal, "modal-header", ['game-modal-header']);
    var body = gUI.El('div', modal, null, ['game-modal-body-container']);
    gUI.modalFooter = gUI.El('div', modal, "modal-footer", ['game-modal-footer']);

    // Title
    var title = gUI.El('div', header, "modal-title", ['game-modal-title']);

    // Close button
    var close = gUI.El('div', header, "modal-close", ['game-modal-close']);
    close.innerHTML = gIcon.close;
    close.onclick = gUI.HideModal;

    // Content
    gUI.modalContent = gUI.El('div', body, "modal-content", ['game-modal-body']);

}

/**
 * Fancy way to show total of wins.
 */
gUI.InitWinFrame = function () {

    // Show wins panel
    gUI.winsPanel = gUI.El('div', gUI.betFrame, 'wins-panel');
    
    // Label
    var winsContainer = gUI.El('div', gUI.winsPanel, 'wins-container');
    var label = gUI.El('div', winsContainer, 'wins-label');
    label.innerHTML = 'Score';

    // Total
    gUI.score = gUI.El('div', winsContainer, 'wins-total');
    gUI.score.innerHTML = gApp.wins;

    // Multiplier
    gUI.multiplier = gUI.El('div', gUI.winsPanel, 'wins-multiplier');
    gUI.multiplier.innerHTML = 'x' + gApp.multiplier + ' Score Multiplier!';

}

/**
 * Initializes the bet form.
 */
gUI.InitBetForm = function () {

    // Frame
    gUI.betFormContainer = gUI.El('div', gUI.betFrame, 'bet-form');

    // Bet amount form
    gUI.betForm = gUI.El('div', gUI.betFormContainer, 'bet-amount');
    var row = gUI.Row(null, null, '20px');
    gUI.betForm.appendChild(row);

    // Bet amount
    var col = gUI.Col(null, '50%');
    row.appendChild(col);

    var input = gUI.InputNumber(
        'Bet Amount ($)', 
        () => { gApp.SetBet( gUI.betInput ) },
        () => { gApp.AddBet(-0.1) },
        () => { gApp.AddBet(0.1) },
        0.10.toFixed(2)
    );
    gUI.betInput = input.querySelector('input');
    gUI.betInput.setAttribute('novalidate', "novalidate");
    
    col.appendChild(input);

    // Bet shortcut buttons
    var col = gUI.Col();
    row.appendChild(col);
    var shortcutButtons = gUI.El('div', col, 'bet-shortcut-buttons');

    var xx = 0;
    var btnRow = gUI.Row(null, null, '10px');
    btnRow.style.marginBottom = '10px';
    shortcutButtons.appendChild(btnRow);
    for (var i = 0; i < gUI.betButtons.length; i++) {

        // Create button
        var btnCol = gUI.Col(null, '50%');
        var button = gUI.ButtonOutline(gUI.betButtons[i] + '$', null, true);
        button.bet = gUI.betButtons[i];
        button.onclick = (e) => { gApp.AddBet(e.target.bet) };

        btnCol.appendChild(button);
        btnRow.appendChild(btnCol);

        // Next row
        xx++;
        if (i < gUI.betButtons.length - 1 &&
            xx >= gUI.betButtonsPerRow) {
                
            btnRow = gUI.Row(null, null, '10px');
            shortcutButtons.appendChild(btnRow);
            xx = 0;
            
        }

    }

    // Bet button
    var row = gUI.Row();
    gUI.betFrame.appendChild(row);
    var col = gUI.Col();
    row.appendChild(col);

    gUI.betButton = gUI.ButtonPrimary('Make Bet');
    gUI.betButton.onclick = () => { gApp.MakeBet(); };
    col.appendChild(gUI.betButton);

}

/**
 * Toggles the interactivity of the bet form.
 */
gUI.ToggleBetForm = function () {

    if (gApp.canBet) {

        gUI.winsPanel.classList.remove('active');
        gUI.multiplier.classList.remove('active');
        gUI.score.innerHTML = 0;

        gUI.betForm.parentNode.classList.remove('hidden');
        gUI.betButton.classList.remove('hidden');
        gUI.betButton.innerHTML = 'Make Bet';
        gUI.betInput.value = 0.10.toFixed(2);

    } else {

        gUI.winsPanel.classList.add('active');

        gUI.betForm.parentNode.classList.add('hidden');
        gUI.betButton.classList.add('disabled');
        gUI.betButton.innerHTML = 'Cashout';
    }

}

/**
 * Toggles the cashout button.
 */
gUI.ToggleCashout = function () {

    if (gApp.canCashout) {
        gUI.betButton.innerHTML = 'Cashout ' + gApp.pot.toFixed(2) + '$';
        gUI.betButton.classList.remove('disabled');
    } else {
        gUI.betButton.innerHTML = 'Make Bet';
        gUI.betButton.classList.remove('disabled');
    }

}

/**
 * Adds an option to the sidebar.
 * 
 * @param {string}  icon        Icon for the option.
 * @param {string}  label       Label for the option. 
 * @param {mixed}   onClick     Function to call when the option is clicked.
 * @param {boolean} toggle      Whether the option is a toggle.
 * @param {boolean} enabled     Whether the option is enabled.
 */
gUI.AddSidebarOption = function (icon, label, onClick, toggle = false, enabled = false) {

    // Create container
    var li = gUI.El('li', gUI.sidebarOptions, null, ['game-sidebar-option']);

    // Create link
    var a = gUI.El('a', li, null, ['game-sidebar-option-link', 'game-btn']);

    if (!toggle) {
        a.onclick = onClick;
    }

    // Icon and label
    var optLabel = gUI.El('div', a, null, ['game-sidebar-label']);
    var optIcon = gUI.El('div', optLabel, null, ['game-sidebar-icon']);

    optIcon.innerHTML = icon;
    optLabel.innerHTML += label;

    // Is a toggable option?
    if (toggle) {

        // Add switch
        var switchEl = gUI.SwitchElement(enabled);
        a.appendChild(switchEl);
        switchEl.querySelector('input').addEventListener('click', onClick);
        
    }

}

/**
 * Toggles the game sidebar.
 */
gUI.ToggleSidebar = function () {

    gUI.sidebarActive = !gUI.sidebarActive;
    var el = document.querySelector('#game-sidebar');
    el.classList.toggle('active');

    gApp.PlaySound(gApp.sounds.whoosh);

}

/**
 * Show a modal box.
 * 
 * @param {string} title    The modal title.
 * @param {string} content  The modal content. 
 * @param {boolean} footer  Whether to show the modal footer.
 */
gUI.ShowModal = function (title, content, footer = true, canClose=true) {

    if (gUI.sidebarActive) gUI.ToggleSidebar();

    // Update title
    var modalHeader = document.querySelector('#modal-header');
    var modalTitle = document.querySelector('#modal-title');

    if (title) {
        modalTitle.innerHTML = title;
        modalHeader.classList.add('active');
    } else {
        modalHeader.classList.remove('active');
    }

    // Close button
    var closeButton = document.querySelector('#modal-close');

    if (canClose) {
        closeButton.classList.add('active');
    } else {
        closeButton.classList.remove('active');
    }

    // Update content
    if (content) {
        var modalContent = document.querySelector('#modal-content');
        modalContent.innerHTML = content;
    }

    // Show footer?
    var modalFooter = document.querySelector('#modal-footer');
    if (footer) {
        modalFooter.classList.add('active');
    } else {
        modalFooter.classList.remove('active');
    }

    // Activate modal
    var overlay = document.querySelector('#game-modal-container');
    var modal = document.querySelector('#game-modal');
    modal.classList.remove('wide');
    overlay.classList.add('active');
    modal.classList.add('active');

    return modal;

}

/**
 * Hides the modal.
 */
gUI.HideModal = function () {

    var el = document.querySelector('#game-modal-container');
    el.classList.remove('active');

    var el = document.querySelector('.game-modal');
    el.classList.remove('active');

}

/**
 * Show loading screen.
 */
gUI.LoadScreen = function () {

    // Create loading icon
    var loadIcon = document.createElement('div');
    loadIcon.classList.add('game-loading');

    loadIcon.appendChild(gUI.LoadingRing());

    // Create loading text
    var loadText = document.createElement('h1');
    loadText.classList.add('game-loading-text');
    loadText.innerHTML = 'Loading...';
    loadIcon.appendChild(loadText);

    gUI.modalContent.appendChild(loadIcon);

    // Show modal
    gUI.ShowModal(null, null, false);

}

/**
 * Resets UI to default state.
 */
gUI.Reset = function () {
    
    //gUI.appBar.style.visibility = 'visible';

    //gUI.gameFrame.innerHTML = '';
    //gUI.container.style.visibility = 'visible';

    //gUI.betButton.innerHTML = 'Make Bet';

}

/**
 * Creates a HTML element.
 * 
 * @param {string}      tag         Tag name.
 * @param {HTMLElement} appendTo    Element to append to.
 * @param {string}      id          Element id.
 * @param {array}       classList   Class list.
 * @returns 
 */
gUI.El = function (tag, appendTo = null, id = null, classList = null) {
    var div = document.createElement(tag);
    if (id) div.id = id;
    if (classList) div.classList.add(...classList);
    if (appendTo) appendTo.appendChild(div);
    return div;
}
 
/**
 * Creates a row div.
 * 
 * @returns {HTMLElement}
 */
gUI.Row = function (id=null, width = null, gap = null) {
    
    var row = document.createElement('div');
    row.classList.add('game-row');
    if (id) row.id = id;
    if (width) row.style.width = width;
    if (gap) row.style.gap = gap;

    return row;

}

/**
 * Creates a column div.
 * 
 * @returns {HTMLElement}
 */
gUI.Col = function (id=null, width=null) {
    
    var col = document.createElement('div');
    col.classList.add('game-col');
    if (id) col.id = id;
    if (width) {
        col.style.width = '100%';
        col.style.maxWidth = width;
    } else {
        col.style.flex = '1 1 auto';
    }

    return col;
    
}

/**
 * Create a primary button.
 * 
 * @param {string} label    Label on button.
 * @param {mixed} onclick   Onclick event.
 * 
 * @returns {HTMLElement}
 */
gUI.ButtonPrimary = function (label, onclick, small = false) {

    var btn = document.createElement('button');
    btn.classList.add('game-btn-default');
    btn.classList.add('game-btn-primary');
    if (small) btn.classList.add('game-btn-small');
    btn.innerHTML = label;
    btn.onclick = onclick;

    btn.addEventListener('click', function () {
        gApp.PlaySound(gApp.sounds.click);
    });

    return btn;

}

/**
 * Create a secondary button.
 * 
 * @param {string} label    Label on button.
 * @param {mixed} onclick   Onclick event.
 * 
 * @returns {HTMLElement}
 */
gUI.ButtonSecondary = function (label, onclick, small = false) {

    var btn = document.createElement('button');
    btn.classList.add('game-btn-default');
    btn.classList.add('game-btn-secondary');
    if (small) btn.classList.add('game-btn-small');
    btn.innerHTML = label;
    btn.onclick = onclick;

    btn.addEventListener('click', function () {
        gApp.PlaySound(gApp.sounds.click);
    });

    return btn;

}

/**
 * Create a outline button.
 * 
 * @param {string} label    Label on button.
 * @param {mixed} onclick   Onclick event.
 * 
 * @returns {HTMLElement}
 */
gUI.ButtonOutline = function (label, onclick, small = false) {

    var btn = document.createElement('button');
    btn.classList.add('game-btn-default');
    btn.classList.add('game-btn-outline');
    if (small) btn.classList.add('game-btn-small');
    btn.innerHTML = label;
    btn.onclick = onclick;

    btn.addEventListener('click', function () {
        gApp.PlaySound(gApp.sounds.click);
    });

    return btn;

}

/**
 * Create a text input.
 * 
 * @param {string} label        Label on input.
 * @param {string} onchange     Onchange event.
 * @param {string} value        Value of input.
 * 
 * @returns {HTMLElement}
 */
gUI.InputText = function (label, onchange, value = '') {
    
    var input = document.createElement('input');
    input.type = 'text';
    if (value) input.value = value;
    if (onchange) input.onchange = onchange;

    var labelEl = document.createElement('label');
    labelEl.innerHTML = label;

    var div = document.createElement('div');
    div.classList.add('game-field-group');
    div.appendChild(labelEl);
    div.appendChild(input);

    return div;
    
}

/**
 * Create a number input.
 * 
 * @param {string} label        Label on input.
 * @param {string} onchange     Onchange event.
 * @param {string} value        Value of input.
 * 
 * @returns {HTMLElement}
 */
gUI.InputNumber = function (label, onkeyup, onSub, onAdd, value = '') {
    
    // Layout
    var div = gUI.Row();
    div.classList.add('game-field-group');
    div.style.flexDirection = 'column'; 
        
    // Label
    var col = gUI.Col();
    div.appendChild(col);
    var labelEl = document.createElement('label');
    labelEl.innerHTML = label;
    col.appendChild(labelEl);
        
    // Container
    var row = gUI.Row();
    div.appendChild(row);

    // Minus
    var col = gUI.Col(null);
    row.appendChild(col);
    var minus = gUI.El('a', col, 'bet-amount-minus', ['bet-amount-minus']);
    minus.innerHTML = gIcon.minus;
    minus.addEventListener('click', onSub);

    // Input
    var col = gUI.Col(null, '60%');
    row.appendChild(col);
    var input = document.createElement('input');
    col.appendChild(input);
    input.type = 'number';
    if (value) input.value = value;
    if (onkeyup) input.addEventListener('keyup', onkeyup);

    // Plus
    var col = gUI.Col();
    row.appendChild(col);
    var plus = gUI.El('a', col, 'bet-amount-plus', ['bet-amount-plus']);
    plus.innerHTML = gIcon.plus;
    plus.addEventListener('click', onAdd);

    return div;
    
}

/**
 * Creates a toggle switch button element.
 * 
 * @param {bool} enabled Is active?
 */
gUI.SwitchElement = function (enabled) {

    var switchEl = gUI.El('div', null, null, ['switch']);
    var label = gUI.El('label', switchEl, null, ['toggle-control']);

    var input = gUI.El('input', label, null, ['toggle-control-input']);
    input.type = 'checkbox';

    gUI.El('span', label, null, ['control']);

    if (enabled) {
        input.checked = true;
    }

    return switchEl;

}

/**
 * Loading ring element.
 * 
 * @returns {HTMLElement}
 */
gUI.LoadingRing = function () {

    var ring = document.createElement('div');
    ring.classList.add('lds-ring');
    for (i = 0; i < 4; i++) {
        var div = document.createElement('div');
        ring.appendChild(div);   
    }

    return ring;

}