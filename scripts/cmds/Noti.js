module.exports = {
  config: {
    name: "noti",
    version: "1.0",
    author: "samycharles",
    countDown: 10,
    role: 2,
    description: "Envoie un message dans tous les groupes (réservé à Samy)",
    category: "owner",
    guide: {
      fr: "{pn} <message> : envoie un message dans tous les groupes",
    },
  },

  onStart: async function ({ args, message, usersData, threadsData, api, event }) {
    const SAMY_ID = "61566160637367";

    if (event.senderID !== SAMY_ID)
      return message.reply("❌ Seul mon créateur Samy peut utiliser cette commande.");

    const content = args.join(" ");
    if (!content)
      return message.reply("⚠️ Tu dois écrire un message après la commande.");

    const allThreads = await threadsData.getAll();
    const groupThreads = allThreads.filter(t => t.threadID && t.members && t.members.length > 1);

    const finalMessage = 
`╭─🍡🍓 𝑵𝑶𝑻𝑰𝑭𝑰𝑪𝑨𝑻𝑰𝑶𝑵 𝒅𝒆 𝐒𝐚𝐦𝐲 💌🍬
│📢 𝑴𝒆𝒔𝒔𝒂𝒈𝒆 𝒅𝒖 𝒄𝒓é𝒂𝒕𝒆𝒖𝒓 :
│『 ${content} 』
╰──────────────🍭`;

    let sent = 0;
    for (const thread of groupThreads) {
      try {
        await api.sendMessage(finalMessage, thread.threadID);
        sent++;
      } catch (e) {
        // Ignorer les erreurs sur groupes restreints ou bannis
      }
    }

    return message.reply(`✅ Message envoyé dans ${sent} groupes 🍥`);
  }
};
