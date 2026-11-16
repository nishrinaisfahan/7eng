export type IllustrationKind =
  | "wave"
  | "sunrise"
  | "family"
  | "schoolbag"
  | "clock"
  | "brush"
  | "palette"
  | "bicycle"
  | "guitar"
  | "book"
  | "camera"
  | "plant"
  | "glasses"
  | "smile"
  | "heart"
  | "star"
  | "shield"
  | "lightbulb"
  | "pronoun-person"
  | "pronoun-gift"
  | "pronoun-home"
  | "puzzle"
  | "whisk"
  | "spatula"
  | "pan"
  | "board"
  | "bowl"
  | "eggs"
  | "strawberry"
  | "pancakes"
  | "herb"
  | "nutrition";

export type FlashcardItem = {
  id: string;
  unitId: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  tip: string;
  illustration: IllustrationKind;
  pastelSurface: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  highlight?: string;
};

export type GrammarPoint = {
  title: string;
  pattern: string;
  explanation: string;
  examples: string[];
};

export type InteractivePrompt = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  audioPrompt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type UnitData = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  pastelCardBg: string;
  pastelAccentBg: string;
  accentText: string;
  accentButton: string;
  dialogueTitle: string;
  dialogue: DialogueLine[];
  grammarPoints: GrammarPoint[];
  exerciseTitle: string;
  exerciseInstruction: string;
  exerciseType: "sequence" | "match-fill";
  sequenceSteps?: { id: string; text: string; order: number }[];
  fillPrompts?: InteractivePrompt[];
  quiz: QuizQuestion[];
};

export type SentenceChallenge = {
  id: string;
  category: "intro" | "hobbies" | "traits" | "pronouns" | "food";
  categoryLabel: string;
  clue: string;
  slots: string[];
  targetTokens: string[];
  distractorTokens: string[];
  grammarNote: string;
};

export type ChatTopic = {
  id: string;
  title: string;
  goal: string;
  opener: string;
  starterReplies: string[];
  helpfulWords: string[];
  pastelSurface: string;
};

