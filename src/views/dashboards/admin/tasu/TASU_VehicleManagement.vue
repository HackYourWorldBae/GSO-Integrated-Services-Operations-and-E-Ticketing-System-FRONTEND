<template>
  <MainLayout>
    <template #sidebar-links>
      <router-link to="/admin/tasu" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text">TASU Home</span>
      </router-link>
      <router-link to="/admin/tasu/queues" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text">Ticket Queues</span>
      </router-link>
      <router-link to="/admin/tasu/personnel" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text">Personnel Management</span>
      </router-link>
      <router-link to="/admin/tasu/vehicles" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        <span class="text">Vehicle Management</span>
      </router-link>
      <router-link to="/admin/tasu/dispatch" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text">Dispatch Board</span>
      </router-link>
      <div class="mt-8 mb-4 px-4">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archived Tickets</p>
      </div>
      <router-link to="/admin/tasu/archives" class="nav-item">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span class="text">Archives</span>
      </router-link>
    </template>

    <template #header-title>
      <div class="flex flex-col">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Vehicle Management</h2>
        <p class="text-[10px] text-emerald-600 font-extrabold tracking-[0.2em] uppercase">Fleet & Automotive Operations</p>
      </div>
    </template>

    <template #main-content>
      <div class="space-y-8 animate-fade-in">
        <div class="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-500/5">
          <div class="flex items-center gap-6">
            <div class="flex -space-x-4 p-1">
               <template v-for="(v, index) in activeFleetAvatars" :key="v.id || index">
                 <img v-if="v.image" :src="v.image" class="inline-block h-12 w-12 rounded-full ring-4 ring-white object-cover bg-white" alt="Vehicle Thumbnail">
                 <div v-else class="inline-block h-12 w-12 rounded-full ring-4 ring-white bg-slate-100 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                     <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                     <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H12a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4a1 1 0 01.8.4l3 4A1 1 0 0122 12v3a1 1 0 01-1 1h-.05a2.5 2.5 0 01-4.9 0H14V7z" />
                   </svg>
                 </div>
               </template>
               <div v-if="remainingFleetCount > 0" class="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 ring-4 ring-white text-xs font-black text-slate-400 font-sans">+{{ remainingFleetCount }}</div>
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900 tracking-tight">Active Fleet Control</h3>
              <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">{{ vehicles.length }} Total Vehicles • Active Fleet</p>
            </div>
          </div>
          <button @click="showAddModal = true" class="px-8 py-4 bg-emerald-600 text-white font-black rounded-3xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
            </svg>
            Add New Vehicle
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="vehicle in vehicles" :key="vehicle.id" class="group relative bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <!-- Vehicle Image Backdrop -->
            <div class="h-56 overflow-hidden relative bg-slate-100 flex items-center justify-center">
              <img v-if="vehicle.image" :src="vehicle.image" :alt="vehicle.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-slate-300 transition-transform duration-700 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H12a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4a1 1 0 01.8.4l3 4A1 1 0 0122 12v3a1 1 0 01-1 1h-.05a2.5 2.5 0 01-4.9 0H14V7z" />
              </svg>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div class="absolute top-6 left-6">
                <span :class="['px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 shadow-sm backdrop-blur-md', vehicle.status === 'Available' ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30' : 'bg-red-500/20 text-red-100 border-red-400/30']">
                  {{ vehicle.status }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-8 space-y-6">
               <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-xl font-black text-slate-900 tracking-tight mb-1">{{ vehicle.name }}</h3>
                    <p class="text-sm text-slate-400 font-bold uppercase tracking-widest leading-none">{{ vehicle.plate }}</p>
                  </div>
                  <button @click="openEditModal(vehicle)" class="p-3 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl text-slate-400 transition-colors shadow-sm" title="Edit Vehicle">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
               </div>

               <div class="grid grid-cols-2 gap-4">
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fuel & Engine</p>
                     <p class="text-sm font-black text-slate-900">{{ vehicle.fuel }} • {{ vehicle.engine }}</p>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Model Year</p>
                     <p class="text-sm font-black text-slate-900">{{ vehicle.model }} Model</p>
                  </div>
               </div>

               <!-- Status Toggle -->
                <div class="pt-4 flex items-center justify-between border-t border-slate-50">
                  <span class="text-sm font-bold text-slate-500">Operation Status</span>
                  <button @click="toggleStatus(vehicle)" :class="['relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none shadow-inner', vehicle.status === 'Available' ? 'bg-emerald-500' : 'bg-red-500']">
                    <span :class="['inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md', vehicle.status === 'Available' ? 'translate-x-7' : 'translate-x-1']" />
                  </button>
               </div>
            </div>
          </div>
        </div>

        <!-- Add New Vehicle Modal -->
        <Teleport to="body">
          <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div class="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
              <button @click="closeAddModal" class="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            <div class="mb-6">
              <span class="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-emerald-50 text-emerald-600 mb-2 inline-block">{{ isEditing ? 'Update Fleet' : 'Fleet Expansion' }}</span>
              <h3 class="text-2xl font-black text-slate-900">{{ isEditing ? 'Edit Vehicle' : 'Add New Vehicle' }}</h3>
              <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{{ isEditing ? 'Update details of the vehicle' : 'Register a new unit to TASU active fleet' }}</p>
            </div>
            <form @submit.prevent="submitVehicleForm" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Vehicle Name / Unit</label>
                  <input v-model="vehicleForm.name" required type="text" placeholder="e.g. Toyota Coaster Deluxe" class="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Plate Number</label>
                  <input v-model="vehicleForm.plate" required type="text" placeholder="e.g. SYA 8890" class="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all uppercase" />
                </div>
                <div>
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Category</label>
                  <select v-model="vehicleForm.category" class="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                    <option value="Van">Van</option>
                    <option value="Bus">Bus</option>
                    <option value="Pickup">Pickup</option>
                    <option value="SUV">SUV</option>
                    <option value="Logistics">Logistics / Cargo</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Fuel Type</label>
                  <select v-model="vehicleForm.fuel" class="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                    <option value="Diesel">Diesel</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Electric / Hybrid">Electric / Hybrid</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Model Year</label>
                  <input v-model="vehicleForm.model" required type="text" placeholder="e.g. 2026" class="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
                <div class="col-span-2">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Engine / Displacement</label>
                  <input v-model="vehicleForm.engine" required type="text" placeholder="e.g. 2800 cc / Euro 4" class="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
                <div class="col-span-2">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Image Thumbnail (Optional)</label>
                  <input @change="handleImageUpload" type="file" accept="image/*" class="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                  <p v-if="vehicleForm.image && !vehicleForm.imageFile" class="text-xs text-slate-400 mt-2">Current image will be kept if no new file is uploaded.</p>
                </div>
              </div>
              <div class="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" @click="closeAddModal" class="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" class="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/30 hover:bg-emerald-500 transition-all hover:-translate-y-0.5" :disabled="isSubmitting">{{ isEditing ? (isSubmitting ? 'Updating...' : 'Update Vehicle') : (isSubmitting ? 'Adding...' : 'Add Vehicle') }}</button>
              </div>
            </form>
          </div>
        </div>
        </Teleport>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MainLayout from '@/layouts/Main_Dashboard_Layout.vue';
import { useTasuVehiclesStore } from '@/stores/tasuVehicles';
import { toast } from 'vue3-toastify';

const store = useTasuVehiclesStore();
const vehicles = computed(() => store.vehicles);

const activeFleetAvatars = computed(() => {
  return vehicles.value.slice(0, 4);
});

const remainingFleetCount = computed(() => {
  return vehicles.value.length > 4 ? vehicles.value.length - 4 : 0;
});

onMounted(async () => {
  await store.fetchVehicles();
});

const showAddModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

const vehicleForm = ref({
  id: null,
  name: '',
  plate: '',
  category: 'Van',
  fuel: 'Diesel',
  model: '2026',
  engine: '',
  image: '',
  imageFile: null
});

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    vehicleForm.value.imageFile = file;
  } else {
    vehicleForm.value.imageFile = null;
  }
};

const openEditModal = (vehicle) => {
  isEditing.value = true;
  vehicleForm.value = { ...vehicle };
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
  isEditing.value = false;
  vehicleForm.value = {
    id: null,
    name: '',
    plate: '',
    category: 'Van',
    fuel: 'Diesel',
    model: '2026',
    engine: '',
    image: '',
    imageFile: null
  };
};

const submitVehicleForm = async () => {
  isSubmitting.value = true;
  try {
    if (isEditing.value) {
      await store.updateVehicle(vehicleForm.value.id, { ...vehicleForm.value });
      toast.success(`Successfully updated ${vehicleForm.value.name} (${vehicleForm.value.plate})`);
    } else {
      await store.addVehicle({ ...vehicleForm.value });
      toast.success(`Successfully added ${vehicleForm.value.name} (${vehicleForm.value.plate})`);
    }
    closeAddModal();
  } catch (error) {
    toast.error('An error occurred. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

const toggleStatus = async (vehicle) => {
  try {
    await store.toggleVehicleStatus(vehicle.id);
    toast.info(`${vehicle.name} status updated.`);
  } catch (error) {
    toast.error('Failed to update vehicle status.');
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
