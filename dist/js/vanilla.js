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
async function resetCoins(coins){
  return Promise.all([...Array(coins.length).keys()].map(async (i) => {
    coins[i].id = parseInt(i);

    await getAPIData(coins[i].coincapID).then((result) => {
        value = []
        for (let x = (result.data.length - 1); x >= (result.data.length - 50); x--)
            value.push({time: result.data[x].date, value: result.data[x].priceUsd});
        coins[i].value = value;
        coins[i].curValue = Math.floor(value[0].value * 10000) / 10000;
        coins[i].curRate = Math.floor((value[0].value / value[1].value * 100 - 100) * 10000) / 10000;
        console.log(value);
    });
  })).then(() => {
      localStorage.setItem("coins", JSON.stringify(coins))
      localStorage.setItem("orders", JSON.stringify([]))
    }
  );
}

function removeFromOrdersByID(id) {
  const orders = JSON.parse(localStorage.getItem("orders"))
  let new_orders = []
  for(let i = 0; i < orders.length; i++) {
    if(orders[i].id != id) {
      new_orders.push(orders[i])
    }
  }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

function changeOrderAmount(id, amount) {
  const orders = JSON.parse(localStorage.getItem("orders"))
  let new_orders = []
    for(let i = 0; i < orders.length; i++) {
      let new_order = orders[i]
      if(orders[i].id === id) {
        new_order.amount = amount
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

function contains_order(orders, id) {
  for(let i = 0; i< orders.length; i++) {
    id = orders[i].id === id
    if(id) {
      return i;
    }
  }
  return -1;
}

function addOrder(order) {
  const orders = JSON.parse(localStorage.getItem("orders"))
  if(orders) {
    id = contains_order(orders, order.id)
     if(id == -1) {
     orders.push(order)
     new_orders = orders
   } else {
     orders[id].amount += order.amount
     new_orders = orders
   }
  } else {
    new_orders = [order]
  }
  localStorage.setItem("orders", JSON.stringify(new_orders))
}

function getOrders() {
  let orders = JSON.parse(localStorage.getItem("orders"))
  new_orders = []
  orders.forEach((order) => {
    const coin = getCoinByID(order.id)
    new_order = {...coin, amount: order.amount, 
      end_price: coin.value*order.amount}
    new_orders.push(new_order)
  })
  return {ord: new_orders}
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

async function getAPIData(cid){
  return fetch(url = "https://api.coincap.io/v2/assets/" + cid + "/history?interval=d1&limit=10").then(response => {
    if (!response.ok) {
      throw new Error('API Network response was not ok');
    }
    return response.json();
  })
}

function render(template_obj, dest_obj, data){
  const template = Handlebars.compile(template_obj.innerHTML);
  dest_obj.innerHTML = template(data)
}
