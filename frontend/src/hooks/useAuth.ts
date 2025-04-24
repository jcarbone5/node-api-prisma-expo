import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../components/Toast";
import { LoginInput, RegisterInput, UpdatePasswordInput, UpdateProfileInput } from "../schemas/auth";
import { AuthResponse, User, ApiError } from "../types";
import { AxiosError } from "axios";

export const useLogin = () => {
  const { setUser, setTokens } = useAuthStore();
  const setToast = useToastStore((state) => state.setToast);

  return useMutation<AuthResponse, AxiosError<ApiError>, LoginInput>({
    mutationFn: async (credentials) => {
      const { data } = await axiosInstance.post<AuthResponse>("/auth/login", credentials);
      return data;
    },
    onSuccess: async (data) => {
      await setTokens(data.tokens);
      setUser(data.user);
      setToast("Sesión iniciada correctamente", "success");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Error al iniciar sesión";
      setToast(message, "error");
    },
  });
};

export const useRegister = () => {
  const { setUser, setTokens } = useAuthStore();
  const setToast = useToastStore((state) => state.setToast);

  return useMutation<AuthResponse, AxiosError<ApiError>, RegisterInput>({
    mutationFn: async (userData) => {
      const { data } = await axiosInstance.post<AuthResponse>("/auth/register", userData);
      return data;
    },
    onSuccess: async (data) => {
      await setTokens(data.tokens);
      setUser(data.user);
      setToast("Registro exitoso", "success");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Error al registrarse";
      setToast(message, "error");
    },
  });
};

export const useProfile = () => {
  return useQuery<User, AxiosError<ApiError>>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<User>("/users/profile");
      return data;
    },
  });
};

export const useUpdatePassword = () => {
  const setToast = useToastStore((state) => state.setToast);

  return useMutation<{ message: string; user: User }, AxiosError<ApiError>, UpdatePasswordInput>({
    mutationFn: async (passwords) => {
      const { data } = await axiosInstance.patch("/users/password", passwords);
      return data;
    },
    onSuccess: (data) => {
      setToast(data.message, "success");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Error al actualizar la contraseña";
      setToast(message, "error");
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const setToast = useToastStore((state) => state.setToast);

  return useMutation<void, AxiosError<ApiError>>({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      setToast("Sesión cerrada correctamente", "success");
    },
    onError: () => {
      setToast("Error al cerrar sesión", "error");
    },
  });
};

export const useUpdateProfile = () => {
  const setToast = useToastStore((state) => state.setToast);
  const { setUser } = useAuthStore();

  return useMutation<User, AxiosError<ApiError>, UpdateProfileInput>({
    mutationFn: (data: UpdateProfileInput) =>
      axiosInstance.patch<User>("/users/profile", data).then((res) => res.data),
    onSuccess: (data) => {
      setUser(data);
      setToast("Perfil actualizado correctamente", "success");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Error al actualizar el perfil";
      setToast(message, "error");
    },
  });
}; 