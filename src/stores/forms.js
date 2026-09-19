import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

const getFormattedToday = () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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
  const ssuIncidentState = ref(createSsuIncidentState());

  const clearForms = () => {
    fgmuState.value = createUnitFormState();
    leauState.value = createUnitFormState();
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
    ssuIncidentState 
  });

  return {
    fgmuState,
    leauState,
    ssuIncidentState,
    clearForms,
    v$
  };
}, {
  persist: true
});
