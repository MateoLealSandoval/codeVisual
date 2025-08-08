// frontend/src/utils/subscriptionHelper.ts

import Swal from 'sweetalert2';
import { useAuthStore } from '@/store';
import axios from 'axios';
import type { Router, RouteLocationNormalized } from 'vue-router';

// ✅ INTERFACES PARA SUSCRIPCIONES
export interface SubscriptionStatus {
  hasActivePlan: boolean;
  planType?: string;
  expirationDate?: string;
  isActive?: boolean;
  subscriptionId?: string;
}

export interface SubscriptionResponse {
  status: number;
  data: {
    id: string;
    email: string;
    name: string;
    active: boolean;
    planType: string;
    expirationDate?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const subscriptionHelper = {
  
  /**
   * ✅ Verificar si se debe validar suscripción
   * Solo validar si el usuario está en el panel profesional
   */
  shouldCheckSubscription(route: RouteLocationNormalized, user: any): boolean {
    return user && 
           user.role === 'USER_PARTNER' && 
           route.name === 'paneluser';
  },
  
  /**
   * ✅ Verificar el estado de suscripción del usuario CONECTANDO CON TU API REAL
   */
  async checkUserSubscription(userId: string): Promise<SubscriptionStatus> {
    try {
      // ✅ CONEXIÓN REAL CON TU API DE SUSCRIPCIONES
      const response = await axios.get<SubscriptionResponse>(`/email/subscriptions/user/${userId}`);
      
      if (response.data.status === 200 && response.data.data) {
        const subscription = response.data.data;
        
        // Verificar si la suscripción está activa y no ha expirado
        const isActive = subscription.active;
        const hasNotExpired = subscription.expirationDate 
          ? new Date(subscription.expirationDate) > new Date() 
          : true;
        
        return {
          hasActivePlan: isActive && hasNotExpired,
          planType: subscription.planType || 'Básico',
          expirationDate: subscription.expirationDate,
          isActive: subscription.active,
          subscriptionId: subscription.id
        };
      }
      
      // Si no se encuentra suscripción, asumir plan gratuito
      return { hasActivePlan: false };
      
    } catch (error: any) {
      console.error('Error verificando suscripción:', error);
      
      // Si es error 404 (usuario sin suscripción), no es un error crítico
      if (error.response?.status === 404) {
        return { hasActivePlan: false };
      }
      
      // Para otros errores, asumir que no tiene plan activo por seguridad
      return { hasActivePlan: false };
    }
  },

  /**
   * ✅ Verificar suscripción por email (alternativo)
   */
  async checkUserSubscriptionByEmail(email: string): Promise<SubscriptionStatus> {
    try {
      const response = await axios.get<SubscriptionResponse>(`/email/subscriptions/email/${email}`);
      
      if (response.data.status === 200 && response.data.data) {
        const subscription = response.data.data;
        
        const isActive = subscription.active;
        const hasNotExpired = subscription.expirationDate 
          ? new Date(subscription.expirationDate) > new Date() 
          : true;
        
        return {
          hasActivePlan: isActive && hasNotExpired,
          planType: subscription.planType || 'Básico',
          expirationDate: subscription.expirationDate,
          isActive: subscription.active,
          subscriptionId: subscription.id
        };
      }
      
      return { hasActivePlan: false };
      
    } catch (error) {
      console.error('Error verificando suscripción por email:', error);
      return { hasActivePlan: false };
    }
  },

  /**
   * ✅ Crear nueva suscripción
   */
  async createSubscription(email: string, name: string, planType: string = 'PROFESIONAL'): Promise<boolean> {
    try {
      const response = await axios.post('/email/subscriptions', {
        email,
        name,
        planType
      });
      
      return response.data.status === 200;
    } catch (error) {
      console.error('Error creando suscripción:', error);
      return false;
    }
  },

  /**
   * ✅ Actualizar suscripción existente
   */
  async updateSubscription(subscriptionId: string, email: string, name: string): Promise<boolean> {
    try {
      const response = await axios.put(`/email/subscriptions/${subscriptionId}`, {
        email,
        name
      });
      
      return response.data.status === 200;
    } catch (error) {
      console.error('Error actualizando suscripción:', error);
      return false;
    }
  },

  /**
   * ✅ Cancelar suscripción
   */
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const response = await axios.delete(`/email/subscriptions/${subscriptionId}`);
      return response.data.status === 200;
    } catch (error) {
      console.error('Error cancelando suscripción:', error);
      return false;
    }
  },
  
