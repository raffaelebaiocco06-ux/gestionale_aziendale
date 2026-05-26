import api from "./axios";

export const getUtenti = () => api.get("/utenti");
export const getUtenteById = (id) => api.get(`/utenti/${id}`);
export const createUtente = (data) => api.post("/utenti", data);
export const updateUtente = (id, data) => api.put(`/utenti/${id}`, data);
export const deleteUtente = (id) => api.delete(`/utenti/${id}`);
