import api from "./axios";

export const getProgetti = () => api.get("/progetti?size=100");
export const createProgetto = (data) => api.post("/progetti", data);
export const updateProgetto = (id, data) => api.put(`/progetti/${id}`, data);
export const deleteProgetto = (id) => api.delete(`/progetti/${id}`);
