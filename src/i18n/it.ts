import type { Translations } from "./types";

export const it: Translations = {
  // Header
  tagline: "Il dev che parte da",

  // Price display
  live: "LIVE",
  flashDrop: "FLASH DROP",

  // Stats
  rate: "velocita",
  lastSold: "ultimo venduto",
  perHour: "/ora",

  // Description
  description:
    "Il prezzo sale ogni secondo. Quando qualcuno compra, riparte da $1.000. Puoi comprare {anything} — nessun limite, nessun tier. Paga il 5% di caparra per bloccare il prezzo.",
  anything: "qualsiasi cosa",

  // CTA
  lockThisPrice: "Blocca Questo Prezzo",
  depositInfo: "5% caparra • Rimborsabile se rifiuto il progetto • Discuteremo in una call",

  // Checkout modal
  lockYourPrice: "Blocca Il Tuo Prezzo",
  priceLockedAt: "Prezzo bloccato a",
  currentPrice: "Prezzo attuale",
  priceGoingUp: "(continua a salire mentre compili il form)",
  yourName: "Il Tuo Nome",
  email: "Email",
  phoneOptional: "Telefono (opzionale)",
  describeProject: "Descrivi Il Tuo Progetto",
  projectPlaceholder: "Dimmi cosa vuoi costruire. Piu dettagli, meglio e...",
  cancel: "Annulla",
  pay: "Paga",
  processing: "Elaborazione...",
  depositDisclaimer:
    "La caparra è rimborsabile solo se rifiuto il progetto. Ti contatterò entro 24 ore.",
  lockedPrice: "Prezzo Bloccato",
  deposit: "Caparra (5%)",

  // Validation errors
  errorNameMin: "Il nome deve avere almeno 2 caratteri",
  errorEmailInvalid: "Inserisci un'email valida",
  errorProjectMin: "Descrivi il tuo progetto (min 10 caratteri)",

  // Success page
  successTitle: "Prezzo Bloccato!",
  successMessage1: "La tua caparra e stata ricevuta. Il contatore e stato resettato a $1.000.",
  successMessage2: "Ti contattero entro 24 ore per discutere il progetto e i prossimi passi.",
  whatHappensNext: "Cosa succede ora:",
  step1: "Controlla la tua email per la conferma",
  step2: "Revisiono la descrizione del tuo progetto",
  step3: "Fissiamo una call per discutere i dettagli",
  step4: "Ti invio la fattura per il saldo rimanente",
  backToHome: "Torna alla Home",

  // Cancel page
  cancelTitle: "Checkout Annullato",
  cancelMessage1: "Nessun problema! Il checkout e stato annullato e nessun pagamento e stato effettuato.",
  cancelMessage2: "Il prezzo continua a salire pero. Torna quando sei pronto!",
  cancelWarning: "Ricorda: il prezzo non scende mai. Bloccalo prima che sia troppo tardi.",
  tryAgain: "Riprova",

  // Flash drop
  flashDropTitle: "FLASH DROP",
  flashDropDesc:
    "Una volta al mese, il prezzo crolla a $100 per 15 minuti. Data e ora segrete. Solo gli iscritti alla newsletter vengono avvisati.",
  emailPlaceholder: "tua@email.com",
  subscribe: "AVVISAMI",
  subscribed: "SEI DENTRO",

  // Gallery
  galleryTitle: "Progetti Passati",
  paidAt: "pagato",

  // Social Price
  socialPriceLink: "Oppure prova il Social Price Mode →",

  // Footer
  brand: "100KDEV",
};
