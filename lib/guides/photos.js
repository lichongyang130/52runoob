/* Computers and Electronics — long-form 28-step digital-photo organization and preservation guide. */

module.exports = {
  slug: "Organize-and-Back-Up-a-Lifetime-of-Digital-Photos",
  title: "Organize and Back Up a Lifetime of Digital Photos",
  category: "Computers-and-Electronics",
  hero_image: "/img/categories/computers-hero.jpg",
  author: "Jonas Reed, Digital Preservation Editor",
  read_time: 30,
  featured: 1,
  summary:
    "Bring scattered digital photographs into a searchable, resilient archive. These 28 steps cover source inventories, safe copying, scanning, folders, filenames, metadata, duplicates, master files, 3-2-1 backups, restore tests, sharing, and long-term migration.",
  intro:
    "A lifetime photo archive should preserve memories and make them findable without depending on one phone, one app, or one person's memory. Use these 28 steps in our [Computers and Electronics](/category/Computers-and-Electronics) collection to gather originals carefully, build a simple catalog, maintain independent backups, and document the system for your future self and trusted family members.",
  methods: [
    {
      title: "Gathering Photos and Protecting Originals",
      steps: [
        {
          text: "Define the scope and purpose of your photo archive. Decide whether you are preserving family history, creative work, travel memories, documents, or a mixture, and include important videos, scans, albums, and sidecar files in the inventory. Write down who may need to find or use the collection later so your organization is based on real retrieval needs rather than software defaults.",
        },
        {
          text: "Inventory every source before deleting or consolidating anything. List phones, cameras, memory cards, computers, external drives, discs, messaging exports, social accounts, cloud services, and relatives' collections, noting approximate dates and which libraries might overlap. Check that old accounts and devices remain accessible, but do not erase a source merely because its thumbnails appear in another location.",
        },
        {
          text: "Create one master library with enough working space. Choose a reliable computer or storage location for the canonical collection, estimate the current size plus room for working copies and future imports, and separate this library from temporary downloads. If storage cleanup is necessary first, our [slow-laptop guide](/how-to/Speed-Up-a-Slow-Laptop) can help you review space without treating irreplaceable photographs as disposable cache files.",
        },
        {
          text: "Copy each source into a labelled intake area before editing it. Use a folder that identifies the device and import date, preserve the original directory structure where useful, and compare file counts, sizes, and a sample of opened images after copying. Keep the source intact until the master library and independent backups are verified, and never use a move operation as the first step with the only copy.",
        },
        {
          text: "Preserve original image files and their embedded information. Keep camera JPEGs, raw files, videos, and accompanying metadata unchanged in the master area, and avoid repeated saves that reduce quality or strip timestamps and camera details. Work on copies when cropping, converting, or correcting appearance, and record any later metadata change rather than silently rewriting the historical evidence.",
        },
        {
          text: "Digitize prints and albums with a preservation master and a working copy. Clean and prepare the original photographs safely, choose a resolution suitable for the source and intended use, and keep an untouched high-quality master while using smaller copies for sharing. The Library of Congress [scanning guidance](https://blogs.loc.gov/thesignal/2014/03/personal-digital-archiving-the-basics-of-scanning/) discusses TIFF masters and JPEG working copies; our [travel sketchbook guide](/how-to/Keep-a-Daily-Visual-Sketchbook-Diary-While-Traveling) can help you decide which accompanying journal pages add useful context.",
        },
      ],
    },
    {
      title: "Selecting, Naming, and Describing the Collection",
      steps: [
        {
          text: "Review camera clocks and time zones before sorting by date. Compare a few images with known events, note devices whose clocks were wrong, and correct copies or catalog fields with a documented offset instead of guessing every date. Preserve the original timestamp where possible and mark uncertain or estimated dates clearly so a future editor does not treat them as exact.",
        },
        {
          text: "Build broad folders around the way you expect to browse. A simple year-and-event structure is easier to maintain than hundreds of highly specific folders, while large collections can add a top-level division for family, work, or creative projects. The Library of Congress [personal archiving project guide](https://blogs.loc.gov/thesignal/2016/05/how-to-begin-a-personal-archiving-project/) likewise recommends starting simply with broad categories and refining the arrangement in later passes.",
        },
        {
          text: "Review duplicates and bursts without deleting the only meaningful version. Compare resolution, focus, expressions, context, and whether an apparently inferior frame documents something different, then keep the versions that serve your preservation goal. Use duplicate-detection tools only as suggestions, verify matches visually, and move rejects to a temporary review folder until backups and the final selection are confirmed.",
        },
        {
          text: "Separate screenshots, downloads, and photos received from other people. Record the source, creator, date received, and any permission or usage limits where known, and avoid presenting another person's image as your own work. Keep these files searchable within the broader collection, but do not strip existing attribution or assume that a family sharing invitation permits public republishing.",
        },
        {
          text: "Apply a consistent, human-readable filename pattern. A format such as year-month-day followed by a short event and sequence number sorts chronologically while remaining understandable outside the photo app, with approximate dates labelled rather than invented. The Library of Congress [digital photograph preservation tips](https://blogs.loc.gov/thesignal/2011/10/four-easy-tips-for-preserving-your-digital-photographs/) support descriptive filenames, a clear directory structure, and a written explanation stored with the collection.",
        },
        {
          text: "Add captions that preserve who, what, where, and why. Record names or relationships with consent, useful places and events, the photographer or source, and phrases such as probably or circa when details are uncertain. Avoid embedding unnecessary sensitive information about children, home addresses, or private events, especially when files may later be shared or uploaded.",
        },
      ],
    },
    {
      title: "Managing Metadata, Edits, and Catalog Information",
      steps: [
        {
          text: "Separate preservation masters from everyday working copies. Keep original or high-quality master files read-only where practical, and create derivative JPEGs or project files for cropping, retouching, albums, and sharing so you can return to the source. When judging color and exposure for edited copies, our [monitor calibration guide](/how-to/Calibrate-a-Desktop-Monitor-for-Accurate-sRGB-Colors) provides a more consistent viewing setup.",
        },
        {
          text: "Test metadata tools on a small batch before changing thousands of files. Confirm how the software handles timestamps, filenames, captions, raw files, sidecars, and undo operations, then inspect both the edited copies and untouched masters afterward. Keep a log of batch changes and avoid automatic actions that could convert formats or discard fields without making those consequences clear.",
        },
        {
          text: "Use a small controlled set of keywords instead of improvised tag sprawl. Choose reusable terms for broad themes such as family, travel, work, and a few recurring people or places, then apply them consistently while relying on folders and captions for the wider story. Review new tags occasionally so singular spelling variants and overlapping labels do not make search less reliable.",
        },
        {
          text: "Keep catalog information available outside one proprietary application. Prefer tools that support standard embedded metadata, sidecar files, or a documented export, and periodically export the folder list, captions, ratings, and keywords in a readable format. Test that export on a fresh device or second viewer so you know the descriptions are not trapped in a database you cannot restore.",
        },
        {
          text: "Save edited versions without overwriting raw files or original exports. Retain camera raw files and their adjustment information where available, use versioned filenames or a catalog to relate derivatives to the master, and avoid repeatedly compressing a working JPEG. Keep the original aspect, color, and resolution information when it matters, and generate fresh sharing copies from a stable master rather than from a social-media download.",
        },
        {
          text: "Write a short readme that explains the entire system. Describe the master folder, naming pattern, date conventions, master-versus-working distinction, keyword list, backup locations, and the steps for importing new photographs. Store this plain-language document with the archive and review it after software changes so a trusted person can understand the collection without watching you use it.",
        },
      ],
    },
    {
      title: "Building Independent and Recoverable Backups",
      steps: [
        {
          text: "Follow a 3-2-1 backup plan for the master library. Maintain the primary collection plus at least two backups on different storage types or services, with one copy in a separate physical location where practical. The [CISA data-backup guidance](https://www.cisa.gov/sites/default/files/publications/data_backup_options.pdf) explains this approach; include sidecars, catalog exports, and the readme rather than backing up image files alone.",
        },
        {
          text: "Automate local and remote backup jobs with version history. Schedule copies that match how often new photographs arrive, monitor failures and available capacity, and retain earlier versions long enough to notice accidental deletion or corruption. Our [encrypted cloud and local backup guide](/how-to/Set-Up-Encrypted-Automated-Cloud-and-Local-Backups) covers setup details, but remember that simple synchronization can copy deletions and is not automatically a complete backup.",
        },
        {
          text: "Protect backup accounts, devices, and recovery information. Use unique passwords and multi-factor authentication for cloud services, encrypt sensitive portable drives where supported, and store recovery keys or codes securely and separately from the protected device. Give a trusted person an appropriate emergency access plan without writing credentials into the public photo catalog.",
        },
        {
          text: "Keep an offline or otherwise isolated copy for serious failure scenarios. Disconnect a periodically updated external archive after verification, or use a service and configuration designed to preserve independent immutable or versioned copies, and restrict who can delete them. An always-connected drive and a live sync folder may both be affected by the same malware, account compromise, or accidental mass deletion.",
        },
        {
          text: "Test restoration before an emergency makes it urgent. Restore a sample of originals, edited copies, metadata, and the catalog export to a separate location, then open the images and check that names and descriptions survived. The [NCSC backup guide](https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security/1-backing-up-your-data) emphasizes knowing how to restore and checking that backups contain the important data.",
        },
      ],
    },
    {
      title: "Maintaining, Sharing, and Passing On the Archive",
      steps: [
        {
          text: "Schedule a recurring intake session for new photographs. Import from each active phone and camera, preserve originals, apply the established folder and metadata routine, and confirm that the next backup includes the new material. A monthly session is easier to manage than reconstructing several years at once, but choose a frequency that matches how quickly your collection grows.",
        },
        {
          text: "Perform an annual integrity and coverage review. Open a random sample from every storage period and backup location, check backup logs and available space, and compare file counts or checksums where your tools provide them reliably. Investigate missing years, unreadable files, abandoned accounts, and expired recovery methods instead of assuming a green backup icon proves that every memory is safe.",
        },
        {
          text: "Migrate storage and formats before they become difficult to read. Replace aging drives on a planned schedule, verify the new copies before retiring old media, and watch for software or account changes that could strand proprietary catalogs or original formats. Preserve the master during migration and document what changed, because copying to a new device is not complete until the files and metadata are usable there.",
        },
        {
          text: "Share purpose-made copies with privacy and consent in mind. Export suitably sized images for relatives, albums, or public posts, review location and other embedded metadata, and avoid exposing sensitive documents, children's details, or identifiable private moments. Tell recipients when further sharing is restricted, and keep the preservation masters and full archive access separate from casual sharing links.",
        },
        {
          text: "Document a handover plan and keep the workflow useful for new photos. Identify a trusted archive contact, record where masters, backups, recovery instructions, and the readme are stored, and review permissions without placing passwords in an unsecured note. For future projects, a consistent capture setup such as our [home portrait lighting guide](/how-to/Light-a-Home-Portrait-Studio-With-Two-Softboxes) can reduce corrective editing while the same intake routine preserves each new set.",
        },
      ],
    },
  ],
  tips: [
    "Finish one small year or event completely before starting another; visible progress makes a lifetime archive feel less overwhelming.",
    "Ask relatives for names and stories while they are available, and record who supplied uncertain identifications so later corrections remain traceable.",
    "Include the catalog export and readme in every restore test, not just the most visually impressive photographs.",
  ],
  warnings: [
    "Do not delete a phone, memory card, account, or old drive until the master copies, independent backups, and a sample restoration have all been verified.",
    "Cloud synchronization can reproduce deletions, ransomware, and unwanted edits, so keep independent versioned or offline backups as well.",
    "Review consent, location data, children's information, and private documents before uploading or sharing photographs and their metadata.",
  ],
  things: [
    "A reliable master-library computer or storage device with spare capacity",
    "Card readers, cables, and access to the original devices and accounts",
    "At least one external backup drive plus an independent remote backup option",
    "A suitable scanner for prints and albums where needed",
    "Photo-catalog or metadata software with a tested export method",
    "A secure recovery record and a plain-language archive readme",
  ],
  faqs: [
    {
      question: "Should I delete blurry and duplicate photographs?",
      answer: "Only after preserving the collection and reviewing what each image documents. Duplicates can be culled when they add no value, but a technically imperfect photo may still be the only record of a person or event. Keep rejected files temporarily until the selection and backups are confirmed.",
    },
    {
      question: "Is a cloud photo account enough protection?",
      answer: "No single account is a complete preservation plan. Account loss, sync deletion, subscription changes, corruption, and service problems can affect access, so maintain independent copies on different storage and test restoration, including metadata and catalog information.",
    },
    {
      question: "What filename format works best for a family archive?",
      answer: "A consistent year-month-day, short event, and sequence-number pattern is a practical starting point because it sorts chronologically and remains readable outside an app. Use approximate-date labels when necessary and explain the convention in the archive readme.",
    },
  ],
  references: [
    {
      title: "Personal Digital Archiving: The Basics of Scanning",
      publisher: "Library of Congress",
      url: "https://blogs.loc.gov/thesignal/2014/03/personal-digital-archiving-the-basics-of-scanning/",
    },
    {
      title: "Your Personal Archiving Project: Where Do You Start?",
      publisher: "Library of Congress",
      url: "https://blogs.loc.gov/thesignal/2016/05/how-to-begin-a-personal-archiving-project/",
    },
    {
      title: "Four Easy Tips for Preserving Your Digital Photographs",
      publisher: "Library of Congress",
      url: "https://blogs.loc.gov/thesignal/2011/10/four-easy-tips-for-preserving-your-digital-photographs/",
    },
    {
      title: "Data Backup Options",
      publisher: "Cybersecurity and Infrastructure Security Agency",
      url: "https://www.cisa.gov/sites/default/files/publications/data_backup_options.pdf",
    },
    {
      title: "Backing Up Your Data",
      publisher: "UK National Cyber Security Centre",
      url: "https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security/1-backing-up-your-data",
    },
  ],
};