  /**
   * ✅ Mostrar modal de suscripción de forma no invasiva
   * Permite al usuario elegir qué hacer sin bloquear la navegación
   */
  async showSubscriptionPrompt(router: Router): Promise<'plans' | 'continue' | 'logout'> {
    const result = await Swal.fire({
      title: 'Plan Profesional Requerido',
      html: `
        <div class="text-left">
          <p class="mb-4">Para acceder a todas las funcionalidades profesionales necesitas un plan activo.</p>
          <p class="mb-4"><strong>Con el Plan Profesional puedes:</strong></p>
          <ul class="text-sm text-gray-600 mb-4 list-disc list-inside">
            <li>Gestionar citas ilimitadas</li>
            <li>Crear múltiples horarios personalizados</li>
            <li>Acceder a reportes avanzados y estadísticas</li>
            <li>Gestionar base de datos completa de pacientes</li>
            <li>Recibir notificaciones en tiempo real</li>
            <li>Sistema de facturación automático</li>
            <li>Recordatorios automáticos para pacientes</li>
            <li>Soporte prioritario 24/7</li>
          </ul>
          <div class="bg-blue-50 p-4 rounded-lg mb-4">
            <p class="text-blue-800 font-semibold">💡 Oferta especial: ¡Primer mes 50% de descuento!</p>
          </div>
          <p class="font-medium">¿Qué deseas hacer?</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: '🚀 Ver Planes y Precios',
      denyButtonText: '⚡ Continuar con Acceso Limitado',
      cancelButtonText: '🚪 Cerrar Sesión',
      allowOutsideClick: true,
      allowEscapeKey: true,
      reverseButtons: true,
      customClass: {
        popup: 'swal2-popup-large',
        confirmButton: 'swal2-confirm-custom',
        denyButton: 'swal2-deny-custom',
        cancelButton: 'swal2-cancel-custom'
      },
      didOpen: () => {
        // Aplicar estilos personalizados
        const style = document.createElement('style');
        style.textContent = `
          .swal2-popup-large { width: 600px !important; }
          .swal2-confirm-custom { background-color: #2563eb !important; }
          .swal2-deny-custom { background-color: #6b7280 !important; }
          .swal2-cancel-custom { background-color: #dc2626 !important; }
        `;
        document.head.appendChild(style);
      }
    });

    if (result.isConfirmed) {
      router.push('/planes');
      return 'plans';
    } else if (result.isDenied) {
      // Mostrar mensaje de confirmación para modo limitado
      await Swal.fire({
        title: 'Modo Limitado Activado',
        text: 'Puedes usar las funciones básicas. ¡Actualiza cuando estés listo para más funcionalidades!',
        icon: 'info',
        timer: 3000,
        showConfirmButton: false
      });
      return 'continue';
    } else {
      return 'logout';
    }
  },
  
  /**
   * ✅ Verificar si el usuario puede acceder a una funcionalidad específica
   */
  canAccessFeature(featureName: string, subscriptionStatus: SubscriptionStatus): boolean {
    if (!subscriptionStatus.hasActivePlan) {
      // Funcionalidades disponibles sin plan (modo limitado)
      const freeFeatures = [
        'profile_view',
        'basic_profile_edit',
        'view_appointments', // Solo ver, no gestionar
        'limited_schedule_view',
        'basic_notifications',
        'dashboard_view',
        'settings_basic'
      ];
      
      return freeFeatures.includes(featureName);
    }
    
    // Con plan activo, acceso completo a todas las funcionalidades
    return true;
  },
  
  /**
   * ✅ Mostrar mensaje de funcionalidad limitada
   */
  showFeatureLimitedMessage(featureName: string): void {
    const featureMessages: Record<string, { title: string, description: string }> = {
      'schedule_management': {
        title: 'Gestión Avanzada de Horarios',
        description: 'Crea horarios personalizados, gestiona múltiples consultorios y automatiza tu agenda.'
      },
      'appointment_creation': {
        title: 'Gestión Completa de Citas',
        description: 'Crea, edita y gestiona citas con herramientas avanzadas de programación.'
      },
      'reports': {
        title: 'Reportes y Estadísticas',
        description: 'Accede a análisis detallados de tu práctica médica y reportes financieros.'
      },
      'notifications': {
        title: 'Notificaciones Avanzadas',
        description: 'Recibe notificaciones en tiempo real y configura recordatorios automáticos.'
      },
      'multiple_offices': {
        title: 'Múltiples Consultorios',
        description: 'Gestiona varios consultorios desde una sola plataforma.'
      },
      'patient_management': {
        title: 'Base de Datos de Pacientes',
        description: 'Mantén registros completos de todos tus pacientes con historiales médicos.'
      },
      'billing': {
        title: 'Sistema de Facturación',
        description: 'Genera facturas automáticas y rastrea pagos de manera eficiente.'
      }
    };

    const feature = featureMessages[featureName] || {
      title: 'Funcionalidad Profesional',
      description: 'Esta funcionalidad avanzada está disponible con el Plan Profesional.'
    };

    Swal.fire({
      title: `🔒 ${feature.title}`,
      html: `
        <div class="text-left">
          <p class="mb-4">${feature.description}</p>
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-amber-800 mb-2">💡 ¿Por qué actualizar?</h4>
            <ul class="text-sm text-amber-700 list-disc list-inside space-y-1">
              <li>Aumenta tu productividad</li>
              <li>Mejora la experiencia de tus pacientes</li>
              <li>Optimiza tus procesos médicos</li>
              <li>Accede a herramientas profesionales</li>
            </ul>
          </div>
          <p class="text-center text-gray-600">
            <strong>Oferta especial:</strong> ¡Primer mes con 50% de descuento!
          </p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: '🚀 Ver Planes',
      showCancelButton: true,
      cancelButtonText: '⚡ Continuar sin esta función',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        window.open('/planes', '_blank');
      }
    });
  },
  
  /**
   * ✅ Logout seguro
   */
  async logout(router: Router): Promise<void> {
    const authStore = useAuthStore();
    
    try {
      await authStore.close_session();
      router.push('/auth-professional');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar logout local
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/auth-professional');
    }
  },
  
  /**
   * ✅ Obtener texto descriptivo del estado de suscripción
   */
  getSubscriptionStatusText(subscriptionStatus: SubscriptionStatus): string {
    if (!subscriptionStatus.hasActivePlan) {
      return 'Plan Gratuito - Acceso limitado';
    }
    
    const planTypeText = subscriptionStatus.planType || 'Profesional';
    const expirationText = subscriptionStatus.expirationDate 
      ? ` (vence ${new Date(subscriptionStatus.expirationDate).toLocaleDateString('es-CO')})`
      : '';
    
    return `Plan ${planTypeText} activo${expirationText}`;
  },

  /**
   * ✅ Formatear fecha de expiración
   */
  formatExpirationDate(date: string): string {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * ✅ Verificar si la suscripción está próxima a vencer (30 días)
   */
  isSubscriptionExpiringSoon(subscriptionStatus: SubscriptionStatus): boolean {
    if (!subscriptionStatus.expirationDate) return false;
    
    const expirationDate = new Date(subscriptionStatus.expirationDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return expirationDate <= thirtyDaysFromNow;
  },

  /**
   * ✅ Mostrar notificación de renovación próxima
   */
  showRenewalNotification(subscriptionStatus: SubscriptionStatus): void {
    if (!this.isSubscriptionExpiringSoon(subscriptionStatus)) return;
    
    const daysUntilExpiration = Math.ceil(
      (new Date(subscriptionStatus.expirationDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    Swal.fire({
      title: '⏰ Renovación Próxima',
      html: `
        <p>Tu Plan ${subscriptionStatus.planType} vence en <strong>${daysUntilExpiration} días</strong>.</p>
        <p>Renueva ahora para mantener acceso a todas las funcionalidades profesionales.</p>
      `,
      icon: 'warning',
      confirmButtonText: 'Renovar Ahora',
      showCancelButton: true,
      cancelButtonText: 'Recordar Más Tarde'
    }).then((result) => {
      if (result.isConfirmed) {
        window.open('/planes', '_blank');
      }
    });
  }
};

/**
 * ✅ Composable para usar en componentes Vue
 */
export const useSubscription = () => {
  const checkAndHandleSubscription = async (
    route: RouteLocationNormalized, 
    router: Router, 
    user: any
  ): Promise<boolean> => {
    
    // Solo verificar si es necesario
    if (!subscriptionHelper.shouldCheckSubscription(route, user)) {
      return true; // Permitir acceso sin verificar
    }
    
    try {
      // Verificar suscripción usando ID o email del usuario
      const subscriptionStatus = user.id 
        ? await subscriptionHelper.checkUserSubscription(user.id)
        : await subscriptionHelper.checkUserSubscriptionByEmail(user.email);
      
      // Verificar si está próximo a vencer
      if (subscriptionStatus.hasActivePlan) {
        subscriptionHelper.showRenewalNotification(subscriptionStatus);
      }
      
      if (!subscriptionStatus.hasActivePlan) {
        const userChoice = await subscriptionHelper.showSubscriptionPrompt(router);
        
        if (userChoice === 'logout') {
          await subscriptionHelper.logout(router);
          return false;
        } else if (userChoice === 'plans') {
          return false; // Se redirigió a planes
        }
        // Si eligió 'continue', permitir acceso limitado
      }
      
      return true;
    } catch (error) {
      console.error('Error en verificación de suscripción:', error);
      // En caso de error, permitir acceso limitado
      return true;
    }
  };
  
  return {
    checkAndHandleSubscription,
    canAccessFeature: subscriptionHelper.canAccessFeature,
    showFeatureLimitedMessage: subscriptionHelper.showFeatureLimitedMessage,
    getSubscriptionStatusText: subscriptionHelper.getSubscriptionStatusText,
    checkUserSubscription: subscriptionHelper.checkUserSubscription,
    checkUserSubscriptionByEmail: subscriptionHelper.checkUserSubscriptionByEmail,
    createSubscription: subscriptionHelper.createSubscription,
    updateSubscription: subscriptionHelper.updateSubscription,
    cancelSubscription: subscriptionHelper.cancelSubscription
  };
};