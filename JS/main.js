let burgerMenu = document.querySelector(".burger-menu");
let menuList = document.querySelector(".burger-menu .list-menu");
let menuItems = document.querySelectorAll(".burger-menu .list-menu .list a");
let detailsItems = document.querySelectorAll(
  ".burger-menu .list-menu .details div"
);
let mediumScreens = window.matchMedia("(max-width: 767px)");

function myFunc(mediumScreens) {
  if (!mediumScreens.matches) {
    for (let i = 0; i < menuItems.length; i++) {
      menuItems[i].addEventListener("mouseover", function (e) {
        detailsItems.forEach(function (div) {
          div.classList.add("visually-hidden");
        });
        document
          .querySelector(e.currentTarget.dataset.categ)
          .classList.remove("visually-hidden");
      });
    }
  }
}
myFunc(mediumScreens);
mediumScreens.addListener(myFunc);

burgerMenu.onmouseover = function () {
  menuList.classList.replace("d-none", "d-flex");
};
burgerMenu.onmouseout = function () {
  menuList.classList.replace("d-flex", "d-none");
};

onmousemove = function () {
  if (menuList.classList.contains("d-none")) {
    detailsItems.forEach(function (div) {
      div.classList.add("visually-hidden");
    });
  }
};

const grandCaterorie = document.querySelectorAll(".categories ul li span");
const anchor = document.querySelectorAll(".categories a");

for (let a of anchor) {
  a.onclick = function (e) {
    anchor.forEach((a) => {
      a.classList.remove("active");
    });
    a.classList.add("active");
  };
}

for (let i of grandCaterorie) {
  let icon = document.createElement("i");
  icon.setAttribute("onclick", "toggleShowHide(this)");
  icon.classList.add("fa-solid", "fa-plus", "border", "rounded-1");
  i.prepend(icon);
}

function toggleShowHide(ele) {
  let span = ele.parentElement;
  span.style.userSelect = "none";
  if (ele.classList.contains("fa-plus")) {
    ele.classList.replace("fa-plus", "fa-minus");
    span.nextElementSibling.style.display = "block";
  } else {
    ele.classList.replace("fa-minus", "fa-plus");
    span.nextElementSibling.style.display = "none";
  }
}

const searchInput = document.getElementById("find");
const brandsContainer = document.querySelector(".brands-container");
const offersContainer = document.querySelectorAll("[data-category]");
let productsList;

async function categoriesOffers() {
  await productsItems();
  offersContainer.forEach(function (cont) {
    let numberOfItems = +cont.dataset.count || productsList.length;
    let exp = productsList.filter((prod) =>
      prod["category"].split(" ").includes(cont.dataset.category)
    );
    let container = document.createElement("div");
    container.classList.add("row", "sec-body", "row-gap-3");
    for (let i = 0; i < numberOfItems; i++) {
      let product = document.createElement("div");
      numberOfItems == 6
        ? product.classList.add("col-2")
        : product.classList.add("col-3");
      product.innerHTML = `
      <a href="#" class="card h-100 border-0" title="${exp[i]["title"]}">
        <img src="${
          exp[i]["image"]
        }" class="card-img-top" alt="Product-Image" />
        <h6 class="card-title fw-semibold ps-1 pe-1 text-nowrap">
          ${exp[i]["title"]}
        </h6>
        <p class="fs-6 fw-bold ps-1 pe-1 m-0">${exp[i]["new price"]} DA</p>
        <p
          class="old-price mb-1 fs-6 fw-bold ps-1 pe-1 text-body-tertiary text-decoration-line-through"
        >
        ${
          +exp[i]["new price"] >= +exp[i]["old price"]
            ? ""
            : exp[i]["old price"] + " DA"
        }
        </p>
        ${
          100 - Math.trunc((exp[i]["new price"] * 100) / exp[i]["old price"]) <=
          0
            ? ""
            : `<div class="remise-percent">-${
                100 -
                Math.trunc((exp[i]["new price"] * 100) / exp[i]["old price"])
              }%</div>`
        }
        <div class="fav" onclick="favoriteProduct(this)" onmouseleave="retDefault(this)" title="Ajouter au favoris""><i class="fa-regular fa-heart"></i></div>
        <div class="add-to-cart" onclick="cartAdding(this, ${
          exp[i]["id"]
        })" onmouseleave="retDefault(this)" title="Ajouter au panier"><i class="fa-solid fa-cart-shopping"></i></div>
      </a>`;
      container.appendChild(product);
    }
    cont.appendChild(container);
  });
}
categoriesOffers();

async function dataBrands() {
  await productsItems();
  let brandsList = productsList.map((prod) => prod["brand"]).sort();
  let brandsUnique = [...new Set(brandsList)];
  brandsContainer.innerHTML = brandsUnique
    .map(
      (brand) => `
    <div class="d-flex">
    <input type="checkbox" name="brand" id="${brand.toLowerCase()}">
    <label for="${brand.toLowerCase()}" class="fw-semibold p-1 ps-2 w-50">${brand}</label>
    </div>`
    )
    .join("");

  const brandsLabel = document.querySelectorAll(
    ".brands-container > div label"
  );

  searchInput.addEventListener("input", function () {
    let searchValue = this.value.toLowerCase();
    for (let i = 0; i < brandsLabel.length; i++) {
      let value = brandsLabel[i].innerHTML.toLowerCase();
      if (value.indexOf(searchValue) == -1) {
        brandsLabel[i].parentElement.classList.replace("d-flex", "d-none");
      } else {
        brandsLabel[i].parentElement.classList.replace("d-none", "d-flex");
      }
    }
  });
}
dataBrands();

