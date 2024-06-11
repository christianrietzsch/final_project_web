// renders the shop items with the given coins
                  function renderShop(coins) {
                    json = []
                    let index = 0
                    coins.map(function (obj) {
                        json.push({
                            ...obj,
                            color: obj.curRate > 0 ? "color:green;" : "color:red;",
                            buy: "buyFunc(" + obj.id + ")",
                            more: "moreFunc(" + obj.id + ")",
                        });
                    })
                    $ID("items").innerHTML = template({res: json});

                    for (const coin of coins) {
                        $ID(coin.id + "-arrow").innerHTML = coin.curRate >= 0 ? "&uarr;" : "&darr;";
                    }
                };

// adds an item to the cart by placing an order
                function addToCart(id) {
                    var amount = parseInt(cart_count.value)
                    if (!amount || amount <= 0) {
                        amount = 1;
                        cart_count.value = "1";
                    }

                    addOrder({"id": id, "amount": amount})
                    bootstrap.Offcanvas.getInstance(more).hide();
                }

// renders more data about a given coin
                  function moreFunc(id) {
                    var coin = allCoins[id];
                    coin.colorDay = coin.curRate > 0 ? "color:green;" : "color:red;";
                    coin.monthRate = round(coin.value[0].value / coin.value[30].value * 100 - 100, 4);
                    coin.colorMonth = coin.monthRate > 0 ? "color:green;" : "color:red;";
                    coin.yearRate = round(coin.value[0].value / coin.value[363].value * 100 - 100, 4);
                    coin.colorYear = coin.yearRate > 0 ? "color:green;" : "color:red;";

                    render(more_template, more, coin)
                    cart_count.addEventListener("change", () => {
                        if (parseFloat(cart_count.value) <= 0) {
                            cart_count.value = "1";
                        }
                    });
                    cart_count.addEventListener("keydown", (event) => {
                        if (event.key === 'Enter') {
                            addToCart(id);
                        }
                    });
                    cart_buy_button.addEventListener("click", () => {
                        addToCart(id);
                    });
                    $ID("offcanvas-24-arrow").innerHTML = coin.curRate >= 0 ? "&uarr;" : "&darr;";
                    $ID("offcanvas-30-arrow").innerHTML = coin.monthRate >= 0 ? "&uarr;" : "&darr;";
                    $ID("offcanvas-1-arrow").innerHTML = coin.yearRate >= 0 ? "&uarr;" : "&darr;";
                    new Chart($ID("more_chart"), toChartData(id, 20));
                }

//sorts the items after a given filter
                  function sortShop(asc, val) {
                    const filter = search_bar.value;

                    coins = [];
                    for (const coin of allCoins)
                        if (coin.name.toLowerCase().includes(filter.toLowerCase()))
                            coins.push(coin);

                    coins.sort((a, b) => (val(a) < val(b)) ^ asc ? -1 : 1);
                    renderShop(coins);
                };

