<script lang="ts">
  import { Cpu, Database, Globe, Users, BookOpen, Layers } from 'lucide-svelte';
</script>

<svelte:head>
  <title>About | SoberGuard</title>
</svelte:head>

<div class="mx-auto max-w-4xl py-12 px-4">
  <div class="mb-16 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold uppercase tracking-wider mb-6 border border-blue-100">
      <BookOpen size={16} /> Web Technologies Project
    </div>
    <h1 class="mb-6 text-5xl font-black tracking-tighter text-[#1a237e] uppercase">
      About SoberGuard
    </h1>
    <p class="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600">
      SoberGuard is a cutting-edge real-time alcohol monitoring system developed as a core project for the 
      <span class="font-bold text-[#1a237e]">Web Technologies</span> class.
    </p>
  </div>

  <div class="space-y-16">
    <section>
      <div class="flex items-center gap-3 mb-8">
        <Users class="text-[#1a237e]" size={32} />
        <h2 class="text-3xl font-bold text-gray-800">Development Team</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card-material text-center p-6 border-t-4 border-[#1a237e]">
          <p class="font-bold text-lg text-gray-800">Pulido Sebastian</p>
        </div>
        <div class="card-material text-center p-6 border-t-4 border-[#1a237e]">
          <p class="font-bold text-lg text-gray-800">Reyes Juan Camilo</p>
        </div>
        <div class="card-material text-center p-6 border-t-4 border-[#1a237e]">
          <p class="font-bold text-lg text-gray-800">Zapata Randy Jair</p>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div>
        <h2 class="mb-4 flex items-center gap-3 text-3xl font-bold text-gray-800">
          <Globe class="text-[#1a237e]" /> The Mission
        </h2>
        <p class="text-lg leading-relaxed text-gray-600">
          Our mission is to provide an accessible, high-performance monitoring platform that empowers organizations
          to maintain a safe and sober environment.
        </p>
      </div>
      <div class="card-material flex justify-center border-blue-100 bg-blue-50/50 py-12">
        <Globe size={120} class="text-[#1a237e] opacity-20" />
      </div>
    </section>
  </div>
</div>
