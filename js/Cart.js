export default class Cart {

    constructor () {
        //Get the cart from LocalStorage
        this.cart = JSON.parse(localStorage.getItem('cart'));
        //If don't exist create the object
        if (!this.cart || this.cart.length < 1) {
            this.cart = {
                quantity: 0,
                total: 0,
                items: []
            }
        }
        this.navCart = document.getElementById('number-items-cart');
        this.model = '';
        this.tableCart = document.getElementById('table-cart');
    }

    //Communication with Product class as a method model :)
    setModel(model) {
        this.model = model;
    }

    //Show the quantity of products at cart at header
    showQuantity() {
        this.navCart.innerText = this.cart.quantity;
    }

    //When click at AddProduct at cart
    async addProductCart(productId) {
        //Obtains product's details from model (product class)
        const details = await this.model.getDetails(productId);
        const txtQuantity = document.getElementById('detail-cart-quantity').value;
        const quantityProduct = parseInt(txtQuantity, 10);

        let item = {};
        //If the cart has products actually
        if (Array.isArray(this.cart.items) && this.cart.items.length) {
            //Search at the cart the product by ProductId received by param
            const element = this.cart.items.filter(i => i.idProduct === productId);

            //If this product exist at cart, updated this quantity and subtotal
            if (Array.isArray(element) && element.length) {
                element[0].quantity += parseInt(quantityProduct, 10);
                element[0].subtotal += parseInt(quantityProduct, 10) * parseInt(details.price, 10);

            //If product don't exist at cart, create a object Item
            }else {
                item = {
                    idProduct: details.id,
                    nameProduct: details.name,
                    image: details.image,
                    price: parseInt(details.price, 10),
                    quantity: parseInt(quantityProduct, 10),
                    subtotal: parseInt(quantityProduct, 10) * parseInt(details.price, 10)
                };
                //Add the object to array cart.items
                this.cart.items.push(item);
            }

        // If the cart is empty, create a object Item and insert to array cart.items
        }else {
            item = {
                idProduct: details.id,
                nameProduct: details.name,
                image: details.image,
                price: parseInt(details.price, 10),
                quantity: parseInt(quantityProduct, 10),
                subtotal: parseInt(quantityProduct, 10) * parseInt(details.price, 10)
            };
            this.cart.items.push(item);
        }

        //Update the object with total and quantitys
        this.cart.quantity += parseInt(quantityProduct, 10);
        this.cart.total += parseInt(quantityProduct, 10) * parseInt(details.price, 10);
        
        //Save at localstorage the cart object.
        localStorage.setItem('cart', JSON.stringify(this.cart));

        //Updated the show Quantity at header
        this.showQuantity();
        //Show a message of success
        this.showAlert();
    }

    //Show a success message
    showAlert() {
        const divDetails = document.getElementById('divDetails');
        divDetails.innerHTML += `
        <div class="alert success"><p><strong>Agregado al carrito.</strong> Desea <a href="/cart.html">Ver el Carrito?</a> o <a href="/products.html">Seguir Comprando?</a></p></div>
        `
    }

    //Show the cart at a table
    renderCart() {
        const tbody = this.tableCart.getElementsByTagName('tbody')[0];
        const tfoot = this.tableCart.getElementsByTagName('tfoot')[0];
        
        //Clean the table
        tbody.innerHTML = '';
        tfoot.innerHTML = '';

        //Show a row for each item
        for (const item of this.cart.items) {
            const row = tbody.insertRow();
            row.setAttribute('id', item.idProduct)
            row.classList.add('table-cart-row');
            row.innerHTML = `
                <td class="table-cart-description">
                    <span>${item.nameProduct}</span>
                    <img src="${item.image}" alt="${item.nameProduct}"  class="table-cart-image">
                </td>
                <td class="table-cart-item">${item.quantity}</td>
                <td class="table-cart-item">$ ${item.price}</td>
                <td class="table-cart-item">$ ${item.subtotal}</td>
                <td class="table-cart-item"><button class="table-btn-delete">X</button></td>
            `;
        }

        //Hidden the buttons clean and buy if cart is empty
        let buttonIsHidden = true;
        if (Array.isArray(this.cart.items) && this.cart.items.length) {
            buttonIsHidden = false;
        }else {
            buttonIsHidden = true;
        }

        //Show the tfoot
        tfoot.innerHTML = `
            <tr class="table-cart-row-footer">
                <td colspan="4" class="table-cart-total table-cart-footer">TOTAL</td>
                <td colspan="1" class="table-cart-footer">$ ${this.cart.total}</td>
            </tr>
            <tr class="table-btn">
                <td colspan="4"><button id="btn-clean" class="table-btn-button ${buttonIsHidden ? 'hidden' : ''}">VACIAR</button></td>
                <td><button id="btn-pay" class="table-btn-button ${buttonIsHidden ? 'hidden' : ''}">PAGAR</button></td>
            </tr>
        `;
        
        //Updated the show Quantity at header
        this.showQuantity();
    }

    //When clicked clean cart
    cleanCart() {
        //Delete cart from localstorage
        localStorage.removeItem('cart');
        //Clean the object
        this.cart = {
            quantity: 0,
            total: 0,
            items: []
        }
    }

    //When clicked delete a Item at cart
    deleteItem(idProduct) {
        //Search the item at array
        for (let i = 0; i < this.cart.items.length; i++) {
            const item = this.cart.items[i];

            if (item.idProduct === idProduct) {
                this.cart.total -= item.subtotal;
                this.cart.quantity -= item.quantity;
                this.cart.items.splice(i, 1);

                //Update the localstorage
                localStorage.setItem('cart', JSON.stringify(this.cart));
                //Update the view
                this.renderCart();
            }
        }
    }

}