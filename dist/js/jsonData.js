function load_json() {
    jsonData().then((coins) => resetCoins(coins)).then(() => window.location.reload());
};

function add_new() {
    location.href = "edit.html?selected=-1";
}

function update(id) {
    return () => {
        location.href = "edit.html?selected=" + id;
    };
}

function del(id) {
    return () => {
        currentCoin = id;
        modal_text.innerHTML = "Are you sure, you want to delete " + getCoinByID(id).name + "?";
    };
}

function remove() {
    var coins = getCoins();
    coins.splice(currentCoin, 1);
    resetCoins(coins).then(() => window.location.reload());
}
