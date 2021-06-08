//import { Low, JSONFile } from '../node_modules/lowdb'

export default class Pay {

    constructor() {
        this.form = document.getElementById('form-buy');
        this.name = document.getElementById('name');
        this.email = document.getElementById('email');
        this.cardNumber = document.getElementById('cardNumber');
        this.cardExpirated = document.getElementById('cardExpirated');
        this.cardCVV = document.getElementById('cardCVV');
        this.cart = '';
    }

    setCart(cart) {
        this.cart = cart;
    }

    //When form Pay is submitted
    onSubmitPay(e) {
        e.preventDefault();

        const buyer = {
            name: this.name.value,
            email: this.email.value,
            cardNumber: this.cardNumber.value,
            cardExpirated: this.cardExpirated.value,
            cardCVV: this.cardCVV.value
        }
        
        //Get data from cart
        const cart = this.cart.cart;

        const sale = {
            buyer: buyer,
            order: cart
        }

        //Save the sale Object at JSON file (DB)
        console.log(sale);

        //Clean the cart
        this.cart.cleanCart();

        this.form.reset();
    }

}