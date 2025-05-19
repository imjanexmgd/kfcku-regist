import { faker } from '@faker-js/faker/locale/id_ID';
import random from 'random';
import {
  encryptData,
  validateUser,
  requestSmsOtp,
  validateOtp,
  registerAccount,
  sendVerificationEmail,
  settAccount,
} from './kfc_func.js';
import 'dotenv/config';
// import config from './config.js.json' assert { type: 'json' };
import { checkCode, getBalance, orderNum, changeStatus } from './smshub.js';
import fs from 'fs';
import path from 'path';
import { readFile } from 'fs/promises';

const config = JSON.parse(
  await readFile(path.join(process.cwd(), 'config.json'))
);
const randomYear = () => {
  const currentDate = new Date();
  const randomYear = Math.floor(Math.random() * (2004 - 2000 + 1)) + 2000;
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${randomYear}-${month}-${day}`;
};

function saveAccountData(phone, email, pin) {
  const filePath = 'result.txt';
  const line = `${phone} ${email} ${pin}\n`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, line, 'utf8');
  } else {
    fs.appendFileSync(filePath, line, 'utf8');
  }
}

const readResult = async () => {
  try {
    let filePath = path.join(process.cwd(), 'result.txt');
    if (!fs.existsSync(filePath)) {
      console.log(`Creating file ${filePath}`);
      fs.open(filePath, 'w', (err) => {
        if (err) {
          throw err;
        }
        console.log('success creating file');
      });
    }
    const listAccount = await readFile(filePath, 'utf-8');
    let accountJson = [];
    listAccount
      .split('\n')
      .slice(0, -1)
      .map((line) => {
        const [phoneNum, email, pin] = line.split(' ');
        accountJson.push({ phoneNum, email, pin });
      });
    return accountJson;
  } catch (error) {
    throw error;
  }
};

(async () => {
  try {
    process.stdout.write('\x1Bc');
    console.log(`KFCKU X SMSHUB AUTO REGISTER\nMADE WITH ❤️ BY JANEXMGD`);

    const jsonAccount = await readResult();
    await getBalance();
    const MAX_WAIT_TIME = 30000;
    const CHECK_INTERVAL = 3000;
    const MAX_RETRIES = 3;
    const { orderid, number } = await orderNum();
    let phoneNumber = number;
    let email;
    while (true) {
      const { email_address } = config;
      const [username, domain] = email_address.split('@');
      email = `${username}+${random.int(0, 9999)}@${domain}`;
      const isEmailUsed = jsonAccount.every(
        (account) => account.email !== email
      );
      if (isEmailUsed) {
        break;
      } else {
        console.log(`email ${email} already used`);
      }
    }
    console.log(`Checking phone number: ${phoneNumber} and email: ${email}`);
    const doValidate = await validateUser(phoneNumber, email);
    console.log(doValidate.response_output.detail);

    // name for account
    let nameAccount;
    let name = `${faker.person.fullName({ sex: config.gender })}`;
    let nameArr = name.split(' ');
    if (nameArr.length == 3) {
      if (nameArr[0] === nameArr[1]) {
        name = `${nameArr[1]} ${nameArr[2]}`;
        nameAccount = name;
      } else {
        nameAccount = name;
      }
    } else {
      nameAccount = name;
    }

    // refferrall code
    let referral_code = config.REFF_CODE || null;
    console.log(`{
phoneNumber: ${phoneNumber},
email: ${email},        
name: ${nameAccount},
referral_code: ${referral_code},
}`);
    console.log(`Trying encrypt data`);
    const doEncryptData = await encryptData(
      phoneNumber,
      email,
      nameAccount,
      referral_code
    );
    const encryptedData = doEncryptData.response_output.detail.encrypted_data;
    console.log(`Encrypted data: ${encryptedData}`);

    let retryCount = 0;
    let code;
    let id = orderid;

    while (retryCount < MAX_RETRIES) {
      console.log(`\rTrying to request sms otp (attempt ${retryCount + 1})`);
      let doRequestSmsOtp;
      if (retryCount == 0) {
        doRequestSmsOtp = await requestSmsOtp(encryptedData, 'whatsapp');
      } else {
        doRequestSmsOtp = await requestSmsOtp(encryptedData, 'sms');
      }
      console.log(doRequestSmsOtp.response_output.detail);

      let totalTimeWaited = 0;
      while (totalTimeWaited <= MAX_WAIT_TIME) {
        if (totalTimeWaited == 0) {
          console.log(`checking otp orderid ${id} (try ${retryCount + 1})`);
        }
        process.stdout.write(`\rWAITING OTP ${totalTimeWaited}ms`);
        await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));
        code = await checkCode(id);
        if (code != undefined) {
          console.log(`\nchanging status orderid ${id} to success`);
          const status = await changeStatus(id, '6');
          console.log(`status orderid ${id} to ${status}`);
          break;
        }
        totalTimeWaited += CHECK_INTERVAL;
        if (retryCount == 3) {
          console.log(`\nTimeout waiting for OTP`);
          const status = await changeStatus(id, '8');
          console.log(`status orderid ${id} to ${status}`);
          break;
        }
      }
      if (code) {
        break;
      }
      retryCount++;
    }

    if (!code) {
      console.log(`\rFailed no otp code,please re run the code`);
      return;
    }
    const otp = code.split(' ')[3].replace('.', '');
    console.log(`OTP: ${otp}`);
    console.log(`Trying to validate otp`);
    const doValidateOtp = await validateOtp(encryptedData, otp);
    console.log(doValidateOtp.response_output.detail);

    console.log(`Trying to register`);
    const pin = config.pin;
    const doRegister = await registerAccount(pin, encryptedData);
    console.log(`Success register`);

    console.log(doRegister.response_output.detail);
    saveAccountData(phoneNumber, email, pin);
    const token = doRegister.response_output.detail.token;
    const sendingVerificationEmail = await sendVerificationEmail(token);
    console.log(sendingVerificationEmail.response_output.detail);
    console.log(`Please check your email to verify your account`);
    console.log(`Trying set birthdate`);
    const formattedDate = randomYear();
    const gender = config.gender;
    const doSetAccount = await settAccount(
      token,
      nameAccount,
      gender,
      formattedDate,
      email
    );
    console.log(doSetAccount.response_output.detail);
    console.log(`Success set account`);

    console.log(`process done`);
  } catch (error) {
    console.log(error);
    console.log(error.response.data);
  }
})();
