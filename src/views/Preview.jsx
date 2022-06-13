import React from 'react';
import CalendarIcon from '../assets/icons/calender.svg';
import FamilyIcon from '../assets/icons/family.svg';
import InsuranceIcon from '../assets/icons/insurance.svg';
import MedicalIcon from '../assets/icons/medical.svg';
import MedicationsIcon from '../assets/icons/medications.svg';
import ShoeIcon from '../assets/icons/shoe.svg';
import SocialIcon from '../assets/icons/social.svg';
import SurgicalIcon from '../assets/icons/surgical.svg';
import Logo from '../assets/images/logo.svg';
import PrimaryButton from '../components/buttons/PrimaryButton';
import ScanCard from '../components/cards/ScanCard';
import PreviewCard from '../components/previewCard/PreviewCard';
import store from '../state/store';
import styles from '../styles/Preview.module.css';

const Preview = () => {
  const state = store?.getState()?.data;

  const monthsLong = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };

  const {
    allergies,
    demographicsInfo,
    familyHistory,
    hippaPolicy,
    medicalHistory,
    medications,
    practicePolicies,
    primaryInsurance,
    secondaryInsurance,
    shoeSize,
    socialHistory,
    surgicalHistory,
    survey,
    userInfo,
  } = state;
  // toJSON(state);

  return (
    <div className={styles.previewContainer}>
      <div id={styles.item_0}>
        <img src={Logo} alt='Logo' />
      </div>
      <div id={styles.item_1}>
        <img src={demographicsInfo?.patientsPicture} alt='Insurance Card' />
        <h2 className='header2'>{demographicsInfo?.user?.fullName}</h2>
      </div>
      <div id={styles.item_2}>
        <PrimaryButton text='Approve' url='/' />
      </div>
      <div id={styles.item_3}>
        <PrimaryButton text='Edit Information' url='/kiosk/checkIn_General' />
      </div>
      <div id={styles.item_4}>
        <ScanCard
          title='DRIVER’S LICENSE'
          subTitle=''
          img={demographicsInfo?.driversLicense}
          alt='License'
          btnText='Review'
        />
      </div>
      <div id={styles.item_5}>
        <PreviewCard
          icon={InsuranceIcon}
          title='Allergies'
          text='Active allergies:'
          info={allergies}
        />
        <PreviewCard
          icon={MedicationsIcon}
          title='Medications'
          text=''
          info={medications}
        />
        <PreviewCard
          icon={FamilyIcon}
          title='Family History'
          text='Does (Did) your mother or father have diabetes?'
          info={[familyHistory.diabetes.toUpperCase()]}
        />
      </div>
      <div id={styles.item_6}>
        <div className={styles.insuranceHeader}>
          <img src={InsuranceIcon} alt='Insurance' />
          <h6 className='header6'>Insurance</h6>
        </div>
        <div className={styles.insuranceCardBody}>
          <div className={styles.insuranceCardLeft}>
            <br />
            <small>Active Date</small>
            <strong>Sep 30, 2014</strong>
            <small>Copay for Specialist</small>
            <strong>$40.00</strong>
          </div>
          <div className={styles.insuranceCardRight}>
            <br />
            <small>Primary Insurance </small>
            <strong>{primaryInsurance?.insuranceName}</strong>
            <small>Member ID</small>
            <strong>{primaryInsurance?.memberId}</strong>
            <small>Group Number</small>
            <strong>{primaryInsurance?.groupNumber}</strong>
            <small>Copay</small>
            <strong>$110.00</strong>
            <small>Group Name</small>
            <strong>{primaryInsurance?.groupName}</strong>
            <small>Phone Number</small>
            <strong>{primaryInsurance?.phoneNumber}</strong>

            {secondaryInsurance?.insuranceName && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: '1px solid lightgrey',
                  width: '85%',
                }}>
                <br />
                <small>Secondary Insurance </small>
                <strong>{secondaryInsurance?.insuranceName}</strong>
                <small>Member ID</small>
                <strong>{secondaryInsurance?.memberId}</strong>
                <small>Group Number</small>
                <strong>{secondaryInsurance?.groupNumber}</strong>
                <small>Copay</small>
                <strong>$110.00</strong>
                <small>Group Name</small>
                <strong>{secondaryInsurance?.groupName}</strong>
                <small>Phone Number</small>
                <strong>{secondaryInsurance?.phoneNumber}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
      <div id={styles.item_7}>
        <PreviewCard
          icon={MedicalIcon}
          title='Medical History'
          text='Past medical history:'
          info={medicalHistory}
        />
        <PreviewCard
          icon={SurgicalIcon}
          title='Surgical History'
          text=''
          info={surgicalHistory}
        />
        <div className={styles.item_7_sub}>
          <PreviewCard
            icon={SocialIcon}
            title='Social History'
            text={socialHistory?.smoke.toUpperCase()}
            info={[]}
          />
          <PreviewCard
            icon={ShoeIcon}
            title='Shoe Size'
            text='Choose your shoe size'
            info={[shoeSize?.shoeSize]}
          />
        </div>
      </div>
      <div id={styles.item_8}>
        <div className={styles.item_8_header}>
          <img src={CalendarIcon} alt='Calendar' />
          <h6 className='header6'>Last doctor's visits</h6>
        </div>
        <div className={styles.item_8_body}>
          <strong>Today, 8:45, 03 Nov 2021</strong>
        </div>
      </div>
      <div id={styles.item_9}>
        <div className={styles.item_9_content}>
          <small>Date of birth</small>
          <strong>
            {userInfo?.day}/{monthsLong[userInfo?.month]}/{userInfo?.year}
          </strong>
          <small>Primary Phone</small>
          <strong>{demographicsInfo?.phone}</strong>
          <small>Email Address</small>
          <strong>{demographicsInfo?.email}</strong>
          <small>Zipcode</small>
          <strong>{demographicsInfo?.zipcode}</strong>
        </div>
        <div className={styles.item_9_content}>
          <small>Address</small>
          <strong>{demographicsInfo?.address}</strong>
          <small>Apartment, suite, etc (optional)</small>
          <strong>{demographicsInfo?.address2}</strong>
          <small>State</small>
          <strong>{demographicsInfo?.state}</strong>
          <small>City</small>
          <strong>{demographicsInfo?.city}</strong>
        </div>
      </div>
      <div id={styles.item_10}>
        <ScanCard
          title='PRI INSURANCE CARD'
          subTitle='Front'
          img={primaryInsurance?.insuranceCardFront}
          alt='Insurance Card'
          btnText='Review'
        />
      </div>
      <div id={styles.item_11}>
        <ScanCard
          title='PRI INSURANCE CARD'
          subTitle='Back'
          img={primaryInsurance?.insuranceCardBack}
          alt='Insurance Card'
          btnText='Review'
        />
      </div>
      {secondaryInsurance?.insuranceName && (
        <div id={styles.item_12}>
          <ScanCard
            title='SEC INSURANCE CARD'
            subTitle='Front'
            img={secondaryInsurance?.insuranceCardBack}
            alt='Insurance Card'
            btnText='Review'
          />
        </div>
      )}
      {secondaryInsurance?.insuranceName && (
        <div id={styles.item_13}>
          <ScanCard
            title=' SEC INSURANCE CARD'
            subTitle='Back'
            img={secondaryInsurance?.insuranceCardBack}
            alt='Insurance Card'
            btnText='Review'
          />
        </div>
      )}
    </div>
  );
};

export default Preview;
