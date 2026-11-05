/* Computers and Electronics — long-form 23-step phishing recognition and response guide. */

module.exports = {
  slug: "Recognize-and-Avoid-Phishing-Emails-Texts-and-Fake-Websites",
  title: "Recognize and Avoid Phishing Emails, Texts, and Fake Websites",
  category: "Computers-and-Electronics",
  hero_image: "/img/categories/computers-hero.jpg",
  author: "Daniel Cho, Consumer Cybersecurity & Fraud Education Editor",
  read_time: 27,
  featured: 0,
  summary:
    "Pause before an unexpected message becomes a clicked link, a stolen password, or a fraudulent payment. These 23 steps cover message context, urgency, sender addresses, lookalike domains, link previews, attachments, QR codes, requests for one-time codes, independent verification, safer reporting, security updates, unique passwords, MFA, malware scans, compromised passwords, payment providers, identity-theft recovery, and ongoing monitoring.",
  intro:
    "Phishing is not limited to badly written email: a polished text, social-media message, phone call, QR code, or copied website can use the same pressure and impersonation. Use these 23 steps in our [Computers and Electronics](/category/Computers-and-Electronics) collection to verify unexpected requests without using the sender's links or numbers, strengthen your accounts, and respond promptly if you clicked, paid, or disclosed information.",
  methods: [
    {
      title: "Pausing and Assessing Unexpected Messages",
      steps: [
        {
          text: "Stop before clicking, replying, scanning, calling, or forwarding an unexpected message. Leave the message available for later reporting, but do not forward a suspicious attachment or link to friends, coworkers, or a public group to ask whether it is safe. CISA's [phishing guidance](https://www.cisa.gov/secure-our-world/recognize-and-report-phishing) recommends resisting the bait and reporting it, so give yourself time to assess the request rather than letting the sender choose the pace.",
        },
        {
          text: "Check whether the message fits a transaction or relationship you actually have. Look for an order, appointment, delivery, account, or conversation you expected, and treat an invoice, refund, job offer, or account warning with no relevant context as a warning sign. The FTC [phishing guide](https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams) suggests asking whether you have an account with the company or know the person, while remembering that a familiar name alone still does not authenticate the message.",
        },
        {
          text: "Identify pressure, fear, urgency, secrecy, or an unusually attractive reward in the request. Note claims that an account will close, a relative is in trouble, a payment must be made immediately, or a prize will disappear unless you act now. CISA [recognition guidance](https://www.cisa.gov/secure-our-world/recognize-and-report-phishing) highlights urgent and emotionally appealing language; a legitimate issue may still require prompt action, but you should handle it through a channel you already trust rather than following the demanding message.",
        },
        {
          text: "Compare the display name with the actual sender address, number, or account profile. Expand the sender details in your mail or messaging client and look for misspellings, extra characters, an unrelated domain, or a recent account with little history, without opening any included links. CISA [phishing examples](https://www.cisa.gov/secure-our-world/recognize-and-report-phishing) include incorrect addresses and lookalike links, but an exact expected address is not conclusive because a real account can be compromised or spoofed.",
        },
        {
          text: "Review wording and presentation as supporting clues rather than a final verdict. Generic greetings, implausible formatting, mismatched branding, and unusual requests can help expose a fake, but polished grammar and professional design do not prove legitimacy. CISA [current phishing guidance](https://www.cisa.gov/secure-our-world/recognize-and-report-phishing) notes that AI-era messages can have perfect spelling and grammar, so keep the message's context, destination, and requested action at the center of your assessment.",
        },
      ],
    },
    {
      title: "Inspecting Links, Attachments, and Requests",
      steps: [
        {
          text: "Inspect a link's destination only through a preview that does not open it. Use your mail client's hover or link-preview feature where available, avoid long-pressing or copying an uncertain link into a browser, and leave the page immediately if the destination cannot be checked safely. The FTC [spam-text guidance](https://consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages) warns that links can lead to convincing spoofed websites, so a preview is an inspection aid, not a reason to proceed.",
        },
        {
          text: "Read the actual domain carefully and navigate independently when you need the service. Identify the registered domain rather than focusing on a familiar word elsewhere in a long address, watch for substituted letters and extra hyphens, and type a known address or use an existing bookmark instead of following the message. Do not treat a padlock or HTTPS as proof that the organization is genuine; encryption can protect a connection to a criminal's lookalike site as well as to a legitimate one.",
        },
        {
          text: "Treat unexpected attachments, downloads, QR codes, and document-sharing prompts as untrusted. Do not enable macros, install a requested app, scan a code to reach a login page, or grant access to a shared document merely because it appears to come from a contact. The FTC [phishing guidance](https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams) warns that attachments and links can install harmful software; verify the file or invitation through a separate channel before opening it.",
        },
        {
          text: "Refuse unexpected requests for passwords, one-time codes, payment details, identity numbers, or remote access. Do not share an authentication code with a caller or enter it into a page reached from the message, and do not allow an unsolicited support agent to control your computer. The FTC [phishing guide](https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams) describes personal and financial information as the attacker's target, so end the interaction and verify the claimed issue independently.",
        },
        {
          text: "End an unsolicited call and avoid calling the number supplied in the message or shown by caller ID. Do not rely on a professional greeting, a transferred supervisor, or a caller who already knows some personal details, because those details can be stolen or invented. Use a number from your statement, card, existing app, or independently located official website; the FTC [spam-text guidance](https://consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages) specifically recommends a phone number or website you know is real.",
        },
      ],
    },
    {
      title: "Verifying Through Independent Channels",
      steps: [
        {
          text: "Open the service's established app or type its known web address yourself to check the claimed issue. Review account alerts, orders, payments, deliveries, and messages inside the authenticated service without using the suspicious link, and compare the details rather than assuming a matching logo confirms the story. CISA [verification guidance](https://www.cisa.gov/secure-our-world/recognize-and-report-phishing) recommends going to the verified website or typing the address yourself when you think a message could be real.",
        },
        {
          text: "Contact the organization through a channel you already trust when the account information does not resolve the question. Use the number on a statement or the back of a card, an established customer-service app, or contact details found independently, and describe the message without sending money or granting access. Do not use the suspicious message's reply address, phone number, or chat link as the verification channel, because that keeps the possible attacker in control of the conversation.",
        },
        {
          text: "Verify a surprising request from a friend, relative, or coworker through a separate existing conversation. Call an established number or ask in person, and discuss the specific context rather than requesting a password or a voice phrase that could also be copied. CISA [phishing guidance](https://www.cisa.gov/secure-our-world/recognize-and-report-phishing) recommends using another way to reach the person, since a compromised social account, spoofed address, or cloned voice can make an urgent request appear familiar.",
        },
        {
          text: "Cross-check invoices, deliveries, refunds, and payment instructions inside the relevant account before taking action. Compare the order number and amount with your own records, and be especially cautious when told to pay with a gift card, cryptocurrency, a wire, or a transfer to a new account. Do not deposit a check and return part of the money or move funds to a supposedly safe account based on an incoming message; confirm any legitimate change directly with the organization.",
        },
        {
          text: "Preserve only the evidence needed for a report, then use the service's report and block controls. Record the date, sender, claimed organization, and your actions, redact unrelated personal information from screenshots, and avoid forwarding harmful content to other potential victims. In the United States, the FTC [phishing guide](https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams) describes forwarding phishing email to reportphishing@apwg.org, texts to 7726, and reports to [ReportFraud.ftc.gov](https://reportfraud.ftc.gov/); follow your provider and local authority's process elsewhere.",
        },
      ],
    },
    {
      title: "Strengthening Accounts and Devices",
      steps: [
        {
          text: "Enable automatic security updates for your operating system, browser, phone, and security software, and maintain tested backups. Install updates through the device or vendor's official mechanism rather than a pop-up in an unexpected message, and keep important backups disconnected or otherwise protected from unauthorized changes. The FTC [phishing protection guidance](https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams) recommends security updates and backups as layers that can reduce harm even when a deceptive message gets through.",
        },
        {
          text: "Use a unique password for every account and store recovery information securely. A password manager can generate and fill credentials for the correct saved site, while our [account-security guide](/how-to/Secure-Your-Online-Accounts-With-a-Password-Manager-and-Recovery-Plan) explains recovery planning; still inspect unexpected login prompts rather than treating autofill as a complete phishing test. CISA [social-engineering guidance](https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks) advises changing every reused password after a compromise, so unique credentials limit the spread from one exposed account.",
        },
        {
          text: "Turn on multifactor authentication for important accounts, especially email, finance, and password-management accounts. Prefer stronger options such as an authenticator app or security key where available, protect backup codes, and never disclose a one-time code to someone who contacted you unexpectedly. The FTC [MFA explanation](https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams) describes the additional credential as a barrier after a password is stolen, but MFA is not permission to approve an unexpected prompt or ignore a fake website.",
        },
        {
          text: "Use spam filtering, blocking, and household verification habits to reduce repeated exposure. Mark suspicious messages through the provider's official controls rather than experimenting with links, keep filters and browser protections enabled, and agree that family members will verify urgent payment or credential requests through a second channel. Share the recognition and reporting process without circulating the malicious content itself, and reduce unnecessary public disclosure of contact, travel, purchase, and account information that can make a lure more convincing.",
        },
      ],
    },
    {
      title: "Responding After a Click, Payment, or Disclosure",
      steps: [
        {
          text: "Stop the interaction and assess what happened without contacting the sender again. If you downloaded something, allowed remote access, or believe malware may be present, disconnect the affected device from untrusted remote control and update and run reputable security software; seek qualified support for persistent symptoms rather than installing another unsolicited cleanup tool. The FTC [scam-response guide](https://consumer.ftc.gov/articles/what-do-if-you-were-scammed) recommends updating security software, scanning, and removing identified problems after giving a scammer computer access.",
        },
        {
          text: "Change compromised passwords from a known-clean device and secure the account recovery routes. Replace the exposed password everywhere it was reused, turn on MFA, review active sessions and recovery email or phone details, and use the provider's official account-recovery process if you are locked out. CISA [phishing-response guidance](https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks) calls for immediately changing revealed passwords, while the FTC [scam-response guide](https://consumer.ftc.gov/articles/what-do-if-you-were-scammed) provides steps for hacked accounts and computer access.",
        },
        {
          text: "Contact the bank, card issuer, payment service, exchange, or gift-card company immediately if you paid or disclosed financial details. Use an official number or app, explain that the transaction was fraudulent, and ask about available reversal, freeze, dispute, or account-protection options without assuming a refund is guaranteed. Follow the payment-specific steps in the FTC [scam-response guide](https://consumer.ftc.gov/articles/what-do-if-you-were-scammed), and monitor subsequent charges or account changes while keeping records of every official contact.",
        },
        {
          text: "Document the incident and use the appropriate identity-theft, fraud-reporting, and monitoring resources. Keep a timeline of messages, payments, disclosures, account changes, and recovery actions, and watch financial and account statements for unauthorized activity. In the United States, use [IdentityTheft.gov](https://www.identitytheft.gov/) for a customized recovery plan when personal information is at risk and [ReportFraud.ftc.gov](https://reportfraud.ftc.gov/) to report the scam; contact local law enforcement or the relevant authority when threats, losses, or jurisdiction require it.",
        },
      ],
    },
  ],
  tips: [
    "Use an existing bookmark or the official app for routine account checks so you are not dependent on links arriving in messages.",
    "Agree on a household rule that urgent payment, gift-card, password, and one-time-code requests always require verification through a second channel.",
    "Keep a short incident timeline from the first message onward; exact times and actions are more useful to providers than a vague statement that you clicked something.",
    "Protect the primary email account with a unique password and MFA because it can reset access to many other services.",
  ],
  warnings: [
    "Never disclose a password, one-time authentication code, full payment number, or identity document in response to an unsolicited message or call.",
    "Do not enable macros, install remote-access software, or grant device control to someone who contacted you unexpectedly and claimed to offer support.",
    "A professional design, correct spelling, familiar logo, HTTPS padlock, or accurate personal detail does not prove that a message or website is legitimate.",
    "Do not forward suspicious links or attachments to others for inspection; preserve minimal evidence and use official reporting channels instead.",
  ],
  things: [
    "An updated phone or computer with official security protections enabled",
    "Existing bookmarks or official apps for important accounts",
    "Trusted contact details from statements, cards, or independently verified websites",
    "A unique-password manager and protected recovery information",
    "Multifactor authentication with securely stored backup options",
    "A private incident log for dates, messages, disclosures, payments, and recovery contacts",
  ],
  faqs: [
    {
      question: "Does a padlock or HTTPS mean a website is not phishing?",
      answer: "No. HTTPS can encrypt a connection to a lookalike site as well as to a legitimate service. Check the actual domain and, more importantly, navigate through an address, bookmark, or app you already trust instead of arriving from an unexpected message.",
    },
    {
      question: "What should I do if I clicked but did not enter information?",
      answer: "Close the page, do not continue interacting, and note what happened. Update and run reputable security software if you downloaded a file or see suspicious behavior, and monitor relevant accounts. If you granted remote access, disclosed credentials, or paid, use the more specific recovery steps and contact the appropriate provider immediately.",
    },
    {
      question: "Is a message safe if it uses my name or real account details?",
      answer: "Not necessarily. Personal and transaction details can come from data breaches, public posts, compromised contacts, or earlier scams. Use those details only as context, not authentication, and verify the claimed issue through an official app, known website, or trusted phone number.",
    },
    {
      question: "Does MFA make it safe to approve every login prompt?",
      answer: "No. MFA adds a layer of protection, but unexpected prompts and requests for one-time codes can themselves be part of an attack. Approve only sign-ins you initiated through a trusted channel, protect backup codes, and never read a code to an unsolicited caller or enter it into a suspicious page.",
    },
  ],
  references: [
    {
      title: "Recognize and Report Phishing",
      publisher: "Cybersecurity and Infrastructure Security Agency",
      url: "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing",
    },
    {
      title: "How To Recognize and Avoid Phishing Scams",
      publisher: "Federal Trade Commission",
      url: "https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams",
    },
    {
      title: "How to Recognize and Report Spam Text Messages",
      publisher: "Federal Trade Commission",
      url: "https://consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages",
    },
    {
      title: "Avoiding Social Engineering and Phishing Attacks",
      publisher: "Cybersecurity and Infrastructure Security Agency",
      url: "https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks",
    },
    {
      title: "What To Do if You Were Scammed",
      publisher: "Federal Trade Commission",
      url: "https://consumer.ftc.gov/articles/what-do-if-you-were-scammed",
    },
    {
      title: "Identity Theft Recovery Steps",
      publisher: "Federal Trade Commission, IdentityTheft.gov",
      url: "https://www.identitytheft.gov/",
    },
  ],
};