export const UNITS: UnitData[] = [
  {
    id: "unit-1",
    number: "Unit 1",
    title: "Hello, Family & Daily Routines",
    subtitle: "Introduce yourself, talk about your family, and share your everyday schedule.",
    summary: "Greetings · Family Tree · Morning & Evening Routines",
    pastelCardBg: "bg-[#FFF5F0]",
    pastelAccentBg: "bg-[#FFE6DC]",
    accentText: "text-[#9C3526]",
    accentButton: "bg-[#C84331] hover:bg-[#AD3525] text-white",
    dialogueTitle: "Meeting a New Classmate",
    dialogue: [
      {
        speaker: "Maya",
        text: "Hi! My name is Maya, and I am in Grade 7. Nice to meet you!",
        highlight: "My name is",
      },
      {
        speaker: "Leo",
        text: "Nice to meet you too, Maya! I live near the park with my parents and my little sister.",
        highlight: "with my parents",
      },
      {
        speaker: "Maya",
        text: "What time do you usually wake up on school days?",
        highlight: "usually wake up",
      },
      {
        speaker: "Leo",
        text: "I wake up at six thirty, brush my teeth, and eat breakfast before taking the bus.",
        highlight: "wake up at six thirty",
      },
    ],
    grammarPoints: [
      {
        title: "Introducing Yourself",
        pattern: "Hello! My name is [Name]. I am [age] years old, and I live in [City].",
        explanation: "Use simple present 'am / is / live' to share facts about yourself.",
        examples: [
          "Hello! My name is Sara. I am twelve years old.",
          "I live in Bandung with my grandparents.",
        ],
      },
      {
        title: "Daily Routines with Time",
        pattern: "Subject + verb (base / -s) + at [time]",
        explanation: "Add -s or -es to the verb when talking about he, she, or one family member.",
        examples: [
          "I wake up at 6:00 a.m. every morning.",
          "My brother brushes his teeth after breakfast.",
        ],
      },
    ],
    exerciseTitle: "Order Leo's Morning Routine",
    exerciseInstruction:
      "Tap the daily routine steps in the right order from waking up to arriving at school.",
    exerciseType: "sequence",
    sequenceSteps: [
      { id: "r1", text: "First, I wake up at 6:15 a.m. and make my bed.", order: 1 },
      { id: "r2", text: "Next, I wash my face and brush my teeth.", order: 2 },
      { id: "r3", text: "Then, I eat a healthy breakfast with my family.", order: 3 },
      { id: "r4", text: "After breakfast, I put on my uniform and pack my bag.", order: 4 },
      { id: "r5", text: "Finally, I walk to school at 7:00 a.m.", order: 5 },
    ],
    quiz: [
      {
        id: "u1-q1",
        question: "Which sentence is the best way to introduce yourself to a new classmate?",
        options: [
          "Hello! My name is Dina, and I am in Grade 7.",
          "Hello! My name Dina Grade 7.",
          "Dina is me name hello.",
          "I are Dina from Grade 7.",
        ],
        correctIndex: 0,
        explanation: "Use 'My name is...' and 'I am...' for a clear, friendly introduction.",
      },
      {
        id: "u1-q2",
        question: "My mother's brother is my ____.",
        options: ["cousin", "uncle", "nephew", "grandfather"],
        correctIndex: 1,
        explanation: "Your mother's or father's brother is your uncle.",
      },
      {
        id: "u1-q3",
        question: "Listen to the audio. Which routine activity did you hear?",
        audioPrompt: "Every evening, I do my homework before dinner.",
        options: [
          "Brushing teeth in the morning",
          "Doing homework before dinner",
          "Playing soccer after lunch",
          "Waking up at seven o'clock",
        ],
        correctIndex: 1,
        explanation: "The audio says: 'Every evening, I do my homework before dinner.'",
      },
      {
        id: "u1-q4",
        question: "Choose the correct verb: 'My little sister ____ her face at 6:30 a.m.'",
        options: ["wash", "washing", "washes", "washed"],
        correctIndex: 2,
        explanation: "For 'my little sister' (she), add -es to 'wash' -> 'washes'.",
      },
      {
        id: "u1-q5",
        question: "Your aunt's son or daughter is your ____.",
        options: ["sibling", "cousin", "niece", "twin"],
        correctIndex: 1,
        explanation: "The child of your aunt or uncle is your cousin.",
      },
    ],
  },
  {
    id: "unit-2",
    number: "Unit 2",
    title: "Hobbies & Free Time",
    subtitle: "Tell others what you love doing after school and on weekends.",
    summary: "Hobby Verbs · Like / Enjoy + -ing · Frequency Adverbs",
    pastelCardBg: "bg-[#F3F8FF]",
    pastelAccentBg: "bg-[#E0ECFF]",
    accentText: "text-[#234C94]",
    accentButton: "bg-[#295CB8] hover:bg-[#204A96] text-white",
    dialogueTitle: "Talking About Weekend Hobbies",
    dialogue: [
      {
        speaker: "Nadia",
        text: "What do you like doing in your free time, Kevin?",
        highlight: "like doing",
      },
      {
        speaker: "Kevin",
        text: "I really enjoy cycling around the neighborhood and taking nature photos.",
        highlight: "enjoy cycling",
      },
      {
        speaker: "Nadia",
        text: "Cool! I love sketching comics and playing the acoustic guitar.",
        highlight: "love sketching",
      },
      {
        speaker: "Kevin",
        text: "How often do you practice guitar? I usually ride my bike on Saturdays.",
        highlight: "usually",
      },
    ],
    grammarPoints: [
      {
        title: "Talking About Likes with -ing",
        pattern: "I like / love / enjoy + [verb-ing]",
        explanation: "After 'like', 'love', or 'enjoy', add -ing to show an activity you feel happy doing.",
        examples: [
          "I enjoy reading mystery books before bed.",
          "She loves gardening with her grandmother.",
        ],
      },
      {
        title: "Adverbs of Frequency",
        pattern: "always (100%) -> usually (80%) -> sometimes (50%) -> never (0%)",
        explanation: "Place frequency adverbs before the main action verb (or after 'am / is / are').",
        examples: [
          "We usually play badminton on Friday afternoons.",
          "He sometimes bakes cookies with his dad.",
        ],
      },
    ],
    exerciseTitle: "Build Hobby Sentences",
    exerciseInstruction: "Pick the natural hobby word or frequency adverb to complete each sentence.",
    exerciseType: "match-fill",
    fillPrompts: [
      {
        id: "h1",
        prompt: "I enjoy ____ colorful flowers in my sketchbook after school.",
        options: ["sketching", "sketch", "sketched"],
        answer: "sketching",
        explanation: "Use verb + -ing ('sketching') after 'enjoy'.",
      },
      {
        id: "h2",
        prompt: "Maya ____ rides her bicycle on Sundays — she only misses it when it rains.",
        options: ["usually", "never", "yesterday"],
        answer: "usually",
        explanation: "'Usually' means most of the time (about 80%).",
      },
      {
        id: "h3",
        prompt: "My friends love ____ guitar together in the music club.",
        options: ["playing", "plays", "played"],
        answer: "playing",
        explanation: "After 'love', use the -ing form: 'love playing'.",
      },
      {
        id: "h4",
        prompt: "Rafi likes ____ new plants in small pots on his balcony.",
        options: ["growing", "grow", "grows"],
        answer: "growing",
        explanation: "'Likes growing' shows an ongoing hobby.",
      },
    ],
    quiz: [
      {
        id: "u2-q1",
        question: "Complete the sentence: 'Sinta enjoys ____ mystery stories.'",
        options: ["read", "reading", "reads", "to reading"],
        correctIndex: 1,
        explanation: "Always use the -ing form after 'enjoy' -> 'enjoys reading'.",
      },
      {
        id: "u2-q2",
        question: "Which adverb means you do a hobby 0% of the time?",
        options: ["always", "often", "sometimes", "never"],
        correctIndex: 3,
        explanation: "'Never' means 0% — not at any time.",
      },
      {
        id: "u2-q3",
        question: "Listen to the audio. What is Tari's favorite weekend hobby?",
        audioPrompt: "On weekends, I love riding my bicycle through the park.",
        options: [
          "Playing video games",
          "Riding her bicycle",
          "Swimming in the pool",
          "Cooking noodles",
        ],
        correctIndex: 1,
        explanation: "Tari says she loves riding her bicycle through the park.",
      },
      {
        id: "u2-q4",
        question: "Which question correctly asks someone about their hobby?",
        options: [
          "What do you like doing in your free time?",
          "What hobby you are doing?",
          "How many hobbies are you?",
          "Where does your hobby go?",
        ],
        correctIndex: 0,
        explanation: "'What do you like doing in your free time?' is natural and polite.",
      },
      {
        id: "u2-q5",
        question: "Choose the best word order: 'always / on Saturdays / soccer / plays / Anton'",
        options: [
          "Anton plays always soccer on Saturdays.",
          "Anton always plays soccer on Saturdays.",
          "Always Anton plays on Saturdays soccer.",
          "Anton soccer always plays on Saturdays.",
        ],
        correctIndex: 1,
        explanation: "Put the frequency adverb ('always') before the main verb ('plays').",
      },
    ],
  },
  {
    id: "unit-3",
    number: "Unit 3",
    title: "Describing People & Traits",
    subtitle: "Describe physical appearance and positive personality traits clearly.",
    summary: "Appearance (has / wears) · Personality (is) · Kind Adjectives",
    pastelCardBg: "bg-[#F9F4FF]",
    pastelAccentBg: "bg-[#EDE0FF]",
    accentText: "text-[#582B8C]",
    accentButton: "bg-[#6838A3] hover:bg-[#542B87] text-white",
    dialogueTitle: "Guess Who in Our Class",
    dialogue: [
      {
        speaker: "Hana",
        text: "Who is the new student sitting by the window?",
        highlight: "sitting by the window",
      },
      {
        speaker: "Toby",
        text: "That is Farhan. He is tall, has short curly hair, and wears round glasses.",
        highlight: "has short curly hair",
      },
      {
        speaker: "Hana",
        text: "What is he like? He looks very friendly!",
        highlight: "What is he like?",
      },
      {
        speaker: "Toby",
        text: "Yes! He is super cheerful, patient, and creative. He loves sharing his markers.",
        highlight: "cheerful, patient, and creative",
      },
    ],
    grammarPoints: [
      {
        title: "Physical Appearance: 'is' vs 'has' vs 'wears'",
        pattern: "He/She is [height/build] · has [hair/eyes/freckles] · wears [glasses/a hat]",
        explanation: "Use 'is' for height or age, 'has' for hair/eyes/face features, and 'wears' for clothes or glasses.",
        examples: [
          "She is medium height and has long wavy hair.",
          "My grandfather wears round glasses and has a warm smile.",
        ],
      },
      {
        title: "Personality Traits",
        pattern: "What is [person] like? -> He/She is [cheerful / generous / patient / brave].",
        explanation: "'What does he look like?' asks about appearance. 'What is he like?' asks about personality!",
        examples: [
          "My older sister is very patient when she helps me study.",
          "Our science teacher is creative and cheerful.",
        ],
      },
    ],
    exerciseTitle: "Choose 'is', 'has', or 'wears'",
    exerciseInstruction: "Pick the exact verb or trait word to describe each person.",
    exerciseType: "match-fill",
    fillPrompts: [
      {
        id: "t1",
        prompt: "Lina ____ bright brown eyes and cute freckles on her cheeks.",
        options: ["has", "is", "wears"],
        answer: "has",
        explanation: "Use 'has' for hair, eyes, and facial features like freckles.",
      },
      {
        id: "t2",
        prompt: "My math partner ____ rectangular glasses in class.",
        options: ["wears", "has", "is"],
        answer: "wears",
        explanation: "Use 'wears' for glasses, hats, or clothing items.",
      },
      {
        id: "t3",
        prompt: "A person who stays calm and helps younger students is ____.",
        options: ["patient", "curly", "tall"],
        answer: "patient",
        explanation: "'Patient' is a personality trait; 'curly' and 'tall' describe appearance.",
      },
      {
        id: "t4",
        prompt: "Bima always shares his snacks and helps friends. He is very ____.",
        options: ["generous", "shy", "sleepy"],
        answer: "generous",
        explanation: "'Generous' means happy to share and give to others.",
      },
    ],
    quiz: [
      {
        id: "u3-q1",
        question: "Which question asks about someone's personality instead of their looks?",
        options: [
          "What does she look like?",
          "What is she like?",
          "How tall is she?",
          "What color is her hair?",
        ],
        correctIndex: 1,
        explanation: "'What is she like?' asks about character and personality.",
      },
      {
        id: "u3-q2",
        question: "Choose the correct sentence:",
        options: [
          "My brother is short curly hair.",
          "My brother has short curly hair.",
          "My brother wears short curly hair.",
          "My brother have short curly hair.",
        ],
        correctIndex: 1,
        explanation: "Use 'has' with hair descriptions for 'my brother' (he).",
      },
      {
        id: "u3-q3",
        question: "Listen to the audio. Which personality trait describes Aunt Rosa?",
        audioPrompt: "Aunt Rosa always greets everyone with a big laugh and makes people feel happy.",
        options: ["Cheerful", "Shy", "Quiet", "Strict"],
        correctIndex: 0,
        explanation: "Someone who smiles, laughs warmly, and brings joy is cheerful.",
      },
      {
        id: "u3-q4",
        question: "Someone who imagines new stories, drawings, and clever ideas is ____.",
        options: ["creative", "wavy", "freckled", "medium"],
        correctIndex: 0,
        explanation: "'Creative' describes a person full of imagination and original ideas.",
      },
      {
        id: "u3-q5",
        question: "Complete: 'Ben is ____ and wears a blue backpack every day.'",
        options: ["tall", "glasses", "hair", "backpack"],
        correctIndex: 0,
        explanation: "Use an adjective like 'tall' after 'is'.",
      },
    ],
  },
  {
    id: "unit-4",
    number: "Unit 4",
    title: "Pronouns & Sentence Structure",
    subtitle: "Master subject, object, and possessive pronouns plus clear English word order.",
    summary: "Subject & Object Pronouns · Possessives · SVO Sentence Order",
    pastelCardBg: "bg-[#F0FAF6]",
    pastelAccentBg: "bg-[#D9F3E8]",
    accentText: "text-[#146346]",
    accentButton: "bg-[#167854] hover:bg-[#116143] text-white",
    dialogueTitle: "Sharing Notebooks After Class",
    dialogue: [
      {
        speaker: "Raka",
        text: "Excuse me, is this green notebook yours? I found it under our desk.",
        highlight: "our desk",
      },
      {
        speaker: "Chloe",
        text: "Oh, thank you! Yes, it is my notebook. Can you pass it to me, please?",
        highlight: "pass it to me",
      },
      {
        speaker: "Raka",
        text: "Sure! Here you go. Did they also leave their pencils behind?",
        highlight: "their pencils",
      },
      {
        speaker: "Chloe",
        text: "Yes, those belong to Mia and Sam. Let's give them back to them before lunch.",
        highlight: "give them back to them",
      },
    ],
    grammarPoints: [
      {
        title: "Subject, Object & Possessive Pronouns",
        pattern: "Subject (I, he, she, we, they) · Object (me, him, her, us, them) · Possessive (my, his, her, our, their)",
        explanation: "Subject pronouns do the action. Object pronouns receive the action. Possessive adjectives go before a noun to show ownership.",
        examples: [
          "She (subject) invited us (object) to her (possessive) birthday lunch.",
          "They (subject) forgot their (possessive) umbrellas, so we helped them (object).",
        ],
      },
      {
        title: "Basic English Sentence Structure",
        pattern: "Subject + Verb + Object + Place + Time",
        explanation: "Keep the doer (Subject) first, the action (Verb) second, what receives it (Object) third, and Place/Time at the end.",
        examples: [
          "We (S) read (V) English stories (O) in the library (Place) every Tuesday (Time).",
          "My dad (S) cooks (V) vegetable soup (O) in the kitchen (Place).",
        ],
      },
    ],
    exerciseTitle: "Pronoun Swap Challenge",
    exerciseInstruction: "Pick the exact pronoun that fits the subject, object, or possessive slot.",
    exerciseType: "match-fill",
    fillPrompts: [
      {
        id: "p1",
        prompt: "Mr. Adi is our English teacher. All the students like ____.",
        options: ["him", "he", "his"],
        answer: "him",
        explanation: "'Mr. Adi' receives the action 'like', so use the object pronoun 'him'.",
      },
      {
        id: "p2",
        prompt: "Put your books on the shelf. ____ belong in the red basket.",
        options: ["They", "Them", "Their"],
        answer: "They",
        explanation: "The books are the subject doing 'belong', so use subject pronoun 'They'.",
      },
      {
        id: "p3",
        prompt: "Sari forgot ____ umbrella at school, so we shared ours.",
        options: ["her", "she", "hers"],
        answer: "her",
        explanation: "Before a noun ('umbrella'), use the possessive adjective 'her'.",
      },
      {
        id: "p4",
        prompt: "Please send the recipe photo to ____ tonight!",
        options: ["us", "we", "our"],
        answer: "us",
        explanation: "After a preposition like 'to', use the object pronoun 'us'.",
      },
    ],
    quiz: [
      {
        id: "u4-q1",
        question: "Choose the correct pronoun: 'My sister and I made dinner, and everyone thanked ____.'",
        options: ["we", "our", "us", "ours"],
        correctIndex: 2,
        explanation: "'Us' is the object pronoun for 'my sister and I' receiving 'thanked'.",
      },
      {
        id: "u4-q2",
        question: "Which sentence follows standard English Subject + Verb + Object + Time order?",
        options: [
          "Yesterday cooked my brother noodles.",
          "My brother cooked noodles yesterday.",
          "Noodles my brother yesterday cooked.",
          "Cooked noodles yesterday my brother.",
        ],
        correctIndex: 1,
        explanation: "Subject ('My brother') + Verb ('cooked') + Object ('noodles') + Time ('yesterday').",
      },
      {
        id: "u4-q3",
        question: "Listen to the audio. Which possessive word did you hear?",
        audioPrompt: "The students hung their colorful posters on the classroom wall.",
        options: ["our", "his", "their", "your"],
        correctIndex: 2,
        explanation: "'Their' shows that the colorful posters belong to the students.",
      },
      {
        id: "u4-q4",
        question: "Replace the underlined words: 'Give the keys to [Dani and me].'",
        options: ["we", "us", "they", "our"],
        correctIndex: 1,
        explanation: "'Dani and me' after 'to' becomes the object pronoun 'us'.",
      },
      {
        id: "u4-q5",
        question: "Complete: '____ dog loves chasing yellow tennis balls.'",
        options: ["We", "Us", "Our", "Me"],
        correctIndex: 2,
        explanation: "Use 'Our' before the noun 'dog' to show ownership.",
      },
    ],
  },
  {
    id: "unit-5",
    number: "Unit 5",
    title: "Food, Tools & Simple Recipes",
    subtitle: "Describe your favourite meals, food facts, cooking tools, ingredients, and recipe steps.",
    summary: "Taste & Nutrition · Kitchen Tools · Recipe Sequence",
    pastelCardBg: "bg-[#FFFBEB]",
    pastelAccentBg: "bg-[#FEF0C3]",
    accentText: "text-[#7A4F0B]",
    accentButton: "bg-[#A16207] hover:bg-[#854D0E] text-white",
    dialogueTitle: "Cooking Banana Pancakes Together",
    dialogue: [
      {
        speaker: "Ellie",
        text: "What is your favourite breakfast meal, Noah?",
        highlight: "favourite breakfast meal",
      },
      {
        speaker: "Noah",
        text: "I love fluffy banana pancakes! They are naturally sweet and give us morning energy.",
        highlight: "naturally sweet",
      },
      {
        speaker: "Ellie",
        text: "Which ingredients and cooking tools do we need?",
        highlight: "ingredients and cooking tools",
      },
      {
        speaker: "Noah",
        text: "We need flour, eggs, milk, a mixing bowl, a whisk, and a frying pan with a spatula!",
        highlight: "a mixing bowl, a whisk",
      },
    ],
    grammarPoints: [
      {
        title: "Sequence Words for Recipe Instructions",
        pattern: "First, ... -> Next, ... -> Then, ... -> Finally, ... + [Imperative Verb]",
        explanation: "Recipe instructions start with an action verb (chop, whisk, pour, flip, bake) right after the sequence word.",
        examples: [
          "First, crack two eggs into a large mixing bowl.",
          "Next, whisk the flour, milk, and eggs until smooth.",
        ],
      },
      {
        title: "Discussing Food Information & Taste",
        pattern: "[Food] is [crispy / savory / sweet / healthy] and rich in [vitamins / protein / fiber].",
        explanation: "Describe both flavor/texture and simple nutrition facts when talking about your favourite meals.",
        examples: [
          "Grilled salmon is savory and rich in protein.",
          "Fresh strawberries are sweet and full of vitamin C.",
        ],
      },
    ],
    exerciseTitle: "Put the Pancake Recipe in Order",
    exerciseInstruction:
      "Tap the recipe instructions from First to Finally so the pancakes turn out delicious!",
    exerciseType: "sequence",
    sequenceSteps: [
      { id: "c1", text: "First, gather flour, two eggs, milk, a bowl, and a whisk.", order: 1 },
      { id: "c2", text: "Next, whisk the eggs, milk, and flour together into a smooth batter.", order: 2 },
      { id: "c3", text: "Then, heat a little butter in a frying pan on medium heat.", order: 3 },
      { id: "c4", text: "Pour a ladle of batter and flip it gently with a spatula.", order: 4 },
      { id: "c5", text: "Finally, serve the warm pancakes with fresh strawberries on top!", order: 5 },
    ],
    quiz: [
      {
        id: "u5-q1",
        question: "Which cooking tool is best for beating eggs and mixing batter smoothly?",
        options: ["Cutting board", "Whisk", "Peeler", "Colander"],
        correctIndex: 1,
        explanation: "A whisk mixes liquids and eggs smoothly with air.",
      },
      {
        id: "u5-q2",
        question: "Which word describes food that is crunchy and lightly fried or baked?",
        options: ["crispy", "sour", "bitter", "raw"],
        correctIndex: 0,
        explanation: "'Crispy' describes crunchy textures like toasted bread or crispy tofu.",
      },
      {
        id: "u5-q3",
        question: "Listen to the audio. Which ingredient should you chop on the cutting board?",
        audioPrompt: "Next, chop two fresh tomatoes on the wooden cutting board.",
        options: ["Butter", "Sugar", "Fresh tomatoes", "Milk"],
        correctIndex: 2,
        explanation: "The instruction says to chop two fresh tomatoes on the cutting board.",
      },
      {
        id: "u5-q4",
        question: "Which tool do you use to lift and flip pancakes in a hot frying pan?",
        options: ["Spatula", "Measuring spoon", "Rolling pin", "Grater"],
        correctIndex: 0,
        explanation: "A flat spatula slides under pancakes to flip them cleanly.",
      },
      {
        id: "u5-q5",
        question: "Which sentence uses a recipe imperative verb correctly?",
        options: [
          "Then, you stirring slowly the soup.",
          "Then, stir the soup slowly for three minutes.",
          "Then, soup stir slowly three minutes.",
          "Then, to stir the soup slowly.",
        ],
        correctIndex: 1,
        explanation: "Recipe steps use the base verb directly: 'Stir the soup slowly...'.",
      },
    ],
  },
];

