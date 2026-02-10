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
  footerVatNumber: "Partita IVA",
  footerOwner: "Titolare",
  footerPrivacy: "Privacy Policy",
  footerCookiePolicy: "Cookie Policy",
  footerTerms: "Termini e Condizioni",
  footerRefund: "Politica Rimborsi",
  footerFaq: "FAQ",
  footerRights: "Tutti i diritti riservati.",
  footerManageCookies: "Gestisci Cookie",

  // Cookie Banner
  cookieBannerTitle: "Utilizziamo i cookie",
  cookieBannerDescription: "Utilizziamo i cookie per migliorare la tua esperienza di navigazione e analizzare il traffico del sito. Leggi la nostra",
  cookieAcceptAll: "Accetta Tutti",
  cookieRejectAll: "Rifiuta Tutti",
  cookieCustomize: "Personalizza",
  cookieEssential: "Cookie Essenziali",
  cookieEssentialDesc: "Necessari per il corretto funzionamento del sito. Non possono essere disabilitati.",
  cookieAnalytics: "Cookie Analitici",
  cookieAnalyticsDesc: "Ci aiutano a capire come i visitatori interagiscono con il sito.",
  cookieMarketing: "Cookie di Marketing",
  cookieMarketingDesc: "Utilizzati per mostrare pubblicita personalizzate.",
  cookieSavePreferences: "Salva Preferenze",

  // Privacy Policy
  privacyTitle: "Informativa sulla Privacy",
  privacyLastUpdated: "Ultimo aggiornamento: Febbraio 2026",
  privacyIntroTitle: "Introduzione",
  privacyIntroText: "Questa Informativa sulla Privacy descrive come 100KDEV (\"noi\", \"ci\" o \"nostro\") raccoglie, utilizza e protegge i tuoi dati personali quando utilizzi il nostro sito web e i nostri servizi. Ci impegniamo a garantire che la tua privacy sia protetta in conformita con il Regolamento Generale sulla Protezione dei Dati (GDPR) e le leggi italiane sulla protezione dei dati.",
  privacyDataControllerTitle: "Titolare del Trattamento",
  privacyDataControllerText: "Il titolare del trattamento responsabile dei tuoi dati personali e:\n\nDrilon Hametaj\nPartita IVA: IT07327360488\nEmail: info@drilonhametaj.it\n\nPuoi contattarci in qualsiasi momento per questioni relative ai tuoi dati personali.",
  privacyDataCollectedTitle: "Dati che Raccogliamo",
  privacyDataCollectedText: "Raccogliamo le seguenti categorie di dati personali:\n\n• Dati Identificativi: Nome\n• Dati di Contatto: Indirizzo email, numero di telefono (opzionale)\n• Dati del Progetto: Descrizione e requisiti del progetto che fornisci\n• Dati di Pagamento: Informazioni di pagamento elaborate in modo sicuro da Stripe\n• Dati Tecnici: Indirizzo IP, tipo di browser, informazioni sul dispositivo\n• Dati di Utilizzo: Informazioni su come utilizzi il nostro sito web\n• Dati sui Cookie: Preferenze e scelte di consenso",
  privacyPurposeTitle: "Finalita del Trattamento",
  privacyPurposeText: "Trattiamo i tuoi dati personali per le seguenti finalita:\n\n• Erogazione del Servizio: Per fornire i nostri servizi di sviluppo e adempiere ai nostri obblighi contrattuali\n• Comunicazione: Per contattarti riguardo al tuo progetto e rispondere alle richieste\n• Elaborazione Pagamenti: Per elaborare caparre e pagamenti tramite Stripe\n• Newsletter: Per inviare notifiche sui Flash Drop (solo con il tuo consenso esplicito)\n• Adempimenti Legali: Per rispettare obblighi legali e normativi\n• Miglioramento del Sito: Per analizzare e migliorare le prestazioni del nostro sito web",
  privacyLegalBasisTitle: "Base Giuridica del Trattamento",
  privacyLegalBasisText: "Trattiamo i tuoi dati personali sulla base dei seguenti fondamenti giuridici ai sensi dell'Articolo 6 del GDPR:\n\n• Esecuzione del Contratto (Art. 6.1.b): Trattamento necessario per l'esecuzione di un contratto o misure precontrattuali\n• Consenso (Art. 6.1.a): Per iscrizioni alla newsletter e cookie non essenziali\n• Legittimo Interesse (Art. 6.1.f): Per analisi del sito web e sicurezza\n• Obbligo Legale (Art. 6.1.c): Per requisiti fiscali e contabili",
  privacyDataSharingTitle: "Condivisione dei Dati",
  privacyDataSharingText: "Potremmo condividere i tuoi dati personali con i seguenti soggetti terzi:\n\n• Stripe: Per l'elaborazione sicura dei pagamenti (Stripe agisce come titolare indipendente)\n• Supabase: Per l'hosting del database (responsabile del trattamento, server in UE)\n• TikTok: Se utilizzi la modalita Social Price, vengono acceduti i dati pubblici di engagement\n\nNon vendiamo i tuoi dati personali a terzi. Tutti i responsabili del trattamento terzi sono vincolati da accordi sul trattamento dei dati.",
  privacyRetentionTitle: "Conservazione dei Dati",
  privacyRetentionText: "Conserviamo i tuoi dati personali per i seguenti periodi:\n\n• Dati Contrattuali: 10 anni dalla fine del rapporto contrattuale (obbligo legale ai fini fiscali)\n• Registri di Pagamento: 10 anni (normativa fiscale italiana)\n• Iscrizioni alla Newsletter: Fino alla revoca del consenso\n• Preferenze Cookie: 12 mesi\n• Log Tecnici: 90 giorni",
  privacyRightsTitle: "I Tuoi Diritti",
  privacyRightsText: "Ai sensi del GDPR, hai i seguenti diritti:\n\n• Diritto di Accesso: Richiedere una copia dei tuoi dati personali\n• Diritto di Rettifica: Correggere dati inesatti o incompleti\n• Diritto alla Cancellazione: Richiedere la cancellazione dei tuoi dati (\"diritto all'oblio\")\n• Diritto di Limitazione: Limitare il modo in cui trattiamo i tuoi dati\n• Diritto alla Portabilita: Ricevere i tuoi dati in un formato strutturato\n• Diritto di Opposizione: Opporsi al trattamento basato sul legittimo interesse\n• Diritto di Revocare il Consenso: Revocare il consenso in qualsiasi momento\n• Diritto di Reclamo: Presentare un reclamo al Garante per la Protezione dei Dati Personali su www.garanteprivacy.it",
  privacyContactTitle: "Contattaci",
  privacyContactText: "Per qualsiasi domanda su questa Informativa sulla Privacy o per esercitare i tuoi diritti, contattaci a:\n\nEmail: info@drilonhametaj.it\n\nRisponderemo alla tua richiesta entro 30 giorni.",

  // Cookie Policy
  cookiePolicyTitle: "Cookie Policy",
  cookiePolicyIntro: "Questa Cookie Policy spiega come 100KDEV utilizza i cookie e tecnologie simili sul nostro sito web.",
  cookieWhatAreTitle: "Cosa Sono i Cookie?",
  cookieWhatAreText: "I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. Aiutano il sito a ricordare le tue preferenze e a capire come interagisci con esso. I cookie possono essere \"di sessione\" (cancellati quando chiudi il browser) o \"persistenti\" (rimangono sul tuo dispositivo per un periodo stabilito).",
  cookieTypesTitle: "Tipi di Cookie che Utilizziamo",
  cookieEssentialTitle: "Cookie Essenziali",
  cookieEssentialText: "Questi cookie sono strettamente necessari per il corretto funzionamento del sito web. Abilitano funzionalita fondamentali come:\n\n• Ricordare la tua preferenza linguistica (Inglese/Italiano)\n• Mantenere la tua sessione durante il checkout\n• Memorizzare le tue preferenze sui cookie\n\nQuesti cookie non possono essere disabilitati poiche sono essenziali per il funzionamento del sito.",
  cookieAnalyticsTitle: "Cookie Analitici",
  cookieAnalyticsText: "Questi cookie ci aiutano a capire come i visitatori interagiscono con il nostro sito web raccogliendo informazioni anonime. Questo ci aiuta a migliorare il sito e i nostri servizi. I cookie analitici vengono impostati solo se dai il tuo consenso.",
  cookieMarketingTitle: "Cookie di Marketing",
  cookieMarketingText: "Questi cookie possono essere impostati da partner pubblicitari terzi per creare un profilo dei tuoi interessi e mostrarti annunci pertinenti su altri siti. Attualmente non utilizziamo cookie di marketing, ma questo potrebbe cambiare in futuro con il tuo consenso.",
  cookieManageTitle: "Gestione delle Preferenze Cookie",
  cookieManageText: "Puoi gestire le tue preferenze sui cookie in qualsiasi momento:\n\n• Cliccando su \"Gestisci Cookie\" nel footer del sito\n• Modificando le impostazioni del tuo browser per bloccare o eliminare i cookie\n• Utilizzando estensioni del browser per gestire il consenso ai cookie\n\nTieni presente che bloccare i cookie essenziali potrebbe influire sulla funzionalita del sito.",
  cookieUpdatesTitle: "Aggiornamenti a Questa Policy",
  cookieUpdatesText: "Potremmo aggiornare questa Cookie Policy di tanto in tanto. Qualsiasi modifica sara pubblicata su questa pagina con una data di revisione aggiornata. Ti invitiamo a rivedere periodicamente questa policy.",

  // Terms and Conditions
  termsTitle: "Termini e Condizioni",
  termsLastUpdated: "Ultimo aggiornamento: Febbraio 2026",
  termsIntroTitle: "Introduzione",
  termsIntroText: "Benvenuto su 100KDEV. Questi Termini e Condizioni regolano l'utilizzo del nostro sito web e dei nostri servizi. Accedendo al nostro sito o usufruendo dei nostri servizi, accetti di essere vincolato da questi termini. Ti preghiamo di leggerli attentamente.",
  termsServiceTitle: "I Nostri Servizi",
  termsServiceText: "100KDEV fornisce servizi di sviluppo software personalizzato. Offriamo sviluppo web, sviluppo di applicazioni e servizi tecnici correlati. L'ambito specifico di ogni progetto viene determinato durante la fase di consulenza dopo che hai bloccato il prezzo.",
  termsPricingTitle: "Modello di Pricing",
  termsPricingText: "100KDEV utilizza un modello di pricing dinamico unico:\n\n• Il prezzo parte da $1.000 USD\n• Il prezzo aumenta ogni secondo\n• Quando qualcuno acquista, il prezzo si resetta a $1.000\n• Il prezzo visualizzato e la tariffa di mercato attuale per i nostri servizi\n• Puoi bloccare il prezzo corrente pagando una caparra del 5%\n\nI prezzi sono visualizzati in USD. Le fatture finali potrebbero essere emesse in EUR in base ai tassi di cambio al momento della fatturazione.",
  termsDepositTitle: "Politica della Caparra",
  termsDepositText: "Per bloccare il prezzo, devi pagare una caparra del 5% del prezzo visualizzato al momento del checkout.\n\n• La caparra viene elaborata in modo sicuro tramite Stripe\n• Dopo aver ricevuto la caparra, ti contatteremo entro 24 ore\n• Esamineremo i requisiti del tuo progetto e fisseremo una consulenza\n• La caparra viene applicata alla fattura finale al momento dell'accettazione del progetto\n\nConsulta la nostra Politica Rimborsi per i dettagli su quando le caparre sono rimborsabili.",
  termsFlashDropTitle: "Flash Drop",
  termsFlashDropText: "Il Flash Drop e un evento promozionale speciale:\n\n• Una volta al mese, il prezzo scende a $100 per 15 minuti\n• Data e ora non vengono annunciate in anticipo\n• Solo gli iscritti alla newsletter vengono avvisati quando si verifica un Flash Drop\n• Gli acquisti durante il Flash Drop seguono gli stessi termini degli acquisti normali\n• La disponibilita del Flash Drop e limitata e soggetta alla capacita dello sviluppatore",
  termsSocialPriceTitle: "Modalita Social Price",
  termsSocialPriceText: "La modalita Social Price e un meccanismo di pricing alternativo:\n\n• Il prezzo e determinato dalle metriche di engagement sui contenuti TikTok\n• Un engagement maggiore comporta prezzi diversi\n• La modalita Social Price ha disponibilita e termini separati\n• La partecipazione alla modalita Social Price e a discrezione dello sviluppatore",
  termsPaymentTitle: "Termini di Pagamento",
  termsPaymentText: "Il pagamento e strutturato come segue:\n\n• Caparra del 5% per bloccare il prezzo (pagata tramite Stripe)\n• Saldo residuo fatturato al momento dell'accettazione del progetto\n• Il pagamento della fattura finale e dovuto entro 14 giorni\n• Metodi di pagamento accettati: Carta di credito, bonifico bancario\n• I pagamenti in ritardo potrebbero comportare interessi come consentito dalla legge italiana",
  termsProjectTitle: "Esecuzione del Progetto",
  termsProjectText: "Dopo la ricezione della caparra:\n\n• Esamineremo la descrizione del tuo progetto\n• Verra programmata una call di consulenza per discutere i dettagli\n• Ci riserviamo il diritto di rifiutare progetti al di fuori della nostra competenza\n• Le tempistiche del progetto vengono discusse e concordate durante la consulenza\n• I deliverable e le milestone vengono definiti nell'accordo di progetto",
  termsIntellectualPropertyTitle: "Proprieta Intellettuale",
  termsIntellectualPropertyText: "Riguardo alla proprieta del lavoro prodotto:\n\n• I diritti di proprieta intellettuale completi ti vengono trasferiti al pagamento completo\n• Fino al pagamento completo, tutto il lavoro rimane di nostra proprieta\n• Manteniamo il diritto di utilizzare i progetti completati nel nostro portfolio\n• I componenti open-source utilizzati nei progetti mantengono le loro licenze originali\n• Ci concedi il permesso di menzionarti come cliente (puo essere anonimizzato su richiesta)",
  termsLimitationTitle: "Limitazione di Responsabilita",
  termsLimitationText: "Nella misura massima consentita dalla legge:\n\n• La nostra responsabilita totale e limitata all'importo pagato per i servizi\n• Non siamo responsabili per danni indiretti, incidentali o consequenziali\n• Non garantiamo risultati aziendali specifici\n• Non siamo responsabili per servizi di terze parti (hosting, domini, ecc.)\n• Eventi di forza maggiore esonerano dagli obblighi di prestazione",
  termsTerminationTitle: "Risoluzione",
  termsTerminationText: "Ciascuna parte puo risolvere l'accordo:\n\n• Prima dell'accettazione del progetto: Vedi Politica Rimborsi per i termini della caparra\n• Dopo l'accettazione del progetto: Termini definiti nell'accordo di progetto\n• Ci riserviamo il diritto di risolvere per mancato pagamento o violazione dei termini\n• Alla risoluzione, si applicano i termini di rimborso applicabili",
  termsGoverningLawTitle: "Legge Applicabile e Giurisdizione",
  termsGoverningLawText: "Questi Termini e Condizioni sono regolati dalla legge italiana. Qualsiasi controversia derivante da questi termini o dai nostri servizi sara soggetta alla giurisdizione esclusiva dei tribunali di Firenze, Italia. Per i consumatori UE, potrebbero applicarsi anche le leggi obbligatorie sulla protezione dei consumatori del tuo paese di residenza.",
  termsContactTitle: "Informazioni di Contatto",
  termsContactText: "Per domande su questi Termini e Condizioni:\n\nDrilon Hametaj\nPartita IVA: IT07327360488\nEmail: info@drilonhametaj.it",

  // Refund Policy
  refundTitle: "Politica Rimborsi",
  refundLastUpdated: "Ultimo aggiornamento: Febbraio 2026",
  refundIntroTitle: "Panoramica",
  refundIntroText: "Questa Politica Rimborsi spiega quando e come puoi ricevere un rimborso per le caparre pagate a 100KDEV. Ci impegniamo ad essere equi e trasparenti in tutte le situazioni di rimborso.",
  refundDepositTitle: "Informazioni sulla Caparra",
  refundDepositText: "La caparra del 5% che paghi serve a:\n\n• Bloccare il prezzo alla tariffa corrente\n• Riservare il nostro tempo per la revisione del progetto e la consulenza\n• Dimostrare un serio intento di procedere con un progetto\n\nLa caparra viene applicata alla fattura finale se il progetto procede.",
  refundRefundableTitle: "Quando le Caparre Sono Rimborsabili",
  refundRefundableText: "La tua caparra sara completamente rimborsata se:\n\n• Rifiutiamo il tuo progetto (es. al di fuori della nostra area di competenza)\n• Non possiamo rispettare la tempistica richiesta e scegli di non procedere\n• Non riusciamo a contattarti entro 48 ore dalla ricezione della caparra\n• Problemi tecnici hanno impedito la corretta erogazione del servizio\n\nI rimborsi in questi casi vengono elaborati entro 14 giorni lavorativi.",
  refundNonRefundableTitle: "Quando le Caparre NON Sono Rimborsabili",
  refundNonRefundableText: "La tua caparra NON e rimborsabile se:\n\n• Cambi idea dopo aver versato la caparra\n• Non rispondi ai nostri tentativi di contatto (3+ tentativi in 7 giorni)\n• Modifichi significativamente l'ambito del progetto dopo l'accettazione\n• Violi i nostri Termini e Condizioni\n• Il progetto e stato accettato e il lavoro e iniziato\n\nLa caparra ci compensa per il tempo speso nella revisione del tuo progetto.",
  refundProcessTitle: "Procedura di Rimborso",
  refundProcessText: "Per richiedere un rimborso:\n\n1. Inviaci un'email a info@drilonhametaj.it con oggetto \"Richiesta Rimborso\"\n2. Includi il tuo nome, l'email utilizzata per il pagamento e il motivo del rimborso\n3. Esamineremo la tua richiesta entro 5 giorni lavorativi\n4. Se approvato, il rimborso sara elaborato entro 14 giorni lavorativi\n5. I rimborsi vengono emessi sul metodo di pagamento originale",
  refundTimelineTitle: "Tempistiche del Rimborso",
  refundTimelineText: "• Revisione della richiesta: 5 giorni lavorativi\n• Elaborazione dopo l'approvazione: 14 giorni lavorativi\n• Tempi di elaborazione bancaria: 5-10 giorni lavorativi aggiuntivi a seconda della tua banca\n\nTempo totale dalla richiesta ai fondi: circa 3-4 settimane",
  refundConsumerRightsTitle: "Diritti dei Consumatori UE",
  refundConsumerRightsText: "Ai sensi della legge UE sulla protezione dei consumatori, hai un diritto di recesso di 14 giorni per gli acquisti online. Tuttavia, questo diritto non si applica a:\n\n• Servizi che sono stati completamente eseguiti con il tuo previo consenso\n• Servizi personalizzati specificamente adattati alle tue esigenze\n\nUna volta che iniziamo a esaminare il tuo progetto e programmiamo la consulenza, il servizio e iniziato. Pagando la caparra, riconosci e acconsenti all'inizio immediato del servizio.",
  refundContactTitle: "Contatti per i Rimborsi",
  refundContactText: "Per richieste di rimborso:\n\nEmail: info@drilonhametaj.it\nOggetto: Richiesta Rimborso\n\nTi preghiamo di attendere fino a 48 ore per una risposta iniziale.",

  // FAQ
  faqTitle: "Domande Frequenti",
  faqPricingTitle: "Prezzi",
  faqPricingQ1: "Come funziona il pricing?",
  faqPricingA1: "Il nostro prezzo parte da $1.000 e aumenta ogni secondo. Quando qualcuno effettua un acquisto, il prezzo si resetta a $1.000. Questo crea un mercato dinamico dove il tempismo conta. Puoi bloccare il prezzo corrente pagando una caparra del 5%.",
  faqPricingQ2: "Perche il prezzo continua a salire?",
  faqPricingA2: "Il prezzo crescente riflette la scarsita del nostro tempo e disponibilita. Crea urgenza e premia i clienti decisi. Piu aspetti, piu paghi. Ma quando qualcuno compra, tutti ripartono da $1.000.",
  faqPricingQ3: "C'e un prezzo massimo?",
  faqPricingA3: "Non c'e un massimo fisso, ma in pratica il prezzo si resetta abbastanza frequentemente da non raggiungere raramente livelli estremi. Il mercato si autoregola naturalmente attraverso gli acquisti.",
  faqDepositTitle: "Caparre",
  faqDepositQ1: "Cosa succede dopo che pago la caparra?",
  faqDepositA1: "Dopo la ricezione della caparra: 1) Il contatore si resetta a $1.000 per tutti. 2) Esaminiamo la descrizione del tuo progetto. 3) Ti contattiamo entro 24 ore. 4) Programmiamo una call di consulenza. 5) Discutiamo il tuo progetto e decidiamo se e adatto.",
  faqDepositQ2: "Posso riavere la mia caparra?",
  faqDepositA2: "Si, se NOI rifiutiamo il tuo progetto (es. e al di fuori della nostra competenza). No, se TU cambi idea dopo aver pagato. La caparra garantisce che entrambe le parti siano serie. Consulta la nostra Politica Rimborsi per i dettagli completi.",
  faqFlashDropTitle: "Flash Drop",
  faqFlashDropQ1: "Cos'e il Flash Drop?",
  faqFlashDropA1: "Il Flash Drop e un evento mensile in cui il nostro prezzo crolla a $100 per esattamente 15 minuti. E il nostro modo di rendere i servizi accessibili. Data e ora sono tenute segrete - solo gli iscritti alla newsletter vengono avvisati quando succede.",
  faqFlashDropQ2: "Come vengo avvisato del Flash Drop?",
  faqFlashDropA2: "Iscriviti alla nostra newsletter sulla homepage. Quando sta per verificarsi un Flash Drop, gli iscritti ricevono una notifica email. Sii veloce - i posti si riempiono in fretta a quel prezzo!",
  faqSocialPriceTitle: "Social Price",
  faqSocialPriceQ1: "Cos'e la modalita Social Price?",
  faqSocialPriceA1: "La modalita Social Price e un meccanismo di pricing alternativo in cui il prezzo e determinato dall'engagement su specifici contenuti TikTok. Un engagement maggiore puo sbloccare prezzi diversi. E un modo sperimentale per premiare la partecipazione social.",
  faqProcessTitle: "Processo",
  faqProcessQ1: "Che tipo di progetti accettate?",
  faqProcessA1: "Ci specializziamo in sviluppo web, applicazioni web e software personalizzato. Esaminiamo ogni progetto individualmente. Se il tuo progetto e al di fuori della nostra competenza, rimborseremo la tua caparra. Descrivi il tuo progetto in dettaglio durante il checkout per la migliore valutazione.",
  faqProcessQ2: "Quanto tempo richiede un progetto?",
  faqProcessA2: "Le tempistiche variano in base alla complessita del progetto e vengono discusse durante la nostra call di consulenza. Non forniamo stime fino a quando non comprendiamo completamente i tuoi requisiti. Progetti urgenti potrebbero essere possibili a discrezione dello sviluppatore.",
};
