import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID || 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const twilioNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

export const twilioClient = twilio(accountSid, authToken);

export const sendSMS = async (to: string, message: string) => {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: twilioNumber,
      to: to
    });
    console.log('SMS Sent:', response.sid);
    return response;
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    throw error;
  }
};

export const makeVoiceCall = async (to: string, ttsMessage: string) => {
  try {
    const response = await twilioClient.calls.create({
      twiml: `<Response><Say>${ttsMessage}</Say></Response>`,
      from: twilioNumber,
      to: to
    });
    console.log('Call Initiated:', response.sid);
    return response;
  } catch (error) {
    console.error('Twilio Call Error:', error);
    throw error;
  }
};
