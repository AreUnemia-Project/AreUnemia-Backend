## API Endpoints
Base URL : http://localhost:8080

Deployment URL : https://backend-areunemia-3cv52zngvq-et.a.run.app (Using JWT Token)

## User
| Endpoint | Parameter | Body | Method    | Description                |
| :--------|:-------- | :------- |:------- | :------------------------- |
| /api/register |`-`| name, gender, birthdate, email, password | `POST` | Register New Email User |
| /api/login|`-`| email, password| `POST` | Login Email User  |
| /api/updateUser|`-` | name, birthdate, gender    | `PUT` | Update User Profile Data|
| /api/updatePassword|`-`| oldPassword, password, confirmpassword| `PUT` | Update User Password |

## Medications
| Endpoint | Parameter| Body | Method    | Description                |
| :--------|:-------- |:-------| :------- | :------------------------- |
| /api/medication |`-` | medicationName, dosage, schedule, notes | `POST` | Add Medication |
| /api/medication|`-`| medicationName |`DELETE` | Delete Medication  |
| /api/medication|`-` | -   | `GET` | Get Medications List|
| /api/medication|`-` | medicationName, timeToRemove  | `PUT` | Delete the medication schedule |
