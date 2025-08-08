import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home/Home.vue'
import Frecuent_questions from '@/views/Frequent_questions/Frecuent_questions.vue';
import Blog from '@/views/Blogs/Blog.vue';
import Blog_Detail from '@/Modules/Blogs/Blog_Detail.vue';
import Auth from '@/views/Auth/Auth.vue';
import AuthPartner from '@/views/AuthPartner/AuthPartner.vue';
import Specialists from '@/views/specialists/Specialists.vue';
import SpecialistDetail from '@/Modules/Specialists/SpecialistDetail.vue';
import Purpose from '@/views/Purpose/Purpose.vue';
import Price from '@/views/Price/Price.vue';
import panel_user_Professional from '@/views/Panel_User_Professional/panel_user.vue';
import Panel_user from '@/views/Panel_user/My_account.vue';
import Contact from '@/views/contact/Contact.vue';
import { useAuthStore } from '@/store';
import Payment from '@/views/Payment/Payment.vue';
import Token_User from '@/Modules/confirm_tokens/Token_User.vue';
import terms from '@/views/terms/Terms.vue';
import data from '@/views/terms/data.vue';
import Reset_Password from '@/Modules/reset_password/Reset_Password.vue';
import Confirmation from '@/Modules/confirmation/Confirmation.vue';
import PanelAdmin from '@/views/panelAdmin/PanelAdmin.vue';
import Services from '@/views/services/Services.vue';
import adminProfessionals from '@/views/Admin/AdminProfessionals.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const route = import.meta.env.BASE_URL || "http://localhost:8080";
<<<<<<< HEAD
=======

// Función para verificar estado de pago
async function checkPaymentStatus(userId: string): Promise<boolean> {
  try {
    const response = await axios.get(`/users/payment-status/${userId}`);
    return response.data.hasPaid && response.data.isActive;
  } catch (error) {
    console.error('Error verificando estado de pago:', error);
    return false;
  }
}
>>>>>>> parent of f9f57ec (.)

const router = createRouter({
  history: createWebHistory(route),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/terms',
      name: 'terms',
      component: terms
    },
    {
      path: '/data',
      name: 'data',
      component: data
    },
    {
      path: '/questions',
      name: 'questions',
      component: Frecuent_questions,
    },
    {
      path: '/createuser/:token',
      name: 'createuser',
      component: Token_User,
    },
    {
      path: '/reset/:token',
      name: 'reset',
      component: Reset_Password,
    },
    {
      path: '/confirmacion',
      name: 'confirmacion',
      component: Confirmation
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: Blog,
    },
    {
      path: '/blogs/:id',
      name: 'BlogDetail',
      component: Blog_Detail,
      props: true
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
    },
    {
      path: '/auth-professional',
      name: 'authParthner',
      component: AuthPartner,
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/specialists',
      name: 'specialists',
      component: Specialists,
<<<<<<< HEAD
    }, 
=======
    },
>>>>>>> parent of f9f57ec (.)
    {
      path: '/specialist/:id',
      name: 'specialistdetail',
      component: SpecialistDetail,
      props: true
<<<<<<< HEAD
    }, 
=======
    },
>>>>>>> parent of f9f57ec (.)
    {
      path: '/planes',
      name: 'planes',
      component: Price
<<<<<<< HEAD
    }, 
=======
    },
>>>>>>> parent of f9f57ec (.)
    {
      path: '/purpose',
      name: 'purpose',
      component: Purpose
    },
    {
      path: '/paneluser',
      name: 'paneluser',
      component: panel_user_Professional,
      meta: { requiresAuth: true, requiresPartner: true }
    },
    {
      path: '/paneladmin',
      name: 'paneladmin',
      component: PanelAdmin,
      meta: { requiresAdmin: true, requiresAuth: true }
    },
    {
      path: '/accountuser',
      name: 'accountuser',
      component: Panel_user,
      meta: { requiresAuth: true }
    },
    {
      path: '/payment',
      name: 'payment',
      component: Payment
    },
    {
      path: '/services',
      name: 'services',
      component: Services
    },
    {
      path: '/admin/profesionales',
      name: 'adminProfessionals',
      component: adminProfessionals,
      meta: { requiresAdmin: true, requiresAuth: true }
    }
  ],
})

