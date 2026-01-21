# Kiosk App - V2 Integration Complete

## ✅ Implementation Summary

The kiosk app has been updated to integrate seamlessly with the v2 CareSync system. All required changes have been implemented:

### 1. **Encounter ID Verification Screen** ✅
- **File**: `src/views/EncounterVerification.jsx` (NEW)
- **Features**:
  - Input field for encounter ID
  - Real-time verification with v2 API
  - Patient name confirmation
  - Error handling for invalid IDs
  - Loading states and animations
  - Session storage for encounter ID and patient ID

### 2. **Removed UserInfo Section** ✅
- **Updated**: `src/views/Preview.jsx`
- **Changes**:
  - Removed `userInfo` object from data submission
  - Patient demographics now come from v2 system only
  - Cleaner data structure matching v2 requirements

### 3. **New API Integration** ✅
- **File**: `src/apis/api.js`
- **New Functions**:
  - `verifyEncounterId(encounterId)` - Verifies encounter ID with v2
  - `submitKioskDataToV2(patientId, kioskData)` - Submits complete kiosk data to v2
- **Configuration**:
  - Dual API support (old and v2)
  - Environment variable for v2 URL: `REACT_APP_V2_API_URL`

### 4. **Updated Routing** ✅
- **File**: `src/utils/Routings.jsx`
- **Changes**:
  - Added `/encounter-verification` route
  - Welcome screen now redirects to verification instead of direct check-in

### 5. **Updated Welcome Screen** ✅
- **File**: `src/views/Welcome.jsx`
- **Changes**:
  - "Start Here" button now goes to encounter verification
  - Ensures all patients verify before check-in

---

## 🚀 How It Works Now

### Patient Flow

```
1. Welcome Screen
   └─> Click "Start Here"
       
2. Encounter Verification
   └─> Enter Encounter ID (e.g., 888470)
       └─> API: GET /api/patients/verify-encounter?encounterId=888470
           └─> Success: Shows patient name + doctor
               └─> Stores patientId and encounterId in session
                   └─> Redirects to check-in forms (2 seconds)
           └─> Error: Shows error message, allows retry

3. Check-In Forms
   └─> Patient completes:
       - Demographics (address, phone, email)
       - Allergies
       - Medications
       - Medical history
       - Surgical history
       - Family history
       - Social history
       - Shoe size
       - HIPAA signature
       - Practice policies signature
       - Survey

4. Preview & Submit
   └─> Review all information
       └─> Click "Submit"
           └─> API: POST /api/kiosk/submit
               └─> Body: { patientId, kioskData }
                   └─> Success: 
                       - Data saved to Firestore
                       - Patient checked in
                       - Added to doctor's queue
                       - Timer tracking started
                   └─> Shows success message
                       └─> Redirects to welcome (3 seconds)
```

---

## 📁 Files Modified/Created

### New Files
1. `src/views/EncounterVerification.jsx` - Encounter ID verification screen

### Modified Files
1. `src/views/Welcome.jsx` - Updated start button URL
2. `src/views/Preview.jsx` - Updated data submission logic
3. `src/apis/api.js` - Added v2 API functions
4. `src/utils/Routings.jsx` - Added verification route
5. `.env` - Added v2 API URL configuration

---

## 🔧 Configuration

### Environment Variables

Add to `.env`:
```env
# V2 API URL (update for production)
REACT_APP_V2_API_URL=http://localhost:3000/api

# Google Maps API Key (existing)
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyA7FgyMAsU6pr22cpAWTW7jREsutJ0AnOw
```

### Production URLs
```env
# Development
REACT_APP_V2_API_URL=http://localhost:3000/api

# Staging
REACT_APP_V2_API_URL=https://staging.caresync.com/api

# Production
REACT_APP_V2_API_URL=https://caresync.com/api
```

---

## 🧪 Testing Instructions

### 1. Start Both Servers

**Terminal 1 - V2 System:**
```bash
cd v2
pnpm dev
# Running on http://localhost:3000
```

**Terminal 2 - Kiosk App:**
```bash
cd kiosk
pnpm start
# Running on http://localhost:3001 (or 3002)
```

### 2. Test Encounter Verification

1. Open kiosk: `http://localhost:3001`
2. Click "Start Here"
3. Enter valid encounter ID: `888470` (from appointments_data.xlsx)
4. **Expected**: 
   - Success message with patient name
   - Shows doctor name
   - Redirects to check-in after 2 seconds

**Test Invalid ID:**
1. Enter: `999999`
2. **Expected**: Error "Encounter ID not found"

### 3. Test Complete Flow

1. Start from welcome
2. Verify encounter ID
3. Complete all check-in forms:
   - Enter phone: `555-1234`
   - Enter email: `test@example.com`
   - Add allergy: `Penicillin`
   - Add medication: `Aspirin 81mg Daily`
   - Complete family history
   - Complete social history
   - Enter shoe size: `10`
   - Sign HIPAA policy
   - Sign practice policies
   - Complete survey
4. Review information
5. Click "Submit"
6. **Expected**:
   - Success toast: "Your appointment was checked in successfully!"
   - Redirects to welcome after 3 seconds
7. **Verify in v2**:
   - Go to v2 Patients section
   - Find patient with encounter ID `888470`
   - Status should be "Waiting"
   - "Arr Time" should show check-in time
