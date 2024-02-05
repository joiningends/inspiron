const fetch = require('node-fetch');
let sentMessageCount = 0;

const sendWhatsAppMessage = (recipientNumber, message) => {
  // Define your Hisocial WhatsApp integration credentials
  const hisocialInstanceID = '654615C660E53';
  const hisocialAccessToken = '64da53e6c44e5';

  // Replace this with the actual endpoint and request format for Hisocial WhatsApp integration
  const hisocialWhatsAppEndpoint = 'https://hisocial.in/api/send';

  // Construct the request pa:yload
  const payload = {
    clientId:'6516a9a7ab3554b246d9b014',
    sender:'Inspiron',
    
    number: recipientNumber, // Use the recipient's phone number
    type: 'text',
    message: message,
    instance_id: hisocialInstanceID, // Use the Hisocial instance ID
    access_token: hisocialAccessToken, // Use the Hisocial access token
  };

  // Send the request to the Hisocial WhatsApp integration endpoint
  fetch(hisocialWhatsAppEndpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => {
      if (!response.ok) {
        console.error('Error sending WhatsApp message:', response.statusText);
      } else {
        // Increment the sent message count
        sentMessageCount++;
        console.log('WhatsApp message sent successfully');
       
        const trackingServiceUrl = 'https://waapi.joiningends.in/api/v1/groups/track-message'; // Replace with your actual URL
        fetch(trackingServiceUrl, {
          method: 'POST',
          body: JSON.stringify({ clientId: '6516a9a7ab3554b246d9b014', sender: 'Inspiron', recipient: recipientNumber, content: message }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((trackingResponse) => {
            if (trackingResponse.ok) {
              console.log('Message sent and tracked successfully');
            } else {
              console.error('Error tracking the message:', trackingResponse.statusText);
            }
          })
          .catch((trackingError) => {
            console.error('Error tracking the message:', trackingError);
          });
      }
    })
    .catch((error) => {
      console.error('Error sending WhatsApp message:', error);
    });
};

const getSentMessageCount = () => {
  return sentMessageCount;
};

const getSentWhatsAppMessages = async (req, res) => {
  try {
    const count = getSentMessageCount();

    res.json({ totalMessages: count });
  } catch (error) {
    console.error('Error retrieving sent WhatsApp messages:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve sent WhatsApp messages' });
  }
};





const sendWhatsAppMessageMedia = (recipientNumber, message,media_url) => {
  // Define your Hisocial WhatsApp integration credentials
  const hisocialInstanceID = '654615C660E53';
  const hisocialAccessToken = '64da53e6c44e5';

  // Replace this with the actual endpoint and request format for Hisocial WhatsApp integration
  const hisocialWhatsAppEndpoint = 'https://hisocial.in/api/send';
  
  console.log( media_url)
  // Construct the request payload
  const payload = {
    clientId: '6516a9a7ab3554b246d9b014',
    sender: 'Inspiron',
    number: recipientNumber, // Use the recipient's phone number
    type: 'media',
    message: message,
    media_url: media_url, // Replace with your server's URL and PDF file path
    instance_id: hisocialInstanceID, // Use the Hisocial instance ID
    access_token: hisocialAccessToken, // Use the Hisocial access token
  };

  // Send the request to the Hisocial WhatsApp integration endpoint
  fetch(hisocialWhatsAppEndpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => {
      if (!response.ok) {
        console.error('Error sending WhatsApp message:', response.statusText);
      } else {
        // Increment the sent message count
        sentMessageCount++;
        console.log('WhatsApp message sent successfully');
        const mediaMessage = `Media (pdf or image) sent.${message}`;
        const trackingServiceUrl = 'https://waapi.joiningends.in/api/v1/groups/track-message'; // Replace with your actual URL
        fetch(trackingServiceUrl, {

          method: 'POST',
          body: JSON.stringify({ clientId: '6516a9a7ab3554b246d9b014', sender: 'Inspiron', recipient: recipientNumber, content: mediaMessage }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((trackingResponse) => {
            if (trackingResponse.ok) {
              console.log('Message sent and tracked successfully');
            } else {
              console.error('Error tracking the message:', trackingResponse.statusText);
            }
          })
          .catch((trackingError) => {
            console.error('Error tracking the message:', trackingError);
          });
      }
    })
    .catch((error) => {
      console.error('Error sending WhatsApp message:', error);
    });
};


module.exports = { sendWhatsAppMessage, getSentWhatsAppMessages, getSentMessageCount,sendWhatsAppMessageMedia };
