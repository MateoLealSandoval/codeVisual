<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store';
import { useSubscription } from '@/utils/subscriptionHelper';
import Swal from 'sweetalert2';

// ✅ IMPORTAR COMPONENTES DEL PANEL (ajustar según tu estructura)
// Estos son tus componentes existentes - ajustar las rutas según tu proyecto
import Navbar from '@/Modules/Home/Navbar.vue';
import Footer_Color from '@/common/Footer_Color.vue';

// Si tienes componentes específicos del panel, importarlos aquí:
// import PanelNavigation from '@/Modules/Panel_User_Professional/PanelNavigation.vue';
// import ProfileSection from '@/Modules/Panel_User_Professional/ProfileSection.vue';
// import ScheduleSection from '@/Modules/Panel_User_Professional/ScheduleSection.vue';
// import AppointmentsSection from '@/Modules/Panel_User_Professional/AppointmentsSection.vue';
// import ReportsSection from '@/Modules/Panel_User_Professional/ReportsSection.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// ✅ Estados del componente
const isLoading = ref(true);
const hasActivePlan = ref(false);
const isLimitedMode = ref(false);
const subscriptionStatus = ref({
  hasActivePlan: false,
  planType: '',
  expirationDate: ''
});
const currentUser = computed(() => authStore.user);

// ✅ Composable para manejo de suscripciones
const { 
  checkAndHandleSubscription, 
  canAccessFeature, 
  showFeatureLimitedMessage,
  getSubscriptionStatusText 
} = useSubscription();

// ✅ Estados del panel
const activeSection = ref('dashboard');
const showMobileMenu = ref(false);

// ✅ Configuración de secciones del panel
const sections = [
  { 
    id: 'dashboard', 
    name: 'Dashboard', 
    icon: '📊', 
    requiresPlan: false,
    description: 'Vista general de tu actividad'
  },
  { 
    id: 'profile', 
    name: 'Mi Perfil', 
    icon: '👤', 
    requiresPlan: false,
    description: 'Información personal y profesional'
  },
  { 
    id: 'schedule', 
    name: 'Horarios', 
    icon: '📅', 
    requiresPlan: true,
    description: 'Gestión avanzada de horarios'
  },
  { 
    id: 'appointments', 
    name: 'Citas', 
    icon: '🩺', 
    requiresPlan: false,
    description: 'Gestión de citas médicas'
  },
  { 
    id: 'patients', 
    name: 'Pacientes', 
    icon: '👥', 
    requiresPlan: true,
    description: 'Base de datos de pacientes'
  },
  { 
    id: 'reports', 
    name: 'Reportes', 
    icon: '📈', 
    requiresPlan: true,
    description: 'Estadísticas y análisis'
  },
  { 
    id: 'notifications', 
    name: 'Notificaciones', 
    icon: '🔔', 
    requiresPlan: false,
    description: 'Alertas y recordatorios'
  },
  { 
    id: 'billing', 
    name: 'Facturación', 
    icon: '💰', 
    requiresPlan: true,
    description: 'Gestión financiera'
  },
  { 
    id: 'settings', 
    name: 'Configuración', 
    icon: '⚙️', 
    requiresPlan: false,
    description: 'Ajustes del sistema'
  }
];

// ✅ Datos de ejemplo para el dashboard
const dashboardStats = ref({
  todayAppointments: 5,
  monthlyPatients: 24,
  monthlyRevenue: 2450000,
  pendingNotifications: 3,
  upcomingAppointments: [
    {
      id: 1,
      patient: 'Juan Pérez',
      type: 'Consulta general',
      time: '10:00 AM',
      date: 'Hoy',
      status: 'confirmada'
    },
    {
      id: 2,
      patient: 'María García',
      type: 'Control rutinario',
      time: '2:30 PM',
      date: 'Hoy',
      status: 'pendiente'
    },
    {
      id: 3,
      patient: 'Carlos López',
      type: 'Seguimiento',
      time: '9:00 AM',
      date: 'Mañana',
      status: 'confirmada'
    }
  ]
});

// ✅ Verificar acceso a funcionalidades
const canAccessSection = (sectionId: string): boolean => {
  const section = sections.find(s => s.id === sectionId);
  if (!section?.requiresPlan) return true;
  
  return canAccessFeature(sectionId, subscriptionStatus.value);
};

// ✅ Manejar clicks en secciones restringidas
const handleSectionClick = (sectionId: string) => {
  if (!canAccessSection(sectionId)) {
    showFeatureLimitedMessage(sectionId);
    return;
  }
  
  activeSection.value = sectionId;
  showMobileMenu.value = false; // Cerrar menú móvil al seleccionar
};

