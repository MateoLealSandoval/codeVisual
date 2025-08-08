import type { registerPartnerDto } from '@/dto/auth'
import type { authdto } from '@/dto/auth/auth.tdo'
import type { registerDto } from '@/dto/auth/register.dto'
import type { templateUser } from '@/dto/auth/templates/user.template'
import axios from 'axios'
import { defineStore } from 'pinia'
import router from '@/router'
import { http_status } from '@/models/http_status'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        user: null as templateUser | null,
        state: http_status.INIT as http_status
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isUser: (state) => state.user?.role === 'USER',
        isPartner: (state) => state.user?.role === 'USER_PARTNER',
        isAdmin: (state) => state.user?.role === 'ADMIN' || state.user?.role === 'SUPER_ADMIN'
    },

    actions: {
        /**
         * ✅ Inicializar store desde localStorage
         */
        initializeFromStorage() {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            
            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    this.token = token;
                    this.user = user;
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } catch (error) {
                    console.error('Error parsing user from localStorage:', error);
                    this.clearAuth();
                }
            }
        },

        /**
         * ✅ Registro de usuario normal
         */
        async registerUser(registerDto: registerDto) {
            try {
                this.state = http_status.LOADING;
                
                const response = await axios.post('/auth/register', {
                    email: registerDto.email,
                    password: registerDto.password,
                    names: registerDto.names,
                    lastnames: registerDto.lastnames,
                });

                if (response.status === 201) {
                    this.state = http_status.FINISH;
                    return response.data;
                } else {
                    this.state = http_status.FINISH;
                    throw new Error("Respuesta inesperada del servidor.");
                }
            } catch (error: any) {
                this.state = http_status.FINISH;
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en el registro.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },

        /**
         * ✅ Confirmar registro con token
         */
        async registerUserToken(token: string) {
            try {
                this.state = http_status.LOADING;
                
                const response = await axios.get(`/auth/register/usertoken/${token}`);
                
                if (response.data.status === 200) {
                    this.setToken(response.data.data.token, response.data.data.user);
                    this.state = http_status.FINISH;
                    return response.data;
                } else {
                    this.state = http_status.FINISH;
                    throw new Error("Respuesta inesperada del servidor.");
                }
            } catch (error: any) {
                this.state = http_status.FINISH;
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en el registro.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },

        /**
         * ✅ Registro de partner/profesional
         */
        async registerParthner(registerPartnerDto: registerPartnerDto) {
            try {
                this.state = http_status.LOADING;
                
                const response = await axios.post('/auth/registerpartner', registerPartnerDto);
                
                if (response.status === 201) {
                    this.state = http_status.FINISH;
                    return response.data;
                } else {
                    this.state = http_status.FINISH;
                    throw new Error("Respuesta inesperada del servidor.");
                }
            } catch (error: any) {
                this.state = http_status.FINISH;
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en el registro.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },

        /**
         * ✅ LOGIN MEJORADO - SIN VALIDACIÓN DE PLANES
         * Solo autentica al usuario, sin verificar suscripciones
         */
        async userAuth(authdto: authdto) {
            try {
                this.state = http_status.LOADING;
                
                const response = await axios.post('/auth/login', {
                    email: authdto.email,
                    password: authdto.password
                });

                if (response.status === 201) {
                    // ✅ Solo establecer autenticación, sin validar planes
                    this.setToken(response.data.token, response.data.user);
                    this.state = http_status.FINISH;
                    return response.data;
                } else {
                    this.state = http_status.FINISH;
                    throw new Error("Respuesta inesperada del servidor.");
                }
            } catch (error: any) {
                this.state = http_status.FINISH;
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en la autenticación.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },

        /**
         * ✅ Alias para mantener compatibilidad
         */
        async login(authdto: authdto) {
            return this.userAuth(authdto);
        },

        /**
         * ✅ Verificar token de usuario
         */
        async verifyUser() {
            try {
                this.state = http_status.LOADING;
                
                const response = await axios.get('/auth/verify');
                
                if (response.data.status === 200) {
                    this.user = response.data.data;
                    this.state = http_status.FINISH;
                    return response.data;
                } else {
                    this.state = http_status.FINISH;
                    throw new Error("Token inválido.");
                }
            } catch (error: any) {
                this.state = http_status.FINISH;
                this.clearAuth();
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error verificando usuario.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },

        /**
         * ✅ Cerrar sesión
         */
        async close_session() {
            try {
                // Limpiar datos locales
                this.clearAuth();
                
                // Opcional: notificar al servidor sobre el logout
                // await axios.post('/auth/logout');
                
                // Redirigir según el tipo de usuario
                const currentPath = router.currentRoute.value.path;
                if (currentPath.includes('paneluser') || currentPath.includes('auth-professional')) {
                    router.push('/auth-professional');
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('Error en logout:', error);
                // Forzar limpieza local incluso si hay error
                this.clearAuth();
                router.push('/');
            }
        },

        /**
         * ✅ Logout alias
         */
        async logout() {
            return this.close_session();
        },

        /**
         * ✅ Establecer token y usuario
         */
        setToken(token: string, user: templateUser) {
            this.token = token;
            this.user = user;
            
            // Guardar en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Configurar axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            this.state = http_status.FINISH;
        },

        /**
         * ✅ Limpiar autenticación
         */
        clearAuth() {
            this.token = '';
            this.user = null;
            this.state = http_status.INIT;
            
            // Limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Limpiar header de axios
            delete axios.defaults.headers.common['Authorization'];
        },

        /**
         * ✅ Actualizar datos del usuario
         */
        updateUser(userData: Partial<templateUser>) {
            if (this.user) {
                this.user = { ...this.user, ...userData };
                localStorage.setItem('user', JSON.stringify(this.user));
            }
        },

        /**
         * ✅ Verificar si el usuario tiene un rol específico
         */
        hasRole(role: string): boolean {
            return this.user?.role === role;
        },

        /**
         * ✅ Verificar si el usuario puede acceder a una ruta
         */
        canAccessRoute(routeName: string): boolean {
            if (!this.isAuthenticated) return false;
            
            const roleRoutes = {
                'USER': ['accountuser', 'payment', 'specialists'],
                'USER_PARTNER': ['paneluser', 'specialists'],
                'ADMIN': ['paneladmin', 'specialists'],
                'SUPER_ADMIN': ['paneladmin', 'specialists']
            };
            
            const userRole = this.user?.role;
            if (!userRole) return false;
            
            const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || [];
            return allowedRoutes.includes(routeName);
        },

        /**
         * ✅ Refrescar token si está próximo a expirar
         * NOTA: Esta función reemplaza la anterior 'refreshToken' que causaba errores
         */
        async refreshTokenIfNeeded() {
            try {
                // Esta función se puede implementar si tu backend soporta refresh tokens
                if (this.token && this.isAuthenticated) {
                    const response = await axios.post('/auth/refresh');
                    if (response.data.token) {
                        this.setToken(response.data.token, this.user!);
                    }
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
                // En caso de error, mantener el token actual
            }
        },

        /**
         * ✅ Método legacy para compatibilidad (ELIMINADO refreshToken)
         * Si algún componente llama refreshToken(), redirigir a refreshTokenIfNeeded()
         */
        async refreshToken() {
            console.warn('refreshToken() is deprecated, use refreshTokenIfNeeded() instead');
            return this.refreshTokenIfNeeded();
        }
    }
});

// ✅ Inicializar el store cuando se carga la aplicación
const authStore = useAuthStore();
authStore.initializeFromStorage();