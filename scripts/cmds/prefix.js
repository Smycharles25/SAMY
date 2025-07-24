const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "1.4",
    author: "samycharles",
    countDown: 5,
    role: 0,
    description: "Changer le préfixe du bot dans un groupe ou globalement (admin uniquement)",
    category: "config",
    guide: {
      fr: "{pn} <nouveau préfixe> : Change le préfixe dans ce groupe\n{pn} <nouveau préfixe> -g : Change le préfixe global (admin uniquement)\n{pn} reset : Réinitialise le préfixe à celui par défaut",
      en: "{pn} <new prefix>: Change prefix in this group\n{pn} <new prefix> -g: Change prefix globally (admin only)\n{pn} reset: Reset prefix to default"
    }
  },

  langs: {
    fr: {
      reset: "🔁 Préfixe réinitialisé : %1",
      onlyAdmin: "🚫 Seul un admin peut modifier le préfixe global.",
      confirmGlobal: "❗ Réagis à ce message pour confirmer le changement du préfixe **global**.",
      confirmThisThread: "❗ Réagis à ce message pour confirmer le changement du préfixe **dans ce groupe**.",
      successGlobal: "✅ Préfixe **global** changé en : %1",
      successThisThread: "✅ Préfixe **du groupe** changé en : %1",
      myPrefix:
        "╭─🍬🍭 𝑷𝑹𝑬𝑭𝑰𝑿 𝒅𝒆 𝐒𝐚𝐦𝐲 💖🍡🍩\n" +
        "│🍒 Global : 『 %1 』\n" +
        "│🍓 Groupe : 『 %2 』\n" +
        "│🍫 Créateur : https://www.facebook.com/samycharles.25\n" +
        "╰──────────🍰"
    },
    en: {
      reset: "🔁 Prefix reset to default: %1",
      onlyAdmin: "🚫 Only admin can change system prefix.",
      confirmGlobal: "❗ Please react to confirm global prefix change.",
      confirmThisThread: "❗ Please react to confirm group prefix change.",
      successGlobal: "✅ Global prefix changed to: %1",
      successThisThread: "✅ Group prefix changed to: %1",
      myPrefix:
        "╭─🍬🍭 𝑷𝑹𝑬𝑭𝑰𝑿 𝒅𝒆 𝐒𝐚𝐦𝐲 💖🍡🍩\n" +
        "│🍒 Global : 『 %1 』\n" +
        "│🍓 Group  : 『 %2 』\n" +
        "│🍫 Creator : https://www.facebook.com/samycharles.25\n" +
        "╰──────────🍰"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0]) return message.SyntaxError();

    if (args[0] == 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix,
      setGlobal: args[1] === "-g"
    };

    if (formSet.setGlobal && role < 2) return message.reply(getLang("onlyAdmin"));

    return message.reply(
      getLang(formSet.setGlobal ? "confirmGlobal" : "confirmThisThread"),
      (err, info) => {
        formSet.messageID = info.messageID;
        global.GoatBot.onReaction.set(info.messageID, formSet);
      }
    );
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, getLang }) {
    if (event.body?.toLowerCase() === "prefix") {
      const globalPrefix = global.GoatBot.config.prefix;
      const threadPrefix = utils.getPrefix(event.threadID);
      return message.reply(getLang("myPrefix", globalPrefix, threadPrefix));
    }
  }
};
