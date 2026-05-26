import api from "./axios";

export const getMappe = () => api.get("/mappe");
export const getMappaById = (id) => api.get(`/mappe/${id}`);
export const createMappa = (data) => api.post("/mappe", data);
export const updateMappa = (id, data) => api.put(`/mappe/${id}`, data);
export const deleteMappa = (id) => api.delete(`/mappe/${id}`);
