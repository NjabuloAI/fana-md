const { fana } = require("../njabulo/fana");
const yts = require("yt-search");

fana({
  nomCom: "yts",
  aliases: ["ytsearch"],
  categorie: "Search",
  reaction: "🔍",
  description: "Search for YouTube videos."
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;
  try {
    if (!arg[0]) return repondre("Please provide a search query.");

    const searchQuery = arg.join(" ");
    await repondre(`🔍 Searching for "${searchQuery}"...`);

    const results = await yts(searchQuery);

    if (!results.videos.length) return repondre("No results found.");

    let resultText = `*YouTube Search Results for "${searchQuery}"*\n\n`;
    results.videos.slice(0, 5).forEach((video, index) => {
      resultText += `*${index + 1}.* ${video.title}\n`;
      resultText += `URL: ${video.url}\n\n`;
    });

    const img = results.videos[0].thumbnail;

    await zk.sendMessage(dest, { 
      image: { 
        url: img 
      }, 
      caption: resultText
    });
  } catch (err) {
    console.error(err);
    repondre("An error occurred while searching for videos.");
  }
});



