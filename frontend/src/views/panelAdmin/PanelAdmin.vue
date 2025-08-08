<script setup lang="ts">
import Navbar_panel from '@/common/Navbar_panel.vue';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/store';

/**
 * Importación de componentes del panel administrativo
 */
import Information_adminPanel from '@/Modules/admin_panel/Information_adminPanel.vue';
import { AdminPanelOptionEnum } from '@/Modules/admin_panel';
import Professionals_registers from '@/Modules/admin_panel/Professionals_registers.vue';
import users_registers from '@/Modules/admin_panel/users_registers.vue';
import Bulleting from '@/Modules/admin_panel/Bulleting.vue';
import Profeccionals_pendings from '@/Modules/admin_panel/Profeccionals_pendings.vue';

// Estado del sidebar
const isOpen = ref(true);

// Panel activo actual
const panelselect = ref<AdminPanelOptionEnum>(AdminPanelOptionEnum.ADMIN);

// Toggle del sidebar
const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
};

// Store de autenticación
const store = useAuthStore();

// Función para mostrar alerta de cierre de sesión
const showAlert = () => {
    Swal.fire({
        title: "¡Alerta!",
        text: "¿Estás seguro de cerrar sesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--blue-1)",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            store.close_session();
        }
    });
};

// Función para cambiar de panel
function changePanel(option: AdminPanelOptionEnum) {
    panelselect.value = option;
}
</script>

<template>
    <div class="w-screen h-screen">
        <div class="flex h-full font-poppins text-base">
            <!-- Sidebar -->
            <aside :class="{
                'translate-x-0': isOpen,
                '-translate-x-full': !isOpen,
            }"
                class="bg-white w-[80%] md:w-[20%] h-full flex flex-col transition-transform duration-300 absolute left-0 bottom-0 z-50">
                
                <!-- Header del Sidebar -->
                <div class="p-4 flex justify-end items-center bg-[var(--blue-1)]">
                    <button @click="toggleSidebar"
                        class="text-white hover:text-cyan-400 focus:outline-none cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Navegación del Sidebar -->
                <nav class="flex-1 overflow-y-auto p-4 bg-[var(--blue-1)]">
                    <ul class="space-y-2">
                        <!-- Dashboard -->
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.ADMIN"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.ADMIN ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover cursor-pointer">
                                Admin
                            </a>
                        </li>

                        <!-- Profesionales Registrados -->
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.PROFESSIONAL_REGISTER"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.PROFESSIONAL_REGISTER ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover cursor-pointer">
                                Profesionales Registrados
                            </a>
                        </li>

                        <!-- Profesionales Pendientes -->
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.PROFESSIONALS_PENDINGS"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.PROFESSIONALS_PENDINGS ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover cursor-pointer">
                                Profesionales Pendientes
                            </a>
                        </li>

                        <!-- Citas Programadas -->
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.QUOTES"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.QUOTES ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover cursor-pointer">
                                Citas programadas
                            </a>
                        </li>

                        <!-- Usuarios Registrados -->
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.USER_REGISTER"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.USER_REGISTER ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover cursor-pointer">
                                Usuarios Registrados
                            </a>
                        </li>

                        <!-- Suscripciones -->
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.SUBSCRIPTIONS"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.SUBSCRIPTIONS ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover cursor-pointer">
                                Suscripciones
                            </a>
                        </li>

                        <!-- Rating Profesionales -->
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.PROFESSIONAL_RATING"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.PROFESSIONAL_RATING ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover cursor-pointer">
                                Rating Profesionales
                            </a>
                        </li>

                        <!-- Solicitudes de Eliminación -->
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.DELETION_REQUESTS"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.DELETION_REQUESTS ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover cursor-pointer">
                                Solicitudes Eliminación
                            </a>
                        </li>

                        <!-- Newsletter -->
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.NEWSLETTER"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.NEWSLETTER ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover cursor-pointer">
                                Boletín
                            </a>
                        </li>

                        <!-- Web Banners -->
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.WEB_BANNERS"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.WEB_BANNERS ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover cursor-pointer">
                                Banners Web
                            </a>
                        </li>

                        <!-- Mensajes -->
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.MESSAGES"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.MESSAGES ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover cursor-pointer">
                                Mensajes
                            </a>
                        </li>

                        <!-- Blog -->
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.BLOG"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.BLOG ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover cursor-pointer">
                                Blog
                            </a>
                        </li>

                        <!-- Cerrar Sesión -->
                        <li class="animate-fade-in cursor-pointer" style="animation-delay: 0.1s;" @click="showAlert">
                            <a class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover">
                                Cerrar sesión
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <!-- Contenido Principal -->
            <main class="flex-1 h-screen">
                <div class="w-full flex justify-end transition-all duration-500">
                    <div :style="{ width: isOpen ? '80%' : '100%' }" class="transition-all duration-500">
                        <!-- Navbar -->
                        <Navbar_panel :onAction="toggleSidebar" :isactive="isOpen" />
                        
                        <!-- Componentes del Panel según selección -->
                        <Information_adminPanel 
                            v-if="panelselect === AdminPanelOptionEnum.ADMIN" 
                            class="min-h-[90svh]"
                            :changePanel="changePanel" />
                        
                        <Professionals_registers 
                            v-if="panelselect === AdminPanelOptionEnum.PROFESSIONAL_REGISTER"
                            class="min-h-[90svh]" />
                        
                        <users_registers 
                            v-if="panelselect === AdminPanelOptionEnum.USER_REGISTER"
                            class="min-h-[90svh]" />
                        
                        <Profeccionals_pendings 
                            v-if="panelselect === AdminPanelOptionEnum.PROFESSIONALS_PENDINGS"
                            class="min-h-[90svh]" />
                        
                        <h1 v-if="panelselect === AdminPanelOptionEnum.QUOTES">Citas Programadas</h1>
                        
                        <Bulleting v-if="panelselect === AdminPanelOptionEnum.SUBSCRIPTIONS" />
                        
                        <h1 v-if="panelselect === AdminPanelOptionEnum.PROFESSIONAL_RATING">Rating Profesionales</h1>
                        
                        <h1 v-if="panelselect === AdminPanelOptionEnum.DELETION_REQUESTS">Solicitudes de Eliminación</h1>
                        
                        <h1 v-if="panelselect === AdminPanelOptionEnum.NEWSLETTER">Newsletter</h1>
                        
                        <h1 v-if="panelselect === AdminPanelOptionEnum.WEB_BANNERS">Web Banners</h1>
                        
                        <h1 v-if="panelselect === AdminPanelOptionEnum.MESSAGES">Mensajes</h1>
                        
                        <h1 v-if="panelselect === AdminPanelOptionEnum.BLOG">Blog</h1>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
/* Animación de fade in para el menú */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
}

/* Efecto hover para los items del menú */
.menu-item-hover {
    position: relative;
    overflow: hidden;
}

.menu-item-hover::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: currentColor;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease-out;
}

.menu-item-hover:hover::after {
    transform: scaleX(1);
    transform-origin: left;
}
</style>