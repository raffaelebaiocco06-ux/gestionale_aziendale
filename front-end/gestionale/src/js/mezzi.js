import api from "./axios";

const getMezzi = () => api.get("/mezzi");
const getMezzoById = (id) => api.get(`/mezzi/${id}`);
const createMezzo = (data) => api.post("/mezzi", data);
const updateMezzo = (id, data) => api.put(`/mezzi/${id}`, data);
const deleteMezzo = (id) => api.delete(`/mezzi/${id}`);

export { getMezzi, getMezzoById, createMezzo, updateMezzo, deleteMezzo };
