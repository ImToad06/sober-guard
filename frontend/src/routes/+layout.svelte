<script lang="ts">
  import '../app.css';
  import { Shield, Home, Info, LogIn, LayoutDashboard } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  let isLoggedIn = false;

  onMount(() => {
    isLoggedIn = !!localStorage.getItem('token');
  });

  function logout() {
    localStorage.removeItem('token');
    window.location.href = `${base}/login`;
  }
</script>

<div class="flex min-h-screen flex-col bg-[#f5f5f5]">
  <header class="sticky top-0 z-50 bg-[#1a237e] text-white shadow-lg">
    <nav class="container mx-auto flex items-center justify-between px-6 py-4">
      <a href="{base}/" class="flex items-center gap-2 text-xl font-bold tracking-tight">
        <Shield size={28} />
        <span>SoberGuard</span>
      </a>

      <div class="flex items-center gap-6">
        <a href="{base}/" class="flex items-center gap-1 transition-colors hover:text-blue-200">
          <Home size={18} /> <span class="hidden sm:inline">Home</span>
        </a>
        <a
          href="{base}/about"
          class="flex items-center gap-1 transition-colors hover:text-blue-200"
        >
          <Info size={18} /> <span class="hidden sm:inline">About</span>
        </a>

        {#if isLoggedIn}
          <a
            href="{base}/dashboard"
            class="flex items-center gap-1 font-semibold transition-colors hover:text-blue-200"
          >
            <LayoutDashboard size={18} /> <span class="hidden sm:inline">Dashboard</span>
          </a>
          <button
            on:click={logout}
            class="rounded-md bg-white/10 px-4 py-1.5 text-sm font-medium tracking-wider uppercase transition-all hover:bg-white/20"
          >
            Logout
          </button>
        {:else}
          <a
            href="{base}/login"
            class="flex items-center gap-1 transition-colors hover:text-blue-200"
          >
            <LogIn size={18} /> <span class="hidden sm:inline">Login</span>
          </a>
          <a
            href="{base}/signup"
            class="rounded-md bg-white px-4 py-1.5 text-sm font-bold tracking-wider text-[#1a237e] uppercase shadow-md transition-all hover:bg-blue-50"
          >
            Sign Up
          </a>
        {/if}
      </div>
    </nav>
  </header>

  <main class="container mx-auto flex-grow px-6 py-8">
    <slot />
  </main>

  <footer class="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
    <p>&copy; {new Date().getFullYear()} SoberGuard. Safety first.</p>
  </footer>
</div>
