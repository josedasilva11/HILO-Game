/**
 * Handles all the HTML template stuff for the game.
 *
 * @link       https://mickeyuk.github.io
 * @since      1.0.0
 */
function gameTemplate() { }

gameTemplate.Button = function (label, onClick, small) {

    var el = document.createElement('button');
    el.innerHTML = label;
    el.className = 'game-btn-primary ' + (small ? ' game-btn-small' : '');
    el.onclick = onClick;

    return el;

}

gameTemplate.ButtonSecondary = function (label, onClick, small) {

    var el = document.createElement('button');
    el.innerHTML = label;
    el.className = 'game-btn-secondary ' + (small ? ' game-btn-small' : '');
    el.onclick = onClick;

    return el;

}

gameTemplate.ButtonOutline = function (label, onClick, small) {

    var el = document.createElement('button');
    el.innerHTML = label;
    el.className = 'game-btn-outline ' + (small ? ' game-btn-small' : '');
    el.onclick = onClick;

    return el;

}

gameTemplate.app = `
<div id="game">
    <div id="game-main">
        <div id="game-frame"></div>
        <div id="bet-frame">
            <div id="bet-form">
                <div id="bet-amount">
                    <label>Bet Amount ($)</label>
                    <div id="bet-amount-controls">
                        <a href="#" class="bet-amount-minus">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7 14h-14v-4h14v4z"/></svg>
                        </a>
                        <input type="number" id="bet-amount-input" 
                        value="10">
                        <a href="#" class="bet-amount-plus">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7 14h-5v5h-4v-5h-5v-4h5v-5h4v5h5v4z"/></svg>
                        </a>
                    </div>
                </div>
                <div id="bet-amount-buttons">
                    <div class="game-row">
                        <button class="game-btn-default game-btn-outline game-btn-small" id="play-again">1$</button>
                        <button class="game-btn-default game-btn-outline game-btn-small" id="play-again">3$</button>
                    </div>
                    <div class="game-row">
                        <button class="game-btn-default game-btn-outline game-btn-small" id="play-again">5$</button>
                        <button class="game-btn-default game-btn-outline game-btn-small" id="play-again">10$</button>
                    </div>
                </div>
            </div>
            <div id="bet-buttons">
                <button class="game-btn-default game-btn-primary" id="play-again">Make Bet</button>
                <button class="game-btn-default game-btn-outline" id="play-again">Clear Cards</button>
            </div>
        </div>
    </div>
    <div id="game-modal-container">
        <div class="game-modal">
            <div class="game-modal-content">
                <div class="game-modal-header">
                    <div class="game-modal-title">
                        How to Play
                    </div>
                    <a href="#" class="game-modal-close" onclick="gUI.HideModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"/></svg>
                    </a>
                </div>
                <div class="game-modal-body-container">
                    <div class="game-modal-body">
                    </div>
                </div>
                <div class="game-modal-footer">
                    <button class="game-btn-default game-btn-secondary" id="play-again" onclick="gUI.HideModal()">Cancel</button>
                    <button class="game-btn-default game-btn-primary">Okay</button>
                </div>
            </div>
        </div>
    </div>
    <div id="game-appbar">
        <div class="game-header">
            <a class="game-app-icon game-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" width="24" height="24" viewBox="0 0 24 24"><path d="M12 3.202l3.839 4.798h-7.678l3.839-4.798zm0-3.202l-8 10h16l-8-10zm8 14h-16l8 10 8-10z"/></svg>
            </a>
            <a class="game-title game-btn">HiLo Ricardo</a>
            <a class="game-fair game-btn"></a>
        </div>
        <div class="game-options">
            <a href="#" id="game-btn-help" class="game-btn" onclick="gUI.ShowModal();">How to Play</a>
            <a href="#" id="game-btn-menu" class="game-btn" onclick="gUI.ToggleSidebar();">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFF"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 17h-12v-2h12v2zm0-4h-12v-2h12v2zm0-4h-12v-2h12v2z"/></svg>
            </a>
        </div>
    </div>
    <div id="game-sidebar">
        <ul id="game-sidebar-options">
            <li>
                <a href="#" class="game-btn">
                    <div class="game-sidebar-label">
                        <div class="game-sidebar-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" width="24" height="24" viewBox="0 0 24 24"><path d="M5 17h-5v-10h5v10zm2-10v10l9 5v-20l-9 5zm11.008 2.093c.742.743 1.2 1.77 1.198 2.903-.002 1.133-.462 2.158-1.205 2.9l1.219 1.223c1.057-1.053 1.712-2.511 1.715-4.121.002-1.611-.648-3.068-1.702-4.125l-1.225 1.22zm2.142-2.135c1.288 1.292 2.082 3.073 2.079 5.041s-.804 3.75-2.096 5.039l1.25 1.254c1.612-1.608 2.613-3.834 2.616-6.291.005-2.457-.986-4.681-2.595-6.293l-1.254 1.25z"/></svg>
                        </div>
                        Sound
                    </div>
                    <div class="switch">
                        <label class="toggle-control">
                            <input type="checkbox" checked>
                            <span class="control"></span>
                        </label>
                    </div>
                </a>
            </li>
            <li>
                <a href="#" class="game-btn">
                    <div class="game-sidebar-label">
                        <div class="game-sidebar-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 18.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25s-.559 1.25-1.25 1.25zm1.961-5.928c-.904.975-.947 1.514-.935 2.178h-2.005c-.007-1.475.02-2.125 1.431-3.468.573-.544 1.025-.975.962-1.821-.058-.805-.73-1.226-1.365-1.226-.709 0-1.538.527-1.538 2.013h-2.01c0-2.4 1.409-3.95 3.59-3.95 1.036 0 1.942.339 2.55.955.57.578.865 1.372.854 2.298-.016 1.383-.857 2.291-1.534 3.021z"/></svg>
                        </div>
                        How to Play
                    </div>
                </a>
            </li>
            <li>
                <a href="#" class="game-btn">
                    <div class="game-sidebar-label">
                        <div class="game-sidebar-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" width="24" height="24" viewBox="0 0 24 24"><path d="M24 12c0 6.627-5.373 12-12 12s-12-5.373-12-12h2c0 5.514 4.486 10 10 10s10-4.486 10-10-4.486-10-10-10c-2.777 0-5.287 1.141-7.099 2.977l2.061 2.061-6.962 1.354 1.305-7.013 2.179 2.18c2.172-2.196 5.182-3.559 8.516-3.559 6.627 0 12 5.373 12 12zm-13-6v8h7v-2h-5v-6h-2z"/></svg>
                        </div>
                        Bets History
                    </div>
                </a>
            </li>
        </ul>
    </div>
</div>
`;