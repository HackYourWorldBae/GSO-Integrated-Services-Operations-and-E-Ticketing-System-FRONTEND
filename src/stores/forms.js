import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

export const useFormsStore = defineStore('forms', () => {
  const fgmuState = ref({
    sectionA: {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      college_building: '',
      office_room: '',
      source_of_fund: '',
      end_user: '',
      contact_number: '',
      job_description: ''
    },
    attachments: []
  });

  const leauState = ref({
    sectionA: {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      college_building: '',
      office_room: '',
      source_of_fund: '',
      end_user: '',
      contact_number: '',
      job_description: ''
    },
    attachments: []
  });

  const ssuIncidentState = ref({
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
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
      printedName: '',
      roles: []
    }
  });

  const clearForms = () => {
    fgmuState.value = {
      sectionA: {
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        college_building: '',
        office_room: '',
        source_of_fund: '',
        end_user: '',
        contact_number: '',
        job_description: ''
      },
      attachments: []
    };

    leauState.value = {
      sectionA: {
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        college_building: '',
        office_room: '',
        source_of_fund: '',
        end_user: '',
        contact_number: '',
        job_description: ''
      },
      attachments: []
    };

    ssuIncidentState.value = {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
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
        printedName: '',
        roles: []
      }
    };

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
      how: { required, minLength: minLength(10) },
      reportedBy: {
        signature: { required },
        roles: { required }
      }
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