export const FLASHCARDS: FlashcardItem[] = [
  // Unit 1: Intro, Family, Daily Routines
  {
    id: "fc-1",
    unitId: "unit-1",
    word: "Introduce",
    phonetic: "/ˌɪn.trəˈdjuːs/",
    partOfSpeech: "verb",
    meaning: "To tell someone your name and basic facts when meeting for the first time.",
    example: "Let me introduce myself: I am Hana, and I love science.",
    tip: "Follow 'Nice to meet you' with 'Nice to meet you too!'",
    illustration: "wave",
    pastelSurface: "bg-[#FFF3EC]",
  },
  {
    id: "fc-2",
    unitId: "unit-1",
    word: "Wake up",
    phonetic: "/weɪk ʌp/",
    partOfSpeech: "phrasal verb",
    meaning: "To stop sleeping and open your eyes in the morning.",
    example: "I wake up at six o'clock on school days.",
    tip: "Use 'at' before exact clock times like 'at 6:00 a.m.'",
    illustration: "sunrise",
    pastelSurface: "bg-[#FFF8E6]",
  },
  {
    id: "fc-3",
    unitId: "unit-1",
    word: "Brush teeth",
    phonetic: "/brʌʃ tiːθ/",
    partOfSpeech: "phrase",
    meaning: "To clean your teeth with a toothbrush and toothpaste.",
    example: "Don't forget to brush your teeth after breakfast.",
    tip: "One tooth, two teeth! ('Teeth' is already plural.)",
    illustration: "brush",
    pastelSurface: "bg-[#EEF9FF]",
  },
  {
    id: "fc-4",
    unitId: "unit-1",
    word: "Grandparents",
    phonetic: "/ˈɡræn.peə.rənts/",
    partOfSpeech: "noun",
    meaning: "The parents of your mother or father (grandmother and grandfather).",
    example: "We visit our grandparents every Sunday afternoon.",
    tip: "Use 'siblings' for brothers and sisters together!",
    illustration: "family",
    pastelSurface: "bg-[#FFF0F5]",
  },
  {
    id: "fc-5",
    unitId: "unit-1",
    word: "Daily routine",
    phonetic: "/ˈdeɪ.li ruːˈtiːn/",
    partOfSpeech: "noun phrase",
    meaning: "The regular things you do in the same order every day.",
    example: "Reading for fifteen minutes before sleep is part of my daily routine.",
    tip: "Use words like 'usually', 'every morning', and 'before dinner'.",
    illustration: "clock",
    pastelSurface: "bg-[#F3F4FF]",
  },
  {
    id: "fc-6",
    unitId: "unit-1",
    word: "Do homework",
    phonetic: "/duː ˈhəʊm.wɜːk/",
    partOfSpeech: "phrase",
    meaning: "To complete school study tasks at home after class.",
    example: "I do my homework at my desk at four o'clock.",
    tip: "'Homework' is uncountable — never add '-s' ('homeworks' is wrong).",
    illustration: "schoolbag",
    pastelSurface: "bg-[#F1FBF6]",
  },

  // Unit 2: Hobbies & Free Time
  {
    id: "fc-7",
    unitId: "unit-2",
    word: "Sketching",
    phonetic: "/ˈsketʃ.ɪŋ/",
    partOfSpeech: "noun / verb-ing",
    meaning: "Drawing quick, creative pictures with a pencil or markers.",
    example: "Maya enjoys sketching animals in her art notebook.",
    tip: "Pair with 'like / love / enjoy + sketching'.",
    illustration: "palette",
    pastelSurface: "bg-[#FFF3EC]",
  },
  {
    id: "fc-8",
    unitId: "unit-2",
    word: "Cycling",
    phonetic: "/ˈsaɪ.klɪŋ/",
    partOfSpeech: "noun / verb-ing",
    meaning: "Riding a bicycle for fun, travel, or exercise.",
    example: "We go cycling along the river path every Saturday.",
    tip: "You can say 'I like cycling' or 'I like riding my bicycle'.",
    illustration: "bicycle",
    pastelSurface: "bg-[#EEFBF4]",
  },
  {
    id: "fc-9",
    unitId: "unit-2",
    word: "Playing guitar",
    phonetic: "/ˈpleɪ.ɪŋ ɡɪˈtɑːr/",
    partOfSpeech: "phrase",
    meaning: "Making music by strumming or plucking guitar strings.",
    example: "Kevin practices playing guitar for thirty minutes daily.",
    tip: "Use 'play' for both sports ('play soccer') and instruments ('play guitar').",
    illustration: "guitar",
    pastelSurface: "bg-[#F7F1FF]",
  },
  {
    id: "fc-10",
    unitId: "unit-2",
    word: "Reading",
    phonetic: "/ˈriː.dɪŋ/",
    partOfSpeech: "noun / verb-ing",
    meaning: "Looking at and understanding stories, comics, or books.",
    example: "My favourite quiet hobby is reading adventure books.",
    tip: "Add detail: 'reading comics' or 'reading mystery novels'.",
    illustration: "book",
    pastelSurface: "bg-[#EFF6FF]",
  },
  {
    id: "fc-11",
    unitId: "unit-2",
    word: "Photography",
    phonetic: "/fəˈtɒɡ.rə.fi/",
    partOfSpeech: "noun",
    meaning: "The hobby or art of taking photos with a camera or phone.",
    example: "He loves photography and takes pictures of clouds.",
    tip: "Notice the stress is on '-TOG-': pho-TOG-ra-phy.",
    illustration: "camera",
    pastelSurface: "bg-[#FFF9E6]",
  },
  {
    id: "fc-12",
    unitId: "unit-2",
    word: "Gardening",
    phonetic: "/ˈɡɑː.dən.ɪŋ/",
    partOfSpeech: "noun / verb-ing",
    meaning: "Planting and taking care of flowers, herbs, or vegetables.",
    example: "My grandmother and I enjoy gardening on sunny mornings.",
    tip: "Great verb to use with 'watering plants' and 'growing herbs'.",
    illustration: "plant",
    pastelSurface: "bg-[#EEFAF2]",
  },

  // Unit 3: Physical & Personality Traits
  {
    id: "fc-13",
    unitId: "unit-3",
    word: "Wear glasses",
    phonetic: "/weər ˈɡlɑː.sɪz/",
    partOfSpeech: "phrase",
    meaning: "To have eyeglasses on your face to help you see clearly.",
    example: "My best friend wears round glasses and has short hair.",
    tip: "Always say 'wear glasses' (not 'use glasses' or 'have glasses on eyes').",
    illustration: "glasses",
    pastelSurface: "bg-[#EFF5FF]",
  },
  {
    id: "fc-14",
    unitId: "unit-3",
    word: "Cheerful",
    phonetic: "/ˈtʃɪə.fəl/",
    partOfSpeech: "adjective",
    meaning: "Noticeably happy, smiling, and bringing positive energy.",
    example: "Our class captain is cheerful even on Monday mornings.",
    tip: "Use 'is cheerful' for personality, never 'has cheerful'.",
    illustration: "smile",
    pastelSurface: "bg-[#FFF8E5]",
  },
  {
    id: "fc-15",
    unitId: "unit-3",
    word: "Generous",
    phonetic: "/ˈdʒen.ər.əs/",
    partOfSpeech: "adjective",
    meaning: "Happy to share your time, snacks, or help with other people.",
    example: "It was very generous of Dani to lend me his colored pencils.",
    tip: "Opposite of 'selfish' — a wonderful compliment!",
    illustration: "heart",
    pastelSurface: "bg-[#FFF0F5]",
  },
  {
    id: "fc-16",
    unitId: "unit-3",
    word: "Creative",
    phonetic: "/kriˈeɪ.tɪv/",
    partOfSpeech: "adjective",
    meaning: "Good at thinking of new, original ideas, art, or stories.",
    example: "Siti is creative; she turns recycled boxes into mini castles.",
    tip: "Related verb: 'create'; related noun: 'creativity'.",
    illustration: "lightbulb",
    pastelSurface: "bg-[#F7F1FF]",
  },
  {
    id: "fc-17",
    unitId: "unit-3",
    word: "Patient",
    phonetic: "/ˈpeɪ.ʃənt/",
    partOfSpeech: "adjective",
    meaning: "Able to wait calmly or teach someone step by step without getting angry.",
    example: "My older brother is patient when he explains math puzzles to me.",
    tip: "Watch the spelling: p-a-t-i-e-n-t.",
    illustration: "star",
    pastelSurface: "bg-[#EEFAF4]",
  },
  {
    id: "fc-18",
    unitId: "unit-3",
    word: "Brave",
    phonetic: "/breɪv/",
    partOfSpeech: "adjective",
    meaning: "Ready to face something new or scary with courage.",
    example: "She was brave to give her English speech in front of the class.",
    tip: "Synonym: 'courageous'.",
    illustration: "shield",
    pastelSurface: "bg-[#FFF3EC]",
  },

  // Unit 4: Pronouns & Sentence Structure
  {
    id: "fc-19",
    unitId: "unit-4",
    word: "Subject Pronoun",
    phonetic: "/ˈsʌb.dʒekt ˈprəʊ.naʊn/",
    partOfSpeech: "grammar",
    meaning: "Words like I, you, he, she, it, we, they that do the action at the start of a sentence.",
    example: "They play badminton in the school yard after class.",
    tip: "Put subject pronouns BEFORE the verb.",
    illustration: "pronoun-person",
    pastelSurface: "bg-[#EEFAF4]",
  },
  {
    id: "fc-20",
    unitId: "unit-4",
    word: "Object Pronoun",
    phonetic: "/ˈɒb.dʒekt ˈprəʊ.naʊn/",
    partOfSpeech: "grammar",
    meaning: "Words like me, you, him, her, it, us, them that receive the action.",
    example: "Our coach praised us after the practice game.",
    tip: "Put object pronouns AFTER a verb or preposition ('for me', 'with him').",
    illustration: "pronoun-gift",
    pastelSurface: "bg-[#EFF6FF]",
  },
  {
    id: "fc-21",
    unitId: "unit-4",
    word: "Possessive Adjective",
    phonetic: "/pəˈzes.ɪv/",
    partOfSpeech: "grammar",
    meaning: "Words like my, your, his, her, its, our, their placed before a noun to show ownership.",
    example: "We decorated our classroom with pastel paper stars.",
    tip: "Always followed by a noun: 'my bag', 'their books'.",
    illustration: "pronoun-home",
    pastelSurface: "bg-[#F8F1FF]",
  },
  {
    id: "fc-22",
    unitId: "unit-4",
    word: "Sentence Order (SVO)",
    phonetic: "/ˈsen.təns ˈɔː.dər/",
    partOfSpeech: "grammar",
    meaning: "Standard English pattern: Subject + Verb + Object (+ Place + Time).",
    example: "Maya (S) bakes (V) muffins (O) at home (Place) on Sundays (Time).",
    tip: "Keep Subject and Verb together at the beginning!",
    illustration: "puzzle",
    pastelSurface: "bg-[#FFF8E6]",
  },

  // Unit 5: Food, Cooking Tools, Ingredients & Recipes
  {
    id: "fc-23",
    unitId: "unit-5",
    word: "Whisk",
    phonetic: "/wɪsk/",
    partOfSpeech: "noun & verb",
    meaning: "A wire kitchen tool used to beat eggs, cream, or pancake batter smoothly.",
    example: "Use the whisk to mix the eggs and milk in a bowl.",
    tip: "'Whisk' can be both the tool (noun) and the action (verb)!",
    illustration: "whisk",
    pastelSurface: "bg-[#FFF8E6]",
  },
  {
    id: "fc-24",
    unitId: "unit-5",
    word: "Spatula",
    phonetic: "/ˈspætʃ.ə.lə/",
    partOfSpeech: "noun",
    meaning: "A flat kitchen tool used for flipping pancakes, eggs, or scraping bowls.",
    example: "Flip the golden pancake gently with a silicone spatula.",
    tip: "Pronounced 'SPACH-uh-luh'.",
    illustration: "spatula",
    pastelSurface: "bg-[#FFF1F3]",
  },
  {
    id: "fc-25",
    unitId: "unit-5",
    word: "Frying pan",
    phonetic: "/ˈfraɪ.ɪŋ pæn/",
    partOfSpeech: "noun",
    meaning: "A shallow metal pan with a long handle for cooking on a stove.",
    example: "Warm a teaspoon of butter in the frying pan.",
    tip: "Also called a 'skillet' in American English.",
    illustration: "pan",
    pastelSurface: "bg-[#F3F5FF]",
  },
  {
    id: "fc-26",
    unitId: "unit-5",
    word: "Cutting board",
    phonetic: "/ˈkʌt.ɪŋ bɔːd/",
    partOfSpeech: "noun",
    meaning: "A flat wooden or plastic board where you safely slice or chop food.",
    example: "Chop the strawberries into small slices on the cutting board.",
    tip: "Always pair with verbs like 'chop', 'slice', and 'dice'.",
    illustration: "board",
    pastelSurface: "bg-[#EEFAF3]",
  },
  {
    id: "fc-27",
    unitId: "unit-5",
    word: "Mixing bowl",
    phonetic: "/ˈmɪk.sɪŋ bəʊl/",
    partOfSpeech: "noun",
    meaning: "A deep round bowl for combining recipe ingredients together.",
    example: "Pour the flour and sugar into a large mixing bowl.",
    tip: "Useful phrase: 'Combine dry ingredients in a mixing bowl.'",
    illustration: "bowl",
    pastelSurface: "bg-[#FFF3EC]",
  },
  {
    id: "fc-28",
    unitId: "unit-5",
    word: "Ingredients",
    phonetic: "/ɪnˈɡriː.di.ənts/",
    partOfSpeech: "noun (plural)",
    meaning: "All the foods (like eggs, flour, milk, herbs) used to make a dish.",
    example: "Check the ingredients list before you start cooking.",
    tip: "Notice the 's' when listing several items: flour, eggs, and honey.",
    illustration: "eggs",
    pastelSurface: "bg-[#FFF9E6]",
  },
  {
    id: "fc-29",
    unitId: "unit-5",
    word: "Fresh herbs",
    phonetic: "/freʃ hɜːbz/",
    partOfSpeech: "noun phrase",
    meaning: "Aromatic green leaves like basil, mint, or parsley that add flavor to food.",
    example: "Sprinkle chopped fresh herbs on top of warm pasta.",
    tip: "In American English, the 'h' in 'herb' is silent ('erbs').",
    illustration: "herb",
    pastelSurface: "bg-[#EEFAF2]",
  },
  {
    id: "fc-30",
    unitId: "unit-5",
    word: "Nutritious",
    phonetic: "/njuːˈtrɪʃ.əs/",
    partOfSpeech: "adjective",
    meaning: "Full of vitamins, protein, or fiber that help your body grow strong.",
    example: "Oatmeal with strawberries and yogurt is a nutritious breakfast.",
    tip: "Great word for discussing food information and healthy meals!",
    illustration: "nutrition",
    pastelSurface: "bg-[#F7F1FF]",
  },
  {
    id: "fc-31",
    unitId: "unit-5",
    word: "Sweet & Savory",
    phonetic: "/swiːt ænd ˈseɪ.vər.i/",
    partOfSpeech: "adjectives",
    meaning: "Sweet tastes like honey or fruit; savory tastes rich, salty, or herby (not sugary).",
    example: "Pancakes with berries are sweet, while vegetable soup is savory.",
    tip: "Use 'crispy', 'creamy', 'sweet', and 'savory' to describe favourite meals.",
    illustration: "pancakes",
    pastelSurface: "bg-[#FFF1F5]",
  },
  {
    id: "fc-32",
    unitId: "unit-5",
    word: "Chop & Simmer",
    phonetic: "/tʃɒp ænd ˈsɪm.ər/",
    partOfSpeech: "verbs",
    meaning: "Chop means cut into small pieces; simmer means cook gently with tiny bubbles.",
    example: "First chop the tomatoes, then simmer the sauce for ten minutes.",
    tip: "Recipe verbs start commands without 'you': 'Chop...', 'Stir...', 'Simmer...'.",
    illustration: "strawberry",
    pastelSurface: "bg-[#FFF5EC]",
  },
];

