import axios from 'axios';
import FormData from 'form-data';
let headers = {
  'User-Agent': 'KFCKU/4.1.0 (Android 13; Redmi Note 8; ginkgo; arm64-v8a)',
  'Accept-Encoding': 'gzip',
  'Content-Type': 'application/json',
  'sec-ch-ua-mobile': '?1',
  channel: 'mobile',
  'device-id': '194a63eea70ee03b',
  'sec-ch-ua-platform-version': '13',
  'notif-token':
    'cJSmXC9VR1OlKAzrBVqNqw:APA91bHsSTAMiJdH2It31Lv7i9qp-H9xOQDpvFvfO81e_hcPbZ8FDDpO1qLZ8MEaLXSUV0-H-rw8mN_RUkNoNetZS3DtIXDxux-T4le7yYHjiVoCHXvY3a0',
  'sec-ch-ua-model': 'Redmi Note 8',
  'sec-ch-ua-arch': 'arm64-v8a',
  language: 'en',
  'accept-language': 'en',
  'sec-ch-ua-full-version': '4.1.0',
  'sec-ch-ua-platform': 'Android',
  'sec-ch-ua': '"KFCKU"; v="4.1.0"',
};
export const validateUser = async (phoneNumber, email) => {
  try {
    const { data } = await axios.post(
      'https://api-core.kfcku.co.id/v1/user/validate-user',
      {
        phone: phoneNumber, // 838452
        email: email, // email
      },
      {
        headers,
      }
    );
    return data;
  } catch (error) {
    console.log('fail to validate user');
    throw error;
  }
};
export const encryptData = async (
  phoneNumber,
  email,
  fullname,
  referral_code
) => {
  try {
    const { data } = await axios.post(
      'https://api-core.kfcku.co.id/v1/user/encrypt-data',
      {
        phone: phoneNumber,
        email: email,
        fullname: fullname,
        referral_code: referral_code || null,
      }
    );
    return data;
  } catch (error) {
    console.log('fail to encrypt data');
    throw error;
  }
};
export const requestSmsOtp = async (encrypted_data, service) => {
  try {
    const { data } = await axios.post(
      'https://api-core.kfcku.co.id/v1/common/otp/request',
      {
        encrypted_data: encrypted_data,
        otp_method: service,
        purpose: 'register',
      },
      {
        headers,
      }
    );
    return data;
  } catch (error) {
    console.log(`Fail request sms otp`);
    throw error;
  }
};
export const validateOtp = async (encrypted_data, otp) => {
  try {
    const { data } = await axios.post(
      'https://api-core.kfcku.co.id/v1/common/otp/validate',
      {
        encrypted_data: encrypted_data,
        code: `${otp}`,
        purpose: 'register',
      },
      {
        headers,
      }
    );
    return data;
  } catch (error) {
    console.log('fail to validate otp');
    throw error;
  }
};
export const registerAccount = async (pin, encrypted_data) => {
  try {
    const { data } = await axios.post(
      'https://api-core.kfcku.co.id/v1/user/register',
      {
        pin_number: pin,
        encrypted_data: encrypted_data,
      },
      {
        headers,
      }
    );
    return data;
  } catch (error) {
    console.log(`fail register account`);
    throw error;
  }
};
export const sendVerificationEmail = async (token) => {
  try {
    const { data } = await axios.get(
      'https://api-core.kfcku.co.id/v1/user/me/profile/send-verification-email',
      {
        headers: {
          'User-Agent':
            'KFCKU/4.1.0 (Android 13; Redmi Note 8; ginkgo; arm64-v8a)',
          'Accept-Encoding': 'gzip',
          'sec-ch-ua-mobile': '?1',
          channel: 'mobile',
          'device-id': '194a63eea70ee03b',
          authorization: `Bearer ${token}`,
          'sec-ch-ua-platform-version': '13',
          'content-type': 'application/json',
          'notif-token':
            'cJSmXC9VR1OlKAzrBVqNqw:APA91bHsSTAMiJdH2It31Lv7i9qp-H9xOQDpvFvfO81e_hcPbZ8FDDpO1qLZ8MEaLXSUV0-H-rw8mN_RUkNoNetZS3DtIXDxux-T4le7yYHjiVoCHXvY3a0',
          'sec-ch-ua-model': 'Redmi Note 8',
          'sec-ch-ua-arch': 'arm64-v8a',
          language: 'en',
          'accept-language': 'en',
          'sec-ch-ua-full-version': '4.1.0',
          'sec-ch-ua-platform': 'Android',
          'sec-ch-ua': '"KFCKU"; v="4.1.0"',
        },
      }
    );
    return data;
  } catch (error) {
    console.log(`fail send verification email`);
    throw error;
  }
};
export const settAccount = async (token, full_name, gender, dob, email) => {
  try {
    const form = new FormData();
    form.append('full_name', full_name);
    form.append('gender', gender.toUpperCase());
    form.append('dob', `${dob}`); // YYYY-MM-DD
    form.append('email', `${email}`);
    const { data } = await axios.put(
      'https://api-core.kfcku.co.id/v1/user/me/profile',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'User-Agent':
            'KFCKU/4.1.0 (Android 13; Redmi Note 8; ginkgo; arm64-v8a)',
          'Accept-Encoding': 'gzip',
          'sec-ch-ua-mobile': '?1',
          channel: 'mobile',
          'device-id': '194a63eea70ee03b',
          authorization: `Bearer ${token}`,
          'sec-ch-ua-platform-version': '13',
          // 'content-type': 'application/json',
          'notif-token':
            'cJSmXC9VR1OlKAzrBVqNqw:APA91bHsSTAMiJdH2It31Lv7i9qp-H9xOQDpvFvfO81e_hcPbZ8FDDpO1qLZ8MEaLXSUV0-H-rw8mN_RUkNoNetZS3DtIXDxux-T4le7yYHjiVoCHXvY3a0',
          'sec-ch-ua-model': 'Redmi Note 8',
          'sec-ch-ua-arch': 'arm64-v8a',
          language: 'en',
          'accept-language': 'en',
          'sec-ch-ua-full-version': '4.1.0',
          'sec-ch-ua-platform': 'Android',
          'sec-ch-ua': '"KFCKU"; v="4.1.0"',
        },
      }
    );
    return data;
  } catch (error) {
    console.log(`fail set birth date`);
    throw error;
  }
};
