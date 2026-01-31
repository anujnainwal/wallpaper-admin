import api from "./api";

interface UploadResponse {
  success: boolean;
  data: {
    url: string;
  };
  message: string;
}

export const uploadService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<UploadResponse>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
