/*
 * Event data for Jatra.
 * All events are fictional and exist only for this project.
 * Dates use Indian Standard Time (+05:30).
 *
 * seats       = total capacity
 * seatsTaken  = seats already booked by other people (simulated)
 * Registrations made in this browser are subtracted on top of that.
 */

const CATEGORIES = ["Tech", "Music", "Workshop", "Sports", "Culture", "Food"];

const EVENTS = [
  {
    id: "konark-code-sprint",
    title: "Konark Code Sprint",
    category: "Tech",
    start: "2026-11-21T09:00:00+05:30",
    end: "2026-11-22T21:00:00+05:30",
    venue: "Infocity Convention Hall",
    area: "Chandrasekharpur",
    price: 0,
    seats: 240,
    seatsTaken: 168,
    featured: true,
    organizer: "Jatra Tech Collective",
    summary: "A 36-hour hackathon for student teams building tools for the city.",
    about: [
      "Teams of two to four get 36 hours to build something useful for Bhubaneswar: a bus-route helper, a civic dashboard, a faster way to find a free hospital bed. Mentors from local startups stay on the floor through the night.",
      "Bring a laptop and a charger. Meals, power and Wi-Fi are covered. Judging happens on the second evening, with prizes for the top three teams and a separate award for the best first-time team."
    ],
    schedule: [
      ["Day 1, 9:00 am", "Check-in and team formation"],
      ["Day 1, 11:00 am", "Problem statements announced, hacking begins"],
      ["Day 2, 2:00 pm", "Code freeze"],
      ["Day 2, 4:00 pm", "Demos and judging"],
      ["Day 2, 7:30 pm", "Results and prizes"]
    ]
  },
  {
    id: "winter-strings",
    title: "Winter Strings: Indie Night",
    category: "Music",
    start: "2026-11-28T18:30:00+05:30",
    end: "2026-11-28T22:30:00+05:30",
    venue: "Janata Maidan",
    area: "Jaydev Vihar",
    price: 499,
    seats: 1200,
    seatsTaken: 910,
    featured: true,
    organizer: "Backstage Odisha",
    summary: "Five indie bands from Odisha and Kolkata on one open-air stage.",
    about: [
      "Five bands, four hours, one open field. The line-up mixes Odia folk-rock with Kolkata's guitar-heavy indie scene, ending with a full-band headline set.",
      "Food stalls open with the gates. Carry a light jacket, since the maidan gets cold after nine. Entry is for ages 16 and up."
    ],
    schedule: [
      ["6:30 pm", "Gates open"],
      ["7:00 pm", "Opening sets"],
      ["8:45 pm", "Short break"],
      ["9:15 pm", "Headline set"]
    ]
  },
  {
    id: "pattachitra-workshop",
    title: "Pattachitra for Beginners",
    category: "Workshop",
    start: "2026-11-15T10:00:00+05:30",
    end: "2026-11-15T13:00:00+05:30",
    venue: "Odisha State Museum",
    area: "Lewis Road",
    price: 350,
    seats: 30,
    seatsTaken: 21,
    featured: false,
    organizer: "Raghurajpur Artists' Circle",
    summary: "Learn the outlines, borders and natural colours of Odisha's scroll painting.",
    about: [
      "A painter from Raghurajpur walks you through how a pattachitra is built: the fine black outline first, then the borders, then colours made from conch shell, lamp soot and stone.",
      "You'll finish a small painting of your own to take home. All materials are provided; no drawing experience needed."
    ],
    schedule: [
      ["10:00 am", "How a pattachitra is made"],
      ["10:30 am", "Sketching outlines"],
      ["11:30 am", "Borders and colour"],
      ["12:45 pm", "Show and tell"]
    ]
  },
  {
    id: "city-half-marathon",
    title: "Bhubaneswar Winter Half Marathon",
    category: "Sports",
    start: "2026-12-06T05:30:00+05:30",
    end: "2026-12-06T10:00:00+05:30",
    venue: "Kalinga Stadium",
    area: "Nayapalli",
    price: 800,
    seats: 2000,
    seatsTaken: 1460,
    featured: false,
    organizer: "Run Bhubaneswar",
    summary: "21 km, 10 km and 5 km routes through the city before sunrise.",
    about: [
      "Choose a 21 km, 10 km or 5 km route. All three start and finish at Kalinga Stadium and loop through Nayapalli and Jaydev Vihar while the roads are still closed to traffic.",
      "Your bib, timing chip and finisher's medal are included. Collect your race kit at the stadium the day before."
    ],
    schedule: [
      ["5:30 am", "21 km start"],
      ["6:00 am", "10 km start"],
      ["6:30 am", "5 km start"],
      ["9:00 am", "Prize giving"]
    ]
  },
  {
    id: "odissi-evening",
    title: "An Evening of Odissi",
    category: "Culture",
    start: "2026-12-12T18:00:00+05:30",
    end: "2026-12-12T20:30:00+05:30",
    venue: "Rabindra Mandap",
    area: "Sachivalaya Marg",
    price: 0,
    seats: 600,
    seatsTaken: 402,
    featured: true,
    organizer: "Kalinga Nritya Sangha",
    summary: "Three dancers, a live ensemble and a short talk on the form's temple roots.",
    about: [
      "Three solo Odissi performances accompanied by a live ensemble of mardala, flute, violin and vocals. Before the first piece, a short talk explains how the form grew out of temple ritual.",
      "Entry is free but seats are reserved, so register to keep yours. Doors close once the first performance starts."
    ],
    schedule: [
      ["6:00 pm", "Doors open"],
      ["6:20 pm", "Talk: Odissi and the temple"],
      ["6:45 pm", "Performances"],
      ["8:15 pm", "Meet the artists"]
    ]
  },
  {
    id: "old-town-food-trail",
    title: "Old Town Food Trail",
    category: "Food",
    start: "2026-11-22T17:00:00+05:30",
    end: "2026-11-22T20:00:00+05:30",
    venue: "Starts at Bindu Sagar",
    area: "Old Town",
    price: 600,
    seats: 25,
    seatsTaken: 19,
    featured: false,
    organizer: "Eat Odisha Walks",
    summary: "A guided walk to the dahibara, chhena jhili and chaat stalls locals queue at.",
    about: [
      "A three-hour evening walk through the lanes around Bindu Sagar, stopping at seven stalls that have been feeding the Old Town for decades.",
      "All tastings are included in the price. Wear comfortable shoes and let us know about allergies when you register."
    ],
    schedule: [
      ["5:00 pm", "Meet at the Bindu Sagar steps"],
      ["5:20 pm", "Dahibara aloodum"],
      ["6:15 pm", "Chaat and gupchup lane"],
      ["7:30 pm", "Chhena jhili to finish"]
    ]
  },
  {
    id: "uiux-first-steps",
    title: "UI/UX Design: First Steps",
    category: "Workshop",
    start: "2026-11-29T11:00:00+05:30",
    end: "2026-11-29T16:00:00+05:30",
    venue: "Co-work Loft",
    area: "Saheed Nagar",
    price: 0,
    seats: 40,
    seatsTaken: 31,
    featured: false,
    organizer: "Design Club Bhubaneswar",
    summary: "Wireframe, prototype and test one app screen in a single afternoon.",
    about: [
      "A hands-on afternoon for students who want to start designing interfaces. You'll sketch a screen on paper, turn it into a clickable prototype and test it with someone else in the room.",
      "Bring a laptop with a free Figma account set up. Lunch is provided."
    ],
    schedule: [
      ["11:00 am", "What good UI looks like"],
      ["12:00 pm", "Paper wireframes"],
      ["1:00 pm", "Lunch"],
      ["2:00 pm", "Build a clickable prototype"],
      ["3:15 pm", "Quick usability tests"]
    ]
  },
  {
    id: "startup-pitch-day",
    title: "Student Startup Pitch Day",
    category: "Tech",
    start: "2026-12-10T14:00:00+05:30",
    end: "2026-12-10T18:00:00+05:30",
    venue: "Infocity Convention Hall",
    area: "Chandrasekharpur",
    price: 0,
    seats: 300,
    seatsTaken: 120,
    featured: false,
    organizer: "Jatra Tech Collective",
    summary: "Twelve student founders pitch to investors in five minutes each.",
    about: [
      "Twelve student teams get five minutes on stage and five minutes of questions from a panel of investors and founders.",
      "The audience votes for a people's choice award. Stay for the networking hour afterwards."
    ],
    schedule: [
      ["2:00 pm", "Welcome"],
      ["2:15 pm", "Pitches, first half"],
      ["3:30 pm", "Break"],
      ["3:45 pm", "Pitches, second half"],
      ["5:00 pm", "Results and networking"]
    ]
  },
  {
    id: "ekamra-craft-fair",
    title: "Ekamra Winter Craft Fair",
    category: "Culture",
    start: "2026-12-18T11:00:00+05:30",
    end: "2026-12-20T21:00:00+05:30",
    venue: "Ekamra Haat",
    area: "Madhusudan Nagar",
    price: 50,
    seats: 5000,
    seatsTaken: 1800,
    featured: false,
    organizer: "Odisha Crafts Network",
    summary: "Three days of handloom, dokra metalwork and silver filigree from across Odisha.",
    about: [
      "More than eighty artisans bring Sambalpuri and Bomkai handloom, dokra metal casting, Cuttack silver filigree and palm-leaf engraving.",
      "Live demonstrations run every afternoon. One ticket covers all three days."
    ],
    schedule: [
      ["Day 1, 11:00 am", "Fair opens"],
      ["Day 1 to 3, 3:00 pm", "Live craft demonstrations"],
      ["Day 3, 9:00 pm", "Fair closes"]
    ]
  },
  {
    id: "chhena-poda-class",
    title: "Bake Chhena Poda at Home",
    category: "Food",
    start: "2026-12-13T16:00:00+05:30",
    end: "2026-12-13T18:30:00+05:30",
    venue: "Kitchen Studio",
    area: "Patia",
    price: 450,
    seats: 16,
    seatsTaken: 13,
    featured: false,
    organizer: "Kitchen Studio",
    summary: "Make Odisha's caramelised cheese dessert from fresh chhena, no oven needed.",
    about: [
      "Learn to make fresh chhena, sweeten it with jaggery and cardamom, and bake it slowly in a pan until the outside caramelises.",
      "Small batch, sixteen people. You'll leave with the recipe and your own chhena poda."
    ],
    schedule: [
      ["4:00 pm", "Making fresh chhena"],
      ["4:45 pm", "Mixing and seasoning"],
      ["5:15 pm", "Baking on the stove"],
      ["6:15 pm", "Tasting"]
    ]
  },
  {
    id: "lakeside-jazz",
    title: "Jazz by the Lake",
    category: "Music",
    start: "2027-01-03T17:30:00+05:30",
    end: "2027-01-03T21:00:00+05:30",
    venue: "Bindu Sagar ghats",
    area: "Old Town",
    price: 299,
    seats: 400,
    seatsTaken: 85,
    featured: false,
    organizer: "Backstage Odisha",
    summary: "A quartet and a big band play the new year in at sunset.",
    about: [
      "A sunset set by a local quartet, followed by a twelve-piece big band playing swing standards and a few Odia film songs rearranged for brass.",
      "Seating is on mats along the ghats. Bring a shawl."
    ],
    schedule: [
      ["5:30 pm", "Quartet set"],
      ["7:00 pm", "Break"],
      ["7:30 pm", "Big band"]
    ]
  },
  {
    id: "inter-college-football",
    title: "Inter-College Football Cup",
    category: "Sports",
    start: "2027-01-09T08:00:00+05:30",
    end: "2027-01-09T18:00:00+05:30",
    venue: "Kalinga Stadium",
    area: "Nayapalli",
    price: 0,
    seats: 1500,
    seatsTaken: 240,
    featured: false,
    organizer: "Bhubaneswar Colleges Sports Board",
    summary: "Sixteen college teams, one day of knockout football. Free entry to watch.",
    about: [
      "Sixteen college teams play 7-a-side knockout matches across two pitches, ending with a floodlit final.",
      "Spectator entry is free; register so we can plan seating and water stations."
    ],
    schedule: [
      ["8:00 am", "Round of 16"],
      ["11:30 am", "Quarter-finals"],
      ["2:30 pm", "Semi-finals"],
      ["5:00 pm", "Final"]
    ]
  },
  {
    id: "autumn-photo-walk",
    title: "Autumn Photo Walk",
    category: "Workshop",
    start: "2026-11-01T06:30:00+05:30",
    end: "2026-11-01T09:00:00+05:30",
    venue: "Lingaraj Temple Road",
    area: "Old Town",
    price: 0,
    seats: 30,
    seatsTaken: 30,
    featured: false,
    organizer: "Lens Club Bhubaneswar",
    summary: "An early-morning walk photographing the temples of the Old Town.",
    about: [
      "A slow morning walk past the Lingaraj, Mukteswar and Rajarani temples, with tips on shooting stone carving in low light.",
      "Any camera works, including a phone."
    ],
    schedule: [
      ["6:30 am", "Meet at Lingaraj Temple Road"],
      ["7:15 am", "Mukteswar Temple"],
      ["8:15 am", "Rajarani Temple"]
    ]
  }
];
