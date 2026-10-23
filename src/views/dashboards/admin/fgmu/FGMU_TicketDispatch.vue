<template>
  <MainLayout>
    <template #header-title>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
        FGMU Operations
      </h2>
    </template>

    <template #main-content>
      <div v-if="checkingType" class="py-16 text-center text-xs font-bold text-slate-400">
        Resolving ticket type...
      </div>
      <BorrowingDispatchWorkspace
        v-else-if="isBorrowingMode"
        key="fgmu-dispatch-borrowing"
        unit-code="FGMU"
      />
      <TicketDispatchWorkspace
        v-else
        key="fgmu-dispatch-job"
        unit-code="FGMU"
        unit-title="Facilities &amp; Grounds Management Unit"
        :store="fgmuStore"
        @switch-to-borrowing="dispatchMode = 'borrowing'"
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
import { useFgmuPersonnelStore } from '@/stores/fgmuPersonnel';
import api from '@/api/client';
import { isBorrowingService } from '@/utils/borrowing';

const fgmuStore = useFgmuPersonnelStore();
const route = useRoute();

const dispatchMode = ref('job');
const checkingType = ref(false);
const isBorrowingMode = computed(() => dispatchMode.value === 'borrowing');

const resolveTicketType = async (ticketId) => {
  if (route.query.mode === 'borrowing') {
    dispatchMode.value = 'borrowing';
    return;
  }
  if (!ticketId) {
    dispatchMode.value = 'job';
    return;
  }
  checkingType.value = true;
  try {
    const cleanId = String(ticketId).trim().replace(/^#/, '');
    const res = await api.get(`tickets/${cleanId}`);
    const t = res.data?.data?.ticket || res.data?.data;
    dispatchMode.value = isBorrowingService(t) ? 'borrowing' : 'job';
  } catch {
    try {
      const res = await api.get('tickets/dispatch/FGMU');
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
  () => [route.query.ticket, route.query.ticketId, route.query.id, route.query.mode, route.query._t],
  ([v]) => {
    const tid = v || route.query.ticketId || route.query.id;
    resolveTicketType(tid);
  },
  { immediate: true }
);

onMounted(() => {
  const tid = route.query.ticket || route.query.ticketId || route.query.id;
  resolveTicketType(tid);
});
</script>
