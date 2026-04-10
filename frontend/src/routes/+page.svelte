<script lang="ts">
  import { Shield, Activity, BarChart3, Lock, Info } from 'lucide-svelte';
  import { base } from '$app/paths';
</script>

<div
  class="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 text-center"
>
  <div class="mb-8 inline-block animate-pulse rounded-full bg-blue-50 p-4 text-[#1a237e]">
    <Shield size={64} />
  </div>

  <h1 class="mb-6 text-6xl font-black tracking-tight text-[#1a237e] uppercase">SoberGuard</h1>
  <p class="mb-12 max-w-2xl text-xl leading-relaxed text-gray-600">
    Professional real-time alcohol monitoring for high-safety environments. Powered by MQ135
    sensors, ESP8266 connectivity, and advanced data visualization.
  </p>

  <div class="flex flex-wrap justify-center gap-6">
    <a href="{base}/signup" class="btn-primary flex items-center gap-2 px-10 py-4 text-lg">
      Get Started <Activity size={20} />
    </a>
    <a href="{base}/about" class="btn-outline flex items-center gap-2 px-10 py-4 text-lg">
      Learn More <Info size={20} />
    </a>
  </div>

  <div class="mt-24 grid w-full grid-cols-1 gap-8 md:grid-cols-3">
    <div class="card-material group transition-shadow hover:shadow-xl">
      <div
        class="mb-4 flex justify-center text-[#1a237e] transition-transform group-hover:scale-110"
      >
        <Activity size={40} />
      </div>
      <h3 class="mb-3 text-xl font-bold text-gray-800">Real-time Data</h3>
      <p class="leading-relaxed text-gray-500">
        Experience sub-second latency with our high-performance WebSocket architecture.
      </p>
    </div>

    <div class="card-material group transition-shadow hover:shadow-xl">
      <div
        class="mb-4 flex justify-center text-[#1a237e] transition-transform group-hover:scale-110"
      >
        <BarChart3 size={40} />
      </div>
      <h3 class="mb-3 text-xl font-bold text-gray-800">Advanced Analytics</h3>
      <p class="leading-relaxed text-gray-500">
        Visualise historical trends and statistical deviations with integrated charting tools.
      </p>
    </div>

    <div class="card-material group transition-shadow hover:shadow-xl">
      <div
        class="mb-4 flex justify-center text-[#1a237e] transition-transform group-hover:scale-110"
      >
        <Lock size={40} />
      </div>
      <h3 class="mb-3 text-xl font-bold text-gray-800">Secure by Design</h3>
      <p class="leading-relaxed text-gray-500">
        Enterprise-grade JWT authentication and secure MongoDB storage for your sensitive data.
      </p>
    </div>
  </div>
</div>