async function productsItems() {
  let products = await fetch("../JS/products.json");
  productsList = await products.json();
}

function favoriteProduct(ele) {
  ele.innerHTML ==
  '<svg class="svg-inline--fa fa-heart" aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"></path></svg><!-- <i class="fa-regular fa-heart"></i> Font Awesome fontawesome.com -->'
    ? (ele.innerHTML = `<i class="fa-solid fa-heart" title="Supprimer des favoris"></i>`)
    : (ele.innerHTML = `<i class="fa-regular fa-heart"></i>`);
  ele.parentElement.onclick = function (e) {
    e.preventDefault();
  };
}
function retDefault(ele) {
  ele.parentElement.onclick = function (e) {
    e.defaultPrevented;
  };
}

const cartIcon = document.querySelector(".main-header .cart span");
let cartContent = document.querySelector(".panier");
let indexesOfCartItems = [];



function cartAdding(ele, id) {
  ele.parentElement.onclick = function (e) {
    e.preventDefault();
  };
  if (ele.firstChild.style.color == "rgb(255, 176, 0)") {
    ele.firstChild.style.opacity = "";
    ele.firstChild.style.color = "#004225";
    indexesOfCartItems.splice(indexesOfCartItems.indexOf(id - 1), 1);
    indexesOfCartItems.length <= 9
      ? (cartIcon.innerHTML = indexesOfCartItems.length)
      : (cartIcon.innerHTML = "+9");
  } else {
    ele.firstChild.style.opacity = "1";
    ele.firstChild.style.color = "#ffb000";
    indexesOfCartItems.push(id - 1);
    indexesOfCartItems.length <= 9
      ? (cartIcon.innerHTML = indexesOfCartItems.length)
      : (cartIcon.innerHTML = "+9");
  }
  cartIcon.innerHTML <= 0
    ? cartIcon.classList.add("d-none")
    : cartIcon.classList.remove("d-none");
    async function dealWithCartItems() {
      await productsItems();
      let exp = [];
      productsList.map((prod) => (prod["id"] == id ? exp.push(prod) : null));
    
      if (indexesOfCartItems.length == 0) {
        cartContent.innerHTML = `<div class="section container text-center pt-4 pb-4">
          <div class="no-product mb-4"><img src="IMG/panier_vide.png" alt="" /></div>
          <h3>Votre panier est vide!</h3>
          <p>Parcourez nos catégories et découvrez nos meilleures offres!</p>
          <a href="index.html" class="btn">Commencez vos achats</a>
          </div>`;
      } else {
        let contain = document.createElement("div");
        contain.classList.add(
          "container",
          "d-flex",
          "gap-2",
          "justify-content-between",
          "align-items-baseline",
          "p-0"
        );
        let sec = document.createElement("div");
        sec.classList.add("section", "flex-grow-1");
        let title = document.createElement("h4");
        title.classList.add("m-0", "p-2", "border-bottom");
        title.innerHTML = `Panier (${exp.length})`;
        let prods = document.createElement("div");
        prods.classList.add("products");
    
        for (let i = 0; i < exp.length; i++) {
          let prod = document.createElement("div");
          prod.classList.add(
            "product",
            "d-flex",
            "justify-content-between",
            "pt-2",
            "pb-2",
            "border-bottom"
          );
          prod.innerHTML = `
              <div class="d-flex ps-2">
                <img src="${exp[i]["image"]}" alt="Product-image">
                <h6 class="p-2">${exp[i]["title"]}</h6>
              </div>
              <div class="info p-2 text-end d-flex flex-column">
                <span class="n-price fw-bold fs-5 mb-1">${
                  exp[i]["new price"]
                } DA</span>
                <div class="descount flex-grow-1 d-flex align-items-baseline gap-3">
                  <span class="o-price fw-bold text-secondary text-decoration-line-through">${
                    exp[i]["old price"]
                  } Da</span>
                  ${
                    100 -
                      Math.trunc(
                        (exp[i]["new price"] * 100) / exp[i]["old price"]
                      ) <=
                    0
                      ? ""
                      : `<span class="remise-percent">-${
                          100 -
                          Math.trunc(
                            (exp[i]["new price"] * 100) / exp[i]["old price"]
                          )
                        }%</span>`
                  }
                </div>
                <div class="quantity d-flex align-items-center">
                  <button class="btn fw-bold"><i class="fa-solid fa-minus"></i></button>
                  <span class="ps-3 pe-3 fs-5 fw-bold">1</span>
                  <button class="btn"><i class="fa-solid fa-plus"></i></button>
                </div>
              </div>`;
          prods.appendChild(prod);
        }
        sec.appendChild(title);
        sec.appendChild(prods);
        contain.appendChild(sec);
        cartContent.appendChild(contain);
      }
    }
  dealWithCartItems();
}
/*
<div class="section total-price" style="min-width: 280px;">
  <h5 class="m-0 p-2 border-bottom">Résumé du panier</h5>
  <div class="total p-2 border-bottom d-flex gap-5 justify-content-between align-items-center">
    <p class="m-0">Sous-total</p>
    <span class="fw-bold fs-5">0 DA</span>
  </div>
  <div class="commande p-2">
    <a href="#" class="btn w-100 fw-semibold fs-6">Commander</a>
  </div>
</div>
*/