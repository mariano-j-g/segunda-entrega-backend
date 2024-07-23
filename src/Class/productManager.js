import fs from "fs";
class ProductManager {
  constructor(path) {
    this.path = path;
  }
  async newId() {
    const productsInDataBase = await this.showDataBase();
    if (productsInDataBase.length) {
      const lastProduct = productsInDataBase[productsInDataBase.length - 1];
      const lastId = lastProduct.id;
      return lastId + 1;
    } else {
      return 1;
    }
  }
  async showDataBase() {
    const productsInDataBase = JSON.parse(
      await fs.promises.readFile(this.path, "utf-8")
    );
    return productsInDataBase;
  }
  async getProducts(limit) {
    const productsInDataBase = await this.showDataBase();
    const productsToShow = productsInDataBase.slice(0, limit);
    if (productsToShow.length) {
      return productsToShow;
    } else
      return {
        messaje: "Producto no encontrado",
      };
  }
  async getProductById(productId) {
    const productsInDataBase = await this.showDataBase();
    const productFinded = productsInDataBase.find(
      (item) => item.id == productId
    );
    if (productFinded) {
      return productFinded;
    } else {
      return {
        messaje: "Producto:" + productId + " inexistente",
      };
    }
  }
  async addProduct(body) {
    const { title, description, code, price, stock, category } = body;
    if (title && description && code && price && stock && category) {
      if (typeof title !== "string") {
        return { messaje: "Error debe ser texto" };
      }
      if (typeof description !== "string") {
        return { messaje: "Error debe ser texto" };
      }
      if (typeof code !== "string") {
        return { messaje: "Error debe ser texto" };
      }
      if (typeof price !== "number") {
        return { messaje: "Debe ser numero" };
      }
      if (typeof stock !== "number") {
        return { messaje: "Debe ser nunmero" };
      }
      if (typeof category !== "string") {
        return { messaje: "Dbebe ingresar texto" };
      }
      if (body.thumbnails) {
        if (!Array.isArray(body.thumbnails)) {
          return {
            messaje: "Debe ser cadena",
          };
        }
      }
      const newProductWithId = {
        ...body,
        status: true,
        id: await this.newId(),
      };
      const productsInDataBase = await this.showDataBase();
      productsInDataBase.push(newProductWithId);
      const updatedDatabase = JSON.stringify(productsInDataBase, null, " ");
      await fs.promises.writeFile(this.path, updatedDatabase);
      return {
        messaje: "nuevo producto agregado",
      };
    } else {
      return {
        messaje: "complete todos los campos",
      };
    }
  }
  async modifyProduct(productId, body) {
    const productsInDataBase = await this.showDataBase();
    const result = productsInDataBase.find((item) => item.id == productId);
    if (result) {
      const { title, description, code, price, stock, category } = body;
      if (title && description && code && price && stock && category) {
        if (typeof title !== "string") {
          return { messaje: "Debe ser texto" };
        }
        if (typeof description !== "string") {
          return { messaje: "Debe ser texto" };
        }
        if (typeof code !== "string") {
          return { messaje: "Debe ser texto" };
        }
        if (typeof price !== "number") {
          return { messaje: "Debe swr valor numerico" };
        }
        if (typeof stock !== "number") {
          return { messaje: "Debe ser valor numerico" };
        }
        if (typeof category !== "string") {
          return { messaje: "Debe ser texto" };
        }
        if (body.thumbnails) {
          if (!Array.isArray(body.thumbnails)) {
            return {
              messaje: "dee ser cadena",
            };
          }
        }
        result.title = title;
        result.description = description;
        result.code = code;
        result.price = price;
        if (body.status === false) {
          result.status = false;
        }
        result.stock = stock;
        result.category = category;
        if (body.thumbnails) {
          result.thumbnails = body.thumbnails;
        }
        const updatedDatabase = JSON.stringify(productsInDataBase, null, " ");
        await fs.promises.writeFile(this.path, updatedDatabase);
        return {
          messaje: "producto modificado",
        };
      } else {
        return {
          messaje: "falta completar campos",
        };
      }
    }
  }
  async deleteProduct(productId) {
    const productsInDataBase = await this.showDataBase();
    const indexProductoToDelete = productsInDataBase.findIndex(
      (item) => item.id == productId
    );
    if (indexProductoToDelete > -1) {
      productsInDataBase.splice(indexProductoToDelete, 1);
      const updatedDatabase = JSON.stringify(productsInDataBase, null, " ");
      await fs.promises.writeFile(this.path, updatedDatabase);
      return { messaje: "producto eliminado" };
    } else {
      return {
        messaje: "Producto: " + productId + " inexistente",
      };
    }
  }
}

export { ProductManager };
