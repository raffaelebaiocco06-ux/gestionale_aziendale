import api from "./axios";

export const getEntrate = () => api.get("/entrate");
export const getEntrataById = (id) => api.get(`/entrate/${id}`);
export const createEntrata = (data) => api.post("/entrate", data);
export const updateEntrata = (id, data) => api.put(`/entrate/${id}`, data);
export const deleteEntrata = (id) => api.delete(`/entrate/${id}`);