8. **Verify in v2 Dashboard**:
   - Doctor's waiting count increased
   - Patient appears in queue

### 4. Test Error Handling

**Network Error:**
1. Stop v2 server
2. Try to verify encounter ID
3. **Expected**: Error message about connection

**Validation Error:**
1. Complete forms with empty required fields
2. Try to submit
3. **Expected**: Validation error messages

---

## 📊 Data Structure Changes

### Before (Old Structure)
```json
{
  "userInfo": {
    "fullName": "John Doe",
    "dob": "1990-01-15",
    "gender": "Male"
  },
  "demographicsInfo": { ... },
  "allergies": [ ... ],
  ...
}
```

### After (New Structure - No userInfo)
```json
{
  "patientId": "patient-1234567890-0",
  "encounterId": "888470",
  "demographicsInfo": {
    "address": "123 Main St",
    "city": "Springfield",
    "zipcode": "62701",
    "email": "john@example.com",
    "phone": "555-1234",
    "address2": "",
    "state": "IL"
  },
  "allergies": [
    {
      "allergiesDescription": "Penicillin",
      "severity": "Severe"
    }
  ],
  "medications": [ ... ],
  "familyHistory": { ... },
  "medicalHistory": [ ... ],
  "surgicalHistory": [ ... ],
  "socialHistory": { ... },
  "shoeSize": { "shoeSize": "10" },
  "hippaPolicy": { ... },
  "practicePolicies": { ... },
  "survey": { ... },
  "checkInTime": "2026-01-22T10:00:00Z",
  "createdAt": "2026-01-22T10:00:00Z",
  "updatedAt": "2026-01-22T10:00:00Z"
}
```

**Key Changes:**
- ❌ Removed `userInfo` section
- ✅ Added `patientId` at root level
- ✅ Added `encounterId` at root level
- ✅ Patient name, DOB, gender now come from v2 system
- ✅ Only kiosk-collected data is submitted

---

## 🔄 API Integration Details

### Endpoint 1: Verify Encounter ID

**Request:**
```javascript
GET /api/patients/verify-encounter?encounterId=888470
```

**Response (Success 200):**
```json
{
  "id": "patient-1234567890-0",
  "firstName": "John",
  "lastName": "Doe",
  "appointmentProviderName": "Dr. Smith",
  "appointmentTime": "10:30 AM"
}
```

**Response (Error 404):**
```json
{
  "error": "Patient not found"
}
```

### Endpoint 2: Submit Kiosk Data

**Request:**
```javascript
POST /api/kiosk/submit
Content-Type: application/json

{
  "patientId": "patient-1234567890-0",
  "kioskData": {
    "patientId": "patient-1234567890-0",
    "encounterId": "888470",
    "demographicsInfo": { ... },
    "allergies": [ ... ],
    "medications": [ ... ],
    ...
  }
}
```

**Response (Success 200):**
```json
{
  "success": true,
  "kioskDataId": "kiosk-1737552000000",
  "message": "Kiosk data submitted and patient checked in successfully"
}
```

**Response (Error 400):**
```json
{
  "error": "Validation failed",
  "details": [
    "Patient ID is required",
    "Phone number is required"
  ]
}
```

---

## 🐛 Troubleshooting

### Issue: "Session expired" error
**Solution**: Encounter verification must be completed before check-in. Start from welcome screen.

### Issue: Network error when verifying
**Solution**: Ensure v2 server is running on http://localhost:3000

### Issue: CORS error in browser console
**Solution**: V2 Next.js automatically handles CORS. Check if v2 server is running.

### Issue: Patient not appearing in v2 dashboard
**Solution**: 
1. Check browser console for API errors
2. Verify encounter ID matches uploaded patient
3. Ensure v2 server has no errors

### Issue: Validation errors on submit
**Solution**:
1. Ensure all required fields filled:
   - Phone number
   - Email address
2. Check browser console for detailed errors

---

## 📝 Development Notes

### Session Storage Keys
- `encounterId` - Stored after verification
- `patientId` - Stored after verification
- `patient` - Legacy, kept for backwards compatibility

### Component Dependencies
- Material-UI (`@mui/material`) - UI components
- `react-hot-toast` - Toast notifications
- `react-router-dom` - Navigation
- `axios` - HTTP client

### Code Style
- Functional components with hooks
- Async/await for API calls
- Try-catch for error handling
- Toast notifications for user feedback

---

## ✅ Checklist for Deployment

- [ ] Update `REACT_APP_V2_API_URL` in production `.env`
- [ ] Test encounter verification with production data
- [ ] Test complete check-in flow
- [ ] Verify data appears correctly in v2 system
- [ ] Test error scenarios (invalid ID, network issues)
- [ ] Check mobile responsiveness
- [ ] Verify session storage cleanup
- [ ] Test with multiple patients
- [ ] Confirm Firestore data structure
- [ ] Load test with concurrent check-ins

---

## 🎉 Summary

**Kiosk app is now fully integrated with v2!**

✅ Encounter ID verification before check-in  
✅ Clean data structure (no userInfo duplication)  
✅ Real-time API communication with v2  
✅ Automatic patient check-in and queue management  
✅ Timer tracking starts automatically  
✅ Error handling and user feedback  
✅ Session management  
✅ Production-ready configuration  

**Ready for testing and deployment!** 🚀
