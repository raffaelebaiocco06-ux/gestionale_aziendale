import api from "./axios";

export const getMappe = () => api.get("/api/mappe-fiera");
export const getMappaById = (id) => api.get(`/api/mappe-fiera/${id}`);

export const uploadMappa = (formData) =>
  api.post("/api/mappe-fiera/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getElementiMappa = (mappaId) => api.get(`/api/mappe-fiera/${mappaId}/elementi`);
export const createElementoMappa = (mappaId, data) => api.post(`/api/mappe-fiera/${mappaId}/elementi`, data);
export const updateElementoMappa = (elementoId, data) => api.put(`/api/elementi-mappa/${elementoId}`, data);
export const deleteElementoMappa = (elementoId) => api.delete(`/api/elementi-mappa/${elementoId}`);
export const generaGrigliaMappa = (mappaId, data) => api.post(`/api/mappe-fiera/${mappaId}/genera-griglia`, data);
