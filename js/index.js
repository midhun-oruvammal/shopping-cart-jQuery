$(document).ready(function () {
  $.ajax({
    url: "https://dummyjson.com/products",
    type: "GET",
    success: function (data) {
      let categories = [];
      const cartItems = [];
      $("#cart-price").hide();
      $("#checkout-button").hide();
      let completeProducts = data.products;
      let a = 0;
      let b = 3;
      let products = completeProducts.slice(a, b);
      completeProducts.forEach((element) => {
        if (!categories.includes(element.category)) {
          categories.push(element.category);
        }
      });
      function scrollPage() {
        console.log($(document).height());
        console.log($(window).height());
        console.log($(window).scrollTop());
        if (
          Math.ceil($(window).scrollTop()) >=
          $(document).height() - $(window).height()
        ) {
          if (
            $("#filter-items").val() === "" &&
            $("#search-box").val() === ""
          ) {
            a = b;
            b += 3;
            if (b <= completeProducts.length) {
              const products1 = completeProducts.slice(a, b);
              products = products.concat(products1);
              console.log(products);
              displayProducts(products1);
            }
          }
        }
      }
      $(document).on("scroll", scrollPage);
      displayProducts(products);
      console.log(categories);

      categories.forEach((element) => {
        $("#filter-items").append(
          `<option value="${element}">${element}</option>`
        );
      });
      let filteredProducts = [];
      $("#filter-items").on("change", function () {
        const selectedCategory = $("#filter-items").val();
        console.log(products);
        filteredProducts = completeProducts.filter(
          (item) => item.category === selectedCategory
        );
        $("#product-items-container").html("");
        if (selectedCategory === "") {
          filteredProducts = products;
          displayProducts(filteredProducts);
        } else {
          displayProducts(filteredProducts);
        }
      });
      $("#sort-items").on("change", function () {
        const sortOrder = $("#sort-items").val();
        if ($("#filter-items").val() === "") {
          let sortedProducts = sortProducts(completeProducts, sortOrder);
          $("#product-items-container").html("");
          displayProducts(sortedProducts);
        } else {
          let sortedProducts = sortProducts(filteredProducts, sortOrder);
          $("#product-items-container").html("");
          displayProducts(sortedProducts);
        }
      });

      function sortProducts(filteredProducts, sortOrder) {
        return filteredProducts.sort((a, b) => {
          let discountPricea = Math.round(
            a.price - a.price * (a.discountPercentage / 100)
          );
          let discountPriceb = Math.round(
            b.price - b.price * (b.discountPercentage / 100)
          );
          if (sortOrder === "price-low") {
            return discountPricea - discountPriceb;
          } else if (sortOrder === "price-high") {
            return discountPriceb - discountPricea;
          } else if (sortOrder === "rating") {
            return b.rating - a.rating;
          }
        });
      }

      function displayProducts(products) {
        products.forEach((item) => {
          let discountPrice = Math.round(
            item.price - item.price * (item.discountPercentage / 100)
          );
          $("#product-items-container").append(
            `<div class="item-container">
                        <div class="thumbnail-wrapper">
                            <img src="${item.thumbnail}" alt="Image of ${item.title}" class="thumbnail">
                        </div>
                        <div class="product-info">
                            <h2 class="product-title">${item.title}</h2>
                            <span class="product-rating">${item.rating} ★</span>
                            <p class="product-description">${item.description}</p>
                        </div>
                        <div id="more-images${item.id}" class="more-images"></div>
                        <div class="price-info">
                            <p class="discount-price">$${discountPrice}</p>
                            <span class="og-price">$${item.price}</span>
                            <span class="discount-percentage">${item.discountPercentage}%</span>
                            <p class="product-stock">${item.stock} left</p>
                            <button id="item${item.id}" class="add-cart-button">Add to cart <i class="fa-solid fa-cart-shopping" style="color: #ffffff;"></i></button>
                        </div>
                    </div>`
          );
          let itemImages = item.images;
          for (let i = 0; i < itemImages.length; i += 1){
            $(`#more-images${item.id}`).append(`<div class="images-wrapper">
                                        <img class="image" src="${itemImages[i]}" alt="">
                                      </div>`);
          }
          $(`#item${item.id}`).click(function addtoCart() {
            let CartItemIndex = cartItems.findIndex(
              (element) => element.id === item.id
            );
            if (CartItemIndex !== -1) {
              cartItems[CartItemIndex].quantity += 1;
            } else {
              cartItems.push({
                id: item.id,
                productName: item.title,
                price: discountPrice,
                imageLink: item.thumbnail,
                quantity: 1,
              });
            }
            updateCart();
          });
        });
        function updateCart() {
          if (cartItems.length < 1) {
            $("#empty-cart").show();
          } else {
            $("#empty-cart").hide();
          }
          $("#cart").html("");
          let cartTotal = 0;
          cartItems.forEach((cart) => {
            let productTotal = cart.price * cart.quantity;
            cartTotal += productTotal;
            $("#cart").append(
              `<div class="cart-items-container">
                                    <div class="cart-thumbnail-wrapper">
                                        <img class="cart-thumbnail" id="cart-thumbnail" src="${cart.imageLink}" alt="Image of ${cart.productName}">
                                    </div>
                                    <div class="quantity-container">
                                        <h2 class="item-name">${cart.productName}</h2>
                                        <span class="item-price">Cost $${cart.price}</span>
                                        <span class="update-buttons-group">
                                            <button id="increment${cart.id}" class="increment-button">+</button>
                                            <p class="quantity">${cart.quantity}</p>
                                            <button id="decrement${cart.id}" class="decrement-button">-</button>
                                            <button id="remove-item${cart.id}" class="remove-cart-button"><i class="fa-solid fa-trash-can" style="color: #ff0000;"></i></button>
                                        </span>
                                    </div>
                                </div>`
            );
            $("#cart-price").show();
            $("#checkout-button").show();
            $(`#increment${cart.id}`).click(function () {
              let CartItemIndex = cartItems.findIndex(
                (item) => item.id === cart.id
              );
              if (CartItemIndex !== -1) {
                cartItems[CartItemIndex].quantity += 1;
                updateCart();
              }
            });
            $(`#decrement${cart.id}`).click(function () {
              let CartItemIndex = cartItems.findIndex(
                (item) => item.id === cart.id
              );
              if (CartItemIndex !== -1) {
                if (cartItems[CartItemIndex].quantity > 0) {
                  cartItems[CartItemIndex].quantity -= 1;
                  if (cartItems[CartItemIndex].quantity === 0) {
                    cartItems.splice(CartItemIndex, 1);
                    $("#cart-price").hide();
                    $("#checkout-button").hide();
                  }
                }
                updateCart();
              }
            });
            $(`#remove-item${cart.id}`).click(function () {
              let CartItemIndex = cartItems.findIndex(
                (item) => item.id === cart.id
              );
              if (CartItemIndex !== -1) {
                cartItems.splice(CartItemIndex, 1);
                $("#cart-price").hide();
                $("#checkout-button").hide();
                updateCart();
              }
            });
            $("#cart-price").text(`Cart Total: $${cartTotal}`);
          });
        }
        $("#search-box").keyup(function () {
          $("#product-items-container").html("");
          let searchValue = $("#search-box").val().toLowerCase();
          let searchResult = false;
          completeProducts.forEach((item) => {
            if (item.title.toLowerCase().startsWith(searchValue)) {
              searchResult = true;
              let discountPrice = Math.round(
                item.price - item.price * (item.discountPercentage / 100)
              );
              $("#product-items-container").append(
                `<div class="item-container">
                            <div class="thumbnail-wrapper">
                                <img src="${item.thumbnail}" alt="Image of ${item.title}" class="thumbnail">
                            </div>
                            <div class="product-info">
                                <h2 class="product-title">${item.title}</h2>
                                <span class="product-rating">${item.rating} ★</span>
                                <p class="product-description">${item.description}</p>
                            </div>
                            <div id="more-images${item.id}" class="more-images"></div>
                            <div class="price-info">
                                <p class="discount-price">$${discountPrice}</p>
                                <span class="og-price">$${item.price}</span>
                                <span class="discount-percentage">${item.discountPercentage}%</span>
                                <p class="product-stock">${item.stock} left</p>
                                <button id="item${item.id}" class="add-cart-button">Add to cart <i class="fa-solid fa-cart-shopping" style="color: #ffffff;"></i></button>
                            </div>
                        </div>`
              );
              let itemImages = item.images;
              for (let i = 0; i < itemImages.length; i += 1){
                $(`#more-images${item.id}`).append(`<div class="images-wrapper">
                                            <img class="image" src="${itemImages[i]}" alt="">
                                          </div>`);
              }
              $(`#item${item.id}`).click(function addtoCart() {
                let CartItemIndex = cartItems.findIndex(
                  (element) => element.id === item.id
                );
                if (CartItemIndex !== -1) {
                  cartItems[CartItemIndex].quantity += 1;
                } else {
                  cartItems.push({
                    id: item.id,
                    productName: item.title,
                    price: discountPrice,
                    imageLink: item.thumbnail,
                    quantity: 1,
                  });
                }
                updateCart();
              });
            }
          });
          if (!searchResult) {
            $("#product-items-container").append(
              '<p class="no-results">No results found</p>'
            );
          }
        });
      }
    },
  });
});
