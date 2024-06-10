//checks if a given discount is available    
function checkDiscount(discount) {
        return discounts.available.includes(discount) || discounts.current === discount

    }

// validates the discount written in the input field and adds the discount value to the price
    function addDiscount() {
        const discount = $ID("discount_field").value
        if (checkDiscount(discount) && ($ID("item_count").innerText != "0")) {
            $ID("discount_code").innerText = discount;
            $ID("discount").innerText = "-$" + round(getDiscountValue(discount), 2)
            updateTotalPrice()
            updateDiscount(discount, false)
            return true
        } else {
            $ID("discount_field").value = "";
            $ID("discount_code").innerText = "";
            $ID("discount").innerText = "-$ " + 0
            updateTotalPrice()
            return false
        }
    }

// loads all discounts and their value from the local storage
function loadDiscounts() {
    var discounts = localStorage.getItem("discounts");
    if(discounts) {
	    return JSON.parse(discounts)
    } else {
      discounts = {current: null, available: ["Michi10", "HAPPY10"], values: {"Michi10": 10, "HAPPY10": "0.1%"}}
      localStorage.setItem("discounts", JSON.stringify(discounts))
  	  return discounts
    }

}

// wirtes the discounts to the local storage
function writeDiscounts(discounts) {
    localStorage.setItem("discounts", JSON.stringify(discounts))
}

