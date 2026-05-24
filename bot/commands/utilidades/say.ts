import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../types.js";

const say: Command = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Hace que ÆON diga un mensaje en el canal")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((opt) =>
      opt.setName("mensaje").setDescription("El mensaje a enviar").setRequired(true)
    )
    .addChannelOption((opt) =>
      opt.setName("canal").setDescription("Canal destino (opcional)").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const mensaje = interaction.options.getString("mensaje", true);
    const canal = (interaction.options.getChannel("canal") ?? interaction.channel) as TextChannel;

    await canal.send(mensaje);
    await interaction.reply({ content: "✅ Mensaje enviado.", ephemeral: true });
  },
};

export default say;
