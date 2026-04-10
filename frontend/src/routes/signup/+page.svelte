<script lang="ts">
  import { client } from '$lib/client';
  import { UserPlus, Mail, Lock, User } from 'lucide-svelte';
  import { base } from '$app/paths';

  let username = '';
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleSignup() {
    loading = true;
    error = '';

    const { error: err } = await client.auth.signup.post({
      username,
      email,
      password,
    });

    if (err) {
      error = err.value?.error || 'Signup failed';
    } else {
      window.location.href = `${base}/login`;
    }
    loading = false;
  }
</script>

<div class="mx-auto mt-12 max-w-md">
  <div class="card-material">
    <div class="mb-8 text-center">
      <div class="mb-4 inline-block rounded-full bg-blue-50 p-3 text-[#1a237e]">
        <UserPlus size={32} />
      </div>
      <h2 class="text-3xl font-bold text-gray-800">Join SoberGuard</h2>
      <p class="mt-2 text-gray-500">Create an account to start monitoring</p>
    </div>

    {#if error}
      <div
        class="mb-6 rounded border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700 shadow-sm"
      >
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleSignup} class="space-y-5">
      <div>
        <label
          for="username"
          class="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
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
        <label for="email" class="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Mail size={16} /> Email Address
        </label>
        <input
          id="email"
          type="email"
          bind:value={email}
          class="input-material"
          placeholder="john@example.com"
          required
        />
      </div>

      <div>
        <label
          for="password"
          class="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
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
        class="btn-primary mt-4 flex w-full items-center justify-center gap-2 py-3"
        disabled={loading}
      >
        {#if loading}
          <div class="h-5 w-5 animate-spin rounded-full border-t-2 border-white"></div>
          Creating account...
        {:else}
          Sign Up
        {/if}
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-gray-500">
      Already have an account?
      <a href="{base}/login" class="font-bold text-[#1a237e] hover:underline">Log in</a>
    </p>
  </div>
</div>
