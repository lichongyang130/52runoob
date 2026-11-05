/* Computers and Electronics — long-form 24-step password-manager and account-recovery guide. */

module.exports = {
  slug: "Secure-Your-Online-Accounts-With-a-Password-Manager-and-Recovery-Plan",
  title: "Secure Your Online Accounts With a Password Manager and Recovery Plan",
  category: "Computers-and-Electronics",
  hero_image: "/img/categories/computers-hero.jpg",
  author: "Nina Alvarez, Digital Security Editor",
  read_time: 27,
  featured: 1,
  summary:
    "Move important accounts to unique generated passwords without losing access to your own data. These 24 steps cover account inventory, manager selection, a strong primary passphrase, MFA, passkeys, safe migration, recovery codes, emergency access, vault backups, updates, and recovery drills.",
  intro:
    "A password manager is most effective when the vault itself and its recovery route are protected with equal care. Follow these 24 steps in our [Computers and Electronics](/category/Computers-and-Electronics) collection to replace reused passwords gradually, secure the primary account, and build a recovery plan you have actually tested.",
  methods: [
    {
      title: "Assessing Accounts and Choosing a Password Manager",
      steps: [
        {
          text: "Inventory the accounts that would cause the greatest harm if compromised. Start with your primary email, financial services, cloud storage, work tools, healthcare, social accounts, and shopping services that store payment details, recording only the account names and websites rather than their passwords. Mark which email addresses and phone numbers receive reset links so you understand which accounts control access to the others.",
        },
        {
          text: "Identify weak, reused, and already exposed credentials safely. Use reputable breach-notification features built into your device or security provider, review existing password warnings, and note patterns without creating an unencrypted list of secrets. Do not email yourself passwords or paste them into an unknown checking website; the goal is a priority list for replacement, not another copy of the credentials.",
        },
        {
          text: "Compare built-in and independent password managers against your devices. Check whether you need synchronization across browsers and operating systems, secure sharing, passkey support, encrypted export, emergency access, and an interface you can use confidently. The NCSC explanation of [password managers and passkeys](https://www.ncsc.gov.uk/blog-post/trust-the-tech-using-password-managers-passkeys-to-help-you-stay-secure-online) recommends reputable providers, a strong unique primary password, two-step verification, secure devices, and backed-up recovery options.",
        },
        {
          text: "Verify the provider's security model and recovery terms before committing. Read independent assessments, the provider's security documentation, update history, support channels, pricing, and what happens if you forget the primary password or lose a device. Understand which data the provider can access, whether exports are encrypted, and how to leave the service later rather than choosing solely from an app-store ranking.",
        },
        {
          text: "Plan a gradual migration that preserves a way back into every account. Begin with a noncritical test account, then move the primary email and other high-impact services after you understand the workflow, keeping existing login methods available until each change is verified. Set aside time to handle old browser entries, paper notes, spreadsheets, and duplicate records securely instead of importing everything in one rushed session.",
        },
      ],
    },
    {
      title: "Creating and Securing the Main Vault",
      steps: [
        {
          text: "Install the manager only from official sources and prepare your devices. Use the provider's genuine website, verified app-store listing, and documented browser extension, then check the operating system and browser are supported and updated. Remove lookalike extensions you did not intentionally install, lock the device with a strong local method, and avoid setting up the vault on a public or shared computer.",
        },
        {
          text: "Create a long, random, and unique primary passphrase. Choose a memorable sequence of unrelated words or another strong random secret that is not used for any other account and does not rely on names, birthdays, or a familiar quotation. [CISA's strong-password guidance](https://www.cisa.gov/secure-our-world/use-strong-passwords) recommends long, random, unique passwords and a password manager for the rest; memorize the primary secret rather than storing it inside the vault it protects.",
        },
        {
          text: "Turn on multi-factor authentication for the password manager itself. Prefer the strongest practical method offered and supported by your devices, then store its recovery information separately so a lost second factor does not lock you out permanently. [CISA's MFA guidance](https://www.cisa.gov/secure-our-world/turn-mfa) explains how an additional verification step helps even when a password is stolen, making it especially important for the account that holds the others.",
        },
        {
          text: "Configure automatic locking and convenient unlock only on trusted devices. Choose a short enough lock interval to protect an unattended laptop or phone, use device biometrics if they are secure and appropriate for you, and require the full primary secret after restart or significant account changes where available. Disable automatic filling or vault access on shared devices, and lock the vault manually whenever the situation changes.",
        },
        {
          text: "Test autofill and synchronization with a low-risk account first. Confirm that the manager recognizes the genuine domain, fills only when you expect, and appears on the devices you actually use, then try locking and unlocking the vault again. Do not bypass a domain mismatch warning; manually navigate to the official service when something looks wrong so autofill convenience does not become a phishing shortcut.",
        },
      ],
    },
    {
      title: "Migrating to Unique Passwords and Stronger Sign-Ins",
      steps: [
        {
          text: "Import existing credentials without leaving a plaintext trail. Use the manager's documented import route, inspect duplicates and malformed entries, and delete any temporary CSV or exported file from the device, recycle bin, downloads, and synced storage after the import is verified. If the source is an old browser or another manager, follow its current export warnings and perform the work on a trusted device.",
        },
        {
          text: "Secure the primary email and other reset hubs before lower-value accounts. Replace their passwords with newly generated unique values, verify the sign-in on a second trusted session, and review recovery email addresses, phone numbers, connected apps, and active sessions. This order protects the route an attacker could otherwise use to reset the rest of your accounts.",
        },
        {
          text: "Replace reused and weak passwords in manageable priority batches. Use the generator to create a different random value for every service that does not support a stronger passwordless option, save each new entry directly in the vault, and confirm the old password no longer works before marking the item complete. Group the remaining accounts by impact so the task is thorough without becoming an exhausting single-day project.",
        },
        {
          text: "Add passkeys where a trusted service and your devices support them. Follow the service's genuine security settings, keep each passkey in the intended credential manager, and maintain a tested alternative sign-in or recovery method during the transition. The [NCSC passkeys guidance](https://www.ncsc.gov.uk/passkeys) explains that passkeys are created and managed by the device credential manager and offer phishing resistance, while strong unique passwords and two-step verification remain important where passkeys are unavailable.",
        },
        {
          text: "Enable MFA on other important accounts and record only the method metadata. Start with financial, cloud, work, healthcare, and social services, choosing stronger available methods where practical and keeping separate recovery options for each. Store notes such as which authenticator or security key is used, but do not place live one-time codes, recovery codes, and every password together in one easily exported note.",
        },
      ],
    },
    {
      title: "Building a Tested Account-Recovery Plan",
      steps: [
        {
          text: "Generate recovery codes and store them offline in a protected location. Print or write the codes only when the official account flow provides them, label the service without including the password, and keep the record somewhere separate from the corresponding device and everyday wallet. Check whether generating a new set invalidates older codes, and replace exposed or incomplete sets through the official security settings.",
        },
        {
          text: "Maintain more than one legitimate recovery route where the service allows it. Add a current backup email, phone number, authenticator, security key, or other supported method, making sure each route is itself secured and not dependent on the same lost device. Review carrier and email changes promptly, and avoid using a disposable address or a shared inbox that could disappear when you need it most.",
        },
        {
          text: "Use trusted-contact or emergency-access features with clear boundaries. Choose someone who can verify your identity reliably, understand the waiting period and approval process, and limit what they can access until an actual emergency occurs. Tell the person where the official instructions are kept without casually handing over your primary password, and review the arrangement after relationship or household changes.",
        },
        {
          text: "Back up the vault or its essential recovery information using an encrypted method. Follow the provider's documented export or synchronization recovery process, protect any backup with a strong separate secret, and never leave an unencrypted vault export in ordinary cloud storage or email. Our [encrypted backup guide](/how-to/Set-Up-Encrypted-Automated-Cloud-and-Local-Backups) can support the wider plan, while [digital-photo archiving](/how-to/Organize-and-Back-Up-a-Lifetime-of-Digital-Photos) illustrates why recovery documents belong in verified backups too.",
        },
        {
          text: "Practice recovery before a real emergency and record official support routes. Use a noncritical account or the provider's documented recovery test to confirm that codes, backup factors, contacts, and support instructions work as expected, without triggering avoidable lockouts on essential services. Keep genuine support addresses and account-specific reference details in the plan, and never respond to unsolicited recovery help offered through a call, advertisement, or direct message.",
        },
      ],
    },
    {
      title: "Maintaining the Vault and Reviewing Access",
      steps: [
        {
          text: "Review vault health and breach alerts on a regular schedule. Prioritize reused, weak, old, or exposed credentials, navigate to affected services through a known-good address, and verify that each replacement was saved in the correct entry. Treat a breach alert as a reason to act through official channels rather than clicking an unexpected warning link or assuming every old account needs the same urgent response.",
        },
        {
          text: "Remove devices, sharing, and entries that are no longer needed. Revoke vault sessions from sold or lost hardware, end shared access when a project or relationship changes, and delete or archive obsolete account records after confirming they are not required for recovery or records. Check active sessions on the underlying services as well, because deleting a vault entry alone does not close the online account.",
        },
        {
          text: "Keep the operating system, browser, manager, and authentication apps updated. Enable reputable automatic updates where available, restart when required, and replace hardware or software that no longer receives security support. [CISA's software-update guidance](https://www.cisa.gov/secure-our-world/update-software) recommends installing updates promptly; our [slow-laptop guide](/how-to/Speed-Up-a-Slow-Laptop) and [guest Wi-Fi guide](/how-to/Create-a-Separate-Guest-Wi-Fi-Network-on-Your-Home-Router) can help with the wider device environment.",
        },
        {
          text: "Repeat a full access and recovery review every year and after major changes. Confirm the primary passphrase is still unique and memorable, MFA methods and recovery contacts are current, recent devices are recognized, and offline codes remain readable and protected. Update the plan after a move, new phone, number change, account provider change, or financial-account review such as our [emergency-fund guide](/how-to/Build-a-Three-Month-Emergency-Fund-on-a-Variable-Income), which also emphasizes account alerts and recovery records.",
        },
      ],
    },
  ],
  tips: [
    "Migrate one small group of accounts at a time and mark only verified changes as complete; this avoids losing track of which password is current.",
    "Use the manager's domain-matching and password-generation features rather than manually inventing small variations of an old password.",
    "Keep recovery instructions concise enough to use under stress, and review them whenever you replace a phone or change a phone number.",
  ],
  warnings: [
    "Never store the vault's primary password inside that same vault, share MFA codes with another person, or install a password manager from an unsolicited advertisement or link.",
    "Do not leave plaintext password exports in downloads, email, ordinary cloud folders, or the recycle bin after a migration.",
    "Recovery features can also create new access paths, so protect backup email accounts, trusted contacts, printed codes, and emergency access with the same care as the vault.",
  ],
  things: [
    "A prioritized inventory of important accounts and reset hubs",
    "A reputable password manager that supports your devices",
    "A long, unique primary passphrase",
    "MFA methods and a secure second device where appropriate",
    "Protected offline storage for recovery codes and instructions",
    "A schedule for updates, vault reviews, and recovery drills",
  ],
  faqs: [
    {
      question: "Is a browser's built-in password manager good enough?",
      answer: "It can be a reasonable choice when it is reputable, protected by a secure device account, and supports the platforms and recovery features you need. Compare its cross-device access, export, sharing, passkey, MFA, and lockout options with an independent manager before deciding.",
    },
    {
      question: "What should I do first if I think an account was compromised?",
      answer: "Use a trusted device and the service's genuine support route to secure the primary email and affected account, change exposed or reused passwords, review active sessions and recovery details, and enable or verify MFA. Contact the relevant provider promptly for financial or other urgent harm.",
    },
    {
      question: "Should I change every password on a fixed schedule?",
      answer: "A calendar reminder is useful for reviewing the vault, but routine replacement is not a substitute for unique generated passwords, MFA, updates, and prompt action after exposure. Prioritize compromised, reused, weak, or no-longer-needed credentials rather than making arbitrary small changes.",
    },
  ],
  references: [
    {
      title: "Trusting the Tech: Using Password Managers and Passkeys",
      publisher: "UK National Cyber Security Centre",
      url: "https://www.ncsc.gov.uk/blog-post/trust-the-tech-using-password-managers-passkeys-to-help-you-stay-secure-online",
    },
    {
      title: "Use Strong Passwords",
      publisher: "Cybersecurity and Infrastructure Security Agency",
      url: "https://www.cisa.gov/secure-our-world/use-strong-passwords",
    },
    {
      title: "Turn On MFA",
      publisher: "Cybersecurity and Infrastructure Security Agency",
      url: "https://www.cisa.gov/secure-our-world/turn-mfa",
    },
    {
      title: "Passkeys: What You Need to Know",
      publisher: "UK National Cyber Security Centre",
      url: "https://www.ncsc.gov.uk/passkeys",
    },
    {
      title: "Update Software",
      publisher: "Cybersecurity and Infrastructure Security Agency",
      url: "https://www.cisa.gov/secure-our-world/update-software",
    },
  ],
};