<<<<<<< HEAD
// ✅ ROUTER GUARD MEJORADO - SIN VALIDACIÓN DE PLANES EN AUTENTICACIÓN
router.beforeEach((to, from, next) => {
=======
router.beforeEach(async (to, from, next) => {
>>>>>>> parent of f9f57ec (.)
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;
  const role = authStore.user?.role;

  // 🔒 Si no está autenticado y la ruta requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next("/auth");
  }

  // 🛡️ Verificación de roles para rutas administrativas
  if (to.meta.requiresAdmin && !(role === "SUPER_ADMIN" || role === "ADMIN")) {
    await Swal.fire({
      icon: 'error',
      title: 'Acceso Denegado',
      text: 'No tienes permisos para acceder a esta sección',
      confirmButtonText: 'OK'
    });
    return next("/");
  }

<<<<<<< HEAD
  // 🧭 Si va a /auth y ya está autenticado → redirigir al panel según el rol
  // ✅ MODIFICACIÓN: Permitir redirección inmediata sin validar planes
  if (to.name === "auth" && isAuthenticated) {
    if (role === "USER") return next("/accountuser");
    if (role === "USER_PARTNER") return next("/paneluser");
    if (role === "ADMIN" || role === "SUPER_ADMIN") return next("/paneladmin");
  }

  // ✅ MODIFICACIÓN: Permitir acceso a auth-professional sin validar planes
  if (to.name === "authParthner" && isAuthenticated) {
    if (role === "USER") return next("/accountuser");
    if (role === "USER_PARTNER") return next("/paneluser");
    if (role === "ADMIN" || role === "SUPER_ADMIN") return next("/paneladmin");
  }

  // ✅ NUEVO: Solo permitir validación de planes DENTRO del panel, no en la navegación
  // El componente panel_user_Professional se encargará de manejar la validación de planes
  // después de que el usuario esté completamente autenticado y dentro del panel

=======
  // 🔐 Verificación específica para panel de administración
  if (to.name === "paneladmin" && !(role === "SUPER_ADMIN" || role === "ADMIN")) {
    await Swal.fire({
      icon: 'error',
      title: 'Acceso Denegado',
      text: 'Solo administradores pueden acceder al panel de administración',
      confirmButtonText: 'OK'
    });
    return next("/");
  }

  // 🔐 Verificación para administración de profesionales
  if (to.name === "adminProfessionals" && !(role === "SUPER_ADMIN" || role === "ADMIN")) {
    await Swal.fire({
      icon: 'error',
      title: 'Acceso Denegado',
      text: 'Solo administradores pueden gestionar profesionales',
      confirmButtonText: 'OK'
    });
    return next("/");
  }

  // 🧭 Redirección para usuarios ya autenticados que van a páginas de auth
  if (to.name === "auth" && isAuthenticated) {
    switch (role) {
      case "USER":
        return next("/accountuser");
      case "USER_PARTNER":
        return next("/paneluser");
      case "ADMIN":
      case "SUPER_ADMIN":
        return next("/paneladmin");
      default:
        return next("/");
    }
  }

  // 🧭 Redirección para usuarios ya autenticados que van a auth-professional
  if (to.name === "authParthner" && isAuthenticated) {
    switch (role) {
      case "USER":
        return next("/accountuser");
      case "USER_PARTNER":
        return next("/paneluser");
      case "ADMIN":
      case "SUPER_ADMIN":
        return next("/paneladmin");
      default:
        return next("/");
    }
  }

  // 💳 Verificación de estado de pago para partners (opcional)
  if (to.meta.requiresPartner && role === "USER_PARTNER") {
    try {
      const hasValidPayment = await checkPaymentStatus(authStore.user?.id);
      if (!hasValidPayment) {
        await Swal.fire({
          icon: 'warning',
          title: 'Plan Requerido',
          text: 'Necesitas un plan activo para acceder a esta funcionalidad',
          confirmButtonText: 'Ver Planes',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            return next("/planes");
          } else {
            return next("/accountuser");
          }
        });
        return;
      }
    } catch (error) {
      console.error('Error verificando estado de pago:', error);
      // En caso de error, permitir el acceso pero mostrar advertencia
      console.warn('No se pudo verificar el estado de pago, permitiendo acceso');
    }
  }
  
  // ✅ Si pasa todas las validaciones, continuar
>>>>>>> parent of f9f57ec (.)
  next();
});

// 🔄 Interceptor para manejar errores de autenticación globalmente
router.afterEach((to, from, failure) => {
  if (failure) {
    console.error('Error de navegación:', failure);
  }
});

export default router