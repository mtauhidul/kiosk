import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

export const addPatient = async (patient) => {
  const data = {
    patient: patient,
    others: {
      appointment_date: {
        value: new Date().toLocaleDateString(),
        name: 'Appointment Date',
        priority: true,
      },
      appointment_start_time: {
        value: new Date().toLocaleTimeString(),
        name: 'Appointment Start Time',
        priority: true,
      },
      is_televisit: {
        value: 'No',
        name: 'Is Televisit',
        priority: false,
      },
      call_start_time: {
        value: '',
        name: 'Call Start Time',
        priority: false,
      },
      call_end_time: {
        value: '',
        name: 'Call End Time',
        priority: false,
      },
      call_duration: {
        value: '',
        name: 'Call Duration',
        priority: false,
      },
      encounter_id: {
        value: '',
        name: 'Encounter ID',
        priority: false,
      },
      Appointment_created_by: {
        value: patient.userInfo.fullName,
        name: 'Appointment Created By User',
        priority: false,
      },
      visit_type: {
        value: '',
        name: 'Visit Type',
        priority: true,
      },
      visit_status: {
        value: '',
        name: 'Visit Status',
        priority: true,
      },
      case_label: {
        value: '',
        name: 'Case Label',
        priority: true,
      },
      visit_count: {
        value: '1',
        name: 'Visit Count',
        priority: false,
      },
      patient_count: {
        value: '1',
        name: 'Patient Count',
        priority: false,
      },
      patient_name: {
        value: patient.userInfo.fullName,
        name: 'Patient Name',
        priority: true,
      },
      patient_first_name: {
        value: patient.userInfo.fullName.split(' ')[0],
        name: 'Patient First Name',
        priority: true,
      },
      patient_last_name: {
        value: patient.userInfo.fullName.split(' ')[1],
        name: 'Patient Last Name',
        priority: true,
      },
      patient_middle_initial: {
        value: '',
        name: 'Patient Middle Initial',
        priority: false,
      },
      patient_acct_no: {
        value: '',
        name: 'Patient Account Number',
        priority: false,
      },
      patient_dob: {
        value: `${
          patient.userInfo.day +
          ' ' +
          patient.userInfo.month +
          ',' +
          patient.userInfo.year
        }`,
        name: 'Patient DOB',
        priority: true,
      },
      patient_gender: {
        value: '',
        name: 'Patient Gender',
        priority: false,
      },
      patient_address_line_1: {
        value: patient.demographicsInfo.address,
        name: 'Patient Address Line 1',
        priority: false,
      },
      patient_address_line_2: {
        value: patient.demographicsInfo.address2,
        name: 'Patient Address Line 2',
        priority: false,
      },
      patient_city: {
        value: patient.demographicsInfo.city,
        name: 'Patient City',
        priority: false,
      },
      patient_state: {
        value: patient.demographicsInfo.state,
        name: 'Patient State',
        priority: false,
      },
      patient_zip: {
        value: patient.demographicsInfo.zipcode,
        name: 'Patient Zip Code',
        priority: false,
      },
      patient_full_address: {
        value:
          patient.demographicsInfo.address + ' ' + patient.userInfo.zipcode,
        name: 'Patient Full Address',
        priority: false,
      },
      patient_race: {
        value: '',
        name: 'Patient Race',
        priority: false,
      },
      patient_ethnicity: {
        value: '',
        name: 'Patient Ethnicity',
        priority: false,
      },
      patient_home_phone: {
        value: patient.demographicsInfo.phone,
        name: 'Patient Home Phone',
        priority: false,
      },
      patient_cell_phone: {
        value: patient.demographicsInfo.phone,
        name: 'Patient Cell Phone',
        priority: false,
      },
      patient_work_phone: {
        value: patient.demographicsInfo.phone,
        name: 'Patient Work Phone',
        priority: false,
      },
      patient_email: {
        value: patient.demographicsInfo.email,
        name: 'Patient E-mail',
        priority: false,
      },
      patient_status: {
        value: 'Active',
        name: 'Patient Status',
        priority: false,
      },
      dont_send_statements: {
        value: 'No',
        name: "Don't Send Statements",
        priority: false,
      },
      patient_deceased: {
        value: 'No',
        name: 'Patient Deceased',
        priority: false,
      },
      patient_age_group: {
        value: 'Between 18 - 64  Yrs',
        name: 'Patient Age Group',
        priority: false,
      },
      appointment_facility_name: {
        value: 'Your Total Foot Care Specialist',
        name: 'Appointment Facility Name',
        priority: true,
      },
      appointment_facility_pos: {
        value: '',
        name: 'Appointment Facility POS',
        priority: false,
      },
      appointment_facility_group_name: {
        value: 'Facility Not In Group',
        name: 'Appointment Facility Group Name',
        priority: false,
      },
      department_name: {
        value: 'Unknown',
        name: 'Department Name',
        priority: false,
      },
      practice_name: {
        value: 'Practice Not Defined',
        name: 'Practice Name',
        priority: false,
      },
      appointment_provider_name: {
        value: '',
        name: 'Appointment Provider Name',
        priority: true,
      },
      appointment_provider_npi: {
        value: '',
        name: 'Appointment Provider NPI',
        priority: false,
      },
      appointment_referring_provider_name: {
        value: '',
        name: 'Appointment Referring Provider Name',
        priority: false,
      },
      appointment_referring_provider_npi: {
        value: '',
        name: 'Appointment Referring Provider NPI',
        priority: false,
      },
      resource_provider_name: {
        value: '',
        name: 'Resource Provider Name',
        priority: true,
      },
      resource_provider_npi: {
        value: '',
        name: 'Resource Provider NPI',
        priority: false,
      },
      demographics_pcp_name: {
        value: '',
        name: 'Demographics PCP Name',
        priority: false,
      },
      demographics_pcp_npi: {
        value: '',
        name: 'Demographics PCP NPI',
        priority: false,
      },
      demographics_referring_provider_name: {
        value: '',
        name: 'Demographics Referring Provider Name',
        priority: false,
      },
      demographics_referring_provider_npi: {
        value: '',
        name: 'Demographics Referring Provider NPI',
        priority: false,
      },
      demographics_rendering_provider_name: {
        value: '',
        name: 'Demographics Rendering Provider Name',
        priority: false,
      },
      demographics_rendering_provider_npi: {
        value: '',
        name: 'Demographics Rendering Provider NPI',
        priority: false,
      },
      primary_insurance_name: {
        value: patient.primaryInsurance.insuranceName,
        name: 'Primary Insurance Name',
        priority: false,
      },
      primary_insurance_subscriber_no: {
        value: patient.primaryInsurance.memberId,
        name: 'Primary Insurance Subscriber No',
        priority: false,
      },
      secondary_insurance_name: {
        value: patient?.secondaryInsurance?.insuranceName || '',
        name: 'Secondary Insurance Name',
        priority: false,
      },
      secondary_insurance_subscriber_no: {
        value: patient?.secondaryInsurance?.memberId || '',
        name: 'Secondary Insurance Subscriber No',
        priority: false,
      },
      tertiary_insurance_name: {
        value: '',
        name: 'Tertiary Insurance Name',
        priority: false,
      },
      tertiary_insurance_subscriber_no: {
        value: '',
        name: 'Tertiary Insurance Subscriber No',
        priority: false,
      },
      sliding_fee_schedule: {
        value: '',
        name: 'Sliding Fee Schedule',
        priority: false,
      },
      total_visit_count: {
        value: '',
        name: 'Total(Visit Count)',
        priority: false,
      },
      count_distinct_patient_acct_no: {
        value: '',
        name: 'Count Distinct(Patient Acct No)',
        priority: false,
      },
    },
  };

  try {
    const kioskRef = await addDoc(collection(db, 'kiosk'), data);
    const returnPatient = { id: kioskRef.id, status: 'success' };
    return returnPatient;
  } catch (e) {
    return e;
  }
};
