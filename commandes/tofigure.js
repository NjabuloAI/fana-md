const { fana } = require('../njabulo/fana');
const axios = require('axios');
const FormData = require('form-data');
const conf = require(__dirname + '/../set');

fana({
  nomCom: "tofigure",
  aliases: ["figure", "tofigur"],
  categorie: "Images",
  reaction: "🎨"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  try {
    if (!ms || (!ms.quoted && !ms.message.imageMessage)) {
      return repondre('Please reply to or send an image with this command.');
    }

    await repondre('Creating your figure-style image... Please wait');

    let quoted;
    if (ms.quoted) {
      quoted = ms.quoted;
    } else if (ms.message.imageMessage) {
      quoted = ms;
    }

    const media = await quoted.download();
    if (!media) {
      return repondre('Failed to download the image. Try again.');
    }

    if (media.length > 10 * 1024 * 1024) {
      return repondre('The image is too large (max 10MB).');
    }

    const uploadImage = async (buffer) => {
      const form = new FormData();
      form.append('image', buffer, 'image.jpg');
      try {
        const response = await axios.post('https://telegraph.gerokuapp.com/upload', form, {
          headers: form.getHeaders(),
        });
        return response.data[0].src;
      } catch (error) {
        throw new Error(`Upload error: ${error.message}`);
      }
    };

    const imageUrl = await uploadImage(media);

    const apiURL = `https://api.fikmydomainsz.xyz/imagecreator/tofigur?url=${encodeURIComponent(imageUrl)}`;
    try {
      const response = await axios.get(apiURL);
      if (!response.data || !response.data.status || !response.data.result) {
        throw new Error('Invalid response from API');
      }
      const resultUrl = response.data.result;

      try {
        const figureBuffer = (await axios.get(resultUrl, { responseType: 'arraybuffer' })).data;

        await zk.sendMessage(
          dest,
          {
            image: Buffer.from(figureBuffer),
            caption: 'Your image has been turned into a figure-style art!',
          },
          { quoted: ms }
        );
      } catch (error) {
        throw new Error(`Error downloading or sending figure image: ${error.message}`);
      }
    } catch (error) {
      throw new Error(`API error: ${error.message}`);
    }
  } catch (err) {
    repondre(`Error while generating figure image: ${err.message}`);
  }
});
