import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

const getFormattedToday = () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Quantity is optional; when provided it must be at least 1.
const optionalQuantity = (v) => v === '' || v === null || v === undefined || (Number(v) >= 1);

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
  // Item Details (item name only; quantity is optional and defaults to 1)
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
  const leauBorrowingState = ref(createBorrowingFormState());
  const ssuIncidentState = ref(createSsuIncidentState());

  const clearForms = () => {
    fgmuState.value = createUnitFormState();
    leauState.value = createUnitFormState();
    leauBorrowingState.value = createBorrowingFormState();
    ssuIncidentState.value = createSsuIncidentState();
    v$.value.$reset();
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
    leauBorrowingState: {
      item_name: { required },
      quantity_needed: { optionalQuantity },
      purpose_project: { required, minLength: minLength(10) },
      date_needed: { required },
      expected_return_date: { required },
      terms_agreed: { required }
    },
    ssuIncidentState: {
      incidents: { required },
      who: { required },
      where: { required },
      when: { required },
      how: { required, minLength: minLength(10) }
    }
  }));

  const v$ = useVuelidate(rules, { 
    fgmuState, 
    leauState,
    leauBorrowingState,
    ssuIncidentState 
  });

  return {
    fgmuState,
    leauState,
    leauBorrowingState,
    ssuIncidentState,
    clearForms,
    v$
  };
}, {
  persist: true
});
