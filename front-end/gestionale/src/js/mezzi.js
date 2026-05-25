import api from "./axios";

export const getMezzi = () => api.get("/mezzi");
export const getMezzoById = (id) => api.get(`/mezzi/${id}`);
export const createMezzo = (data) => api.post("/mezzi", data);
export const updateMezzo = (id, data) => api.put(`/mezzi/${id}`, data);
export const deleteMezzo = (id) => api.delete(`/mezzi/${id}`);
