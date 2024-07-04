import { response } from "./responseHandler.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

class CardsImpl {
  async getCards(req, res) {
    try {
      const token = crypto.randomUUID();
      const hash = await bcrypt.hash(token, 10);
      response({ code: 200, message: hash, res, success: true });
    } catch (error) {
      response({ code: 500, message: error, res, success: false });
    }
  }
}

const cardsImpl = new CardsImpl();
export { cardsImpl };
