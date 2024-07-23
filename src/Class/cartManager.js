import fs from "fs";
class CartManager {
  constructor(path) {
    this.path = path;
  }
  async showDataBase() {
    const cartInDataBase = JSON.parse(
      await fs.promises.readFile(this.path, "utf-8")
    );
    return cartInDataBase;
  }
  async newId() {
    const cartsInDatabase = await this.showDataBase();
    if (cartsInDatabase.length) {
      const lastCartInDatabase = cartsInDatabase[cartsInDatabase.length - 1];
      const lastId = lastCartInDatabase.id;
      return lastId + 1;
    } else {
      return 1;
    }
  }
  async cartsInDatabase(limit) {
    const cartsInDatabase = await this.showDataBase();
    const limitData = cartsInDatabase.slice(0, limit);
    if (limitData.length) {
      return limitData;
    } else
      return {
        messaje: "no encontrado",
      };
  }
  async addCart() {
    const cartsInDatabase = await this.showDataBase();
    const newCartWithId = { products: [], id: await this.newId() };
    cartsInDatabase.push(newCartWithId);
    const updatedDatabase = JSON.stringify(cartsInDatabase, null, " ");
    await fs.promises.writeFile(this.path, updatedDatabase);
    return { messaje: "agregado correctamente" };
  }
  async getCartById(cartId) {
    const cartsInDatabase = await this.showDataBase();
    const cartFinded = cartsInDatabase.find((item) => item.id == cartId);
    if (cartFinded) {
      if (cartFinded.products.length) {
        return cartFinded.products;
      }
      return {
        message: "Sin productos",
      };
    } else {
      return {
        message: "Carro:" + cartId + " inexistente",
      };
    }
  }
  async addProductInCart(params) {
    const cartsInDatabase = await this.showDataBase();
    const cartFinded = cartsInDatabase.find((item) => item.id == params.idcart);
    if (cartFinded) {
      const productExistInCart = cartFinded.products.find(
        (item) => item.product == params.idproduct
      );
      if (productExistInCart) {
        productExistInCart.quantity++;
        const updatedDatabase = JSON.stringify(cartsInDatabase, null, " ");
        await fs.promises.writeFile(this.path, updatedDatabase);
        return {
          messaje: "Se agrego" + params.idproduct + " en carro" + params.idcart,
        };
      } else {
        const productInCart = {
          product: parseInt(params.idproduct),
          quantity: 1,
        };
        cartFinded.products.push(productInCart);
        const updatedDatabase = JSON.stringify(cartsInDatabase, null, " ");
        await fs.promises.writeFile(this.path, updatedDatabase);
        return {
          messaje:
            "Se agrego " + params.idproduct + " en carro " + params.idcart,
        };
      }
    } else {
      return { messaje: "No existe" };
    }
  }
}
export { CartManager };
