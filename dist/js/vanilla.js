function $ID (id) {
  return document.getElementById(id)
}

async function jsonData(){
  const response = await fetch("daten.json", {cache: "no-store"}); 
  // cache disabled for debugging purposes 
  const data = await response.json();
  return data;
}

function getCoins() {
  const coins = localStorage.getItem("coins");
  if (!coins)
    return [];
  else
    return JSON.parse(coins);
}
function setCoins(coins){
  localStorage.setItem("coins", JSON.stringify(coins));
}

function removeFromOrdersByID(id) {
  const orders = getOrders().ord
  let new_orders = []
  for(let i = 0; i < orders.length; i++) {
    if(orders[i].index != id) {
      new_orders.push(orders[i])
    }
  }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

function changeOrderAmount(id, amount) {
  const orders = getOrders().ord
  let new_orders = []
    for(let i = 0; i < orders.length; i++) {
      let new_order = orders[i]
      if(orders[i].index === id) {
        new_order.amount = amount
        new_order.end_price = amount*new_order.value
      }
      new_orders.push(new_order)  
    }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

function updateOrder(id, amount) {
  if(amount === -1) {
    removeFromOrdersByID(id)
  } else {
    changeOrderAmount(id, amount)
  }
}

function contains_order(orders, index) {
  for(let i = 0; i< orders.length; i++) {
    index = orders[i].index === index
    if(index) {
      return i;
    }
  }
  return -1;
}

function addOrder(order) {
  const orders = JSON.parse(localStorage.getItem("orders"))
  if(orders) {
    index = contains_order(orders, order.index)
     if(index == -1) {
     orders.push(order)
     new_orders = orders
   } else {
     orders[index].amount += order.amount
     new_orders = orders
   }
  } else {
    new_orders = [order]
  }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

function getOrders() {
  let orders = JSON.parse(localStorage.getItem("orders"))
  return {ord: orders}
}

function getCurrentCoinID(){
  return parseInt(localStorage.getItem("current"));
}

function getCurrentCoin() {
  var id = parseInt(localStorage.getItem("current"));
  if (id == null) id = 0;
  else if (id < 0) return {};

  return getCoinByID(id);
}

function getCoinByID(id) {
  const coins = getCoins();
  if (id >= coins.length) return {};
  else return coins[id];
}

function render(template_obj, dest_obj, data){
  const template = Handlebars.compile(template_obj.innerHTML);
  dest_obj.innerHTML = template(data)
}


