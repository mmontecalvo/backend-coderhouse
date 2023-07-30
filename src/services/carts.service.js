import { Carts } from "../DAO/factory.js";
import { productsService } from "./products.service.js";
import { ticketsService } from "./tickets.service.js";

class CartsService {
    constructor(dao) {
        this.dao = dao;
    }

    async newCart() {
        const cartCreated = await this.dao.newCart();
        if (!cartCreated) {
            throw new Error("Cart could not be created.");
        }
        return cartCreated;
    }

    async getCartById(idCart) {
        const cart = await this.dao.getCartById(idCart);
        if (!cart) {
            throw new Error("Cart not found.");
        }
        return cart;
    }

    async updateCart(idCart, updateCart){
        const cartUptaded = await this.dao.updateCart(idCart , updateCart);
        return cartUptaded;
    }

    async addProductToCart(cid, pid, qty) {
        const cart = await this.getCartById(cid); 
        const product = await productsService.getProductById(pid);

        if(cart && product){
            const existingProduct = cart.products.find((p) => p.product._id.toString() === pid.toString());
            if (existingProduct) {
                existingProduct.quantity += qty;
            } else {
                const newProduct = {
                  product: pid,
                  quantity: qty
                };
                cart.products.push(newProduct);
            }
            const cartUpdated = await this.updateCart(cid, cart);
            return cartUpdated;
        } else {
            throw new Error("Cart or product not exist.");
        }
    }

    async deleteProductToCart(cid, pid) {
        const cart = await this.getCartById(cid); 
        const product = await productsService.getProductById(pid);

        if(cart && product){
            const cartUpdated = await this.dao.deleteProductToCart(cid, pid);
            return cartUpdated;
        } else {
            throw new Error("Cart or product not exist.");
        }
    }

    async emptyCart(cid) {
        const cart = await this.getCartById(cid);

        if (cart) {
            const cartUpdated = await this.dao.emptyCart(cid);
            return cartUpdated;
        } else {
            throw new Error("Cart not exist.");
        }
    }

    async updateAllCart(idCart, updateCart){
        const emptyCart = await this.emptyCart(idCart);
        if(emptyCart) {
            for (const prod of updateCart) {
                await this.addProductToCart(idCart, prod.product, prod.quantity);
            }
            return await this.getCartById(idCart);
        } else {
            throw new Error("Cart not found or invalid information.");
        }
    }

    async updateProductQty(cid, pid, newQty) {
        const cart = await this.getCartById(cid);

        if(cart){
            const cartUpdated = await this.dao.updateProductQty(cid, pid, newQty);
            if(cartUpdated.modifiedCount === 0){
                throw new Error('Product not exist or not is included into the cart!');
            } else {
                return cartUpdated;
            }
        } else {
            throw new Error('Cart not exist.');
        }
    }

    async finalizePurchase(cid, user) {
        const cart = await this.getCartById(cid);

        if(cart) {
            const createTicket = await ticketsService.createTicket(user);
            for (const prod of cart.products) {
                const product = await productsService.getProductById(prod.product._id);
                if(product.stock >= prod.quantity) {
                    await productsService.updateProduct(product._id, { stock: product.stock - prod.quantity});
                    const amount = product.price * prod.quantity;
                    await ticketsService.updateTicketAmount(createTicket._id, amount);
                    await this.deleteProductToCart(cid, product._id);
                }
            }
            const finalizedPurchase = await ticketsService.getTicketById(createTicket._id);
            return finalizedPurchase;
        } else {
            throw new Error('Cart not exist.');
        }
    }
}

export const cartsService = new CartsService(Carts);