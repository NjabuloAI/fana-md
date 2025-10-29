const { fana } = require("../njabulo/fana");
const { getAllSudoNumbers, isSudoTableNotEmpty } = require("../bdd/sudo");
const conf = require("../set");

let contacts = {};

fana({ 
  nomCom: "vcontact", 
  aliases: ["card", "contact"], 
  categorie: "vcard", 
  reaction: "📇" 
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;
  try {
    const quotedMessage = ms.quoted ? ms.quoted : ms;
    const quotedSender = quotedMessage.sender;
    if (!quotedSender) {
      return repondre('Reply to a user\'s message to save their number.');
    }
    if (!arg[0]) {
      const phoneNumber = quotedSender.split('@')[0].replace(/[^0-9]/g, '');
      const vcardString = `BEGIN:VCARD\n` + `VERSION:3.0\n` + `FN:${quotedSender}\n` + `TEL;type=CELL;type=VOICE;waid=${phoneNumber}:${phoneNumber}\n` + `END:VCARD`;
      zk.sendMessage(dest, {
        contacts: {
          displayName: quotedSender,
          contacts: [{ displayName: quotedSender, vcard: vcardString }]
        }
      });
    } else {
      const name = arg.join(' ');
      const phoneNumber = quotedSender.split('@')[0].replace(/[^0-9]/g, '');
      const vcardString = `BEGIN:VCARD\n` + `VERSION:3.0\n` + `FN:${name}\n` + `TEL;type=CELL;type=VOICE;waid=${phoneNumber}:${phoneNumber}\n` + `END:VCARD`;
      zk.sendMessage(dest, {
        contacts: {
          displayName: name,
          contacts: [{ displayName: name, vcard: vcardString }]
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});
