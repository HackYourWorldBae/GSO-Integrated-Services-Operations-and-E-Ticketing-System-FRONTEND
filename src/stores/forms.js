import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

const getFormattedToday = () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Quantity is mandatory and must be an integer >= 1.
const validQuantity = (v) => {
  if (v === '' || v === null || v === undefined) return false;
  const num = Number(v);
  return !isNaN(num) && Number.isInteger(num) && num >= 1;
};

// Terms agreement must be explicitly checked
const mustBeTrue = (v) => v === true;

const createUnitFormState = () => ({
  sectionA: {
    date: getFormattedToday(),
    college_building: '',
    office_room: '',
    source_of_fund: '',
    end_user: '',
    contact_number: '',
    job_description: ''
  },
  attachments: []
});

const createBorrowingFormState = () => ({
  // Borrower Info
  borrower_name: '',
  borrower_id_number: '',
  borrower_email: '',
  borrower_contact: '',
  department_major: '',

  // Multi-item list: array of { id, name, quantity }
  items: [],
  item_input_draft: '',

  // Item Details (synced from items or set directly)
  item_name: '',
  quantity_needed: '',
  purpose_project: '',

  // Schedule
  date_needed: '',
  expected_return_date: '',

  // Acknowledgement
  terms_agreed: false,

  // Attachments
  attachments: []
});

const createSsuIncidentState = () => ({
  date: getFormattedToday(),
  incidents: [],
  otherIncident: '',
  information: [],
  otherInformation: '',
  followUp: false,
  who: '',
  where: '',
  when: '',
  how: '',
  reportedBy: {
    signature: '',
    printedName: ''
  }
});

export const useFormsStore = defineStore('forms', () => {
  const fgmuState = ref(createUnitFormState());
  const leauState = ref(createUnitFormState());
  const fgmuBorrowingState = ref(createBorrowingFormState());
  const leauBorrowingState = ref(createBorrowingFormState());
  const ssuIncidentState = ref(createSsuIncidentState());

  const syncBorrowingItems = (state) => {
    if (!state) return;
    if (Array.isArray(state.items) && state.items.length > 0) {
      state.item_name = state.items
        .map(i => `${(i.name || '').trim()} (${parseInt(i.quantity, 10) || 1})`)
        .filter(s => s.length > 3)
        .join(', ');
      state.quantity_needed = state.items.reduce((acc, i) => acc + (parseInt(i.quantity, 10) || 1), 0);
    }
  };

  const commitDraftItem = (state) => {
    if (!state) return;
    const draft = (state.item_input_draft || '').trim();
    if (!draft) return;
    if (!Array.isArray(state.items)) state.items = [];
    const match = state.items.find(i => i.name.toLowerCase() === draft.toLowerCase());
    if (match) {
      match.quantity = (parseInt(match.quantity, 10) || 1) + 1;
    } else {
      state.items.push({
        id: Date.now() + Math.random(),
        name: draft,
        quantity: 1
      });
    }
    state.item_input_draft = '';
    syncBorrowingItems(state);
  };

  const clearForms = () => {
    fgmuState.value = createUnitFormState();
    leauState.value = createUnitFormState();
    fgmuBorrowingState.value = createBorrowingFormState();
    leauBorrowingState.value = createBorrowingFormState();
    ssuIncidentState.value = createSsuIncidentState();
    v$.value.$reset();
  };

  // Incident type is satisfied by a checked box OR a typed custom type
  // in the Others field (accepted as another incident type).
  const incidentTypeRequired = (value) => {
    if (Array.isArray(value) && value.length > 0) return true;
    return ((ssuIncidentState.value && ssuIncidentState.value.otherIncident) || '').trim() !== '';
  };

  const rules = computed(() => ({
    fgmuState: {
      sectionA: {
        college_building: { required },
        office_room: { required },
        job_description: { required, minLength: minLength(10) }
      }
    },
    leauState: {
      sectionA: {
        college_building: { required },
        office_room: { required },
        job_description: { required, minLength: minLength(10) }
      }
    },
    fgmuBorrowingState: {
      item_name: { required },
      quantity_needed: { required, validQuantity },
      purpose_project: { required, minLength: minLength(3) },
      date_needed: { required },
      expected_return_date: { required },
      terms_agreed: { mustBeTrue }
    },
    leauBorrowingState: {
      item_name: { required },
      quantity_needed: { required, validQuantity },
      purpose_project: { required, minLength: minLength(3) },
      date_needed: { required },
      expected_return_date: { required },
      terms_agreed: { mustBeTrue }
    },
    ssuIncidentState: {
      incidents: { incidentTypeRequired },
      who: { required },
      where: { required },
      when: { required },
      how: { required, minLength: minLength(10) }
    }
  }));

  const v$ = useVuelidate(rules, { 
    fgmuState, 
    leauState,
    fgmuBorrowingState,
    leauBorrowingState,
    ssuIncidentState 
  });

  return {
    fgmuState,
    leauState,
    fgmuBorrowingState,
    leauBorrowingState,
    ssuIncidentState,
    syncBorrowingItems,
    commitDraftItem,
    clearForms,
    v$,
    /**
     * Drop any non-File entries from attachment arrays.
     * File/Blob objects cannot survive JSON persistence (they rehydrate
     * as plain `{}`), which previously caused "No files uploaded" on submit.
     * Safe to call on view mount and before upload.
     */
    sanitizeAttachments,
  };

  function sanitizeAttachments() {
    for (const state of [fgmuState.value, leauState.value, fgmuBorrowingState.value, leauBorrowingState.value]) {
      if (state && Array.isArray(state.attachments)) {
        const valid = state.attachments.filter((f) => f instanceof File);
        if (valid.length !== state.attachments.length) {
          state.attachments = valid;
        }
      }
    }
  }
}, {
  // NOTE: File/Blob objects cannot be JSON-serialized. Persisting them turns
  // them into `{}` on reload, breaking uploads. Exclude attachments so only
  // text fields survive a refresh — users re-attach files after reload.
  persist: {
    omit: [
      'fgmuState.attachments',
      'leauState.attachments',
      'fgmuBorrowingState.attachments',
      'leauBorrowingState.attachments',
    ],
  },
});
