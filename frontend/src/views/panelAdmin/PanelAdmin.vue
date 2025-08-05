<script setup lang="ts">
import Navbar_panel from '@/common/Navbar_panel.vue';
import { ref } from 'vue';

import Swal from 'sweetalert2';
import { useAuthStore } from '@/store';

/**
 * TODO components
 * 
 */
import Information_adminPanel from '@/Modules/admin_panel/Information_adminPanel.vue';
import { AdminPanelOptionEnum } from '@/Modules/admin_panel';
import Professionals_registers from '@/Modules/admin_panel/Professionals_registers.vue';
import users_registers from '@/Modules/admin_panel/users_registers.vue';
import Bulleting from '@/Modules/admin_panel/Bulleting.vue';
import Profeccionals_pendings from '@/Modules/admin_panel/Profeccionals_pendings.vue';
// Panel activo inicial — Dashboard por defecto

//
const isOpen = ref(true);

const panelselect = ref<AdminPanelOptionEnum>(AdminPanelOptionEnum.ADMIN);
const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
};
const store = useAuthStore();
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
function changePanel(option: AdminPanelOptionEnum) {
    panelselect.value = option;
}
</script>
<template>
    <div class="w-screen h-screen">

        <div class="flex  h-full font-poppins text-base">
            <!-- Sidebar -->
            <aside :class="{
                'translate-x-0': isOpen,
                '-translate-x-full': !isOpen,
            }"
                class="bg-white w-[80%] md:w-[20%]  h-full    flex flex-col transition-transform duration-300 absolute left-0 bottom-0 z-50">
                <div class="p-4 flex justify-end items-center  bg-[var(--blue-1)] ">

                    <button @click="toggleSidebar"
                        class="text-white hover:text-cyan-400     focus:outline-none cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav class="flex-1  overflow-y-auto p-4 bg-[var(--blue-1)]">
                    <ul class="space-y-2">
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.ADMIN"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.ADMIN ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white   rounded-lg hover:bg-indigo-100    transition-colors duration-300 menu-item-hover">
                                <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg> -->
                                Admin
                            </a>
                        </li>
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.PROFESSIONAL_REGISTER"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.PROFESSIONAL_REGISTER ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white  rounded-lg hover:bg-indigo-100    transition-colors duration-300 menu-item-hover">
                                Profesionales Registrados
                            </a>
                        </li>
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.PROFESSIONALS_PENDINGS"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.PROFESSIONALS_PENDINGS ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white  rounded-lg hover:bg-indigo-100    transition-colors duration-300 menu-item-hover">
                                Profesionales Pendientes
                            </a>
                        </li>

                        <li class="animate-fade-in" style="animation-delay: 0.1s; ">
                            <a @click="panelselect = AdminPanelOptionEnum.QUOTES"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.QUOTES ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white   rounded-lg hover:bg-indigo-100    transition-colors duration-300 menu-item-hover">
                                Citas programadas
                            </a>
                        </li>
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.USER_REGISTER"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.USER_REGISTER ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover">
                                Usuarios Registrados
                            </a>
                        </li>
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.SUBSCRIPTIONS"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.SUBSCRIPTIONS ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover">
                                Suscripciones
                            </a>
                        </li>
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.PROFESSIONAL_RATING"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.PROFESSIONAL_RATING ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover">
                                Rating Profesionales
                            </a>
                        </li>
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.DELETION_REQUESTS"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.DELETION_REQUESTS ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover">
                                Solicitudes Eliminación
                            </a>
                        </li>
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.NEWSLETTER"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.NEWSLETTER ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover">
                                Boletín
                            </a>
                        </li>
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.WEB_BANNERS"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.WEB_BANNERS ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover">
                                Banners Web
                            </a>
                        </li>
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.MESSAGES"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.MESSAGES ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover">
                                Mensajes
                            </a>
                        </li>
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.BLOG"
                                :style="{ fontWeight: panelselect === AdminPanelOptionEnum.BLOG ? 'bold' : 'normal' }"
                                class="flex items-center p-2 text-white rounded-lg hover:bg-indigo-100 transition-colors duration-300 menu-item-hover">
                                Blog
                            </a>
                        </li>

                        <li class="animate-fade-in cursor-pointer" style="animation-delay: 0.1s; " @click="showAlert">
                            <a
                                class="flex items-center p-2 text-white   rounded-lg hover:bg-indigo-100    transition-colors duration-300 menu-item-hover">
                                Cerrar sesión
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 h-screen ">

                <div class="w-full flex justify-end transition-all duration-500">
                    <div :style="{ width: isOpen ? '80%' : '100%' }" class="transition-all duration-500">
                        <Navbar_panel :onAction="toggleSidebar" :isactive="isOpen" />
                        <Information_adminPanel v-if="panelselect === AdminPanelOptionEnum.ADMIN" class="min-h-[90svh]"
                            :changePanel="changePanel" />
                        <Professionals_registers v-if="panelselect === AdminPanelOptionEnum.PROFESSIONAL_REGISTER"
                            class="min-h-[90svh]" />
                        <users_registers v-if="panelselect === AdminPanelOptionEnum.USER_REGISTER"
                            class="min-h-[90svh]" />
                        <Profeccionals_pendings v-if="panelselect === AdminPanelOptionEnum.PROFESSIONALS_PENDINGS"   class="min-h-[90svh]" />
                        <h1 v-if="panelselect === AdminPanelOptionEnum.QUOTES">quotes</h1>
                        <Bulleting v-if="panelselect === AdminPanelOptionEnum.SUBSCRIPTIONS" />

                        <h1 v-if="panelselect === AdminPanelOptionEnum.PROFESSIONAL_RATING">professional rating</h1>
                        <h1 v-if="panelselect === AdminPanelOptionEnum.DELETION_REQUESTS">deletion requests</h1>
                        <h1 v-if="panelselect === AdminPanelOptionEnum.NEWSLETTER">newsletter</h1>
                        <h1 v-if="panelselect === AdminPanelOptionEnum.WEB_BANNERS">web banners</h1>
                        <h1 v-if="panelselect === AdminPanelOptionEnum.MESSAGES">messages</h1>
                        <h1 v-if="panelselect === AdminPanelOptionEnum.BLOG">blog</h1>

                        <!-- 🔽 Footer incluido dentro del mismo bloque de ancho -->

                    </div>
                </div>
            </main>


        </div>



    </div>
</template>