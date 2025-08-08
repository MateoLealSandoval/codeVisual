<script lang="ts">
import { ref, reactive } from 'vue';
import type { authdto } from '@/dto/auth/auth.tdo';
import type { registerPartnerDto } from '@/dto/auth/registerPartner.dto';
import { useAuthStore } from '@/store/auth.store';
import Swal from 'sweetalert2';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { http_status } from '@/models/http_status';

// ✅ IMPORTAR COMPONENTES
import Navbar from '@/Modules/Home/Navbar.vue';
import Footer_Color from '@/common/Footer_Color.vue';

export default {
    name: 'AuthPartner',
    components: {
        Navbar,
        Footer_Color
    },
    setup() {
        const store = useAuthStore();
        
        const panels = reactive({
            login: false,
            register: false
        });

        const loginInput = reactive({
            gmail: '',
            password: ''
        });

        const register = reactive({
            gmail: '',
            password: '',
            confirmpassword: '',
            names: '',
            lastnames: '',
            document: '',
            phone: '',
            title: '',
            frontImage: '',
            backImage: '',
            acept: false,
            terms: false
        });

        const passwordValid = reactive({
            minLength: false,
            hasLowerCase: false,
            hasUpperCase: false,
            hasSpecialChar: false,
            allValid: false
        });

        const showPassword = ref(false);

        return {
            store,
            panels,
            loginInput,
            register,
            passwordValid,
            showPassword
        };
    },
    methods: {
        // ✅ MÉTODO DE LOGIN CORREGIDO
        async loginComponent() {
            const blueColor = getComputedStyle(document.documentElement).getPropertyValue('--blue-1').trim();
            
            if (this.loginInput.gmail.trim() === '' || this.loginInput.password.trim() === '') {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Faltan datos',
                    confirmButtonColor: blueColor,
                    text: 'Por favor, completa todos los campos',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const logindata: authdto = {
                email: this.loginInput.gmail,
                password: this.loginInput.password
            };

            try {
                // ✅ Login directo sin validación de planes
                await this.store.userAuth(logindata);
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Autenticación Completada',
                    confirmButtonColor: blueColor,
                    confirmButtonText: 'OK'
                });

                // ✅ La redirección la manejará el watcher automáticamente
                
            } catch (error: any) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                    confirmButtonColor: blueColor,
                    confirmButtonText: 'OK'
                });
            }
        },

        async registerComponent() {
            if (this.isFormValid) {
                const newRegister: registerPartnerDto = {
                    email: this.register.gmail,
                    names: this.register.names,
                    lastnames: this.register.lastnames,
                    password: this.register.password,
                    document: this.register.document,
                    phone: this.register.phone,
                    title: this.register.title
                };
                
                try {
                    await this.store.registerParthner(newRegister);
                    toast.success("Gracias por ser parte de DocVisual, tu perfil entra en aprobación y validación, en 24 a 48 horas máximo, tendrás acceso a tu cuenta", {
                        position: 'top-center',
                        autoClose: 2000
                    });
                } catch (error: any) {
                    toast.error(error.message, {
                        position: 'top-center',
                        autoClose: 2000,
                    });
                }
            } else {
                throw new Error("Faltan datos o no son válidos");
            }
        },

        async resetPassword() {
            const blueColor = getComputedStyle(document.documentElement).getPropertyValue('--blue-1').trim();
            
            if (this.loginInput.gmail.trim() === '') {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Email requerido',
                    text: 'Por favor, ingresa tu email para recuperar la contraseña',
                    confirmButtonColor: blueColor
                });
                return;
            }
            
            try {
                const response = await axios.post('/auth-reset/reset', {
                    email: this.loginInput.gmail
                });

                await Swal.fire({
                    icon: 'success',
                    title: 'Correo enviado',
                    text: 'Se ha enviado un enlace de recuperación a tu correo electrónico.',
                    confirmButtonColor: blueColor
                });
                
            } catch (error: any) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar',
                    text: error.response?.data?.message || 'Hubo un problema al enviar el correo.',
                    confirmButtonColor: blueColor
                });
            }
        },

        base64ToFile(dataUrl: string, filename: string): File {
            const arr = dataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)![1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, { type: mime });
        },

        triggerFileInput(type: 'front' | 'back'): void {
            const element = document.getElementById(type === 'front' ? 'front-card' : 'back-card') as HTMLInputElement;
            if (element) {
                element.click();
            }
        },

        handleEnter(event: any) {
            if (event.key === "Enter") {
                this.loginComponent();
            }
        },

        gotoRute(rute: string) {
            this.$router.push(rute);
        },

        checkPassword() {
            const password = this.register.password;
            this.passwordValid.minLength = password.length >= 8;
            this.passwordValid.hasLowerCase = /[a-z]/.test(password);
            this.passwordValid.hasUpperCase = /[A-Z]/.test(password);
            this.passwordValid.hasSpecialChar = /[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

            this.passwordValid.allValid =
                this.passwordValid.minLength &&
                this.passwordValid.hasLowerCase &&
                this.passwordValid.hasUpperCase &&
                this.passwordValid.hasSpecialChar;
        },

        togglePanel(panelName: 'register' | 'login') {
            Object.keys(this.panels).forEach(key => {
                this.panels[key as keyof typeof this.panels] = key === panelName;
            });
        },

        closepanels() {
            this.panels.login = false;
            this.panels.register = false;
        },

        isValidPhone(phone: string) {
            return /^\d{10}$/.test(phone);
        },

        isValidDocument(document: string) {
            return /^\d{6,10}$/.test(document);
        },

        goToTerms() {
            window.open('/terms', '_blank');
        },

        goToData() {
            window.open('/data', '_blank');
        },

        handleFileUpload(event: Event, type: 'front' | 'back'): void {
            const input = event.target as HTMLInputElement;
            if (!input.files || input.files.length === 0) return;

            const file = input.files[0];
            
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                toast.error('Solo se permiten archivos de imagen', {
                    position: 'top-center',
                    autoClose: 2000,
                });
                return;
            }

            // Validar tamaño (5MB máximo)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('El archivo no puede ser mayor a 5MB', {
                    position: 'top-center',
                    autoClose: 2000,
                });
                return;
            }

            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    if (type === 'front') {
                        this.register.frontImage = e.target.result as string;
                    } else {
                        this.register.backImage = e.target.result as string;
                    }
                }
            };

            reader.readAsDataURL(file);
        }
    },
    
    computed: {
        token() {
            return this.store.token;
        },
        user() {
            return this.store.user;
        },
        state() {
            return this.store.state;
        },
        isFormValid() {
            return (
                this.register.acept &&
                this.register.terms &&
                this.passwordValid.allValid &&
                this.register.gmail.trim() !== '' &&
                this.register.lastnames.trim() !== '' &&
                this.register.names.trim() !== '' &&
                this.register.confirmpassword === this.register.password &&
                this.register.frontImage.trim() !== '' &&
                this.register.backImage.trim() !== '' &&
                this.isValidDocument(this.register.document) &&
                this.isValidPhone(this.register.phone) &&
                this.register.title.trim() !== ''
            );
        }
    },
    
    // ✅ WATCHER CORREGIDO - REDIRECCIÓN SIN VALIDAR PLANES
    watch: {
        user(newUser: any) {
            if (newUser && newUser.role) {
                switch (newUser.role) {
                    case 'USER':
                        this.$router.push('/accountuser');
                        break;
                    case 'USER_PARTNER':
                        this.$router.push('/paneluser');
                        break;
                    case 'ADMIN':
                        this.$router.push('/paneladmin');
                        break;
                    case 'SUPER_ADMIN':
                        this.$router.push('/paneladmin');
                        break;
                }
            }
        },
        
        state(newState: http_status) {
            if (newState === http_status.LOADING) {
                Swal.fire({
                    title: "Processing...",
                    html: "Please wait...",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
            } else {
                Swal.close();
            }
        }
    },

    beforeUnmount() {
        document.removeEventListener("keyup", this.handleEnter);
    },

    mounted() {
        document.addEventListener("keyup", this.handleEnter);
    },

    created() {
        // Verificar si ya hay un token al cargar el componente
        if (this.token && this.token !== '') {
            this.$router.push('/paneluser');
        }
    }
};
</script>

<template>
    <Navbar />
    <div class="w-screen flex flex-col justify-between bg-gray-100 font-poppins">
        <!-- Contenido de autenticación aquí -->
        <div class="w-full lg:flex-grow lg:flex bg-gray-100 text-sm">
            <div class="hidden lg:block lg:w-[45%] h-screen sticky top-0">
                <img src="@/assets/images/letters.webp" alt="Image" class="w-full h-full object-cover" />
            </div>

            <div class="w-full lg:w-1/2 flex justify-center">
                <div class="w-[90%] sm:w-[60%] flex flex-col h-fit mx-3 m-auto">
                    <img src="@/assets/images/LogoPng.webp" alt="image"
                        class="h-16 w-auto pt-5 m-auto mb-7 cursor-pointer" @click="gotoRute('/')" />
                    
                    <h1 class="text-center font-poppins font-bold pt-6 text-base" style="color: var(--blue-1);"
                        v-if="panels.login === false && panels.register === false">
                        Hacemos visibles a los expertos
                    </h1>
                    <h2 class="font-poppins font-semibold m-auto text-center pt-8"
                        v-if="panels.login === false && panels.register === false">
                        Crea tu cuenta y haz parte de la comunidad de especialistas en salud visual
                    </h2>
                    
                    <div class="w-full flex flex-col items-center px-4 mt-7"
                        v-if="panels.login === false && panels.register === false">
                        <button
                            class="w-full mb-3 mt-5 rounded-xl font-poppins cursor-pointer py-4 font-medium tracking-wide text-white transition-colors duration-300 transform hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                            style="background-color: var(--blue-1);" @click="togglePanel('register')">
                            Crear una cuenta
                        </button>
                        <button
                            class="w-full mb-5 mt-2 rounded-xl font-poppins cursor-pointer py-4 font-medium tracking-wide text-white transition-colors duration-300 transform focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                            style="border: 2px solid var(--blue-1); color: var(--blue-1);"
                            @click="togglePanel('login')">
                            Iniciar sesión
                        </button>
                    </div>

                    <!-- PANEL DE LOGIN -->
                    <div class="w-full flex flex-col items-center px-4" v-if="panels.login">
                        <h1 class="text-3xl font-semibold mb-3">Iniciar sesión</h1>
                        <h1 class="mb-5">¿No tienes cuenta? 
                            <span class="text-[var(--blue-1)] cursor-pointer" @click="togglePanel('register')">
                                Registrarme
                            </span>
                        </h1>

                        <input type="email" placeholder="Correo" v-model="loginInput.gmail"
                            class="w-full px-4 py-5 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />

                        <div class="relative w-full mb-4">
                            <input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña"
                                v-model="loginInput.password" @keyup.enter="handleEnter"
                                class="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                            <button type="button"
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                @click="showPassword = !showPassword">
                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                                </svg>
                            </button>
                        </div>

                        <button 
                            class="w-full py-4 mb-4 rounded-xl font-medium text-white transition-colors duration-300 hover:bg-blue-500"
                            style="background-color: var(--blue-1);"
                            @click="loginComponent">
                            Iniciar sesión
                        </button>

                        <p class="text-center mb-4">
                            <span class="text-[var(--blue-1)] cursor-pointer" @click="resetPassword">
                                ¿Olvidaste tu contraseña?
                            </span>
                        </p>

                        <div class="text-center">
                            <button 
                                class="text-gray-600 hover:text-[var(--blue-1)]"
                                @click="closepanels">
                                ← Volver
                            </button>
                        </div>
                    </div>

                    <!-- PANEL DE REGISTRO -->
                    <div class="w-full flex flex-col items-center px-4" v-if="panels.register">
                        <h1 class="text-3xl font-semibold mb-2">Registrarme</h1>
                        <h1 class="mb-6">¿Ya tienes cuenta? 
                            <span class="text-[var(--blue-1)] cursor-pointer" @click="togglePanel('login')">
                                Iniciar sesión
                            </span>
                        </h1>

                        <!-- Campos de registro -->
                        <div class="w-full flex gap-2">
                            <div class="w-1/2 mb-3">
                                <input type="text" placeholder="Nombre" v-model="register.names"
                                    class="w-full px-4 py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                            </div>
                            <div class="w-1/2 mb-3">
                                <input type="text" placeholder="Apellido" v-model="register.lastnames"
                                    class="w-full px-4 py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                            </div>
                        </div>

                        <div class="w-full mb-3">
                            <input type="email" placeholder="Correo" v-model="register.gmail"
                                class="w-full px-4 py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                        </div>

                        <div class="w-full mb-3">
                            <input type="text" placeholder="Cédula" v-model="register.document"
                                class="w-full px-4 py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                        </div>

                        <div class="w-full mb-3">
                            <input type="text" placeholder="Celular" v-model="register.phone"
                                class="w-full px-4 py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                        </div>

                        <div class="w-full mb-3">
                            <input type="text" placeholder="Tarjeta profesional" v-model="register.title"
                                class="w-full px-4 py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                        </div>

                        <!-- Contraseñas -->
                        <div class="relative w-full mb-3">
                            <input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña"
                                v-model="register.password" @input="checkPassword"
                                class="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                            <button type="button"
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                @click="showPassword = !showPassword">
                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                                </svg>
                            </button>
                        </div>

                        <div class="relative w-full mb-3">
                            <input :type="showPassword ? 'text' : 'password'" placeholder="Confirmar contraseña"
                                v-model="register.confirmpassword"
                                class="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                        </div>

                        <!-- Validación de contraseña -->
                        <div v-if="register.password" class="mb-4 text-sm w-full">
                            <p :class="passwordValid.minLength ? 'text-green-600' : 'text-red-600'">
                                ✓ Mínimo 8 caracteres
                            </p>
                            <p :class="passwordValid.hasLowerCase ? 'text-green-600' : 'text-red-600'">
                                ✓ Al menos una minúscula
                            </p>
                            <p :class="passwordValid.hasUpperCase ? 'text-green-600' : 'text-red-600'">
                                ✓ Al menos una mayúscula
                            </p>
                            <p :class="passwordValid.hasSpecialChar ? 'text-green-600' : 'text-red-600'">
                                ✓ Al menos un carácter especial
                            </p>
                        </div>

                        <!-- Carga de archivos -->
                        <div class="w-full mb-4">
                            <h3 class="text-sm font-medium mb-2">Tarjeta profesional (ambos lados):</h3>
                            
                            <!-- Input oculto para archivo frontal -->
                            <input type="file" id="front-card" accept="image/*" style="display: none;"
                                @change="handleFileUpload($event, 'front')" />
                            
                            <!-- Input oculto para archivo posterior -->
                            <input type="file" id="back-card" accept="image/*" style="display: none;"
                                @change="handleFileUpload($event, 'back')" />

                            <div class="flex gap-2">
                                <!-- Botón para cargar imagen frontal -->
                                <div class="w-1/2">
                                    <button type="button" @click="triggerFileInput('front')"
                                        class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-[var(--blue-1)] transition-colors">
                                        <div v-if="register.frontImage" class="text-green-600">
                                            ✓ Frontal cargada
                                        </div>
                                        <div v-else class="text-gray-500">
                                            Cargar frontal
                                        </div>
                                    </button>
                                </div>

                                <!-- Botón para cargar imagen posterior -->
                                <div class="w-1/2">
                                    <button type="button" @click="triggerFileInput('back')"
                                        class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-[var(--blue-1)] transition-colors">
                                        <div v-if="register.backImage" class="text-green-600">
                                            ✓ Posterior cargada
                                        </div>
                                        <div v-else class="text-gray-500">
                                            Cargar posterior
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Checkboxes -->
                        <div class="w-full mb-4">
                            <label class="flex items-center mb-2">
                                <input type="checkbox" v-model="register.terms" class="mr-2">
                                <span class="text-sm">
                                    Acepto los 
                                    <span class="text-[var(--blue-1)] cursor-pointer" @click="goToTerms">
                                        términos y condiciones
                                    </span>
                                </span>
                            </label>
                            
                            <label class="flex items-center">
                                <input type="checkbox" v-model="register.acept" class="mr-2">
                                <span class="text-sm">
                                    Acepto las 
                                    <span class="text-[var(--blue-1)] cursor-pointer" @click="goToData">
                                        políticas de privacidad
                                    </span>
                                </span>
                            </label>
                        </div>

                        <button 
                            class="w-full py-4 mb-4 rounded-xl font-medium text-white transition-colors duration-300"
                            :class="isFormValid ? 'bg-[var(--blue-1)] hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'"
                            :disabled="!isFormValid"
                            @click="registerComponent">
                            Crear cuenta
                        </button>

                        <div class="text-center">
                            <button 
                                class="text-gray-600 hover:text-[var(--blue-1)]"
                                @click="closepanels">
                                ← Volver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <Footer_Color />
    </div>
</template>

<style scoped>
/* Estilos personalizados si son necesarios */
.font-poppins {
    font-family: 'Poppins', sans-serif;
}
</style>