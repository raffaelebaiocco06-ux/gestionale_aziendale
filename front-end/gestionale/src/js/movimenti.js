import api from "./axios";

export const getMovimenti = () => api.get("/movimenti?size=100");
export const createMovimento = (data) => api.post("/movimenti", data);
export const updateMovimento = (id, data) => api.put(`/movimenti/${id}`, data);
export const deleteMovimento = (id) => api.delete(`/movimenti/${id}`);
