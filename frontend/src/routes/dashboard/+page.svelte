<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { client } from '$lib/client';
  import { Line } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler,
    type ChartData,
    type ChartOptions,
  } from 'chart.js';
  import { Activity, Thermometer, Clock, AlertTriangle } from 'lucide-svelte';
  import { PUBLIC_WS_URL } from '$env/static/public';

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler,
  );

  interface ReadingData {
    id: string;
    value: number;
    deviceId: string;
    timestamp: string;
  }

  interface Stats {
    totalReadings: number;
    averageValue: number;
    lastReading: ReadingData | null;
  }

  // Type for the backend reading object
  interface RawReading {
    _id?: string;
    value: number;
    deviceId: string;
    timestamp: string;
  }

  interface RawStats {
    totalReadings: number;
    averageValue: number;
    lastReading: RawReading | null;
  }

  let history = $state<ReadingData[]>([]);
  let stats = $state<Stats>({ totalReadings: 0, averageValue: 0, lastReading: null });
  let liveValue = $state<number | null>(null);
  let ws: WebSocket;

  let chartData = $state<ChartData<'line'>>({
    labels: [],
    datasets: [
      {
        label: 'Alcohol Level (PPM)',
        data: [],
        fill: true,
        borderColor: '#1a237e',
        backgroundColor: 'rgba(26, 35, 126, 0.1)',
        tension: 0.4,
        pointRadius: 2,
        borderWidth: 3,
      },
    ],
  });

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } },
    },
  };

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Initial Data Fetch
    const { data: hist } = await client.api.dashboard.history.get();
    if (hist && Array.isArray(hist)) {
      const rawHist = hist as unknown as RawReading[];
      const formattedHist: ReadingData[] = rawHist.map((r) => ({
        id: r._id || Math.random().toString(),
        value: r.value,
        deviceId: r.deviceId,
        timestamp: r.timestamp,
      }));
      history = formattedHist;
      updateChart(formattedHist.slice().reverse());
    }

    const { data: s } = await client.api.dashboard.stats.get();
    if (s) {
      const rawStats = s as unknown as RawStats;
      stats = {
        totalReadings: rawStats.totalReadings,
        averageValue: rawStats.averageValue,
        lastReading: rawStats.lastReading
          ? {
              id: rawStats.lastReading._id || '',
              value: rawStats.lastReading.value,
              deviceId: rawStats.lastReading.deviceId,
              timestamp: rawStats.lastReading.timestamp,
            }
          : null,
      };
    }

    // WebSocket Connection
    ws = new WebSocket(PUBLIC_WS_URL || 'ws://localhost:3000/ws');
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'new_reading') {
        const r = msg.data as RawReading;
        const reading: ReadingData = {
          id: r._id || Math.random().toString(),
          value: r.value,
          deviceId: r.deviceId,
          timestamp: r.timestamp,
        };
        liveValue = reading.value;
        history = [reading, ...history].slice(0, 50);
        updateChart([reading], true);
        stats.totalReadings++;
      }
    };
  });

  onDestroy(() => {
    if (ws) ws.close();
  });

  function updateChart(newData: ReadingData[], append = false) {
    const labels = newData.map((r) =>
      new Date(r.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    );
    const values = newData.map((r) => r.value);

    if (append) {
      chartData.labels = [...(chartData.labels || []).slice(-19), ...labels];
      chartData.datasets[0].data = [...chartData.datasets[0].data.slice(-19), ...values];
    } else {
      chartData.labels = labels;
      chartData.datasets[0].data = values;
    }
  }
</script>

<div class="mx-auto max-w-7xl space-y-8">
  <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
    <div>
      <h1 class="text-4xl font-black tracking-tight text-[#1a237e] uppercase">
        Monitoring Dashboard
      </h1>
      <p class="font-medium text-gray-500">Live data from MQ135 sensor</p>
    </div>
    <div class="flex items-center gap-3">
      <div
        class="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-bold text-green-700"
      >
        <div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
        SYSTEM ONLINE
      </div>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
    <div class="card-material border-l-8 border-[#1a237e]">
      <div class="flex items-center gap-4">
        <div class="rounded-lg bg-blue-50 p-3 text-[#1a237e]">
          <Activity size={24} />
        </div>
        <div>
          <p class="text-sm font-bold text-gray-500 uppercase">Live Level</p>
          <p class="text-2xl font-black text-gray-800">
            {liveValue ?? '---'} <span class="text-sm font-normal text-gray-400">PPM</span>
          </p>
        </div>
      </div>
    </div>

    <div class="card-material border-l-8 border-blue-400">
      <div class="flex items-center gap-4">
        <div class="rounded-lg bg-blue-50 p-3 text-blue-400">
          <Thermometer size={24} />
        </div>
        <div>
          <p class="text-sm font-bold text-gray-500 uppercase">Avg Value</p>
          <p class="text-2xl font-black text-gray-800">
            {Math.round(stats.averageValue)}
            <span class="text-sm font-normal text-gray-400">PPM</span>
          </p>
        </div>
      </div>
    </div>

    <div class="card-material border-l-8 border-gray-400">
      <div class="flex items-center gap-4">
        <div class="rounded-lg bg-gray-50 p-3 text-gray-400">
          <Clock size={24} />
        </div>
        <div>
          <p class="text-sm font-bold text-gray-500 uppercase">Total Logged</p>
          <p class="text-2xl font-black text-gray-800">{stats.totalReadings}</p>
        </div>
      </div>
    </div>

    <div class="card-material border-l-8 border-yellow-500">
      <div class="flex items-center gap-4">
        <div class="rounded-lg bg-yellow-50 p-3 text-yellow-600">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p class="text-sm font-bold text-gray-500 uppercase">Status</p>
          <p
            class="text-2xl font-black {liveValue && liveValue > 400
              ? 'text-red-600'
              : 'text-green-600'}"
          >
            {liveValue && liveValue > 400 ? 'WARNING' : 'SAFE'}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Chart & Table -->
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
    <div class="card-material flex min-h-[400px] flex-col overflow-hidden p-0 lg:col-span-2">
      <div class="flex items-center justify-between border-b border-gray-100 p-6">
        <h3 class="text-xl font-bold tracking-wide text-gray-800 uppercase">Level Trends</h3>
        <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1a237e] uppercase"
          >Real-time graph</span
        >
      </div>
      <div class="flex-grow p-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>

    <div class="card-material flex flex-col overflow-hidden p-0">
      <div class="border-b border-gray-100 p-6">
        <h3 class="text-xl font-bold tracking-wide text-gray-800 uppercase">Recent Log</h3>
      </div>
      <div class="max-h-[400px] flex-grow overflow-y-auto">
        <table class="w-full text-left">
          <thead class="sticky top-0 bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-xs font-black text-gray-500 uppercase">Time</th>
              <th class="px-6 py-3 text-right text-xs font-black text-gray-500 uppercase">Value</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            {#each history.slice(0, 10) as reading (reading.id)}
              <tr class="transition-colors hover:bg-blue-50/50">
                <td class="px-6 py-4 text-sm font-medium text-gray-600">
                  {new Date(reading.timestamp).toLocaleTimeString()}
                </td>
                <td
                  class="px-6 py-4 text-right text-sm font-black {reading.value > 400
                    ? 'text-red-600'
                    : 'text-[#1a237e]'}"
                >
                  {reading.value} PPM
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
