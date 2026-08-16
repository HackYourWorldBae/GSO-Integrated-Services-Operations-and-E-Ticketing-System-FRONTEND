import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf, minLength } from '@vuelidate/validators';

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

  const ssuVehicleState = reactive({
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    applicantName: '',
    collegeOffice: '',
    contactNo: '',
    driverName: '',
    driverContact: '',
    houseStreet: '',
    barangay: '',
    cityMunicipality: '',
    province: '',
    vehicleDetails: {
      registeredOwner: '',
      plateNo: '',
      makeSeries: '',
      typeColor: ''
    },
    privacyAgreed: false,
    disclosureAgreed: false,
    signature: '',
    idTypeNo: '',
    validUntil: '',
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

  const tasuVehicleState = ref({
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    time: '',
    requestingPersonnel: '',
    officeCollegeDepartment: '',
    agencyAddress: '',
    numberOfPassengers: '',
    dateOfTravel: '',
    destination: '',
    purposeOfTravel: '',
    travelOrderAttachments: []
  });

  const clearForms = (formType) => {
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

    if (formType === 'ssu-vehicle') {
      Object.assign(ssuVehicleState, {
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        applicantName: '',
        collegeOffice: '',
        contactNo: '',
        driverName: '',
        driverContact: '',
        houseStreet: '',
        barangay: '',
        cityMunicipality: '',
        province: '',
        vehicleDetails: {
          registeredOwner: '',
          plateNo: '',
          makeSeries: '',
          typeColor: ''
        },
        privacyAgreed: false,
        disclosureAgreed: false,
        signature: '',
        idTypeNo: '',
        validUntil: '',
        attachments: []
      });
    }

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

    tasuVehicleState.value = {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: '',
      requestingPersonnel: '',
      officeCollegeDepartment: '',
      agencyAddress: '',
      numberOfPassengers: '',
      dateOfTravel: '',
      destination: '',
      purposeOfTravel: '',
      travelOrderAttachments: []
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
    'ssu-vehicle': {
      applicantName: { required },
      collegeOffice: { required },
      contactNo: { required },
      houseStreet: { required },
      barangay: { required },
      cityMunicipality: { required },
      province: { required },
      vehicleDetails: {
        registeredOwner: { required },
        plateNo: { required },
        makeSeries: { required },
        typeColor: { required }
      },
      privacyAgreed: { required: requiredIf((value) => value === true) },
      disclosureAgreed: { required: requiredIf((value) => value === true) },
      signature: { required }
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
    },
    tasuVehicleState: {
      time: { required },
      requestingPersonnel: { required },
      officeCollegeDepartment: { required },
      numberOfPassengers: { required },
      dateOfTravel: { required },
      destination: { required },
      purposeOfTravel: { required, minLength: minLength(10) }
    }
  }));

  const v$ = useVuelidate(rules, { 
    fgmuState, 
    leauState, 
    ssuVehicleState, 
    ssuIncidentState, 
    tasuVehicleState 
  });

  return {
    fgmuState,
    leauState,
    ssuVehicleState,
    ssuIncidentState,
    tasuVehicleState,
    clearForms,
    v$
  };
}, {
  persist: true
});
