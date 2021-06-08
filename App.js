import Category from './js/Category.js';
import Cart from './js/Cart.js';
import Product from './js/Product.js';
import MaskInputs from './js/maskInputs.js';
import Pay from './js/Pay.js';

const category = new Category();
const cart = new Cart();
const product = new Product();


//Asign Product as model for Cart
cart.setModel(product);

//When site is loaded excute the functions
document.addEventListener('DOMContentLoaded', () => {
    validation();
    cart.showQuantity();
});

//Validate the URL for assign functions
async function validation() {
    switch (window.location.pathname) {
        case '/':
            await showCategories();
            break;

        case '/index.html':
            await showCategories();
            break;
        
        case '/products.html':
            await getCategories();
            await showProducts();
            break;
        
        case '/product-detail.html':
            await getDetailProduct();
            break;
        
        case '/cart.html':
            showCart();
            listenEvents();
            break;

        case '/pay.html':
            mask();
            onSubmitPay();
            break;
    }
}

//Show categories at Index
async function showCategories() {

    const listCategories = await category.getCategories();
    category.render(listCategories);

    //Event when category is clicked
    category.containerHome.addEventListener('click', (e) => {clickCategory(e)})

}

//Event when category is clicked
function clickCategory(e) {
    //Verify if target clicked is a category
    if (e.target.parentElement.className === 'category') {
        const categoryId = e.target.parentElement.id;
        window.location.href = `/products.html?categoryId=${categoryId}`;
    }
}

//Show categories at products page
async function getCategories() {
    const listCategories = await category.getCategories();
    category.showList(listCategories);
    //Get the params URL for assign class to Category Link
    let params = new URLSearchParams(location.search);
    const categoryId = params.get('categoryId');
    //Change the class to active Category
    category.setActive(categoryId);
}

//Show products at products page
async function showProducts() {
    //Get the Category Id by param
    let params = new URLSearchParams(location.search);
    const categoryId = params.get('categoryId');

    const listProducts = await product.getProducts(categoryId);
    product.render(listProducts);

    //When a product is clicked
    product.containerProducts.addEventListener('click', (e) => {clickProduct(e)})
}

//When a product is clicked
function clickProduct(e) {
    let productId = '';
    //If is clicked at image, text, or div
    if (e.target.className === 'product') {
        productId = e.target.id;
    }else if(e.target.parentElement.className === 'product') {
        productId = e.target.parentElement.id;
    }
    //If is a valid product Id, redirect to product details page
    if (productId !== '') {
        window.location.href = `/product-detail.html?productId=${productId}`;
    }
    
}

//Get the details of a product
async function getDetailProduct() {
    //Get the productId by param
    let params = new URLSearchParams(location.search);
    const productId = params.get('productId');
    const details = await product.getDetails(productId);
    //Show details if exist
    if (details !== false) {
        product.renderDetails(details);
    }

    //Event Listener over Add Cart Button
    const btnAddCart = document.getElementById('detail-btn-add');
    btnAddCart.addEventListener('click', () => addProductCart());
}

//When button Add Product Cart is clicked
async function addProductCart() {
    //Get the productId by param
    let params = new URLSearchParams(location.search);
    const productId = params.get('productId');
    await cart.addProductCart(productId);
}

//Show the cart at a table
function showCart() {
    cart.renderCart();
}

//Events at the cart page
function listenEvents() {
    const btnPay = document.getElementById('btn-pay');
    const btnClean = document.getElementById('btn-clean');

    //When the btn Pay is clicked
    btnPay.addEventListener('click', () => {
        window.location.href = `/pay.html`;
    });

    //When the btn Clean is clicked
    btnClean.addEventListener('click', () => {cleanCart()});

    //When is clicked deleted a item at a row from table
    const tbody = cart.tableCart.getElementsByTagName('tbody')[0];
    tbody.addEventListener('click', (e) => {clickDelete(e)})
}

//When the btn Clean is clicked
function cleanCart() {
    cart.cleanCart();
    //Again render the table
    cart.renderCart();
}

//When is clicked deleted a item at a row from table
function clickDelete(e) {
    //If target clicked is the button delete
    if (e.target.className === 'table-btn-delete') {
        const idProduct = e.target.parentElement.parentElement.id;
        cart.deleteItem(idProduct);
    }
}

//Mask to inputs of Pay form
function mask() {
    
    const ccMask = new MaskInputs();

    const inputNumber = document.getElementById('cardNumber');
    const inputExpirated = document.getElementById('cardExpirated');
    const inputCCV = document.getElementById('cardCVV')

    ccMask.maskCreditCard(inputNumber, inputExpirated, inputCCV);
    
}

//When form Pay is submitted
function onSubmitPay() {
    const pay = new Pay();
    //Setting Shop Cart to Pay class
    pay.setCart(cart);

    const form = document.getElementById('form-buy');
    form.addEventListener('submit', (e) => {pay.onSubmitPay(e)});
}