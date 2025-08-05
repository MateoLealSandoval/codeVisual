<script setup lang="ts">

import type { UsersProfessionalsPanelAdminDto } from '@/dto/AdminPanel';
import { store_admin_professionals } from '@/store/stores_admin_panel';
import { computed, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';

const adminProfessioanlStore = store_admin_professionals()
/** 
 * Todo import images
 * **/

/** 
 * Todo import components
 * **/
import paginadeComponent from '@/common/paginade.component.vue';


//
async function updateUserRole(user: UsersProfessionalsPanelAdminDto, checked: boolean) {
  if (user.role === 'DELETED_USER_PARTNER') {
    const result = await Swal.fire({
      title: "¡Alerta!",
      text: `¿Quieres habilitar al usuario ${user.names} ${user.lastnames}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--blue-1)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, habilitar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await adminProfessioanlStore.setState_professionals(user.id, 'USER_PARTNER');
      user.role = 'USER_PARTNER';
    }
    return;
  }

  if (user.role === 'USER_PARTNER' && !checked) {
    const result = await Swal.fire({
      title: "¡Alerta!",
      text: `¿Quieres bloquear al usuario ${user.names} ${user.lastnames}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--blue-1)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, bloquear",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await adminProfessioanlStore.setState_professionals(user.id, 'DELETED_USER_PARTNER');
      user.role = 'DELETED_USER_PARTNER';
    }
    return;
  }

}
onMounted(() => {
  adminProfessioanlStore.get_all_users();
});
onUnmounted(() => {
  adminProfessioanlStore.reset();
});
const all_users = computed(() => adminProfessioanlStore.users || null);
const meta = computed(() => adminProfessioanlStore.meta || null);
// const shedules_datas_office = computed(() => adminInformation.informationdata || null);
</script>
<template>
  <div class="w-full bg-gray-100 ">
    <h1 class="py-10 w-[90%] mx-auto">Bienvenido a Doc Visual Administrador</h1>
    <div class="w-[90%] mx-auto bg-white rounded-2xl   shadow-gray-400 shadow-2xl  " v-if="all_users.length">
      <div class="min-h-[400px] w-full">
        <table class="min-w-full bg-white shadow-md rounded-xl overflow-hidden  ">
          <thead class="bg-gray-200 text-gray-500 text-left">
            <tr>
              <th class="px-6 py-3">Nombre</th>
              <th class="px-6 py-3">Documento</th>
              <th class="px-6 py-3">Celular </th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Acción</th>
            </tr>
          </thead>
          <tbody class="w-full">
            <tr v-for="(user, index) in all_users" :key="user.id" class="border-b hover:bg-gray-50  ">
              <td class="px-6 py-3">{{ user.names + " " + user.lastnames }}</td>
              <td class="px-6 py-3">{{ user.names }}</td>
              <td class="px-6 py-3">{{ user.lastnames }}</td>
              <td class="px-6 py-3">{{ user.email }}</td>
              <td class="px-6 py-3">
                <label class="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" :checked="user.role === 'USER_PARTNER'"
                    @click.prevent="(event) => updateUserRole(user, !(user.role === 'USER_PARTNER'))" />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-green-500 transition-all">
                  </div>
                  <div
                    class="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 peer-checked:translate-x-full">
                  </div>
                </label>
              </td>

              <td class="px-6 py-3">—</td>
            </tr>

          </tbody>

        </table>
      </div>
      <div class="flex justify-center mt-4 pb-4">
        <paginadeComponent v-if="meta" :meta="meta" @change-page="adminProfessioanlStore.goToPage" />
      </div>
    </div>

  </div>

</template>