// ✅ Cargar datos del usuario
const loadUserData = async () => {
  try {
    // Aquí va tu lógica existente para cargar datos del usuario
    // await profesionalStore.loadProfessionalData();
    console.log('Cargando datos del usuario...');
    
    // Simular verificación de suscripción (reemplazar con tu lógica real)
    // const userSubscription = await checkUserSubscription(currentUser.value.id);
    // Por ahora, simular que no tiene plan activo
    hasActivePlan.value = false; // Cambiar según tu lógica real
    isLimitedMode.value = !hasActivePlan.value;
    
  } catch (error) {
    console.error('Error cargando datos del usuario:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los datos del usuario.'
    });
  }
};

// ✅ Inicialización del componente
onMounted(async () => {
  try {
    isLoading.value = true;
    
    // 1. Verificar autenticación
    if (!currentUser.value || currentUser.value.role !== 'USER_PARTNER') {
      await Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
        text: 'Debes iniciar sesión como especialista.',
      });
      router.push('/auth-professional');
      return;
    }
    
    // 2. Cargar datos del usuario primero
    await loadUserData();
    
    // 3. DESPUÉS verificar suscripción (no bloquear acceso)
    await nextTick(); // Asegurar que el componente esté montado
    
    const hasAccess = await checkAndHandleSubscription(route, router, currentUser.value);
    
    if (!hasAccess) {
      // El usuario eligió ir a planes o cerrar sesión
      return;
    }
    
    // 4. Si llegó aquí, puede acceder (con o sin limitaciones)
    isLimitedMode.value = !hasActivePlan.value;
    
  } catch (error) {
    console.error('Error en inicialización:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al cargar el panel.'
    });
  } finally {
    isLoading.value = false;
  }
});

// ✅ Funciones para manejar acciones del panel
const upgradeSubscription = () => {
  window.open('/planes', '_blank');
};

