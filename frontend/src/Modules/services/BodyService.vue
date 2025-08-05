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
                <h1 class="text-[var(--blue-1)] text-xl">Soluciones que transforman tu marca</h1>
                <h1 class="font-bold text-xl">Estamos aquí para ayudarte con tu marca personal
                </h1>
            </div>
        </div>
        <div class="container m-auto flex flex-wrap font-poppins justify-between px-8  pb-10">

            <div class="w-full md:w-[30%]    ">



                <hr class="w-[80%] mx-auto border-t-8 border-[var(--blue-1)] " />
                <div class="w-full border rounded-2xl text-center flex flex-col h-full">
                    <!-- contenido -->
                    <div class="w-[90%] mx-auto flex-grow">
                        <h1 class="mt-10 text-xl lg:text-3xl font-bold text-[var(--blue-1)] ">Starter</h1>
                        <h2 class="text-3xl  lg:text-5xl font-bold text-gray-600">$ 2.385.000</h2>
                        <p class="text-gray-400">mensuales + IVA </p>
                        <div class="mb-2">
                            <h1 class="my-3 text-[14px]">Salud visual y especialistas Proposito Recursos Agende su cita
                                Profesionales Pacientes Inhouse Blog Preguntas frecuentes
                                Soluciones que transforman tu marca
                                Estamos aquí para ayudarte con tu marca personal
                                2025 DocVisual® Todos los derechos reservados
                                Starter
                                $ 2.385.000
                                8 piezas gráficas
                                personalizadas - (Versión
                                Post e Historias), alineadas
                                con la identidad de marca (
                                Colores, tipografía y estilo).</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>

                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3 ">2 Vídeos promocionales o
                                Reels - Duración: De 30 sg a 3
                                min (El profesional envía el
                                material grabado y en
                                ICÓNICA se edita)</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Manejo de redes sociales
                                (Instagram)
                                Optimización de redes
                                sociales
                                Parrilla de contenido
                                (organización y planificación
                                para subir contenido gráfico y
                                audiovisual en las R.R.S.S.)</h1>
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
                        <h1 class="mt-10 text-xl lg:text-3xl font-bold text-amber-500 ">Plus</h1>
                        <h2 class="text-3xl  lg:text-5xl font-bold text-gray-600">$ 3.115.000</h2>
                        <p class="text-gray-400">mensuales (IVA incluido) </p>
                        <div class="mb-2">
                            <h1 class="my-3 text-[14px]">10 piezas gráficas
                                personalizadas - (Versión
                                Post e Historias), alineadas
                                con la identidad de marca (
                                Colores, tipografía y estilo).</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>

                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">3 Vídeos promocionales o
                                Reels - Duración: De 30 sg a 3
                                min (El profesional envía el
                                material grabado y en
                                ICÓNICA se edita)</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Manejo de redes sociales
                                (Instagram y Facebook)
                                Optimización de redes
                                sociales
                                Parrilla de contenido
                                (organización y planificación
                                para subir contenido gráfico y
                                audiovisual en las R.R.S.S.)</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Diseño de una landing page
                                con el objetivo de captuar
                                lead en campañas</h1>
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
                        <h1 class="mt-10 text-xl lg:text-3xl font-bold text-green-500 ">VIP</h1>
                        <h2 class="text-3xl  lg:text-5xl font-bold text-gray-600">$3.945.000</h2>
			<p class="text-gray-400">mensuales (IVA incluido)</p>
                        <div class="mb-2">
                            <h1 class="my-3 text-[14px]">12 piezas gráficas
                                personalizadas - (Versión
                                Post e Historias), alineadas
                                con la identidad de marca (
                                Colores, tipografía y estilo).</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>

                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">4 Vídeos promocionales o
                                Reels - Duración: De 30 sg a 3
                                min (El profesional envía el
                                material grabado y en
                                ICÓNICA se edita)</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Manejo de redes sociales
                                (Linkedln o Tiktok)
                                Optimización de redes
                                sociales
                                Parrilla de contenido
                                (organización y planificación
                                para subir contenido gráfico y
                                audiovisual en las R.R.S.S.)</h1>
                            <hr class="w-[70%] mx-auto  border-t-2  border-[var(--blue-1)] mb-3" />
                        </div>
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">1 Diseño de una landing page
                                con el objetivo de captuar
                                lead en campañas</h1>
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
	    <h1 class="text-center mt-10 text-xl lg:text-3xl font-bold text-[var(--blue-1)]">Personalizado</h1>
            <h1 class="w-full text-center">
                Si alguno de los paquetes no es lo que estas buscando y necesitas algo mas personalizado,
                CONTÁCTANOS al
                <span>
                    <a href="https://wa.me/573124967421" target="_blank" rel="noopener noreferrer"
                        class="text-[var(--blue-3)] hover:underline">
                        312 4967421
                    </a>
                </span>
            </h1>

            <h1 class="text-center">
                y una persona del equipo se pondra en contacto contigo para
                poder orientarte y ofrecerte una solución a la medida.
            </h1>
            <div class=" origin-center mt-10 text-[var(--blue-1)]">
                <h1 class="w-full text-center">Consulta las condiciones de los planes DOCVISUAL.
                </h1>
                <h1 class="w-full text-center">Contrato mínimo 3 meses para lograr resultados.</h1>
            </div>
            <h1 class="w-full text-center mt-10 text-[var(--blue-1)] cursor-pointer" @click="goToTerms">Consulta las
                condiciones de los planes DOCVISUAL</h1>
        </div>
    </div>
</template>
