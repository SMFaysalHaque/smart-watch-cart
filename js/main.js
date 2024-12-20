import smartWatch from "../js/data.js";

let checkoutObj = {
  id: 0,
  type: "",
  model: "",
  colorName: "",
  imgUrl: "",
  qty: 0,
  size: "",
  price: 0,
  totalPrice: 0,
  favorite: false,
};
let checkoutLists = [];

function renderWatch(watch) {
  const detailsArea = document.getElementById("details-area");

  detailsArea.innerHTML = `
    <div id="image-area">
      <img src="${watch.imgUrl}" alt="${watch.model}" />
    </div>
    <div id="info-area">
      <p id="product-title">${smartWatch.productName}</p>
      <div id="review-area">
        <div id="star">
          <img src="../images/div.png" alt="star" />
        </div>
        <p id="review-text">(2 Reviews)</p>
      </div>
      <div id="price-area">
        <p id="old-price">$${watch.wristSizes[0].oldPrice}</p>
        <p id="new-price">$${watch.wristSizes[0].newPrice}</p>
      </div>
      <p id="description">${watch.description}</p>
      <table id="table">
        <tr>
          <td class="head-text" style="padding: 0 43px 0 0px">Type</td>
          <td class="head-text">Model Number</td>
        </tr>
        <tr>
          <td class="body-text" style="padding: 0 43px 0 0px">${watch.type}</td>
          <td class="body-text">${watch.model}</td>
        </tr>
      </table>
      <p id="brand-text">Band Color</p>
      <div id="radio-area"></div>
      <p id="btn-text">Wrist Size</p>
      <div id="btn-area"></div>
      <div id="cart-bottom">
        <div id="increment-decrement-area">
          <div id="minus" class="plus-minus-btn">
            <img src="../svg/minus.svg" alt="minus" />
          </div>
          <p id="digit-area">${checkoutObj.qty}</p>
          <div id="plus" class="plus-minus-btn">
            <img src="../svg/plus.svg" alt="plus" />
          </div>
        </div>
        <button id="add-cart-btn">Add to Cart</button>
        <div id="favorite">
          <img id="favorite-false" src="../svg/heart-fill-0.svg" alt="favorite-false" style="display: block;" />
          <img id="favorite-true" src="../svg/heart-fill-1.svg" alt="favorite-true" style="display: none;" />
        </div>
      </div>
    </div>
  `;

  updateCheckoutObj(watch);

  generateRadioButtons(smartWatch.watches, watch.id);
}

function updateCheckoutObj(watch) {
  checkoutObj.id = watch.id;
  checkoutObj.type = watch.type;
  checkoutObj.model = watch.model;
  checkoutObj.colorName = watch.colorName;
  checkoutObj.imgUrl = watch.imgUrl;
  checkoutObj.qty = 0;
  checkoutObj.size = watch.wristSizes[0].size;
  checkoutObj.price = watch.wristSizes[0].newPrice;
  checkoutObj.favorite = watch.favorite || false;
}

function generateRadioButtons(watches, selectedId) {
  const radioArea = document.getElementById("radio-area");
  radioArea.innerHTML = "";

  watches.forEach((watch, index) => {
    const radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.name = "watch-select";
    radioButton.id = `radio-${index}`;
    radioButton.style.accentColor = watch.color;
    radioButton.checked = index === 0 || watch.id === selectedId;

    radioButton.addEventListener("click", () => {
      renderWatch(watch);
      increment(watch);
      decrement(watch);
      toggleFavorite(watch);
      addToCart(watch);
      checkoutObj.qty = 0;
      const digitArea = document.getElementById("digit-area");
      digitArea.textContent = checkoutObj.qty;
    });

    const label = document.createElement("label");
    label.htmlFor = `radio-${index}`;
    label.appendChild(radioButton);

    radioArea.appendChild(label);
    if (watch.id === selectedId) {
      getWatchPrice(watch);
    }
  });
}

function getWatchPrice(value) {
  const btnArea = document.getElementById("btn-area");
  btnArea.innerHTML = value.wristSizes
    .map(
      (el, indx) => `
        <div id="price-btn-${indx}" class="btn">
          <span>${el.size}</span>
          $${el.newPrice}
        </div>`
    )
    .join("");

  const buttons = [];

  value.wristSizes.forEach((el, indx) => {
    const btn = document.getElementById(`price-btn-${indx}`);
    buttons.push(btn);
    if (btn) {
      btn.addEventListener("click", () => {
        buttons.forEach((button) => {
          button.style.border = "1px solid #dbdfea";
          button.style.color = "#8091a7";
          btn.querySelector("span").style.color = "#6576ff";
        });

        btn.style.border = "1px solid #6576ff";
        btn.querySelector("span").style.color = "#6576ff";

        checkoutObj.size = el.size;
        checkoutObj.price = el.newPrice;
      });
    }
  });
}

function toggleFavorite(value) {
  const favoriteFalse = document.getElementById("favorite-false");
  const favoriteTrue = document.getElementById("favorite-true");

  if (!favoriteFalse || !favoriteTrue) return;

  function updateFavoriteUI() {
    if (value.favorite) {
      favoriteFalse.style.display = "none";
      favoriteTrue.style.display = "block";
    } else {
      favoriteFalse.style.display = "block";
      favoriteTrue.style.display = "none";
    }
  }

  favoriteFalse.addEventListener("click", () => {
    value.favorite = true;

    checkoutObj.favorite = value.favorite;
    updateFavoriteUI();
  });

  favoriteTrue.addEventListener("click", () => {
    value.favorite = false;

    checkoutObj.favorite = value.favorite;
    updateFavoriteUI();
  });

  updateFavoriteUI();
}

