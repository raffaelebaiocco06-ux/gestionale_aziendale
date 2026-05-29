import api from "./axios";

export const getFornitori = () => api.get("/fornitori?size=100");
export const createFornitore = (data) => api.post("/fornitori", data);
export const updateFornitore = (id, data) => api.put(`/fornitori/${id}`, data);
export const deleteFornitore = (id) => api.delete(`/fornitori/${id}`);
