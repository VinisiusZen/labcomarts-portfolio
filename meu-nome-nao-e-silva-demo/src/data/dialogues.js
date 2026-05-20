export const confrontationDialogues = {
  act1Captain: {
    id: "act1Captain",
    title: "Margem de Sentenca",
    subtitle: "Confronto na lama antes da primeira onda",
    backgroundId: "marginOfSentence",
    autoAdvanceMs: 5200,
    speakers: {
      silva: {
        id: "silva",
        name: "Silva",
        side: "left",
        spriteAssetId: "silva",
        spriteState: "idle"
      },
      captain: {
        id: "captain",
        name: "Capataz",
        side: "right",
        spriteAssetId: "captain",
        spriteState: "idle"
      }
    },
    lines: [
      {
        speaker: "captain",
        text: "Corre bonito para quem ainda pertence ao papel dos outros."
      },
      {
        speaker: "silva",
        text: "Papel queima. Corpo lembra."
      },
      {
        speaker: "captain",
        text: "Te deram nome, dono e destino. A mata so esta adiando a corda."
      },
      {
        speaker: "silva",
        text: "Meu nome nao veio da tua boca."
      },
      {
        speaker: "captain",
        text: "Entao fala. Diz teu nome antes que eu escreva outro."
      },
      {
        speaker: "silva",
        text: "Quando eu lembrar, voce vai desejar que eu continuasse calado."
      },
      {
        speaker: "captain",
        text: "Homens! Fechem a margem."
      },
      {
        speaker: "silva",
        text: "A margem ja fechou sobre voces."
      }
    ]
  }
};
