/**
 * Fun facts about rocks and minerals to display after scanning
 */

export interface RockFunFact {
  fact: string
  category: 'history' | 'science' | 'culture' | 'fun'
}

// General facts that can apply to any rock
export const GENERAL_FACTS: RockFunFact[] = [
  {
    fact: "The oldest rocks on Earth are about 4 billion years old.",
    category: 'science'
  },
  {
    fact: "Some rocks can float! Pumice is so full of air pockets it floats on water.",
    category: 'fun'
  },
  {
    fact: "The word 'geology' comes from Greek words meaning 'study of the Earth'.",
    category: 'history'
  },
  {
    fact: "There are over 5,000 known minerals on Earth.",
    category: 'science'
  },
  {
    fact: "Ancient Egyptians used lapis lazuli for Cleopatra's eye shadow.",
    category: 'culture'
  }
]

// Facts specific to rock/mineral types
export const TYPE_FACTS: Record<string, RockFunFact[]> = {
  quartz: [
    {
      fact: "Quartz makes up about 12% of Earth's crust, making it the second most abundant mineral.",
      category: 'science'
    },
    {
      fact: "Ancient Greeks believed quartz was ice frozen so hard it would never melt.",
      category: 'history'
    },
    {
      fact: "Quartz crystals are used in watches because they vibrate at a precise frequency.",
      category: 'science'
    }
  ],
  amethyst: [
    {
      fact: "The name 'amethyst' comes from Greek, meaning 'not intoxicated' - it was believed to prevent drunkenness.",
      category: 'history'
    },
    {
      fact: "Amethyst gets its purple color from iron impurities and natural radiation.",
      category: 'science'
    },
    {
      fact: "Until the 18th century, amethyst was as valuable as diamonds.",
      category: 'history'
    }
  ],
  obsidian: [
    {
      fact: "Obsidian blades can be sharper than surgical steel scalpels.",
      category: 'science'
    },
    {
      fact: "Ancient peoples used obsidian for tools, weapons, and mirrors for over 700,000 years.",
      category: 'history'
    },
    {
      fact: "Obsidian forms when lava cools so quickly that atoms don't have time to form crystals.",
      category: 'science'
    }
  ],
  pyrite: [
    {
      fact: "Pyrite is called 'Fool's Gold' but was actually used to start fires in prehistoric times.",
      category: 'history'
    },
    {
      fact: "During WWII, pyrite was used in radio receivers.",
      category: 'history'
    },
    {
      fact: "Pyrite crystals form perfect cubes in nature without any human shaping.",
      category: 'science'
    }
  ],
  gold: [
    {
      fact: "All the gold ever mined would fit in a cube just 21 meters on each side.",
      category: 'fun'
    },
    {
      fact: "Gold is so malleable that one ounce can be beaten into a sheet covering 100 square feet.",
      category: 'science'
    },
    {
      fact: "The largest gold nugget ever found weighed 72 kg (159 lbs).",
      category: 'fun'
    }
  ],
  diamond: [
    {
      fact: "Diamonds form about 150-200 km below Earth's surface under extreme pressure.",
      category: 'science'
    },
    {
      fact: "The word 'diamond' comes from Greek 'adamas' meaning 'unbreakable'.",
      category: 'history'
    },
    {
      fact: "Scientists have discovered a planet that may be largely made of diamond.",
      category: 'fun'
    }
  ],
  opal: [
    {
      fact: "Opals contain up to 20% water trapped in their silica structure.",
      category: 'science'
    },
    {
      fact: "Australia produces 95% of the world's precious opals.",
      category: 'fun'
    },
    {
      fact: "Mars has opals! NASA's Spirit rover discovered them in 2008.",
      category: 'science'
    }
  ],
  garnet: [
    {
      fact: "Garnets were used as bullets in the 1892 Hunza War in Kashmir.",
      category: 'history'
    },
    {
      fact: "The name 'garnet' comes from Latin 'granatum' meaning pomegranate seed.",
      category: 'history'
    },
    {
      fact: "Garnet has been used as a gemstone for over 5,000 years.",
      category: 'history'
    }
  ],
  malachite: [
    {
      fact: "Ancient Egyptians believed malachite protected children from evil spirits.",
      category: 'culture'
    },
    {
      fact: "The green pigment in malachite was used to paint the Sistine Chapel.",
      category: 'history'
    },
    {
      fact: "Malachite forms through the weathering of copper ore deposits.",
      category: 'science'
    }
  ],
  fluorite: [
    {
      fact: "Fluorite glows under UV light - the phenomenon 'fluorescence' is named after it!",
      category: 'science'
    },
    {
      fact: "Fluorite comes in almost every color, making it a 'chameleon' mineral.",
      category: 'fun'
    },
    {
      fact: "Pure fluorite is colorless - impurities create all the beautiful colors.",
      category: 'science'
    }
  ],
  labradorite: [
    {
      fact: "Labradorite's flash of color is called 'labradorescence' - a phenomenon unique to this mineral.",
      category: 'science'
    },
    {
      fact: "Inuit legend says labradorite fell from the frozen fire of the Aurora Borealis.",
      category: 'culture'
    },
    {
      fact: "Labradorite was first found in Labrador, Canada in 1770.",
      category: 'history'
    }
  ],
  moonstone: [
    {
      fact: "Ancient Romans believed moonstone was formed from solidified rays of the moon.",
      category: 'history'
    },
    {
      fact: "Moonstone's glow is called 'adularescence' and comes from light scattering between layers.",
      category: 'science'
    },
    {
      fact: "Moonstone is the official gemstone of Florida, honoring the moon landings.",
      category: 'culture'
    }
  ],
  turquoise: [
    {
      fact: "Turquoise is one of the oldest known gemstones, used for at least 6,000 years.",
      category: 'history'
    },
    {
      fact: "The word 'turquoise' comes from French for 'Turkish stone' due to trade routes.",
      category: 'history'
    },
    {
      fact: "Ancient Persians believed turquoise changed color to warn of danger.",
      category: 'culture'
    }
  ]
}

/**
 * Get a random fun fact for a given rock type
 */
export function getRandomFact(rockType?: string): RockFunFact {
  // Try to get a type-specific fact first
  if (rockType) {
    const normalizedType = rockType.toLowerCase()
    const typeFacts = TYPE_FACTS[normalizedType]
    if (typeFacts && typeFacts.length > 0) {
      return typeFacts[Math.floor(Math.random() * typeFacts.length)]
    }
  }

  // Fall back to general facts
  return GENERAL_FACTS[Math.floor(Math.random() * GENERAL_FACTS.length)]
}

/**
 * Get multiple unique facts
 */
export function getMultipleFacts(count: number, rockType?: string): RockFunFact[] {
  const facts: RockFunFact[] = []
  const usedIndices = new Set<number>()

  // Combine type-specific and general facts
  const availableFacts = [
    ...(rockType && TYPE_FACTS[rockType.toLowerCase()] || []),
    ...GENERAL_FACTS
  ]

  while (facts.length < count && facts.length < availableFacts.length) {
    const index = Math.floor(Math.random() * availableFacts.length)
    if (!usedIndices.has(index)) {
      usedIndices.add(index)
      facts.push(availableFacts[index])
    }
  }

  return facts
}
