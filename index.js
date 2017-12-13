//Inventory items available to purchase
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
var cart = []


displayInventory(inventory) 
//Function iterates over each object in the inventory array, and
    //appends an "Add to Cart" button
    //adds an event istener to that button that allows user to add items to their cart
    //adds an event listener that calculates total price if user changes the quantity of items in the input field
      //total price = quantity*price per unit
function displayInventory(arr){
  arr.map(function (item){ 
    displayItem(item, 1, ".inventory-container");  
  })
  displayAddCartButton();
  addToCartListener();
  calcTotalPriceListener(); 
}


//Function is used both to initially display inventory items AND to display items in the cart after user clicks "add to cart"
function displayItem(item, itemQuantity, container){
  //create Div container 
  var div = document.createElement("DIV");
  div.className = "item";
  
  //Displays item's name
  var nameContainer = document.createElement("P")
  var name = document.createTextNode(item.name);
  nameContainer.className = "item-name";
  nameContainer.appendChild(name);
  div.appendChild(nameContainer); 

  //Displays "Price $: "
  var priceContainer = document.createElement("p");
  var priceText = document.createTextNode("Price: $")
  priceContainer.appendChild(priceText);

  //Displays price amount
  var priceNumberContainer = document.createElement("span");
  var priceNumber = document.createTextNode((item.price).toFixed(2)+"");
  priceNumberContainer.className = "ppu"
  priceNumberContainer.appendChild(priceNumber);
  priceContainer.appendChild(priceNumberContainer);
  div.appendChild(priceContainer);

  //Displays "Quantity: "
  var quantityContainer = document.createElement("p");
  var quantityText = document.createTextNode("Quantity: ")   
  quantityContainer.appendChild(quantityText);

  
  //Displays "Total Price: $"
  var totalPriceContainer = document.createElement("p");
  var totalPriceText = document.createTextNode("Total Price: $")
  totalPriceContainer.appendChild(totalPriceText);

  //Displays total price amount 
  var totalPriceNumberContainer = document.createElement("span"); 
  totalPriceNumberContainer.className = "total-price";
  var totalPriceNumber = document.createTextNode((item.price).toFixed(2))
  totalPriceNumberContainer.appendChild(totalPriceNumber); 
  totalPriceContainer.appendChild(totalPriceNumberContainer);
  div.appendChild(totalPriceContainer); 

  //If function is called to displayInventory: sets quantity placeholder to 1 
  //If function is called to addItemToCart: select quantity chosen by user, and add quantity to user's cart  
  var quantityInput = document.createElement("input");
  quantityInput.className = "quantity-input"
  quantityContainer.appendChild(quantityInput);
  div.appendChild(quantityContainer);
  if(itemQuantity === 1){
      quantityInput.placeholder = 1;
      
  } else {
    quantityInput.value = itemQuantity; 
    totalPriceNumberContainer.innerHTML = (itemQuantity*item.price).toFixed(2)
  }


  document.querySelector(container).appendChild(div); 
  calcTotalPriceListener();   

  //If function is called to addItemToCart: create ID for div using the name of item (apples, bananas, etc.)
    //AND, add a "remove" button so user can remove item from cart 
  if(container === ".cart-container"){
    div.setAttribute("id", "cart-item-"+item.name)
    displayRemoveButton(div); 
  }
}

//Displays a "Remove" button to all items displayed in user's cart
function displayRemoveButton(div){
  var removeButton = document.createElement("button"); 
  removeButton.className = "remove-btn";
  var removeButtonText = document.createTextNode("Remove"); 
  removeButton.appendChild(removeButtonText); 
  div.appendChild(removeButton)
  removeButtonListener(div); 
}

//Appends an event listener to all "remove" buttons triggered on "click"
function removeButtonListener(div){
  var button = div.querySelector("button"); 
  button.addEventListener("click", removeItem)
}

//If user clicks on remove button, the parent div, with all children, is removed from the DOM
//the item is also completely removed from the user's cart 
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

//Adds an event listener to every inventory item that is displayed to the user so they can add the item to user's cart
function addToCartListener(){
  var addToCartBtn = document.getElementsByClassName("cart-btn");
  for(i=0; i<addToCartBtn.length; i++){
    addToCartBtn[i].addEventListener("click", getItem)
  }
}

//Called when user clicks on an inventory item
//Function retrieves the name of the item from the DOM and finds a matching item name in the inventory array of objects
//this inventory object is then passed into the addItemToCart function, copying the inventory item into the user's cart
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
//If the inventory item is NOT in the cart, then the function pushes the object into the user's cart along with the chosen quantity 
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

//If the item is already in the user's cart, then the quantity displayed is updated by adding the quantity chosen by the user
function updateQuantityDisplay(item){
  var itemDiv = document.getElementById("cart-item-"+item.name);
  var input = itemDiv.querySelector(".quantity-input");
  var totalPrice = itemDiv.querySelector(".total-price")
  input.value = item.quantity;
  totalPrice.innerHTML = (input.value*item.price).toFixed(2)
};

//Appends event listener to all quantity input fields, event is triggered when quantity input changes 
function calcTotalPriceListener(){
  var quantInput = document.getElementsByClassName("quantity-input"); 
  for(i=0; i<quantInput.length; i++){
    quantInput[i].addEventListener("change", calcTotalPrice)
  }
}

//If quantity input changes, fire this function 
//Function updates total price to display total price = (quantity)*(price per unit)
function calcTotalPrice(){
  var itemContainer = this.closest("div"); 
  var quantity = itemContainer.querySelector(".quantity-input").value; 
  var ppu = itemContainer.querySelector(".ppu").innerHTML; 
  var totalPrice = itemContainer.querySelector(".total-price"); 
  totalPrice.innerHTML = (quantity*ppu).toFixed(2)+""
}







