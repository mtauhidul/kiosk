import AllergiesIcon from '../assets/icons/allergies.svg';
import CheckInIcon from '../assets/icons/checkin.svg';
import DemoIcon from '../assets/icons/demographics.svg';
import FamilyIcon from '../assets/icons/family.svg';
import InsuranceIcon from '../assets/icons/insurance.svg';
import MedicalIcon from '../assets/icons/medical.svg';
import MedicationsIcon from '../assets/icons/medications.svg';
import ShoeIcon from '../assets/icons/shoe.svg';
import SocialIcon from '../assets/icons/social.svg';
import SurgicalIcon from '../assets/icons/surgical.svg';

export const listItems = [
  {
    item: 'Check In',
    icon: CheckInIcon,
    url: '/kiosk/checkIn_General',
  },
  {
    item: 'Demographics',
    icon: DemoIcon,
    url: '/kiosk/demographics_Information',
  },
  {
    item: 'Insurance',
    icon: InsuranceIcon,
    url: '/kiosk/insurance_information',
  },
  {
    item: 'Allergies',
    icon: AllergiesIcon,
    url: '/kiosk/allergies_add',
  },
  {
    item: 'Medications',
    icon: MedicationsIcon,
    url: '/kiosk/medications_add',
  },
  {
    item: 'Family History',
    icon: FamilyIcon,
    url: '/kiosk/family_history',
  },
  {
    item: 'Medical History',
    icon: MedicalIcon,
    url: '/kiosk/medical_add',
  },
  {
    item: 'Surgical History',
    icon: SurgicalIcon,
    url: '/kiosk/surgical_add',
  },
  {
    item: 'Social History',
    icon: SocialIcon,
    url: '/kiosk/social_history',
  },
  {
    item: 'Shoe Size',
    icon: ShoeIcon,
    url: '/kiosk/shoe_size',
  },
];
