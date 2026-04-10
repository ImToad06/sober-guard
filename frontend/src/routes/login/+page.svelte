<script lang="ts">
  import { client } from '$lib/client';
  import { LogIn, Lock, User } from 'lucide-svelte';
  import { base } from '$app/paths';

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = '';

    const { data, error: err } = await client.auth.login.post({
      username,
      password,
    });

    if (err) {
      error = err.value?.error || 'Login failed';
    } else if (data?.success && data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = `${base}/dashboard`;
    }
    loading = false;
  }
</script>

<div class="mx-auto mt-12 max-w-md">
  <div class="card-material">
    <div class="mb-8 text-center">
      <div class="mb-4 inline-block rounded-full bg-blue-50 p-3 text-[#1a237e]">
        <LogIn size={32} />
      </div>
      <h2 class="text-3xl font-bold tracking-tight text-gray-800">Welcome Back</h2>
      <p class="mt-2 font-medium text-gray-500">Log in to your dashboard</p>
    </div>

    {#if error}
      <div
        class="mb-6 flex items-center gap-2 rounded border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700 shadow-sm"
      >
        <span class="font-bold">Error:</span>
        {error}
      </div>
    {/if}

    <form onsubmit={handleLogin} class="space-y-6">
      <div>
        <label for="username" class="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
          <User size={16} /> Username
        </label>
        <input
          id="username"
          type="text"
          bind:value={username}
          class="input-material"
          placeholder="johndoe"
          required
        />
      </div>

      <div>
        <label for="password" class="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
          <Lock size={16} /> Password
        </label>
        <input
          id="password"
          type="password"
          bind:value={password}
          class="input-material"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        class="btn-primary mt-4 flex w-full items-center justify-center gap-2 py-3.5 text-base"
        disabled={loading}
      >
        {#if loading}
          <div class="h-5 w-5 animate-spin rounded-full border-t-2 border-white"></div>
          Authenticating...
        {:else}
          Sign In
        {/if}
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-gray-500">
      Don't have an account?
      <a href="{base}/signup" class="font-bold text-[#1a237e] hover:underline">Sign up for free</a>
    </p>
  </div>
</div>
