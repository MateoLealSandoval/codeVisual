<script setup lang="ts">
import { computed } from 'vue'

// ✅ Props corregidas para TypeScript
interface Props {
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'var(--blue-1)' // Color por defecto
})

// ✅ Estilos computados
const footerStyle = computed(() => ({
  backgroundColor: props.color,
  color: 'white'
}))
</script>

<template>
  <footer class="w-full py-8 mt-auto" :style="footerStyle">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <!-- Logo y descripción -->
        <div class="md:col-span-1">
          <h3 class="text-xl font-bold mb-4">DocVisual</h3>
          <p class="text-sm opacity-90">
            Plataforma líder en salud visual que conecta especialistas con pacientes de manera eficiente y profesional.
          </p>
        </div>

        <!-- Enlaces rápidos -->
        <div>
          <h4 class="font-semibold mb-3">Enlaces Rápidos</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/specialists" class="opacity-90 hover:opacity-100 transition-opacity">Especialistas</router-link></li>
            <li><router-link to="/questions" class="opacity-90 hover:opacity-100 transition-opacity">Preguntas Frecuentes</router-link></li>
            <li><router-link to="/blogs" class="opacity-90 hover:opacity-100 transition-opacity">Blog</router-link></li>
            <li><router-link to="/contact" class="opacity-90 hover:opacity-100 transition-opacity">Contacto</router-link></li>
          </ul>
        </div>

        <!-- Servicios -->
        <div>
          <h4 class="font-semibold mb-3">Servicios</h4>
          <ul class="space-y-2 text-sm">
            <li><span class="opacity-90">Oftalmología</span></li>
            <li><span class="opacity-90">Optometría</span></li>
            <li><span class="opacity-90">Terapia Visual</span></li>
            <li><span class="opacity-90">Cirugía Refractiva</span></li>
          </ul>
        </div>

        <!-- Contacto -->
        <div>
          <h4 class="font-semibold mb-3">Contacto</h4>
          <div class="space-y-2 text-sm">
            <p class="opacity-90">📧 hola@docvisual.co</p>
            <p class="opacity-90">📱 +57 300 123 4567</p>
            <p class="opacity-90">📍 Bogotá, Colombia</p>
            <div class="flex space-x-3 mt-4">
              <a href="#" class="opacity-90 hover:opacity-100 transition-opacity">
                <span class="sr-only">Facebook</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="opacity-90 hover:opacity-100 transition-opacity">
                <span class="sr-only">Instagram</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.948 4.615c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm2.931 8.847c-.74-1.418-.188-3.185 1.228-3.946 1.417-.761 3.173-.229 3.946 1.227.774 1.457.246 3.209-1.227 3.946-1.456.737-3.184.184-3.947-1.227z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <hr class="my-6 border-white/20">

      <!-- Copyright -->
      <div class="flex flex-col md:flex-row justify-between items-center text-sm">
        <p class="opacity-90">
          © {{ new Date().getFullYear() }} DocVisual. Todos los derechos reservados.
        </p>
        <div class="flex space-x-4 mt-4 md:mt-0">
          <router-link to="/terms" class="opacity-90 hover:opacity-100 transition-opacity">
            Términos y Condiciones
          </router-link>
          <router-link to="/data" class="opacity-90 hover:opacity-100 transition-opacity">
            Política de Privacidad
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.transition-opacity {
  transition: opacity 0.2s ease;
}
</style>