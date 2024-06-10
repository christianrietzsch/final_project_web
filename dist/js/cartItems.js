    function addCartListeners(id) {
        $ID(id + "_rm_button").addEventListener("click", () => {
            currentCoin = id;
            modal_text.innerHTML = "Are you sure, you want to remove " + getCoinByID(id).name + " from the cart?";
        });
        $ID(id + "_count_input").addEventListener("change", changeCount($ID(id + "_count_input"), id))
        $ID(id + "_-_button").addEventListener("click", () => {
            $ID(id + "_count_input").value = parseInt($ID(id + "_count_input").value) - 1;
            changeCount($ID(id + "_count_input"), id)();
        });
        $ID(id + "_+_button").addEventListener("click", () => {
            $ID(id + "_count_input").value = parseInt($ID(id + "_count_input").value) + 1;
            changeCount($ID(id + "_count_input"), id)();
        });
    }

    function init_cart_items(orders) {
        render($ID("cart_item_template"), $ID("cart"), orders)
        let id_list = []
        orders.ord.forEach((obj) => id_list.push(obj.id))
        id_list.map(addCartListeners)
        $ID("item_count").innerText = id_list.length
    }

function remove() {
        $ID(currentCoin + "").remove()
        let count = $ID("item_count")
        count.innerText = parseInt(count.innerText) - 1
        if($ID("item_count").innerText == "0") {
            $ID("discount_field").innerText = ""
            $ID("discount_code").innerText = "" 
            $ID("discount").innerText = "-$ " + 0
        }
        updateTotalPrice()
        updateOrder(currentCoin, -1)
    }

    function buy_items() {
        if ($ID("item_count").innerText === "0") return;

        window.location.href = "checkout.html"
    }

function changeCount(input_box, id) {
        return function () {
            amount = parseFloat(input_box.value)
            if (amount <= 0) {
                amount = 1;
                input_box.value = "1";
            }

            const price = parseFloat($ID(id + "_val").innerText.substring(3))
            $ID(id + "_total").innerText = "$ " + round(amount * price + 0.005, 2);
            updateTotalPrice()
            updateOrder(id, amount)
        }
    }

    function updateTotalPrice() {
        const elements = document.getElementsByClassName("item_total")
        let total = 0
        for (let i = 0; i < elements.length; i++) {
            total += parseFloat(elements[i].innerText.substring(2))
        }
        total -= parseFloat($ID("discount").innerHTML.substring(2))
        if (round(total, 2) >= 0) {
            price = round(total, 2)
        } else {
            price = 0
        }
        $ID("total").innerText = "$ " + price;
        localStorage.setItem("order_total", JSON.stringify(price));
    }

