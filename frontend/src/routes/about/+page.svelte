<script lang="ts">
  import { Cpu, Database, Globe } from 'lucide-svelte';
</script>

<div class="mx-auto max-w-4xl py-12">
  <div class="mb-16 text-center">
    <h1 class="mb-6 text-5xl font-black tracking-tighter text-[#1a237e] uppercase">
      About SoberGuard
    </h1>
    <p class="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600">
      A cutting-edge solution for real-time monitoring of environmental alcohol levels, designed for
      safety-critical workplaces.
    </p>
  </div>

  <div class="space-y-12">
    <section class="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div>
        <h2 class="mb-4 flex items-center gap-3 text-3xl font-bold text-gray-800">
          <Cpu class="text-[#1a237e]" /> Hardware Layer
        </h2>
        <p class="text-lg leading-relaxed text-gray-600">
          At the core of our system is the <strong>ESP8266</strong> microcontroller paired with the
          <strong>MQ135</strong> air quality and alcohol sensor. This compact hardware captures analog
          data and transmits it securely via WiFi to our cloud services.
        </p>
      </div>
      <div class="card-material flex justify-center border-blue-100 bg-blue-50/50 py-12">
        <Cpu size={120} class="text-[#1a237e] opacity-20" />
      </div>
    </section>

    <section class="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:flex-row-reverse">
      <div
        class="card-material order-2 flex justify-center border-blue-100 bg-blue-50/50 py-12 md:order-1"
      >
        <Database size={120} class="text-[#1a237e] opacity-20" />
      </div>
      <div class="order-1 md:order-2">
        <h2 class="mb-4 flex items-center gap-3 text-3xl font-bold text-gray-800">
          <Database class="text-[#1a237e]" /> Software Stack
        </h2>
        <p class="text-lg leading-relaxed text-gray-600">
          We use <strong>Bun + ElysiaJS</strong> for a blazing-fast backend and
          <strong>SvelteKit</strong> for a responsive, material-inspired user interface. All data is
          persisted in a scalable <strong>MongoDB</strong> NoSQL database.
        </p>
      </div>
    </section>

    <section class="pt-12 text-center">
      <div class="card-material border-2 border-[#1a237e]/10 py-10">
        <Globe size={48} class="mx-auto mb-6 text-[#1a237e]" />
        <h2 class="mb-4 text-3xl font-bold text-gray-800">Our Mission</h2>
        <p class="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
          To provide an accessible, high-performance monitoring platform that empowers organizations
          to maintain a safe and sober environment through data-driven insights.
        </p>
      </div>
    </section>
  </div>
</div>
