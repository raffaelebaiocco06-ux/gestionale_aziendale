import api from "./axios";

export const getScadenze = () => api.get("/scadenze");
export const getScadenzaById = (id) => api.get(`/scadenze/${id}`);
export const createScadenza = (data) => api.post("/scadenze", data);
export const updateScadenza = (id, data) => api.put(`/scadenze/${id}`, data);
export const deleteScadenza = (id) => api.delete(`/scadenze/${id}`);
