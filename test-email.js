const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

(async function() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@raisinreach.com',
      to: 'reach@raisinreach.com', // Assuming this is the desired recipient
      subject: 'RaisinReach System Test',
      html: '<h1>It Works!</h1><p>Your email infrastructure is fully operational.</p>'
    });

    console.log('Test Email Sent Successfully!');
    console.log('ID:', data.data?.id);
    console.log('Error:', data.error);
  } catch (error) {
    console.error('Test Failed:', error);
  }
})();
