const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("../db");

const data = new SlashCommandBuilder()
  .setName("removewebhook")
  .setDescription("Menghapus webhook dari database")
  .addStringOption((option) =>
    option
      .setName("url")
      .setDescription("URL webhook yang ingin dihapus")
      .setRequired(true)
  );

async function run({ interaction }) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: "Maaf kamu tidak punya izin untuk menggunakan perintah ini",
      ephemeral: true,
    });
  }

  const webhookUrl = interaction.options.getString("url");

  db.get(`SELECT url FROM webhook WHERE url = ?`, [webhookUrl], (err, row) => {
    if (err) {
      console.error("❗ Error checking webhook in database:", err.message);
      return interaction.reply({
        content: "Terjadi error saat memeriksa webhook di database.",
        ephemeral: true,
      });
    }

    if (!row) {
      return interaction.reply({
        content: `Webhook dengan URL tersebut tidak ditemukan di database.`,
        ephemeral: true,
      });
    }

    db.run(`DELETE FROM webhook WHERE url = ?`, [webhookUrl], function (err) {
      if (err) {
        console.error("❗ Error deleting webhook from database:", err.message);
        return interaction.reply({
          content: "Terjadi error saat menghapus webhook dari database.",
          ephemeral: true,
        });
      }
      interaction.reply({
        content: `Berhasil menghapus webhook dengan URL: ${webhookUrl}`,
        ephemeral: true,
      });
    });
  });
}

module.exports = { data, run };
