function $ID (id) {
  return document.getElementById(id)
}

async function jsonData(){
  const response = await fetch("daten.json", {cache: "no-store"}); 
  // cache disabled for debugging purposes 
  const data = await response.json();
  return data;
}

async function getCoins() {
  const coins = localStorage.getItem("coins");
  if (!coins)
    return [];
  else
    return JSON.parse(coins);
}
function setCoins(coins){
  localStorage.setItem("coins", JSON.stringify(coins));
}

function getCurrentCoinID(){
  return parseInt(localStorage.getItem("current"));
}

async function getCurrentCoin() {
  var id = parseInt(localStorage.getItem("current"));
  if (id == null) id = 0;
  else if (id < 0) return {};

  const coins = await getCoins();
  if (id >= coins.length) return {};
  else return coins[id];
}

function render(template_obj, dest_obj, data){
  const template = Handlebars.compile(template_obj.innerHTML);
  dest_obj.innerHTML = template(data)
}

function register_listener(id, function_call) {
  $ID(id).addEventListener("click", function_call)
}

function build_json(data) {
  const str = JSON.stringify(data)
  const color = (str[str.search('"rate":')+7] == "-" ? "color:red;" : "color:green;")
  return JSON.parse(str.substring(0, str.length-1) + ',"color": "' + color + '"}')
}

function send_to_cart(amount, price, name) {
  localStorage.setItem(name, JSON.stringify({"amount": parseInt(amount), "price": price}))
}

function init_shop_item(json) {
  const name = json.name
  arrow = $ID(name + "-Arrow")
  arrow.innerHTML = json.rate >= 0 ? "&uarr;" : "&darr;"
  register_listener(name + "-Buy", 
    function() {
      render(modal_template, modal_template.nextElementSibling, json)
      $ID("buy-btn").addEventListener("click", 
        function() {
          let val = amount.value
          if(val && val > 0) {
            send_to_cart(val, json.value, json.name)
            close = $ID("close")
            close.click()
          } else {
            console.log(val)
          }
        })
    })
  register_listener(name + "-More", 
    function() {
      render($ID("more_template"), $ID("more_template").nextElementSibling, json)
  })
}
