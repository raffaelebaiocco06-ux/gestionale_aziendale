import api from "./axios";

export const getCategorie = () => api.get("/categorie?size=100");
