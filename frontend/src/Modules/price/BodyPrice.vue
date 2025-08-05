<script setup lang="ts">
import EpaycoComponent from '@/components/EpaycoComponent.vue';
const goToTerms = () => {
    window.open('/terms', '_blank');
};

</script>
<template>
    <div class="w-screen bg-gradient-to-r from-gray-100 to-gray-50 font-poppins text-xs lg:text-base ">
        <div class="container m-auto max-w-[90%]">
            <div class="text-center py-18">
                <h1 class="text-[var(--blue-1)]">Elige el plan ideal para lograr tus objetivos</h1>
                <h1 class="font-bold text-xl">Recuerda que para crear tu cuenta profesional, debes adquirir tu plan.
                </h1>
            </div>
        </div>
        <div class="container m-auto flex flex-wrap font-poppins justify-between px-8  pb-10">

            <div class="w-full md:w-[30%]    ">



                <hr class="w-[80%] mx-auto border-t-8 border-[var(--blue-1)] " />
                <div class="w-full border rounded-2xl text-center flex flex-col h-full">
                    <!-- contenido -->
                    <div class="w-[90%] mx-auto flex-grow">
                        <h1 class="mt-10 text-xl lg:text-3xl font-bold text-[var(--blue-1)] ">Básico</h1>
                        <h2 class="text-3xl  lg:text-5xl font-bold text-gray-600">178.500 COP</h2>
			<p class="text-gray-400">mensuales (IVA incluido)</p>
                        <div class="mb-2">
                            <h1 class="my-3 text-[14px]">Gana visibilidad con reservas
                                online y recordatorios</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>

                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3 ">Perfil general con
                                especialidad, servicios,
                                productos y campos de
                                acción.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Consulta de ubicación;
                                horarios.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Agendamiento de cita y
                                consultas generales.
                                (Ubicación, especialidad,
                                precios)</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Recordatorios automáticos.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Perfil para consultar
                                (Notificaciones, valoraciones
                                por parte de pacientes,
                                agenda).</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3"> Campañas en Google Ads.
                                Soporte técnico.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>


                    </div>
                    <div class="w-[80%]   mx-auto rounded-xl mb-5">
                        <EpaycoComponent amount="1071000" name="Plan BÁSICO" description="Plan BÁSICO" />
                    </div>
                </div>

            </div>

            <div class="w-full md:w-[30%] mb-2 min-h-[70vh]   ">



                <hr class="w-[80%] mx-auto border-t-8 border-amber-500 " />
                <div class="w-full border rounded-2xl text-center flex flex-col h-full">
                    <!-- contenido -->
                    <div class="w-[90%] mx-auto flex-grow">
                        <h1 class="mt-10 text-xl lg:text-3xl font-bold text-amber-500 ">Estándar</h1>
                        <h2 class="text-3xl  lg:text-5xl font-bold text-gray-600">214.200 COP</h2>
			<p class="text-gray-400">mensuales (IVA incluido)</p>
                        <div class="mb-2">
                            <h1 class="my-3 text-[14px]">Ofrece una excelente
                                experiencia al paciente y crea
                                clientes fidelizados</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>

                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Todo lo que inluye el plan
                                BASICO más:</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Conexión a las Redes Sociales
                                y a la página web.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Conexión con Whatsapp para
                                coordinar cita y pago de la
                                misma en el consultorio o
                                anticipadamente.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Soporte Comercial.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">1 Capacitación en Marca
                                personal.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>

                        <!-- este bloque queda FUERA del contenido y pegado al fondo -->


                    </div>
                    <div class="w-[80%]   mx-auto rounded-xl mb-5">
                        <EpaycoComponent amount="1285200" name="Plan ESTÁNDAR" description="Plan ESTÁNDAR" />
                    </div>
                </div>

            </div>
            <div class="w-full md:w-[30%] mb-2 min-h-[70vh]  ">



                <hr class="w-[80%] mx-auto border-t-8 border-green-500 " />
                <div class="w-full border rounded-2xl text-center flex flex-col h-full">
                    <!-- contenido -->
                    <div class="w-[90%] mx-auto flex-grow">
                        <h1 class="mt-10 text-xl lg:text-3xl font-bold text-green-500 ">Premium</h1>
                        <h2 class="text-3xl  lg:text-5xl font-bold text-gray-600">297.500 COP</h2>
			<p class="text-gray-400">mensuales (IVA incluido)</p>
                        <div class="mb-2">
                            <h1 class="my-3 text-[14px]">Todo lo que inluye el plan
                                ESTÁNDAR más:
                                Participación en Block Doc
                                Visual / Videos de consulta de
                                cuidado primario.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>

                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Envíos mavisos
                                bidireccionales de nueva cita
                                y/o producto.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Publicidad en el sitio y
                                espacios especiales.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">1 Capacitación en Marca
                                personal.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">2 Capacitaciones en
                                Marketing Digital.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">1 Creación de una landing
                                page básica (No incluye
                                Hosting y Dominio).</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Apertura y/o actualización de
                                Google Business.</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>



                    </div>
                    <div class="w-[80%]   mx-auto rounded-xl mb-5">
                        <EpaycoComponent amount="1785000" name="Plan PREMIUM" description="Plan PREMIUM" />


                    </div>
                </div>

            </div>
        </div>
        <div class="w-[90%] mx-auto pb-12  ">
	    <h1 class="mt-10 text-xl lg:text-3xl font-bold text-[var(--blue-1)]">Personalizado</h1>
            <h1 class="w-full text-center">
                Si alguno de los paquetes no es lo que estas buscando y necesitas algo más personalizado,
                CONTÁCTANOS al
                <span>
                    <a href="https://wa.me/573124967421" target="_blank" rel="noopener noreferrer"
                        class="text-[var(--blue-1)] hover:underline">
                        312 4967421
                    </a>
                </span>
            </h1>

            <h1 class="text-center">
                y una persona del equipo se pondra en contacto contigo para
                poder orientarte y ofrecerte una solución a la medida.
            </h1>
            <h1 class="w-full text-center mt-10 text-[var(--blue-1)] cursor-pointer" @click="goToTerms">Consulta las
                condiciones de los planes DOCVISUAL</h1>
        </div>
    </div>
</template>
