import api from "./axios";

export const getClienti = () => api.get("/clienti?size=100");
export const createCliente = (data) => api.post("/clienti", data);
export const updateCliente = (id, data) => api.put(`/clienti/${id}`, data);
export const deleteCliente = (id) => api.delete(`/clienti/${id}`);