function increment(value) {
  const plus = document.getElementById("plus");
  const digitArea = document.getElementById("digit-area");

  plus.addEventListener("click", () => {
    if (value.id === checkoutObj.id) {
      checkoutObj.qty++;
      digitArea.textContent = checkoutObj.qty;
      checkoutObj.totalPrice = checkoutObj.qty * checkoutObj.price;
    }
  });
}

function decrement(value) {
  const plus = document.getElementById("minus");
  const digitArea = document.getElementById("digit-area");

  plus.addEventListener("click", () => {
    if (value.id === checkoutObj.id && checkoutObj.qty > 0) {
      checkoutObj.qty--;
      digitArea.textContent = checkoutObj.qty;
      checkoutObj.totalPrice = checkoutObj.qty * checkoutObj.price;
    }
  });
}

function addToCart() {
  const addCart = document.getElementById("add-cart-btn");

  addCart.addEventListener("click", () => {
    const existingIndex = checkoutLists.findIndex(
      (item) => item.id === checkoutObj.id
    );

    if (existingIndex !== -1) {
      checkoutLists[existingIndex] = { ...checkoutObj };
    } else {
      checkoutLists.push({ ...checkoutObj });
    }

    localStorage.setItem("checkout", JSON.stringify(checkoutLists));

    checkoutBtn();
  });
}

function showCartList() {
  const cartList = document.getElementById("modal-shade");

  const lists = localStorage.getItem("checkout");
  const parsedLists = lists ? JSON.parse(lists) : [];

  if (!Array.isArray(parsedLists)) {
    console.error("Parsed data is not an array:", parsedLists);
    return;
  }

  cartList.innerHTML = `
    <div id="modal">
      <p id="cart-text">Your Cart</p>
      <table id="table-layout">
        <tr>
          <td id="table-heading-one">Item</td>
          <td id="table-heading-two">Color</td>
          <td id="table-heading-three">Size</td>
          <td id="table-heading-four">Qnt</td>
          <td id="table-heading-five">Price</td>
        </tr>
        ${parsedLists
          .map(
            (list) => `
          <tr>
            <td id="data-one"><span><img id="checkout-item-img" src="${
              list.imgUrl
            }" alt="${list.model}" style="" /></span>  ${list.model}</td>
            <td id="data-two">${list.colorName}</td>
            <td id="data-three">${list.size}</td>
            <td id="data-four">${list.qty}</td>
            <td id="data-five">$${list.totalPrice.toFixed(2)}</td>
          </tr>`
          )
          .join("")}
        <tr>
          <td id="total-text">Total</td>
          <td style="width: 62px; text-align: center"></td>
          <td style="width: 69px; text-align: center"></td>
          <td id="total-qnt"></td>
          <td id="total-price"></td>
        </tr>
      </table>

      <div id="bottom-btn-area">
        <button id="continue-shopping">Continue Shopping</button>
        <button id="checkout">Checkout</button>
      </div>
    </div>
    `;

  continueShopping();
  checkout();
}

function checkoutBtn() {
  const checkoutBtn = document.getElementById("checkout-btn-area");
  const modalShade = document.getElementById("modal-shade");

  const lists = localStorage.getItem("checkout");
  const parsedLists = lists ? JSON.parse(lists) : [];

  checkoutBtn.innerHTML = `
    <p id="checkout-text">Checkout</p>
    <div id="checkout-digit">${parsedLists.length}</div>
  `;

  checkoutBtn.addEventListener("click", () => {
    modalShade.style.display = "flex";
    document.body.classList.add("no-scroll");
    showCartList();
    calculation();
  });
}

function calculation() {
  const totalQnt = document.getElementById("total-qnt");
  const totalPrice = document.getElementById("total-price");
  let totalP = 0;
  let totalQ = 0;
  checkoutLists.map((list, index) => {
    totalP = totalP + list.totalPrice;
    totalPrice.textContent = "$" + totalP.toFixed(2);
    totalQ = totalQ + list.qty;
    totalQnt.textContent = totalQ;
  });
}

function continueShopping() {
  const continueShopping = document.getElementById("continue-shopping");
  const modalShade = document.getElementById("modal-shade");

  continueShopping.addEventListener("click", () => {
    modalShade.style.display = "none";
    document.body.classList.remove("no-scroll");
    showCartList();
    calculation();
  });
}

function checkout() {
  const checkout = document.getElementById("checkout");
  const modalShade = document.getElementById("modal-shade");

  checkout.addEventListener("click", () => {
    checkoutLists = [];
    localStorage.clear();
    localStorage.setItem("checkout", JSON.stringify(checkoutLists));
    modalShade.style.display = "none";
    document.body.classList.remove("no-scroll");
    showCartList();
    calculation();
    checkoutBtn();
  });
}

renderWatch(smartWatch.watches[0]);
generateRadioButtons(smartWatch.watches, smartWatch.watches[0].id);
increment(smartWatch.watches[0]);
decrement(smartWatch.watches[0]);
toggleFavorite(smartWatch.watches[0]);
addToCart(smartWatch.watches[0]);
showCartList();
calculation();
checkoutBtn();
