<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store';
// import { useSubscription } from '@/utils/subscriptionHelper';
import Swal from 'sweetalert2';

// ✅ IMPORTAR COMPONENTES DEL PANEL (ajustar según tu estructura)
// Comentar imports problemáticos temporalmente
// import Navbar from '@/Modules/Home/Navbar.vue';
// import Footer_Color from '@/common/Footer_Color.vue';

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

// ✅ Composable para manejo de suscripciones (temporalmente comentado)
// const { 
//   checkAndHandleSubscription, 
//   canAccessFeature, 
//   showFeatureLimitedMessage,
//   getSubscriptionStatusText 
// } = useSubscription();

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
  
  // Temporalmente usar subscriptionStatus local
  return subscriptionStatus.value.hasActivePlan;
};

// ✅ Mostrar mensaje de funcionalidad limitada (versión simplificada)
const showFeatureLimitedMessage = (featureName: string): void => {
  Swal.fire({
    title: 'Funcionalidad Pro',
    text: 'Esta funcionalidad requiere un plan profesional.',
    icon: 'info',
    confirmButtonText: 'Ver Planes',
    showCancelButton: true,
    cancelButtonText: 'Entendido'
  }).then((result) => {
    if (result.isConfirmed) {
      window.open('/planes', '_blank');
    }
  });
};

// ✅ Manejar clicks en secciones restringidas
const handleSectionClick = (sectionId: string) => {
  if (!canAccessSection(sectionId)) {
    showFeatureLimitedMessage(sectionId);
    return;
  }
  
  activeSection.value = sectionId;
  showMobileMenu.value = false;
};

// ✅ Cargar datos del usuario
const loadUserData = async () => {
  try {
    console.log('Cargando datos del usuario...');
    hasActivePlan.value = false; // Por defecto sin plan
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

// ✅ Verificación de suscripción simplificada
const checkAndHandleSubscription = async (): Promise<boolean> => {
  try {
    // Simulación temporal - reemplazar con lógica real
    if (!subscriptionStatus.value.hasActivePlan) {
      const result = await Swal.fire({
        title: 'Plan Profesional',
        text: 'Para acceder a todas las funcionalidades necesitas un plan profesional.',
        icon: 'info',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Ver Planes',
        denyButtonText: 'Continuar Limitado',
        cancelButtonText: 'Cerrar Sesión'
      });

      if (result.isConfirmed) {
        window.open('/planes', '_blank');
        return false;
      } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
        await authStore.close_session();
        router.push('/auth-professional');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error en verificación de suscripción:', error);
    return true;
  }
};

// ✅ Inicialización del componente
onMounted(async () => {
  try {
    isLoading.value = true;
    
    if (!currentUser.value || currentUser.value.role !== 'USER_PARTNER') {
      await Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
        text: 'Debes iniciar sesión como especialista.',
      });
      router.push('/auth-professional');
      return;
    }
    
    await loadUserData();
    await nextTick();
    
    const hasAccess = await checkAndHandleSubscription();
    
    if (!hasAccess) {
      return;
    }
    
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

// ✅ Obtener texto del estado de suscripción
const getSubscriptionStatusText = () => {
  return hasActivePlan.value ? 'Plan Profesional' : 'Plan Gratuito';
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ✅ NAVBAR SIMPLE (reemplazar cuando esté disponible) -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-[var(--blue-1)]">DocVisual</h1>
          </div>
        </div>
      </div>
    </nav>
    
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
      <div class="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:shadow-lg lg:z-40" style="top: 64px;">
        <div class="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-6">
            <h1 class="text-xl font-bold text-[var(--blue-1)]">Panel Pro</h1>
          </div>
          
          <!-- ✅ ESTADO DE SUSCRIPCIÓN -->
          <div class="mt-6 mx-6 p-4 rounded-lg" :class="hasActivePlan ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-2" :class="hasActivePlan ? 'bg-green-500' : 'bg-amber-500'"></div>
              <span class="text-xs font-medium" :class="hasActivePlan ? 'text-green-800' : 'text-amber-800'">
                {{ getSubscriptionStatusText() }}
              </span>
            </div>
            
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
          <h1 class="text-lg font-bold text-[var(--blue-1)]">Panel Pro</h1>
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="text-gray-600 hover:text-gray-900">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        
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
      <div class="flex-1 lg:ml-64" style="margin-top: 64px;">
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
                
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h3>
                  <div class="grid grid-cols-2 gap-3">
                    <button 
                      @click="handleSectionClick('appointments')"
                      class="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
                      <div class="text-2xl mb-2">🩺</div>
                      <p class="text-sm font-medium text-blue-900">Citas</p>
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

            <!-- ✅ OTRAS SECCIONES SIMPLIFICADAS -->
            <div v-else-if="activeSection === 'profile'" class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h2>
              <div class="bg-gray-50 p-8 rounded-lg text-center">
                <div class="w-24 h-24 bg-[var(--blue-1)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span class="text-white text-2xl font-bold">
                    {{ currentUser?.names?.charAt(0) }}{{ currentUser?.lastnames?.charAt(0) }}
                  </span>
                </div>
                <h3 class="text-xl font-semibold">{{ currentUser?.names }} {{ currentUser?.lastnames }}</h3>
                <p class="text-gray-600">{{ currentUser?.email }}</p>
                <p class="text-sm text-gray-500 mt-2">Especialista en Salud Visual</p>
              </div>
            </div>

            <div v-else-if="activeSection === 'appointments'" class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Gestión de Citas</h2>
              
              <div v-if="!hasActivePlan" class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p class="text-amber-800 text-sm">
                  <strong>Modo limitado:</strong> Puedes ver tus citas pero no crear nuevas.
                </p>
              </div>
              
              <div class="space-y-4">
                <div 
                  v-for="appointment in dashboardStats.upcomingAppointments" 
                  :key="appointment.id"
                  class="border rounded-lg p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-semibold">{{ appointment.patient }}</h3>
                      <p class="text-sm text-gray-600">{{ appointment.type }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-medium">{{ appointment.date }}, {{ appointment.time }}</p>
                      <span 
                        :class="getAppointmentStatusClass(appointment.status)"
                        class="inline-block text-xs px-2 py-1 rounded mt-1">
                        {{ appointment.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ✅ SECCIONES PRO -->
            <div v-else-if="['schedule', 'patients', 'reports'].includes(activeSection)" class="p-6">
              <div class="text-center py-12">
                <div class="text-6xl mb-4">
                  {{ activeSection === 'schedule' ? '📅' : activeSection === 'patients' ? '👥' : '📊' }}
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">
                  {{ activeSection === 'schedule' ? 'Gestión de Horarios' : activeSection === 'patients' ? 'Base de Datos de Pacientes' : 'Reportes y Estadísticas' }}
                </h3>
                <p class="text-gray-600 mb-6">
                  Esta funcionalidad avanzada está disponible con el Plan Profesional.
                </p>
                <button 
                  @click="upgradeSubscription"
                  class="bg-[var(--blue-1)] text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium">
                  Actualizar a Plan Pro
                </button>
              </div>
            </div>

            <!-- ✅ OTRAS SECCIONES -->
            <div v-else class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">
                {{ sections.find(s => s.id === activeSection)?.name || 'Sección' }}
              </h2>
              <div class="bg-gray-50 p-8 rounded-lg text-center">
                <p class="text-gray-600">Funcionalidad en desarrollo...</p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
    
    <!-- ✅ FOOTER SIMPLE (reemplazar cuando esté disponible) -->
    <footer class="bg-white border-t border-gray-200 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-500">© 2024 DocVisual. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>