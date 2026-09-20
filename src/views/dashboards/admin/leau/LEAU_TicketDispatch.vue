<template>
  <MainLayout>
    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">LEAU Operations</h2>
        <p class="text-xs text-emerald-600 font-black tracking-wider uppercase">
          {{ isBorrowingMode ? 'Dispatch Tickets — Assign Inventory & Set Ready for Pickup' : 'Dispatch Tickets & Scheduling' }}
        </p>
      </div>
    </template>

    <template #main-content>
      <div v-if="checkingType" class="py-16 text-center text-xs font-bold text-slate-400">
        Resolving ticket type...
      </div>
      <BorrowingDispatchWorkspace
        v-else-if="isBorrowingMode"
        key="leau-dispatch-borrowing"
        unit-code="LEAU"
      />
      <TicketDispatchWorkspace
        v-else
        key="leau-dispatch-job"
        unit-code="LEAU"
        unit-title="Landscaping &amp; Environmental Aesthetics Unit"
        :store="leauStore"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import TicketDispatchWorkspace from '@/components/dispatch/TicketDispatchWorkspace.vue';
import BorrowingDispatchWorkspace from '@/components/dispatch/BorrowingDispatchWorkspace.vue';
import { useLeauPersonnelStore } from '@/stores/leauPersonnel';
import api from '@/api/client';
import { isBorrowingService } from '@/utils/borrowing';

const leauStore = useLeauPersonnelStore();
const route = useRoute();

const dispatchMode = ref('job');
const checkingType = ref(false);
const isBorrowingMode = computed(() => dispatchMode.value === 'borrowing');

const resolveTicketType = async (ticketId) => {
  if (!ticketId) {
    dispatchMode.value = 'job';
    return;
  }
  checkingType.value = true;
  try {
    const cleanId = String(ticketId).trim().replace(/^#/, '');
    // Prefer a direct ticket fetch so the mode is correct even before the queue loads.
    const res = await api.get(`tickets/${cleanId}`);
    const t = res.data?.data?.ticket || res.data?.data;
    dispatchMode.value = isBorrowingService(t) ? 'borrowing' : 'job';
  } catch {
    try {
      // Fallback: look inside the LEAU dispatch queue (covers numeric + legacy ids).
      const res = await api.get('tickets/dispatch/LEAU');
      const raw = res.data?.data?.tickets || res.data?.data || [];
      const target = String(ticketId).toLowerCase().trim().replace(/^#/, '');
      const found = Array.isArray(raw)
        ? raw.find((t) => String(t.id ?? '').toLowerCase().trim().replace(/^#/, '') === target)
        : null;
      dispatchMode.value = found && isBorrowingService(found) ? 'borrowing' : 'job';
    } catch {
      dispatchMode.value = 'job';
    }
  } finally {
    checkingType.value = false;
  }
};

watch(
  () => [route.query.ticket, route.query._t],
  ([v]) => {
    resolveTicketType(v);
  },
  { immediate: true }
);

onMounted(() => {
  resolveTicketType(route.query.ticket);
});
</script>