const logout = async () => {
  const result = await Swal.fire({
    title: '¿Cerrar sesión?',
    text: '¿Estás seguro de que quieres cerrar sesión?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  });
  
  if (result.isConfirmed) {
    await authStore.close_session();
    router.push('/auth-professional');
  }
};

// ✅ Formatear moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(amount);
};

// ✅ Obtener clase CSS para estado de cita
const getAppointmentStatusClass = (status: string) => {
  const classes = {
    'confirmada': 'bg-green-100 text-green-800',
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'cancelada': 'bg-red-100 text-red-800',
    'completada': 'bg-blue-100 text-blue-800'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <!-- ✅ LOADER MIENTRAS CARGA -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando panel profesional...</p>
      </div>
    </div>

    <!-- ✅ PANEL PRINCIPAL -->
    <div v-else class="flex flex-col lg:flex-row">
      
      <!-- ✅ SIDEBAR - DESKTOP -->
      <div class="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:shadow-lg lg:z-40">
        <div class="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-6">
            <h1 class="text-xl font-bold text-[var(--blue-1)]">DocVisual Pro</h1>
          </div>
          
          <!-- ✅ ESTADO DE SUSCRIPCIÓN -->
          <div class="mt-6 mx-6 p-4 rounded-lg" :class="hasActivePlan ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-2" :class="hasActivePlan ? 'bg-green-500' : 'bg-amber-500'"></div>
              <span class="text-xs font-medium" :class="hasActivePlan ? 'text-green-800' : 'text-amber-800'">
                {{ hasActivePlan ? 'Plan Profesional' : 'Plan Gratuito' }}
              </span>
            </div>
            
            <!-- ✅ BOTÓN UPGRADE SI NO TIENE PLAN -->
            <button 
              v-if="!hasActivePlan"
              @click="upgradeSubscription"
              class="mt-2 w-full bg-[var(--blue-1)] text-white text-xs py-2 px-3 rounded hover:bg-blue-600 transition-colors">
              ⬆️ Mejorar Plan
            </button>
          </div>

          <!-- ✅ NAVEGACIÓN -->
          <nav class="mt-6 flex-1 px-4 pb-6">
            <ul class="space-y-1">
              <li v-for="section in sections" :key="section.id">
                <button
                  @click="handleSectionClick(section.id)"
                  :class="[
                    'w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center group',
                    activeSection === section.id 
                      ? 'bg-[var(--blue-1)] text-white' 
                      : 'text-gray-700 hover:bg-gray-100',
                    !canAccessSection(section.id) ? 'opacity-60' : ''
                  ]"
                  :title="section.description">
                  <span class="mr-3 text-lg">{{ section.icon }}</span>
                  <div class="flex-1">
                    <p class="text-sm font-medium">{{ section.name }}</p>
                  </div>
                  
                  <!-- ✅ INDICADOR DE FUNCIÓN PREMIUM -->
                  <span 
                    v-if="section.requiresPlan && !hasActivePlan" 
                    class="ml-auto text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    Pro
                  </span>
                </button>
              </li>
            </ul>
          </nav>

          <!-- ✅ INFORMACIÓN DEL USUARIO -->
          <div class="flex-shrink-0 px-6 py-4 border-t border-gray-200">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-[var(--blue-1)] rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">
                  {{ currentUser?.names?.charAt(0) }}{{ currentUser?.lastnames?.charAt(0) }}
                </span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-700">
                  {{ currentUser?.names }} {{ currentUser?.lastnames }}
                </p>
                <p class="text-xs text-gray-500">Especialista</p>
              </div>
            </div>
            
            <button 
              @click="logout"
              class="mt-3 w-full bg-red-500 text-white py-2 px-4 rounded text-sm hover:bg-red-600 transition-colors">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <!-- ✅ SIDEBAR - MOBILE -->
      <div class="lg:hidden">
        <div class="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
          <h1 class="text-lg font-bold text-[var(--blue-1)]">DocVisual Pro</h1>
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="text-gray-600 hover:text-gray-900">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        
        <!-- ✅ MENÚ MÓVIL -->
        <div v-if="showMobileMenu" class="bg-white border-t border-gray-200">
          <nav class="px-4 py-2">
            <ul class="space-y-1">
              <li v-for="section in sections" :key="section.id">
                <button
                  @click="handleSectionClick(section.id)"
                  :class="[
                    'w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center',
                    activeSection === section.id 
                      ? 'bg-[var(--blue-1)] text-white' 
                      : 'text-gray-700 hover:bg-gray-100',
                    !canAccessSection(section.id) ? 'opacity-60' : ''
                  ]">
                  <span class="mr-3">{{ section.icon }}</span>
                  {{ section.name }}
                  <span 
                    v-if="section.requiresPlan && !hasActivePlan" 
                    class="ml-auto text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    Pro
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- ✅ CONTENIDO PRINCIPAL -->
      <div class="flex-1 lg:ml-64">
        <main class="p-4 lg:p-6">
          
          <!-- ✅ BANNER DE MODO LIMITADO -->
          <div v-if="isLimitedMode" class="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-sm font-medium text-amber-800">Modo Limitado</h3>
                <p class="text-sm text-amber-700 mt-1">
                  Estás usando DocVisual en modo limitado. 
                  <button @click="upgradeSubscription" class="font-medium underline hover:no-underline">
                    Actualiza tu plan
                  </button> 
                  para acceder a todas las funcionalidades profesionales.
                </p>
              </div>
              <button @click="isLimitedMode = false" class="text-amber-400 hover:text-amber-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- ✅ CONTENIDO SEGÚN SECCIÓN ACTIVA -->
          <div class="bg-white rounded-lg shadow-sm">
            
            <!-- ✅ DASHBOARD -->
            <div v-if="activeSection === 'dashboard'" class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
                <div class="text-sm text-gray-500">
                  Última actualización: {{ new Date().toLocaleString() }}
                </div>
              </div>
              
              <!-- ✅ ESTADÍSTICAS PRINCIPALES -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-blue-50 p-6 rounded-lg">
                  <h3 class="text-lg font-semibold text-blue-900">Citas Hoy</h3>
                  <p class="text-3xl font-bold text-blue-600 mt-2">{{ dashboardStats.todayAppointments }}</p>
                  <p class="text-sm text-blue-700 mt-1">+2 desde ayer</p>
                </div>
                
                <div class="bg-green-50 p-6 rounded-lg">
                  <h3 class="text-lg font-semibold text-green-900">Pacientes Este Mes</h3>
                  <p class="text-3xl font-bold text-green-600 mt-2">{{ dashboardStats.monthlyPatients }}</p>
                  <p class="text-sm text-green-700 mt-1">+8% vs mes anterior</p>
                </div>
                
                <div class="bg-purple-50 p-6 rounded-lg" :class="!hasActivePlan ? 'opacity-50' : ''">
                  <h3 class="text-lg font-semibold text-purple-900">Ingresos Este Mes</h3>
                  <p class="text-3xl font-bold text-purple-600 mt-2">
                    {{ hasActivePlan ? formatCurrency(dashboardStats.monthlyRevenue) : 'Pro' }}
                  </p>
                  <button 
                    v-if="!hasActivePlan" 
                    @click="showFeatureLimitedMessage('reports')"
                    class="text-xs text-purple-600 underline mt-1 hover:no-underline">
                    Ver con plan Pro
                  </button>
                  <p v-else class="text-sm text-purple-700 mt-1">+15% vs mes anterior</p>
                </div>
                
                <div class="bg-amber-50 p-6 rounded-lg">
                  <h3 class="text-lg font-semibold text-amber-900">Notificaciones</h3>
                  <p class="text-3xl font-bold text-amber-600 mt-2">{{ dashboardStats.pendingNotifications }}</p>
                  <p class="text-sm text-amber-700 mt-1">Pendientes de leer</p>
                </div>
              </div>

              <!-- ✅ PRÓXIMAS CITAS -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Próximas Citas</h3>
                  <div class="space-y-3">
                    <div 
                      v-for="appointment in dashboardStats.upcomingAppointments" 
                      :key="appointment.id"
                      class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div class="flex justify-between items-start">
                        <div class="flex-1">
                          <p class="font-medium text-gray-900">{{ appointment.patient }}</p>
                          <p class="text-sm text-gray-600">{{ appointment.type }}</p>
                        </div>
                        <div class="text-right ml-4">
                          <p class="text-sm font-medium text-gray-900">{{ appointment.time }}</p>
                          <p class="text-xs text-gray-500">{{ appointment.date }}</p>
                          <span 
                            :class="getAppointmentStatusClass(appointment.status)"
                            class="inline-block text-xs px-2 py-1 rounded mt-1">
                            {{ appointment.status }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    class="mt-4 w-full bg-[var(--blue-1)] text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                    @click="activeSection = 'appointments'">
                    Ver todas las citas
                  </button>
                </div>
                
                <!-- ✅ ACCESOS RÁPIDOS -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h3>
                  <div class="grid grid-cols-2 gap-3">
                    <button 
                      @click="handleSectionClick('appointments')"
                      class="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
                      <div class="text-2xl mb-2">🩺</div>
                      <p class="text-sm font-medium text-blue-900">Nueva Cita</p>
                    </button>
                    
                    <button 
                      @click="handleSectionClick('patients')"
                      class="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors"
                      :class="!hasActivePlan ? 'opacity-50' : ''">
                      <div class="text-2xl mb-2">👥</div>
                      <p class="text-sm font-medium text-green-900">Pacientes</p>
                      <span v-if="!hasActivePlan" class="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded mt-1">Pro</span>
                    </button>
                    
                    <button 
                      @click="handleSectionClick('schedule')"
                      class="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors"
                      :class="!hasActivePlan ? 'opacity-50' : ''">
                      <div class="text-2xl mb-2">📅</div>
                      <p class="text-sm font-medium text-purple-900">Horarios</p>
                      <span v-if="!hasActivePlan" class="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded mt-1">Pro</span>
                    </button>
                    
                    <button 
                      @click="handleSectionClick('reports')"
                      class="bg-amber-50 p-4 rounded-lg text-center hover:bg-amber-100 transition-colors"
                      :class="!hasActivePlan ? 'opacity-50' : ''">
                      <div class="text-2xl mb-2">📈</div>
                      <p class="text-sm font-medium text-amber-900">Reportes</p>
                      <span v-if="!hasActivePlan" class="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded mt-1">Pro</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ✅ PERFIL -->
            <div v-else-if="activeSection === 'profile'" class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Mi Perfil Profesional</h2>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- ✅ INFORMACIÓN PERSONAL -->
                <div class="space-y-6">
                  <div class="border rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">Información Personal</h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <input 
                          type="text" 
                          :value="`${currentUser?.names} ${currentUser?.lastnames}`"
                          class="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                          readonly>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          :value="currentUser?.email"
                          class="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                          readonly>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input 
                          type="tel" 
                          placeholder="Agregar teléfono"
                          class="w-full border border-gray-300 rounded px-3 py-2">
                      </div>
                    </div>
                  </div>
                  
                  <div class="border rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">Información Profesional</h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                        <select class="w-full border border-gray-300 rounded px-3 py-2">
                          <option>Oftalmología General</option>
                          <option>Optometría</option>
                          <option>Retinología</option>
                          <option>Glaucoma</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tarjeta Profesional</label>
                        <input 
                          type="text" 
                          placeholder="Número de tarjeta profesional"
                          class="w-full border border-gray-300 rounded px-3 py-2">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Años de Experiencia</label>
                        <input 
                          type="number" 
                          placeholder="Años de experiencia"
                          class="w-full border border-gray-300 rounded px-3 py-2">
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- ✅ FOTO DE PERFIL Y CONFIGURACIÓN -->
                <div class="space-y-6">
                  <div class="border rounded-lg p-6 text-center">
                    <h3 class="text-lg font-semibold mb-4">Foto de Perfil</h3>
                    <div class="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span class="text-4xl text-gray-500">
                        {{ currentUser?.names?.charAt(0) }}{{ currentUser?.lastnames?.charAt(0) }}
                      </span>
                    </div>
                    <button class="bg-[var(--blue-1)] text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                      Cambiar Foto
                    </button>
                  </div>
                  
                  <div class="border rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">Descripción Profesional</h3>
                    <textarea 
                      rows="4" 
                      placeholder="Describe tu experiencia y especialidades..."
                      class="w-full border border-gray-300 rounded px-3 py-2 resize-none"></textarea>
                    <p class="text-sm text-gray-500 mt-2">
                      Esta descripción será visible para los pacientes.
                    </p>
                  </div>
                  
                  <button class="w-full bg-[var(--blue-1)] text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>

            <!-- ✅ HORARIOS (REQUIERE PLAN) -->
            <div v-else-if="activeSection === 'schedule'" class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Gestión de Horarios</h2>
              
              <div v-if="!hasActivePlan" class="text-center py-12">
                <div class="text-6xl mb-4">📅</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Gestión Avanzada de Horarios</h3>
                <p class="text-gray-600 mb-6">
                  Crea horarios personalizados, gestiona múltiples consultorios y automatiza tu agenda con nuestras herramientas profesionales.
                </p>
                <div class="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-2xl mx-auto">
                  <h4 class="font-semibold text-gray-900 mb-3">Con el Plan Profesional podrás:</h4>
                  <ul class="space-y-2 text-gray-600">
                    <li class="flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Horarios personalizados por día
                    </li>
                    <li class="flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Múltiples consultorios
                    </li>
                    <li class="flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Bloqueo de horarios especiales
                    </li>
                    <li class="flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Sincronización automática
                    </li>
                  </ul>
                </div>
                <button 
                  @click="upgradeSubscription"
                  class="bg-[var(--blue-1)] text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium">
                  Actualizar a Plan Pro
                </button>
              </div>
              
              <div v-else>
                <!-- Aquí iría tu componente de horarios completo -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="border rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">Horario Semanal</h3>
                    <div class="space-y-4">
                      <div v-for="day in ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']" :key="day" class="flex items-center justify-between">
                        <span class="font-medium">{{ day }}</span>
                        <div class="flex items-center space-x-2">
                          <input type="time" value="08:00" class="border rounded px-2 py-1 text-sm">
                          <span>-</span>
                          <input type="time" value="18:00" class="border rounded px-2 py-1 text-sm">
                          <input type="checkbox" checked class="ml-2">
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="border rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">Configuración Avanzada</h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Duración por cita</label>
                        <select class="w-full border border-gray-300 rounded px-3 py-2">
                          <option>30 minutos</option>
                          <option>45 minutos</option>
                          <option>60 minutos</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo entre citas</label>
                        <select class="w-full border border-gray-300 rounded px-3 py-2">
                          <option>5 minutos</option>
                          <option>10 minutos</option>
                          <option>15 minutos</option>
                        </select>
                      </div>
                      <button class="w-full bg-[var(--blue-1)] text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                        Guardar Configuración
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ✅ CITAS -->
            <div v-else-if="activeSection === 'appointments'" class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Gestión de Citas</h2>
                <button 
                  v-if="hasActivePlan"
                  class="bg-[var(--blue-1)] text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                  + Nueva Cita
                </button>
                <button 
                  v-else
                  @click="showFeatureLimitedMessage('appointment_creation')"
                  class="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed">
                  + Nueva Cita (Pro)
                </button>
              </div>
              
              <div v-if="!hasActivePlan" class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p class="text-amber-800 text-sm">
                  <strong>Modo limitado:</strong> Puedes ver tus citas existentes pero no crear nuevas o usar funcionalidades avanzadas de gestión.
                  <button @click="upgradeSubscription" class="underline font-medium ml-1">Actualizar plan</button>
                </p>
              </div>
              
              <!-- ✅ FILTROS -->
              <div class="bg-gray-50 p-4 rounded-lg mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                    <input type="date" class="w-full border border-gray-300 rounded px-3 py-2">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select class="w-full border border-gray-300 rounded px-3 py-2">
                      <option>Todas</option>
                      <option>Confirmadas</option>
                      <option>Pendientes</option>
                      <option>Canceladas</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                    <input type="text" placeholder="Buscar paciente..." class="w-full border border-gray-300 rounded px-3 py-2">
                  </div>
                  <div class="flex items-end">
                    <button class="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors">
                      Filtrar
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- ✅ LISTA DE CITAS -->
              <div class="space-y-4">
                <div 
                  v-for="appointment in dashboardStats.upcomingAppointments" 
                  :key="appointment.id"
                  class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="font-semibold text-gray-900">{{ appointment.patient }}</h3>
                      <p class="text-sm text-gray-600">{{ appointment.type }}</p>
                      <p class="text-xs text-gray-500 mt-1">
                        📧 paciente@email.com • 📱 +57 300 123 4567
                      </p>
                    </div>
                    <div class="text-right ml-4">
                      <p class="text-sm font-medium text-gray-900">{{ appointment.date }}, {{ appointment.time }}</p>
                      <span 
                        :class="getAppointmentStatusClass(appointment.status)"
                        class="inline-block text-xs px-2 py-1 rounded mt-1">
                        {{ appointment.status }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="mt-4 flex gap-2">
                    <button 
                      v-if="hasActivePlan"
                      class="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition-colors">
                      Ver Detalles
                    </button>
                    <button 
                      v-if="hasActivePlan"
                      class="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600 transition-colors">
                      Confirmar
                    </button>
                    <button 
                      v-if="hasActivePlan"
                      class="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600 transition-colors">
                      Cancelar
                    </button>
                    <button 
                      v-else
                      @click="showFeatureLimitedMessage('appointment_management')"
                      class="text-xs text-gray-500 underline hover:no-underline">
                      Gestionar cita (Pro)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ✅ PACIENTES (REQUIERE PLAN) -->
            <div v-else-if="activeSection === 'patients'" class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Base de Datos de Pacientes</h2>
              
              <div v-if="!hasActivePlan" class="text-center py-12">
                <div class="text-6xl mb-4">👥</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Gestión Completa de Pacientes</h3>
                <p class="text-gray-600 mb-6">
                  Mantén un registro completo de todos tus pacientes con historiales médicos, tratamientos y seguimientos.
                </p>
                <button 
                  @click="upgradeSubscription"
                  class="bg-[var(--blue-1)] text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium">
                  Desbloquear Gestión de Pacientes
                </button>
              </div>
              
              <div v-else>
                <!-- Base de datos de pacientes completa -->
                <p class="text-gray-600">Funcionalidad de gestión de pacientes completa aquí...</p>
              </div>
            </div>

            <!-- ✅ REPORTES (REQUIERE PLAN) -->
            <div v-else-if="activeSection === 'reports'" class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Reportes y Estadísticas</h2>
              
              <div v-if="!hasActivePlan" class="text-center py-12">
                <div class="text-6xl mb-4">📊</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Reportes Avanzados</h3>
                <p class="text-gray-600 mb-6">
                  Accede a estadísticas detalladas, reportes financieros y análisis de rendimiento de tu práctica médica.
                </p>
                <button 
                  @click="upgradeSubscription"
                  class="bg-[var(--blue-1)] text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium">
                  Desbloquear Reportes
                </button>
              </div>
              
              <div v-else>
                <!-- Reportes completos -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="border rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">Ingresos Mensuales</h3>
                    <div class="h-48 bg-gray-100 rounded flex items-center justify-center">
                      <p class="text-gray-500">Gráfico de ingresos</p>
                    </div>
                  </div>
                  
                  <div class="border rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">Citas por Mes</h3>
                    <div class="h-48 bg-gray-100 rounded flex items-center justify-center">
                      <p class="text-gray-500">Gráfico de citas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ✅ NOTIFICACIONES -->
            <div v-else-if="activeSection === 'notifications'" class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Notificaciones</h2>
              
              <div v-if="!hasActivePlan" class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p class="text-amber-800 text-sm">
                  <strong>Modo limitado:</strong> Notificaciones básicas disponibles. 
                  <button @click="upgradeSubscription" class="underline font-medium">Actualiza</button> 
                  para notificaciones en tiempo real y personalizadas.
                </p>
              </div>
              
              <div class="space-y-4">
                <div class="border rounded-lg p-4">
                  <div class="flex items-start">
                    <div class="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div class="flex-1">
                      <h3 class="font-medium">Nueva cita agendada</h3>
                      <p class="text-sm text-gray-600">Juan Pérez agendó una cita para mañana a las 10:00 AM</p>
                      <p class="text-xs text-gray-500 mt-1">Hace 5 minutos</p>
                    </div>
                  </div>
                </div>
                
                <div class="border rounded-lg p-4">
                  <div class="flex items-start">
                    <div class="w-3 h-3 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div class="flex-1">
                      <h3 class="font-medium">Cita confirmada</h3>
                      <p class="text-sm text-gray-600">María García confirmó su cita de hoy a las 2:30 PM</p>
                      <p class="text-xs text-gray-500 mt-1">Hace 1 hora</p>
                    </div>
                  </div>
                </div>
                
                <div class="border rounded-lg p-4 opacity-50" v-if="!hasActivePlan">
                  <div class="flex items-start">
                    <div class="w-3 h-3 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div class="flex-1">
                      <h3 class="font-medium">Recordatorio automático enviado</h3>
                      <p class="text-sm text-gray-600">Se enviaron recordatorios a 3 pacientes sobre sus citas de mañana</p>
                      <p class="text-xs text-gray-500 mt-1">Función Pro - Hace 2 horas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ✅ FACTURACIÓN (REQUIERE PLAN) -->
            <div v-else-if="activeSection === 'billing'" class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Facturación y Pagos</h2>
              
              <div v-if="!hasActivePlan" class="text-center py-12">
                <div class="text-6xl mb-4">💰</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Gestión Financiera Completa</h3>
                <p class="text-gray-600 mb-6">
                  Genera facturas automáticas, rastrea pagos y obtén reportes financieros detallados.
                </p>
                <button 
                  @click="upgradeSubscription"
                  class="bg-[var(--blue-1)] text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium">
                  Desbloquear Facturación
                </button>
              </div>
              
              <div v-else>
                <!-- Sistema de facturación completo -->
                <p class="text-gray-600">Sistema de facturación y pagos completo aquí...</p>
              </div>
            </div>

            <!-- ✅ CONFIGURACIÓN -->
            <div v-else-if="activeSection === 'settings'" class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Configuración</h2>
              
              <div class="space-y-6">
                <!-- ✅ INFORMACIÓN DE LA CUENTA -->
                <div class="border rounded-lg p-6">
                  <h3 class="text-lg font-semibold mb-4">Información de la Cuenta</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input 
                        type="text" 
                        :value="currentUser?.names" 
                        class="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                        readonly>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                      <input 
                        type="text" 
                        :value="currentUser?.lastnames" 
                        class="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                        readonly>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        :value="currentUser?.email" 
                        class="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                        readonly>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Cuenta</label>
                      <input 
                        type="text" 
                        value="Especialista Profesional" 
                        class="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                        readonly>
                    </div>
                  </div>
                </div>

                <!-- ✅ CONFIGURACIÓN DE SUSCRIPCIÓN -->
                <div class="border rounded-lg p-6">
                  <h3 class="text-lg font-semibold mb-4">Plan y Suscripción</h3>
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p class="font-medium">{{ hasActivePlan ? 'Plan Profesional' : 'Plan Gratuito' }}</p>
                      <p class="text-sm text-gray-600">
                        {{ hasActivePlan ? 'Acceso completo a todas las funcionalidades' : 'Acceso limitado a funcionalidades básicas' }}
                      </p>
                      <p v-if="hasActivePlan" class="text-xs text-gray-500 mt-1">
                        Renovación automática el 15 de septiembre, 2024
                      </p>
                    </div>
                    <button 
                      v-if="!hasActivePlan"
                      @click="upgradeSubscription"
                      class="bg-[var(--blue-1)] text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors font-medium">
                      Actualizar Plan
                    </button>
                    <div v-else class="text-right">
                      <span class="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                        ✓ Activo
                      </span>
                      <button class="block text-sm text-gray-500 underline mt-2 hover:no-underline">
                        Gestionar suscripción
                      </button>
                    </div>
                  </div>
                </div>

                <!-- ✅ PREFERENCIAS -->
                <div class="border rounded-lg p-6">
                  <h3 class="text-lg font-semibold mb-4">Preferencias de Notificaciones</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium">Notificaciones por email</p>
                        <p class="text-sm text-gray-600">Recibir notificaciones de citas y recordatorios por correo</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" class="sr-only peer" checked>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium">Recordatorios automáticos</p>
                        <p class="text-sm text-gray-600">Enviar recordatorios automáticos a pacientes 24h antes de la cita</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          value="" 
                          class="sr-only peer" 
                          :disabled="!hasActivePlan"
                          :checked="hasActivePlan">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
                      </label>
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium">Notificaciones push</p>
                        <p class="text-sm text-gray-600">Recibir notificaciones push en el navegador</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- ✅ SEGURIDAD -->
                <div class="border rounded-lg p-6">
                  <h3 class="text-lg font-semibold mb-4">Seguridad</h3>
                  <div class="space-y-4">
                    <button class="w-full bg-blue-50 text-blue-700 py-2 px-4 rounded hover:bg-blue-100 transition-colors text-left">
                      🔑 Cambiar contraseña
                    </button>
                    <button class="w-full bg-green-50 text-green-700 py-2 px-4 rounded hover:bg-green-100 transition-colors text-left">
                      🔐 Habilitar autenticación de dos factores
                    </button>
                    <button class="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 transition-colors text-left">
                      📱 Gestionar dispositivos conectados
                    </button>
                  </div>
                </div>

                <!-- ✅ BOTÓN GUARDAR -->
                <div class="flex justify-end">
                  <button class="bg-[var(--blue-1)] text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors font-medium">
                    Guardar Configuración
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
    
    <Footer_Color />
  </div>
</template>

<style scoped>
/* ✅ ESTILOS PERSONALIZADOS */
.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

/* Animación para el loader */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Estilos para el sidebar */
.sidebar-shadow {
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

/* Estilos para cards con hover */
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Estilos para botones de estado */
.status-confirmed {
  @apply bg-green-100 text-green-800;
}

.status-pending {
  @apply bg-yellow-100 text-yellow-800;
}

.status-cancelled {
  @apply bg-red-100 text-red-800;
}

.status-completed {
  @apply bg-blue-100 text-blue-800;
}

/* Responsive utilities */
@media (max-width: 768px) {
  .mobile-grid {
    grid-template-columns: 1fr;
  }
  
  .mobile-hidden {
    display: none;
  }
}

/* Estilos para elementos premium */
.premium-blur {
  filter: blur(2px);
  pointer-events: none;
}

.premium-overlay {
  position: relative;
}

.premium-overlay::after {
  content: '🔒 Pro';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Switch personalizado */
.custom-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.custom-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--blue-1);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Estilos para notificaciones */
.notification-dot {
  position: relative;
}

.notification-dot::after {
  content: '';
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
}

/* Gradientes personalizados */
.gradient-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-green {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-purple {
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
}

.gradient-amber {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

/* Estilos para tablas responsivas */
.table-responsive {
  overflow-x: auto;
}

.table-responsive table {
  min-width: 600px;
}

/* Animaciones suaves */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

/* Estilos para elementos de loading */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Estilos para tooltips */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

/* Estilos para modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

/* Utilidades adicionales */
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.box-shadow-lg {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.border-dashed {
  border-style: dashed;
}

/* Estilos para elementos interactivos */
.interactive-hover:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

.button-primary {
  background-color: var(--blue-1);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button-primary:hover {
  background-color: #1e40af;
}

.button-secondary {
  background-color: #6b7280;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button-secondary:hover {
  background-color: #4b5563;
}

/* Estilos para estado de carga */
.loading-state {
  opacity: 0.6;
  pointer-events: none;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--blue-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Media queries para responsive design */
@media (max-width: 1024px) {
  .lg-hidden {
    display: none !important;
  }
  
  .lg-visible {
    display: block !important;
  }
}

@media (max-width: 768px) {
  .md-hidden {
    display: none !important;
  }
  
  .md-visible {
    display: block !important;
  }
  
  .mobile-stack {
    flex-direction: column;
  }
  
  .mobile-full-width {
    width: 100% !important;
  }
}

@media (max-width: 640px) {
  .sm-hidden {
    display: none !important;
  }
  
  .sm-visible {
    display: block !important;
  }
  
  .text-responsive {
    font-size: 0.875rem;
  }
  
  .padding-mobile {
    padding: 1rem;
  }
}

/* Estilos para dark mode (futuro) */
@media (prefers-color-scheme: dark) {
  .dark-mode {
    background-color: #1f2937;
    color: #f9fafb;
  }
  
  .dark-mode .bg-white {
    background-color: #374151;
  }
  
  .dark-mode .text-gray-900 {
    color: #f9fafb;
  }
  
  .dark-mode .border-gray-200 {
    border-color: #4b5563;
  }
}

/* Estilos para focus y accessibility */
.focus-visible:focus {
  outline: 2px solid var(--blue-1);
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Estilos para scroll personalizado */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}