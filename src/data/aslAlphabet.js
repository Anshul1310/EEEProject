// ASL Alphabet data with instructions for each letter
// Each entry contains the letter, description, and step-by-step instructions

const aslAlphabet = [
  {
    letter: 'A',
    name: 'Letter A',
    description: 'A closed fist with the thumb resting on the side.',
    steps: [
      'Make a fist with your dominant hand.',
      'Curl all four fingers tightly into your palm.',
      'Rest your thumb on the side of your fist, pointing upward.',
      'Keep your thumb alongside your index finger, not tucked in.',
      'Hold your hand in front of you at chest level.'
    ],
    emoji: '✊',
    difficulty: 'easy'
  },
  {
    letter: 'B',
    name: 'Letter B',
    description: 'All four fingers extended straight up with thumb tucked across palm.',
    steps: [
      'Hold your dominant hand up with palm facing forward.',
      'Extend all four fingers straight up, keeping them together.',
      'Tuck your thumb across your palm.',
      'Keep your fingers straight and close together.',
      'Your hand should look like a flat wall.'
    ],
    emoji: '🖐',
    difficulty: 'easy'
  },
  {
    letter: 'C',
    name: 'Letter C',
    description: 'Hand curved into the shape of the letter C.',
    steps: [
      'Hold your dominant hand up with palm facing to the side.',
      'Curve all your fingers and thumb to form a "C" shape.',
      'Your thumb and fingers should not touch.',
      'Imagine holding a small cup or cylinder.',
      'Keep the curve smooth and natural.'
    ],
    emoji: '🤏',
    difficulty: 'easy'
  },
  {
    letter: 'D',
    name: 'Letter D',
    description: 'Index finger pointing up with other fingers and thumb forming a circle.',
    steps: [
      'Extend your index finger straight up.',
      'Curl your middle, ring, and pinky fingers down.',
      'Touch the tips of your curled fingers to your thumb.',
      'Your thumb and middle finger should form a circle.',
      'Keep your index finger straight and tall.'
    ],
    emoji: '☝️',
    difficulty: 'medium'
  },
  {
    letter: 'E',
    name: 'Letter E',
    description: 'All fingers curled down with thumb tucked below.',
    steps: [
      'Hold your hand up with palm facing forward.',
      'Curl all four fingers down toward your palm.',
      'Tuck your thumb under your curled fingers.',
      'Your fingertips should touch or nearly touch your palm.',
      'Keep your hand relaxed but fingers clearly curled.'
    ],
    emoji: '✊',
    difficulty: 'easy'
  },
  {
    letter: 'F',
    name: 'Letter F',
    description: 'Thumb and index finger form a circle, other three fingers extend up.',
    steps: [
      'Touch the tip of your index finger to the tip of your thumb.',
      'This creates a small circle or "OK" shape.',
      'Extend your middle, ring, and pinky fingers straight up.',
      'Keep the three extended fingers spread slightly apart.',
      'Hold your hand with palm facing forward.'
    ],
    emoji: '👌',
    difficulty: 'medium'
  },
  {
    letter: 'G',
    name: 'Letter G',
    description: 'Index finger and thumb pointing sideways, parallel to each other.',
    steps: [
      'Point your index finger to the side (horizontally).',
      'Extend your thumb parallel to your index finger.',
      'Curl your middle, ring, and pinky fingers into your palm.',
      'Your thumb and index finger should point in the same direction.',
      'Hold your hand sideways at chest level.'
    ],
    emoji: '👉',
    difficulty: 'medium'
  },
  {
    letter: 'H',
    name: 'Letter H',
    description: 'Index and middle fingers extended sideways together.',
    steps: [
      'Extend your index and middle fingers together.',
      'Point them horizontally to the side.',
      'Curl your ring finger and pinky into your palm.',
      'Your thumb should rest on your ring finger.',
      'Keep the two extended fingers straight and together.'
    ],
    emoji: '✌️',
    difficulty: 'medium'
  },
  {
    letter: 'I',
    name: 'Letter I',
    description: 'Pinky finger extended straight up, all other fingers in a fist.',
    steps: [
      'Make a fist with your dominant hand.',
      'Extend only your pinky finger straight up.',
      'Keep all other fingers curled tightly.',
      'Your thumb should rest on your middle finger.',
      'Hold your hand with palm facing forward.'
    ],
    emoji: '🤙',
    difficulty: 'easy'
  },
  {
    letter: 'J',
    name: 'Letter J',
    description: 'Like the letter I, but trace a "J" shape in the air with your pinky.',
    steps: [
      'Start with the sign for the letter "I" (pinky up, fist).',
      'Trace a "J" shape downward with your pinky.',
      'Move your hand down and curve to the left.',
      'The motion should be smooth and flowing.',
      'End with your pinky pointing to the left.'
    ],
    emoji: '🤙',
    difficulty: 'medium'
  },
  {
    letter: 'K',
    name: 'Letter K',
    description: 'Index and middle fingers form a V with thumb between them.',
    steps: [
      'Extend your index and middle fingers upward in a V shape.',
      'Place your thumb between your index and middle fingers.',
      'The thumb should touch the middle finger\'s middle section.',
      'Curl your ring finger and pinky into your palm.',
      'Hold your hand up with palm facing forward.'
    ],
    emoji: '✌️',
    difficulty: 'medium'
  },
  {
    letter: 'L',
    name: 'Letter L',
    description: 'Index finger pointing up, thumb pointing sideways forming an "L".',
    steps: [
      'Extend your index finger straight up.',
      'Extend your thumb out to the side (perpendicular to index).',
      'Curl your middle, ring, and pinky fingers into your palm.',
      'Your index finger and thumb should form a 90° angle.',
      'It should look like the letter "L".'
    ],
    emoji: '👆',
    difficulty: 'easy'
  },
  {
    letter: 'M',
    name: 'Letter M',
    description: 'Three fingers draped over the thumb, making a fist.',
    steps: [
      'Make a fist with your thumb tucked inside.',
      'Drape your index, middle, and ring fingers over your thumb.',
      'Your thumb should peek out between your ring and pinky fingers.',
      'Keep your hand compact and neat.',
      'Hold with palm facing down slightly.'
    ],
    emoji: '✊',
    difficulty: 'hard'
  },
  {
    letter: 'N',
    name: 'Letter N',
    description: 'Two fingers draped over the thumb, making a fist.',
    steps: [
      'Make a fist with your thumb tucked inside.',
      'Drape your index and middle fingers over your thumb.',
      'Your thumb should peek out between your middle and ring fingers.',
      'Keep your hand compact and neat.',
      'Similar to M but with only two fingers over the thumb.'
    ],
    emoji: '✊',
    difficulty: 'hard'
  },
  {
    letter: 'O',
    name: 'Letter O',
    description: 'All fingers and thumb curved to form an "O" shape.',
    steps: [
      'Bring all your fingertips together to touch your thumb tip.',
      'Form a round "O" shape with your fingers.',
      'Keep the shape circular and even.',
      'Your fingers should curve naturally.',
      'Hold your hand with the "O" facing forward.'
    ],
    emoji: '👌',
    difficulty: 'easy'
  },
  {
    letter: 'P',
    name: 'Letter P',
    description: 'Like the letter K but pointing downward.',
    steps: [
      'Make the sign for the letter "K" (V with thumb between).',
      'Tilt your hand downward so fingers point to the ground.',
      'Your middle finger should be pointing down.',
      'Keep your thumb between index and middle fingers.',
      'Your wrist does the rotating to point down.'
    ],
    emoji: '👇',
    difficulty: 'hard'
  },
  {
    letter: 'Q',
    name: 'Letter Q',
    description: 'Like the letter G but pointing downward.',
    steps: [
      'Make the sign for the letter "G" (index and thumb pointing out).',
      'Tilt your hand downward so fingers point to the ground.',
      'Your index finger and thumb should point down together.',
      'Curl the remaining fingers into your palm.',
      'Your wrist does the rotating to point down.'
    ],
    emoji: '👇',
    difficulty: 'hard'
  },
  {
    letter: 'R',
    name: 'Letter R',
    description: 'Index and middle fingers crossed.',
    steps: [
      'Extend your index and middle fingers upward.',
      'Cross your middle finger over your index finger.',
      'Curl your ring finger and pinky into your palm.',
      'Your thumb should rest on your ring finger.',
      'Hold your hand with palm facing forward.'
    ],
    emoji: '🤞',
    difficulty: 'medium'
  },
  {
    letter: 'S',
    name: 'Letter S',
    description: 'A fist with the thumb wrapped over the fingers.',
    steps: [
      'Make a fist with your dominant hand.',
      'Curl all four fingers tightly into your palm.',
      'Wrap your thumb over the front of your curled fingers.',
      'Your thumb should rest on top of your middle and ring fingers.',
      'Hold your fist with palm facing forward.'
    ],
    emoji: '✊',
    difficulty: 'easy'
  },
  {
    letter: 'T',
    name: 'Letter T',
    description: 'Thumb tucked between the index and middle fingers in a fist.',
    steps: [
      'Make a fist with your dominant hand.',
      'Tuck your thumb between your index and middle fingers.',
      'Your thumb tip should poke out slightly.',
      'Keep the rest of your fingers curled tight.',
      'Hold your fist with palm facing to the side.'
    ],
    emoji: '✊',
    difficulty: 'medium'
  },
  {
    letter: 'U',
    name: 'Letter U',
    description: 'Index and middle fingers extended straight up and together.',
    steps: [
      'Extend your index and middle fingers straight up.',
      'Keep these two fingers close together (touching).',
      'Curl your ring finger and pinky into your palm.',
      'Your thumb should rest on your ring finger.',
      'Hold your hand with palm facing forward.'
    ],
    emoji: '✌️',
    difficulty: 'easy'
  },
  {
    letter: 'V',
    name: 'Letter V',
    description: 'Index and middle fingers extended in a V shape (peace sign).',
    steps: [
      'Extend your index and middle fingers upward.',
      'Spread them apart to form a "V" shape.',
      'Curl your ring finger and pinky into your palm.',
      'Your thumb should rest on your curled fingers.',
      'Hold your hand with palm facing forward.'
    ],
    emoji: '✌️',
    difficulty: 'easy'
  },
  {
    letter: 'W',
    name: 'Letter W',
    description: 'Index, middle, and ring fingers extended and spread apart.',
    steps: [
      'Extend your index, middle, and ring fingers upward.',
      'Spread these three fingers apart.',
      'Curl your pinky finger into your palm.',
      'Your thumb should rest on or near your pinky.',
      'Hold your hand with palm facing forward.'
    ],
    emoji: '🤟',
    difficulty: 'easy'
  },
  {
    letter: 'X',
    name: 'Letter X',
    description: 'Index finger bent into a hook shape, all other fingers in fist.',
    steps: [
      'Make a fist with your dominant hand.',
      'Extend your index finger and bend it into a hook.',
      'Your index finger should curve down at the top knuckle.',
      'Keep all other fingers curled in.',
      'Hold your hand with palm facing to the side.'
    ],
    emoji: '☝️',
    difficulty: 'medium'
  },
  {
    letter: 'Y',
    name: 'Letter Y',
    description: 'Thumb and pinky extended, other fingers curled.',
    steps: [
      'Extend your thumb out to the side.',
      'Extend your pinky finger straight up.',
      'Curl your index, middle, and ring fingers into your palm.',
      'Your hand forms a "hang loose" or "shaka" shape.',
      'Hold your hand with palm facing forward.'
    ],
    emoji: '🤙',
    difficulty: 'easy'
  },
  {
    letter: 'Z',
    name: 'Letter Z',
    description: 'Trace the letter "Z" in the air with your index finger.',
    steps: [
      'Extend your index finger, curling all other fingers in.',
      'Point your index finger forward.',
      'Trace the letter "Z" pattern in the air.',
      'Move right, then diagonally down-left, then right again.',
      'The motion should be quick and clear.'
    ],
    emoji: '☝️',
    difficulty: 'medium'
  }
];

export default aslAlphabet;