export const SENTENCE_CHALLENGES: SentenceChallenge[] = [
  {
    id: "s1",
    category: "intro",
    categoryLabel: "Intro & Routines",
    clue: "Introduce your name and grade clearly.",
    slots: ["Subject", "Verb", "Name", "Connector", "Grade"],
    targetTokens: ["My name", "is", "Nadia", "and I am", "in Grade 7."],
    distractorTokens: ["are", "yesterday"],
    grammarNote: "Use 'is' with 'My name' and 'am' with 'I'.",
  },
  {
    id: "s2",
    category: "intro",
    categoryLabel: "Intro & Routines",
    clue: "Describe what time you eat breakfast in the morning.",
    slots: ["Subject", "Frequency", "Action", "Time"],
    targetTokens: ["I", "usually", "eat breakfast", "at 6:30 a.m."],
    distractorTokens: ["eats", "tomorrow"],
    grammarNote: "Frequency adverbs like 'usually' go right before the main verb.",
  },
  {
    id: "s3",
    category: "intro",
    categoryLabel: "Intro & Routines",
    clue: "Talk about your sister's evening homework routine.",
    slots: ["Subject", "Verb", "Object", "Time"],
    targetTokens: ["My sister", "does", "her homework", "every evening."],
    distractorTokens: ["do", "his"],
    grammarNote: "Use 'does' for 'my sister' (she) and possessive 'her'.",
  },
  {
    id: "s4",
    category: "hobbies",
    categoryLabel: "Hobbies & Free Time",
    clue: "Share a creative weekend hobby using 'enjoy + -ing'.",
    slots: ["Subject", "Verb", "Hobby (-ing)", "Time"],
    targetTokens: ["We", "enjoy", "sketching comics", "on weekends."],
    distractorTokens: ["sketches", "to sketch"],
    grammarNote: "'Enjoy' is always followed by the -ing verb form.",
  },
  {
    id: "s5",
    category: "hobbies",
    categoryLabel: "Hobbies & Free Time",
    clue: "Tell what Anton likes doing in the park.",
    slots: ["Subject", "Verb", "Hobby (-ing)", "Place"],
    targetTokens: ["Anton", "loves", "riding his bicycle", "in the park."],
    distractorTokens: ["ride", "always"],
    grammarNote: "Add -s to 'love' for singular third person ('Anton loves').",
  },
  {
    id: "s6",
    category: "traits",
    categoryLabel: "People & Traits",
    clue: "Describe a friend's appearance with 'has' and 'wears'.",
    slots: ["Subject", "Verb 1", "Hair", "Connector", "Glasses"],
    targetTokens: ["Maya", "has", "curly brown hair", "and", "wears round glasses."],
    distractorTokens: ["is", "wearing"],
    grammarNote: "Use 'has' for hair and 'wears' for glasses.",
  },
  {
    id: "s7",
    category: "traits",
    categoryLabel: "People & Traits",
    clue: "Describe your teacher's kind personality.",
    slots: ["Subject", "Verb", "Trait 1", "Trait 2"],
    targetTokens: ["Our English teacher", "is", "patient", "and cheerful."],
    distractorTokens: ["has", "curly"],
    grammarNote: "Use 'is' with personality adjectives like 'patient' and 'cheerful'.",
  },
  {
    id: "s8",
    category: "pronouns",
    categoryLabel: "Pronouns",
    clue: "Use a subject pronoun, object pronoun, and possessive adjective together.",
    slots: ["Subject", "Verb", "Object", "Possessive + Noun"],
    targetTokens: ["She", "helped", "us", "with our project."],
    distractorTokens: ["Her", "we"],
    grammarNote: "'She' = subject, 'us' = object, 'our' = possessive before 'project'.",
  },
  {
    id: "s9",
    category: "pronouns",
    categoryLabel: "Pronouns",
    clue: "Say that the students brought their own notebooks.",
    slots: ["Subject", "Verb", "Possessive", "Object", "Place"],
    targetTokens: ["They", "brought", "their", "notebooks", "to class."],
    distractorTokens: ["Them", "theirs"],
    grammarNote: "'They' starts the sentence; 'their' goes right before 'notebooks'.",
  },
  {
    id: "s10",
    category: "pronouns",
    categoryLabel: "Pronouns",
    clue: "Ask someone to pass the whisk to you.",
    slots: ["Polite opener", "Verb", "Object", "Recipient"],
    targetTokens: ["Please", "pass", "the wooden whisk", "to me."],
    distractorTokens: ["to I", "my"],
    grammarNote: "After 'to', use the object pronoun 'me'.",
  },
  {
    id: "s11",
    category: "food",
    categoryLabel: "Food & Recipes",
    clue: "Write step 1 of a pancake recipe using a cooking tool.",
    slots: ["Sequence", "Action", "Ingredients", "Tool"],
    targetTokens: ["First,", "whisk", "the eggs and milk", "in a mixing bowl."],
    distractorTokens: ["whisking", "frying"],
    grammarNote: "Recipe commands use the base verb ('whisk') right after 'First,'.",
  },
  {
    id: "s12",
    category: "food",
    categoryLabel: "Food & Recipes",
    clue: "Describe your favourite nutritious meal and its taste.",
    slots: ["Subject", "Verb", "Taste", "Nutrition Fact"],
    targetTokens: ["Fresh berry oatmeal", "is", "sweet", "and rich in vitamins."],
    distractorTokens: ["has", "spatula"],
    grammarNote: "Combine flavor ('sweet') and nutrition ('rich in vitamins') with 'is'.",
  },
];

