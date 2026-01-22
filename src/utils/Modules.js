import Active from "../layouts/allergies/Active";
import Allergies from "../layouts/allergies/Allergies";
import Appointment from "../layouts/checkIn/Appointment";
import General from "../layouts/checkIn/General";
import Documents from "../layouts/demographics/Documents";
import Information from "../layouts/demographics/Information";
import FamilyHistory from "../layouts/family/FamilyHistory";
import Additional from "../layouts/insurance/Additional";
import InInformation from "../layouts/insurance/InInformation";
import InsuranceDocs from "../layouts/insurance/InsuranceDocs";
import SecInInformation from "../layouts/insurance/SecInInformation";
import SecInsuranceDocs from "../layouts/insurance/SecInsuranceDocs";
import MedicalHistory from "../layouts/medical/MedicalHistory";
import PastHistory from "../layouts/medical/PastHistory";
import Medications from "../layouts/medications/Medications";
import VerifyMedications from "../layouts/medications/VerifyMedications";
import CollectTicket from "../layouts/policies/CollectTicket";
import HippaPolicy from "../layouts/policies/HippaPolicy";
import HippaPolicyTerms from "../layouts/policies/HippaPolicyTerms";
import PracticePolicy from "../layouts/policies/PracticePolicy";
import PracticePolicyTerms from "../layouts/policies/PracticePolicyTerms";
import PrintHippa from "../layouts/policies/PrintHippa";
import PrintPractice from "../layouts/policies/PrintPractice";
import PrintTicket from "../layouts/policies/PrintTicket";
import Survey from "../layouts/policies/Survey";
import Thanks from "../layouts/policies/Thanks";
import ShoeSize from "../layouts/shoeSize/ShoeSize";
import SocialHistory from "../layouts/social/SocialHistory";
import PastSurgical from "../layouts/surgical/PastSurgical";
import SurgicalHistory from "../layouts/surgical/SurgicalHistory";

export const modules = [
  {
    component: General,
    path: "/kiosk/checkIn_General",
    title: "Check In",
  },
  {
    component: Appointment,
    path: "/kiosk/checkIn_Appointment",
    title: "Check In",
  },
  {
    component: Information,
    path: "/kiosk/demographics_Information",
    title: "Demographics Information",
  },
  {
    component: Documents,
    path: "/kiosk/demographics_documents",
    title: "Demographics Information",
  },
  {
    component: InInformation,
    path: "/kiosk/insurance_information",
    title: "Primary Insurance",
  },
  {
    component: InsuranceDocs,
    path: "/kiosk/insurance_documents",
    title: "Primary Insurance",
  },
  {
    component: Additional,
    path: "/kiosk/insurance_additional",
    title: "Primary Insurance",
  },
  {
    component: SecInInformation,
    path: "/kiosk/insurance_info_secondary",
    title: "Secondary Insurance",
  },
  {
    component: SecInsuranceDocs,
    path: "/kiosk/insurance_docs_secondary",
    title: "Secondary Insurance",
  },
  // {
  //   component: ChangeInfo,
  //   path: "/kiosk/insurance_change_info",
  //   title: "Change Insurance Information",
  // },
  {
    component: Allergies,
    path: "/kiosk/allergies_add",
    title: "Allergies",
  },
  {
    component: Active,
    path: "/kiosk/allergies_active",
    title: "Allergies",
  },
  {
    component: Medications,
    path: "/kiosk/medications_add",
    title: "Medications",
  },
  {
    component: VerifyMedications,
    path: "/kiosk/medications_verify",
    title: "Medications",
  },
  {
    component: FamilyHistory,
    path: "/kiosk/family_history",
    title: "Family History",
  },
  {
    component: MedicalHistory,
    path: "/kiosk/medical_add",
    title: "Medical History",
  },
  {
    component: PastHistory,
    path: "/kiosk/medical_past",
    title: "Medical History",
  },
  {
    component: SurgicalHistory,
    path: "/kiosk/surgical_add",
    title: "Surgical History",
  },
  {
    component: PastSurgical,
    path: "/kiosk/surgical_past",
    title: "Surgical History",
  },
  {
    component: SocialHistory,
    path: "/kiosk/social_history",
    title: "Social History",
  },
  {
    component: ShoeSize,
    path: "/kiosk/shoe_size",
    title: "Shoe Size",
  },
  {
    component: HippaPolicyTerms,
    path: "/kiosk/policies_hippa_terms",
    title: "",
  },
  {
    component: HippaPolicy,
    path: "/kiosk/hippa_policy",
    title: "",
  },
  // {
  //   component: PrintHippa,
  //   path: "/kiosk/hippa_print",
  //   title: "",
  // },
  {
    component: PracticePolicyTerms,
    path: "/kiosk/policies_practice_terms",
    title: "",
  },
  {
    component: PracticePolicy,
    path: "/kiosk/practice_policy",
    title: "",
  },
  // {
  //   component: PrintPractice,
  //   path: "/kiosk/practice_print",
  //   title: "",
  // },
  {
    component: PrintTicket,
    path: "/kiosk/print_ticket",
    title: "",
  },
  {
    component: CollectTicket,
    path: "/kiosk/collect_ticket",
    title: "",
  },
  {
    component: Survey,
    path: "/kiosk/survey",
    title: "",
  },
  {
    component: Thanks,
    path: "/kiosk/thanks",
    title: "",
  },
];
