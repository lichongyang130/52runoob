/* Computers and Electronics — long-form guide. */

module.exports = {
  slug: "Speed-Up-a-Slow-Laptop",
  title: "Speed Up a Slow Laptop",
  category: "Computers-and-Electronics",
  hero_image: "laptop",
  author: "Howcompass Tech Team",
  read_time: 20,
  featured: 1,
  summary:
    "A slow laptop is usually not broken — it is tired. This guide works through the whole checklist in order, from the two-minute fixes to the ones that need a screwdriver, and tells you when upgrading the hardware is cheaper than replacing the machine.",
  intro:
    "Work through these steps from the top. Each one is ordered by effort versus payoff, so you can stop as soon as the laptop feels fast enough for what you do. Do not skip step 1: half of all 'my laptop is slow' complaints end there.",
  methods: [
    {
      title: "The Two-Minute Fixes",
      steps: [
        {
          text: "Restart the laptop instead of closing the lid. Sleep mode keeps every stalled background task alive; a full restart clears them and takes about a minute.",
        },
        {
          text: "Open the task manager and sort by CPU, then by memory, then by disk. The process at the top of any of those lists is your actual problem — not the one you assumed.",
        },
        {
          text: "Check how full the drive is. Below 10% free space, Windows and macOS both slow down badly because they cannot manage temporary files or updates.",
        },
        {
          text: "Unplug every accessory and see whether the machine speeds up. A failing USB hub or a faulty external drive can stall the whole system while it retries.",
        },
        {
          text: "Look at the battery or power setting. Many laptops deliberately throttle the processor on battery; plugging in can restore full speed instantly.",
        },
      ],
    },
    {
      title: "Cleaning Up the Software",
      steps: [
        {
          text: "Remove programs you have not opened in six months. Fewer installed applications means fewer background updaters, tray icons and startup hooks.",
        },
        {
          text: "Turn off startup apps one at a time, rebooting between changes. Disable everything you do not need in the first five minutes of use.",
        },
        {
          text: "Uninstall browser toolbars and 'cleaner' utilities. Optimiser apps are one of the most common causes of the slowdown they claim to fix.",
        },
        {
          text: "Clear each browser profile: cache, cookies and unused extensions. A browser with 40 extensions will make a healthy laptop feel five years old.",
        },
        {
          text: "Run the built-in disk cleanup or storage manager, and delete old system update files. This alone can free several gigabytes.",
        },
        {
          text: "Run a full malware scan with the built-in defender. Cryptocurrency miners and ad injectors hide quietly and use every spare cycle.",
        },
      ],
    },
    {
      title: "Making It Fast Again",
      steps: [
        {
          text: "Install all pending operating-system updates, then reboot twice. Feature updates and driver updates fix performance bugs that no amount of cleaning will.",
        },
        {
          text: "Update your graphics driver from the chip maker, not from a download site. Old GPU drivers cause stuttering in video calls and scrolling.",
        },
        {
          text: "Check the drive health with the manufacturer's tool. A failing SSD silently retries bad blocks and makes everything feel slow before it fails outright.",
        },
        {
          text: "Move large media libraries to an external drive or the cloud. Keeping 200 GB of video on the system drive leaves no room for the system to work.",
        },
        {
          text: "Set the power plan to balanced or high performance and turn off battery saver while plugged in.",
        },
        {
          text: "Create a second user account and log in to it. If that account is fast, the problem is a corrupted profile, not the hardware.",
        },
        {
          text: "Reset the operating system while keeping your files, as a last software step. This clears the accumulated damage of years of installs.",
        },
      ],
    },
    {
      title: "Hardware That Actually Helps",
      steps: [
        {
          text: "Check the RAM usage graph before buying anything. If it sits pinned at 90% during your normal work, more memory is the single best upgrade.",
        },
        {
          text: "Install more RAM if the laptop has a free slot. Going from 8 GB to 16 GB is the cheapest noticeable speed-up on any machine.",
        },
        {
          text: "Replace a mechanical hard drive with an SSD, or add a second SSD for your working files. This is the largest single improvement available to an older laptop.",
        },
        {
          text: "Open the case, remove dust from the fan and heatsink with compressed air. A clogged fan makes the CPU throttle itself to stay cool.",
        },
        {
          text: "Replace the thermal paste if the laptop is more than four years old and gets hot under light load.",
        },
        {
          text: "Reinstall the operating system from scratch on a clean drive if all else fails. Back up first, and check that you have the licence key or account login.",
        },
        {
          text: "Compare the cost of upgrades with a replacement. If the machine is over six years old and needs both RAM and an SSD, put the money toward a new laptop.",
        },
      ],
    },
  ],
  tips: [
    "Keep at least 15% of the drive empty. Both Windows and macOS use free space as scratch space, and neither behaves well when it runs out.",
    "Note what you were doing each time the laptop felt slow. A pattern — video calls, large spreadsheets, twenty browser tabs — tells you exactly which upgrade to buy.",
    "Do one change at a time and reboot in between. Changing five settings at once means you will never know which one worked.",
  ],
  warnings: [
    "Back up your files before opening the case, changing a drive, or reinstalling the system. None of those steps is reversible without a copy.",
    "Unplug the power and remove the battery where possible before touching internal components. Static discharge can destroy a motherboard.",
    "Do not use registry cleaners or 'one-click optimiser' suites. They are unnecessary on modern systems and are a common source of instability.",
  ],
  things: [
    "The laptop and its charger",
    "A backup drive or cloud account with enough space",
    "Compressed air and a small screwdriver set",
    "The laptop's model number written down",
    "A spare USB stick (8 GB or larger) for recovery media",
  ],
  faqs: [
    {
      question: "Why is my laptop suddenly slow when it used to be fast?",
      answer:
        "Usually one of three things: the drive is nearly full, a background process or malware is eating resources, or the machine is overheating and throttling. Steps 1 to 6 will identify which one.",
    },
    {
      question: "Does more RAM fix a slow laptop?",
      answer:
        "Only if memory is the bottleneck. Watch the memory graph during your normal work — if it stays above 85%, more RAM helps. If it hovers around 50%, the money is better spent on an SSD.",
    },
    {
      question: "Is it worth upgrading a five-year-old laptop?",
      answer:
        "An SSD and a RAM stick typically cost a fraction of a new machine and can make an older laptop perfectly usable for browsing, office work and video calls. Do not spend that money if the screen, battery or hinges are also failing.",
    },
    {
      question: "How often should I reinstall the operating system?",
      answer:
        "Most people never need to. Reinstalling is worth it only after the software steps above have failed, and always after a verified backup.",
    },
  ],
  references: [
    {
      title: "Tips to improve PC performance in Windows",
      publisher: "Microsoft Support",
      url: "https://support.microsoft.com/en-us/windows/tips-to-improve-pc-performance-in-windows-b3b3ef5b-5953-fb6a-2528-4bbed82fba96",
    },
    {
      title: "Change your Mac's energy settings to save power",
      publisher: "Apple Support",
      url: "https://support.apple.com/guide/mac-help/change-energy-settings-mchlp1278/mac",
    },
    {
      title: "How to check the health of an SSD",
      publisher: "Crucial technical library",
      url: "https://www.crucial.com/articles/about-ssd/how-to-check-ssd-health",
    },
    {
      title: "Thermal throttling explained: why laptops slow down when hot",
      publisher: "Intel Support",
      url: "https://www.intel.com/content/www/us/en/support/articles/000005946/processors.html",
    },
    {
      title: "Protect your PC from malware",
      publisher: "Microsoft Security",
      url: "https://www.microsoft.com/en-us/security/business/security-101/what-is-malware",
    },
  ],
};