export const CHAT_TOPICS: ChatTopic[] = [
  {
    id: "intro-family",
    title: "Introduce Yourself & Family",
    goal: "Practice greeting, saying your age, daily routine, and introducing family members.",
    opener:
      "Hi there! I'm Pip, your English study buddy. Let's practice introducing ourselves! What's your name, and who lives in your home with you?",
    starterReplies: [
      "Hi Pip! My name is Sara and I live with my parents.",
      "Hello! I am 13 years old and I have one brother.",
      "I wake up at 6:00 a.m. and eat breakfast with my family.",
    ],
    helpfulWords: ["My name is...", "I live with...", "parents", "sibling", "wake up at..."],
    pastelSurface: "bg-[#FFF5F0]",
  },
  {
    id: "hobbies-time",
    title: "Hobbies & Free Time",
    goal: "Practice 'like / love / enjoy + -ing' and adverbs like 'usually' and 'sometimes'.",
    opener:
      "Happy to chat with you! Tell me, what do you enjoy doing in your free time after school or on weekends?",
    starterReplies: [
      "I enjoy sketching and reading comics after school.",
      "I usually go cycling with my friends on Saturdays.",
      "I love playing guitar in my room.",
    ],
    helpfulWords: ["I enjoy...", "I love...", "usually", "sometimes", "on weekends"],
    pastelSurface: "bg-[#F3F8FF]",
  },
  {
    id: "people-traits",
    title: "Describe a Friend or Family Member",
    goal: "Practice describing physical appearance ('has / wears') and personality ('is').",
    opener:
      "Let's describe someone special! Think of your best friend or a family member. What do they look like, and what is their personality like?",
    starterReplies: [
      "My best friend has curly hair and wears glasses.",
      "She is very cheerful, patient, and generous.",
      "My dad is tall and creative because he loves cooking.",
    ],
    helpfulWords: ["has curly hair", "wears glasses", "is cheerful", "patient", "creative"],
    pastelSurface: "bg-[#F9F4FF]",
  },
  {
    id: "food-recipes",
    title: "Favourite Meal & Simple Recipe",
    goal: "Practice describing favourite meals, nutrition/taste, cooking tools, ingredients, and recipe steps.",
    opener:
      "Yum, let's talk about food! What is your favourite meal, and can you tell me two ingredients or cooking tools needed to make it?",
    starterReplies: [
      "My favourite meal is banana pancakes because they are sweet!",
      "We need flour, eggs, a mixing bowl, and a whisk.",
      "First, chop the tomatoes on a cutting board.",
    ],
    helpfulWords: ["favourite meal", "sweet / savory", "whisk", "spatula", "First, ... Next, ..."],
    pastelSurface: "bg-[#FFFBEB]",
  },
];
