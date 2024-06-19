# AreUnemia App API
This is the API for AreUnemia Application API. It's a RESTful API that provides access to the users, and medications.

## Build
- Node.js
- Express.js
- Bcrypt
- JWT Token
- @google-cloud/firestore

## Installation

Below is the first step consist of instructions on installing and setting up your app.

Install NPM Package
```bash
  npm install 
```
Setting package.json
```bash
  npm init
```
Install Express.js 
```bash
  npm install express
```
Install Bcrypt
```bash
  npm install bcryptjs
```
Install JWT Token
```bash
  npm install jsonwebtoken
```
Install @google-cloud/firestore
```bash
  npm install @google-cloud/firestore
```

## Configuration 
Create a configuration folder named "config" that contains the following:
- secret key for bcrypt
- service account key for access to Google Cloud

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
