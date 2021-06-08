export default class Product {

    constructor() {
        this.containerProducts = document.getElementById('list-products');
        this.containerDetails = document.getElementById('container-detail');
    }

    //Get the products from DB WITH Category Id Param.
    async getProducts(categoryId) {
        const URI = '../db/products.json';
        const response = await fetch(URI);

        const data = await response.json();

        //If category Id is empty return all products
        if (!categoryId) {
            return data.products;
        }else{
            //Return products filters by category Id
            return data.products.filter(product => product.category === categoryId)
        }
    }

    //Show the products at product page
    render(listProducts) {
        for (const product of listProducts) {
            const divProduct = document.createElement('div');
            divProduct.classList.add('product');
            divProduct.setAttribute('id', product.id);

            const image = document.createElement('img');
            image.classList.add('product-image');
            image.src = product.image;
            image.setAttribute('alt', product.name);
            divProduct.append(image);

            const title = document.createElement('span');
            title.classList.add('product-title');
            title.innerText = product.name;
            divProduct.append(title);

            const price = document.createElement('span');
            price.classList.add('product-price');
            price.innerText = `$ ${product.price}`;
            divProduct.append(price);

            this.containerProducts.append(divProduct);
        }
    }

    //Get product's details filter by productId
    async getDetails(productId) {
        const URI = '../db/products.json';
        const response = await fetch(URI);

        const data = await response.json();
        const details = data.products.filter(product => product.id === productId);

        //If is a real product return the details.
        if (Array.isArray(details) && details.length) {
            return details[0];
        }else {
            //Return false if product is inexistent.
            return false;
        }
    }

    //Show the details of a product
    renderDetails(details) {
        this.containerDetails.innerHTML += `
        <div class="container-detail-image">
            <img src="${details.image}" alt="${details.name}" class="detail-image">
        </div>
        <div class="details" id="divDetails">
            <span class="detail-title">${details.name}</span>
            <span class="detail-price">$ ${details.price}</span>
            <p class="detail-description">${details.description}</p>
            <div class="add-cart">
                <input type="number" class="detail-cart-quantity" id="detail-cart-quantity" value="1">
                <button id="detail-btn-add">Agregar al Carrito</button>
            </div>
        </div>
        `
    }

}