# KFCKU-REGIST

a tool for creating account at app kfcku, using gmail for email verification (just one email), smshub for otp. Auto set birthday at current date

## HOW TO RUN

- Install package

```
npm install
```

- Setup your configuration at config.json

```
{
  "email_address": "meguminkato00@gmail.com", // change with your email
  "pin": "192799",
  "gender": "male",
  "REFF_CODE": "TH8ZFW"
}

```

- Run package

```
node index.js
```

the account result will be saved at result.txt with format

```
phoneNumber email pin
```
