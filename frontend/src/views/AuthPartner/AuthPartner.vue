<script lang="ts">
import Navbar from '@/Modules/Home/Navbar.vue';
import Colors from '@/common/Colors.vue';
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '@/store';
import { http_status } from '@/models/http_status';
import type { registerPartnerDto } from '@/dto/auth';
import { toast } from 'vue3-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';

export default defineComponent({
    name: 'AuthPartner',
    components: {
        Navbar,
        Colors
    },
    setup() {
        return {
            showPassword: ref(false),
            showConfirmPassword: ref(false),
            store: useAuthStore(),
            panels: ref({
                login: false,
                register: false
            }),
            register: ref({
                gmail: '',
                names: '',
                lastnames: '',
                password: '',
                confirmpassword: '',
                phone: '',
                document: '',
                title: '',
                acept: false,
                terms: false,
                frontImage: '',
                backImage: ''
            }),
            loginInput: ref({
                gmail: '',
                password: ''
            }),
            passwordValid: ref({
                minLength: false,
                hasLowerCase: false,
                hasUpperCase: false,
                hasSpecialChar: false,
                allValid: false,
            })
        }
    },
    computed: {
        token() {
            return this.store.token;
        },
        user() {
            return this.store.user;
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
    watch: {
        user(newUser: any) {
            if (newUser?.role === 'USER') {
                this.$router.push('/accountuser');
            }
            if (newUser?.role === 'USER_PARTNER') {
                this.$router.push('/paneluser');
            }
            if (newUser?.role === 'ADMIN') {
                this.$router.push('/paneladmin');
            }
            if (newUser?.role === 'SUPER_ADMIN') {
                this.$router.push('/paneladmin');
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
    methods: {
        // Métodos de validación
        isValidDocument(document: string): boolean {
            return document.length >= 7 && document.length <= 12 && /^\d+$/.test(document);
        },

        isValidPhone(phone: string): boolean {
            return phone.length >= 10 && /^\d+$/.test(phone);
        },

        // 🎯 MENSAJE PARA CREACIÓN DE CUENTA
        async showPaymentWarning(): Promise<boolean> {
            const result = await Swal.fire({
                title: '¡Atención!',
                html: `
                    <div style="text-align: center; font-family: 'Poppins', sans-serif;">
                        <p style="margin-bottom: 15px; font-size: 16px; color: #333;">Para poder crear el perfil, debes adquirir previamente un plan con DocVisual.</p>
                        <p style="margin-top: 15px; font-size: 14px; color: #666;">¿Deseas acceder a los planes disponibles?</p>
                    </div>
                `,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: 'var(--blue-1)',
                cancelButtonColor: '#6c757d',
                confirmButtonText: '<i class="fas fa-credit-card"></i> Ver planes',
                cancelButtonText: 'Continuar sin plan',
                reverseButtons: true,
                customClass: {
                    popup: 'payment-warning-popup',
                    confirmButton: 'payment-warning-confirm',
                    cancelButton: 'payment-warning-cancel'
                }
            });

            if (result.isConfirmed) {
                // Redirigir a la página de planes
                this.$router.push('/planes');
                return false; // No continuar con el registro
            }
            
            return true; // Continuar con el registro
        },

        // 🔒 MENSAJE PARA LOGIN SIN PAGO
        async showPaymentRequiredMessage(): Promise<void> {
            const result = await Swal.fire({
                title: 'Acceso Restringido',
                html: `
                    <div style="text-align: center; font-family: 'Poppins', sans-serif;">
                        <div style="margin-bottom: 20px;">
                            <i class="fas fa-lock" style="font-size: 48px; color: #ffc107;"></i>
                        </div>
                        <p style="margin-bottom: 15px; font-size: 16px; color: #333;">Tu cuenta no tiene un plan activo.</p>
                        <p style="margin-bottom: 20px; font-size: 14px; color: #666;">Para acceder a tu panel de especialista, necesitas adquirir uno de nuestros planes.</p>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <p style="margin: 0; font-size: 13px; color: #495057;">💡 Una vez que adquieras un plan, podrás acceder inmediatamente a todas las funcionalidades.</p>
                        </div>
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'var(--blue-1)',
                cancelButtonColor: '#6c757d',
                confirmButtonText: '<i class="fas fa-shopping-cart"></i> Adquirir Plan',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                customClass: {
                    popup: 'payment-required-popup',
                    confirmButton: 'payment-required-confirm',
                    cancelButton: 'payment-required-cancel'
                }
            });

            if (result.isConfirmed) {
                // Redirigir a la página de planes
                this.$router.push('/planes');
            }
        },

        async registerComponent() {
            try {
                // 🚨 VALIDACIÓN ANTES DE CREAR CUENTA
                const shouldProceed = await this.showPaymentWarning();
                if (!shouldProceed) {
                    return; // Detener el proceso si el usuario no quiere continuar
                }

                if (this.isFormValid) {
                    const newRegister: registerPartnerDto = {
                        email: this.register.gmail,
                        names: this.register.names,
                        lastnames: this.register.lastnames,
                        password: this.register.password,
                        document: this.register.document,
                        phone: this.register.phone,
                        title: this.register.title
                    }
                    
                    const result = await this.store.registerParthner(newRegister);
                    
                    if (result?.requiresPayment) {
                        // Mostrar mensaje especial para cuentas pendientes de pago
                        await Swal.fire({
                            title: '¡Cuenta creada exitosamente!',
                            html: `
                                <div style="text-align: center; font-family: 'Poppins', sans-serif;">
                                    <p style="margin-bottom: 15px;">Tu cuenta ha sido creada pero necesitas un plan para acceder.</p>
                                    <p style="font-size: 14px; color: #666;">Adquiere un plan para comenzar a usar DocVisual.</p>
                                </div>
                            `,
                            icon: 'success',
                            confirmButtonColor: 'var(--blue-1)',
                            confirmButtonText: 'Ver planes'
                        });
                        this.$router.push('/planes');
                    } else {
                        toast.success("Gracias por ser parte de Docvisual, tu perfil entra en aprobación y validación, en 24 a 48 horas máximo, tendrás acceso a tu cuenta", {
                            position: 'top-center',
                            autoClose: 3000
                        });
                    }
                } else {
                    throw new Error("Faltan datos o no son válidos");
                }
            } catch (error: any) {
                toast.error(error.message, {
                    position: 'top-center',
                    autoClose: 2000,
                });
            }
        },

        async resetPassword() {
            try {
                const { value: email } = await Swal.fire({
                    title: "Recuperar contraseña",
                    input: "email",
                    inputLabel: "Ingresa tu correo electrónico",
                    inputPlaceholder: "correo@ejemplo.com",
                    confirmButtonColor: 'var(--blue-1)',
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Enviar",
                    inputValidator: (value) => {
                        if (!value) {
                            return "Debes ingresar un correo electrónico";
                        }
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            return "Ingresa un correo electrónico válido";
                        }
                    }
                });

                if (email) {
                    const response = await axios.post('/emails/reset-password', { email });
                    if (response.data.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Correo enviado',
                            text: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña.',
                            confirmButtonColor: 'var(--blue-1)'
                        });
                    }
                }
            } catch (error) {
                const err = error as any;
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar',
                    text: err.response?.data?.message || 'Hubo un problema al enviar el correo.',
                    confirmButtonColor: 'var(--blue-1)'
                });
            }
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
        },

        submitForm(): void {
            try {
                const formData = new FormData();
                const frontFile = this.base64ToFile(this.register.frontImage, 'front.png');
                const backFile = this.base64ToFile(this.register.backImage, 'back.png');
                
                // Files 
                formData.append('side_front', frontFile);
                formData.append('side_back', backFile);

                // Agregar datos del body
                formData.append('document', this.register.document);
                formData.append('email', this.register.gmail);
                formData.append('lastnames', this.register.lastnames);
                formData.append('names', this.register.names);
                formData.append('password', this.register.password);
                formData.append('phone', this.register.phone);
                formData.append('title', this.register.title);
                
                const response = axios.post('/files-privates/create-user-pending', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                
                Swal.fire({
                    icon: 'success',
                    title: 'Inscripción enviada',
                    text: 'Un administrador revisará tus datos. Cuando tu perfil sea aprobado, recibirás una confirmación por correo electrónico.',
                });
                console.log(response);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error inesperado',
                    text: 'Ocurrió un error inesperado al procesar el formulario.',
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

        isValidDocument(document: string): boolean {
            return document.length >= 7 && document.length <= 12 && /^\d+$/.test(document);
        },

        isValidPhone(phone: string): boolean {
            return phone.length >= 10 && /^\d+$/.test(phone);
        },

        async loginComponent() {
            try {
                const newLogin = {
                    email: this.loginInput.gmail,
                    password: this.loginInput.password
                }
                await this.store.login(newLogin);
            } catch (error: any) {
                // 🚨 VALIDACIÓN DESPUÉS DEL ERROR DE LOGIN
                if (error.message && (
                    error.message.includes('plan activo') || 
                    error.message.includes('adquirir') || 
                    error.message.includes('pago') ||
                    error.message.includes('suscripción') ||
                    error.message.includes('PAYMENT_REQUIRED')
                )) {
                    await this.showPaymentRequiredMessage();
                    return;
                }
                
                toast.error(error.message, {
                    position: 'top-center',
                    autoClose: 2000,
                });
            }
        },

        async resetPassword() {
            try {
                const { value: email } = await Swal.fire({
                    title: "Recuperar contraseña",
                    input: "email",
                    inputLabel: "Ingresa tu correo electrónico",
                    inputPlaceholder: "correo@ejemplo.com",
                    confirmButtonColor: 'var(--blue-1)',
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Enviar",
                    inputValidator: (value) => {
                        if (!value) {
                            return "Debes ingresar un correo electrónico";
                        }
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            return "Ingresa un correo electrónico válido";
                        }
                    }
                });

                if (email) {
                    const response = await axios.post('/emails/reset-password', { email });
                    if (response.data.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Correo enviado',
                            text: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña.',
                            confirmButtonColor: 'var(--blue-1)'
                        });
                    }
                }
            } catch (error) {
                const err = error as any;
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar',
                    text: err.response?.data?.message || 'Hubo un problema al enviar el correo.',
                    confirmButtonColor: 'var(--blue-1)'
                });
            }
        },

        goToTerms() {
            window.open('/terms', '_blank');
        },
        
        goToData() {
            window.open('/data', '_blank');
        },

        handleEnter(event: any) {
            if (event.key === "Enter" && this.panels.login) {
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
        }
    },

    beforeUnmount() {
        document.removeEventListener("keyup", this.handleEnter);
    },

    mounted() {
        document.addEventListener("keyup", this.handleEnter);
    },

    created() {
        if (this.token && this.token !== '') {
            this.$router.push('/paneluser');
        }
    }
});
</script>

<template>
    <Navbar />
    <div class="w-screen flex flex-col justify-between bg-gray-100 font-poppins">
        <div class="w-full lg:flex-grow lg:flex bg-gray-100 text-sm">
            <div class="hidden lg:block lg:w-[45%] h-screen sticky top-0">
                <img src="@/assets/images/letters.webp" alt="Image" class="w-full h-full object-cover" />
            </div>

            <div class="w-full lg:w-1/2 flex justify-center">
                <div class="w-[90%] sm:w-[60%] flex flex-col h-fit mx-3 m-auto">
                    <img src="@/assets/images/LogoPng.webp" alt="image"
                        class="h-16 w-auto pt-5 m-auto mb-7 cursor-pointer" @click="gotoRute('/')" />
                    
                    <!-- Pantalla inicial -->
                    <div v-if="!panels.login && !panels.register">
                        <h1 class="text-center font-poppins font-bold pt-6 text-base" style="color: var(--blue-1);">
                            Hacemos visibles a los expertos
                        </h1>
                        <h2 class="font-poppins font-semibold m-auto text-center pt-8">
                            Crea tu cuenta y haz parte de la comunidad de especialistas en salud visual
                        </h2>
                        <div class="w-full flex flex-col items-center px-4 mt-7">
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
                    </div>

                    <!-- Panel de Login -->
                    <div class="w-full flex flex-col items-center px-4" v-if="panels.login">
                        <h1 class="text-3xl font-semibold mb-3">Iniciar sesión</h1>
                        <h1 class="mb-5">¿No tienes cuenta? 
                            <span class="text-[var(--blue-1)] cursor-pointer" @click="togglePanel('register')">
                                Registrarme
                            </span>
                        </h1>

                        <input type="text" placeholder="Correo" v-model="loginInput.gmail"
                            class="w-full px-4 py-5 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />

                        <div class="relative w-full">
                            <input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña"
                                v-model="loginInput.password"
                                class="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                            <button type="button"
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                @click="showPassword = !showPassword">
                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" height="24px"
                                    viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" fill="#5f6368">
                                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                </svg>
                            </button>
                        </div>

                        <h1 class="ml-auto py-5 cursor-pointer hover:text-[var(--blue-1)]" @click="resetPassword">
                            ¿Olvidaste tu contraseña?
                        </h1>

                        <button
                            class="transition duration-500 w-full py-4 bg-gray-200 text-gray-500 font-semibold rounded-xl mt-4 cursor-pointer text-base hover:bg-[var(--blue-1)] hover:text-white"
                            @click="loginComponent">
                            Ingresar
                        </button>

                        <button
                            class="bg-gray-200 text-gray-500 transition duration-700 w-full py-4 font-bold rounded-xl my-4 text-base cursor-pointer hover:bg-[var(--blue-1)] hover:text-white"
                            @click="gotoRute('/')">
                            Cancelar volver
                        </button>
                    </div>

                    <!-- Panel de Registro -->
                    <div class="w-full flex flex-col items-center px-4" v-if="panels.register">
                        <!-- Aquí va todo el formulario de registro existente -->
                        <h1 class="text-3xl font-semibold mb-3">Crear cuenta</h1>
                        <h1 class="mb-5">¿Ya tienes cuenta? 
                            <span class="text-[var(--blue-1)] cursor-pointer" @click="togglePanel('login')">
                                Iniciar sesión
                            </span>
                        </h1>

                        <!-- Campos del formulario de registro aquí -->
                        <input type="text" placeholder="Nombres" v-model="register.names"
                            class="w-full px-4 py-5 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />

                        <input type="text" placeholder="Apellidos" v-model="register.lastnames"
                            class="w-full px-4 py-5 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />

                        <input type="email" placeholder="Correo electrónico" v-model="register.gmail"
                            class="w-full px-4 py-5 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />

                        <input type="text" placeholder="Documento" v-model="register.document"
                            class="w-full px-4 py-5 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />

                        <input type="text" placeholder="Teléfono" v-model="register.phone"
                            class="w-full px-4 py-5 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />

                        <input type="text" placeholder="Tarjeta profesional" v-model="register.title"
                            class="w-full px-4 py-5 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />

                        <!-- Upload de imágenes -->
                        <div class="w-full flex flex-col md:flex-row gap-4 mb-4">
                            <div class="w-full md:w-1/2 flex flex-col items-center border border-gray-300 rounded-lg p-4">
                                <label for="front-card" class="text-gray-600 mb-2">Foto Tarjeta Profesional (Frontal) tamaño 1080x700, en formato webp o jpg</label>
                                <input type="file" id="front-card" class="hidden" @change="handleFileUpload($event, 'front')">
                                <div class="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-[var(--blue-1)]"
                                    @click="triggerFileInput('front')">
                                    <img v-if="register.frontImage" :src="register.frontImage" class="w-full h-full object-cover rounded-lg" />
                                    <span v-else class="text-gray-500">Cargar Imagen</span>
                                </div>
                            </div>

                            <div class="w-full md:w-1/2 flex flex-col items-center border border-gray-300 rounded-lg p-4">
                                <label for="back-card" class="text-gray-600 mb-2">Foto Tarjeta Profesional (Reverso) tamaño 1080x700, en formato webp o jpg</label>
                                <input type="file" id="back-card" class="hidden" @change="handleFileUpload($event, 'back')">
                                <div class="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-[var(--blue-1)]"
                                    @click="triggerFileInput('back')">
                                    <img v-if="register.backImage" :src="register.backImage" class="w-full h-full object-cover rounded-lg" />
                                    <span v-else class="text-gray-500">Cargar Imagen</span>
                                </div>
                            </div>
                        </div>

                        <!-- Password fields with validations -->
                        <div class="relative w-full mb-3">
                            <input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña"
                                v-model="register.password" @input="checkPassword"
                                class="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                            <button type="button"
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                @click="showPassword = !showPassword">
                                <!-- SVG icons -->

                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" height="24px"
                                    viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" fill="#5f6368">
                                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                </svg>
                            </button>
                        </div>

                        <div class="relative w-full mb-3">
                            <input :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirmar contraseña"
                                v-model="register.confirmpassword"
                                class="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                        </div>

                        <!-- Password validation -->
                        <div class="w-full mb-4">
                            <h3 class="font-bold text-black mb-2">Elige una que no hayas usado y recuerda incluir</h3>
                            <ul class="text-sm space-y-1">
                                <li :class="passwordValid.minLength ? 'text-blue-600' : 'text-blue-400'">
                                    • Mínimo 8 caracteres
                                </li>
                                <li :class="passwordValid.hasLowerCase ? 'text-blue-600' : 'text-blue-400'">
                                    • Al menos una letra minúscula
                                </li>
                                <li :class="passwordValid.hasUpperCase ? 'text-blue-600' : 'text-blue-400'">
                                    • Al menos una letra mayúscula
                                </li>
                                <li :class="passwordValid.hasSpecialChar ? 'text-blue-600' : 'text-blue-400'">
                                    • Al menos un carácter especial (ejemplo: ! @ # $ % & * )
                                </li>
                            </ul>
                        </div>

                        <!-- Checkboxes -->
                        <div class="flex items-start mb-4">
                            <input type="checkbox" v-model="register.acept" id="accept-data" class="mr-2 mt-1">
                            <label for="accept-data" class="text-sm">
                                Acepto <a href="#" @click.prevent="goToData" class="text-blue-600 underline">Política de Habeas DATA</a>
                            </label>
                        </div>

                        <div class="flex items-start mb-6">
                            <input type="checkbox" v-model="register.terms" id="accept-terms" class="mr-2 mt-1">
                            <label for="accept-terms" class="text-sm">
                                Acepto <a href="#" @click.prevent="goToTerms" class="text-blue-600 underline">Términos y condiciones</a>
                            </label>
                        </div>

                        <button
                            :disabled="!isFormValid"
                            :class="[
                                'w-full py-4 font-semibold rounded-xl text-base transition-all duration-300',
                                isFormValid 
                                    ? 'bg-[var(--blue-1)] text-white hover:bg-blue-600 cursor-pointer' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            ]"
                            @click="registerComponent">
                            Registrarme
                        </button>

                        <button
                            class="bg-gray-200 text-gray-500 transition duration-700 w-full py-4 font-bold rounded-xl my-4 text-base cursor-pointer hover:bg-[var(--blue-1)] hover:text-white"
                            @click="gotoRute('/')">
                            Cancelar volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Colors />
    </div>
</template>

<style scoped>
/* Estilos personalizados para los popups */
:global(.payment-warning-popup) {
    border-radius: 15px !important;
    font-family: 'Poppins', sans-serif !important;
}

:global(.payment-required-popup) {
    border-radius: 15px !important;
    font-family: 'Poppins', sans-serif !important;
}

:global(.payment-warning-popup .swal2-html-container),
:global(.payment-required-popup .swal2-html-container) {
    color: #333 !important;
    font-family: 'Poppins', sans-serif !important;
}

:global(.payment-warning-confirm),
:global(.payment-required-confirm) {
    font-weight: 600 !important;
    padding: 12px 24px !important;
    border-radius: 8px !important;
}

:global(.payment-warning-cancel),
:global(.payment-required-cancel) {
    font-weight: 500 !important;
    padding: 12px 24px !important;
    border-radius: 8px !important;
}
</style>