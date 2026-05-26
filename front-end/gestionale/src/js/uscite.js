import api from "./axios";

export const getUscite = () => api.get("/uscite");
export const getUscitaById = (id) => api.get(`/uscite/${id}`);
export const createUscita = (data) => api.post("/uscite", data);
export const updateUscita = (id, data) => api.put(`/uscite/${id}`, data);
export const deleteUscita = (id) => api.delete(`/uscite/${id}`);
