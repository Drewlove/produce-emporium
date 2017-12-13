//Inventory is an array of objects, each object representing an inventory item and its price per unit (ie $2.50 per apple)
var inventory = [
  {name: "apples", 
   price: 2.50,
  },

  {name: "bananas", 
   price: 5.00,
  },

  {name: "oranges", 
   price: 3.50,
  },
]

//Cart instantiates as an empty array of objects. 
//When the user clicks on an item, it is added to the cart with the relevant properties of name and price taken from the inventory
var cart = []

displayInventory(inventory) 

//on load, display each item in the inventory array of objects 
function displayInventory(arr){
  arr.map(function (item){ 
    displayItem(item, 1, ".inventory-container");  
  })
  displayAddCartButton();
  addToCartListener();
  calcTotalPriceListener(); 
}


function displayItem(item, itemQuantity, container){
  //create Div container and name of item 
  var div = document.createElement("DIV");
  div.className = "item";
  var nameContainer = document.createElement("P")
  var name = document.createTextNode(item.name);
  nameContainer.className = "item-name";
  nameContainer.appendChild(name);
  div.appendChild(nameContainer); 

  //Price Per Unit Text
  var priceContainer = document.createElement("p");
  var priceText = document.createTextNode("Price: $")
  priceContainer.appendChild(priceText);

  //Price amount
  var priceNumberContainer = document.createElement("span");
  var priceNumber = document.createTextNode((item.price).toFixed(2)+"");
  priceNumberContainer.className = "ppu"
  priceNumberContainer.appendChild(priceNumber);
  priceContainer.appendChild(priceNumberContainer);

  div.appendChild(priceContainer);

  var quantityContainer = document.createElement("p");
  var quantityText = document.createTextNode("Quantity: ")   
  quantityContainer.appendChild(quantityText);

  
  //Total price
  var totalPriceContainer = document.createElement("p");
  var totalPriceText = document.createTextNode("Total Price: $")
  totalPriceContainer.appendChild(totalPriceText);

  var totalPriceNumberContainer = document.createElement("span"); 
  totalPriceNumberContainer.className = "total-price";
  var totalPriceNumber = document.createTextNode((item.price).toFixed(2))
  totalPriceNumberContainer.appendChild(totalPriceNumber); 

  totalPriceContainer.appendChild(totalPriceNumberContainer); 

  //Quantity text
  var quantityInput = document.createElement("input");
  quantityInput.className = "quantity-input"
  quantityContainer.appendChild(quantityInput);
  div.appendChild(quantityContainer);
  if(itemQuantity === 1){
      quantityInput.placeholder = 1;
      
  } else {
    console.log(item.price);
    quantityInput.value = itemQuantity; 
    totalPriceNumberContainer.innerHTML = (itemQuantity*item.price).toFixed(2)
  }

  div.appendChild(totalPriceContainer);

  document.querySelector(container).appendChild(div); 
  calcTotalPriceListener();   

  if(container === ".cart-container"){
    div.setAttribute("id", "cart-item-"+item.name)
    displayRemoveButton(div); 
  }
}

function displayRemoveButton(div){
  var removeButton = document.createElement("button"); 
  removeButton.className = "remove-btn";
  var removeButtonText = document.createTextNode("Remove"); 
  removeButton.appendChild(removeButtonText); 
  div.appendChild(removeButton)
  removeButtonListener(div); 
}

function removeButtonListener(div){
  var button = div.querySelector("button"); 
  button.addEventListener("click", removeItem)
}

function removeItem(){
  var div = this.closest("div");
  var itemName = div.querySelector(".item-name")
  var cartObj = {}; 
  cart.forEach(function (cartItem){
    if (cartItem.name === itemName){
      cartObj = cartItem
    } 
  })
  cart.shift(cartObj)
  div.parentNode.removeChild(div) 

}

function displayAddCartButton(){
  var inventoryItems = document.getElementsByClassName("item");
  for(i=0; i<inventoryItems.length; i++){
    var addToCartBtn = document.createElement("button");
    addToCartBtn.className = "cart-btn"; 
    addToCartBtn.innerHTML = "Add to Cart";
    inventoryItems[i].appendChild(addToCartBtn)
  }
}

//Adds an event listener to every inventory item that is displayed to the user
function addToCartListener(){
  var addToCartBtn = document.getElementsByClassName("cart-btn");
  for(i=0; i<addToCartBtn.length; i++){
    addToCartBtn[i].addEventListener("click", getItem)
  }
}

//Called when user clicks on an inventory item
//Function retrieves the name of the item from the DOM and finds a matching item name in the inventory array of objects
function getItem(){ 
  var itemContainer = this.closest("div"); 
  var quantity = itemContainer.querySelector(".quantity-input");
  var itemName = itemContainer.querySelector(".item-name")
  var totalPrice = itemContainer.querySelector(".total-price")
  var newItem = {}; 
  inventory.map(function (inventoryItem){
    if(itemName.innerHTML === inventoryItem.name){
      newItem = inventoryItem
      totalPrice.innerHTML = (inventoryItem.price).toFixed(2)
    }
  })
  addItemToCart(newItem, parseInt(quantity.value))
  quantity.value = "";
  quantity.placeholder = 1
}


//Checks to see if that inventory item is already in the cart
//If the inventory item is NOT in the cart, then the function pushes the object into the user's cart, assigns a quantity property with the value of 1, and fires displayNewItem
function addItemToCart(item, itemQuantity){
  if(isNaN(itemQuantity)){
    itemQuantity = 1; 
  }
  var itemIsNew = true; 
  cart.forEach(function (cartItem){
    if(cartItem.name === item.name){
      cartItem.quantity += itemQuantity; 
      updateQuantityDisplay(cartItem); 
      return itemIsNew = false
    } 
  })
  if(itemIsNew){
    cart.push(item); 
    item.quantity = itemQuantity;  
    displayItem(item, itemQuantity, ".cart-container")
  }
}

function updateQuantityDisplay(item){
  var itemDiv = document.getElementById("cart-item-"+item.name);
  var input = itemDiv.querySelector(".quantity-input");
  var totalPrice = itemDiv.querySelector(".total-price")
  input.value = item.quantity;
  totalPrice.innerHTML = (input.value*item.price).toFixed(2)
};

function calcTotalPriceListener(){
  var quantInput = document.getElementsByClassName("quantity-input"); 
  for(i=0; i<quantInput.length; i++){
    quantInput[i].addEventListener("change", calcTotalPrice)
  }
}

function calcTotalPrice(){
  var itemContainer = this.closest("div"); 
  var quantity = itemContainer.querySelector(".quantity-input").value; 
  var ppu = itemContainer.querySelector(".ppu").innerHTML; 
  var totalPrice = itemContainer.querySelector(".total-price"); 
  totalPrice.innerHTML = (quantity*ppu).toFixed(2)+""
}







