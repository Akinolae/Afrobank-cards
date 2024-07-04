import express from "express";
import { cardsImpl } from "../services/cards.js";

const router = express.Router();

router.get("/get-cards", cardsImpl.getCards);

export { router };
