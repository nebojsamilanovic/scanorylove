/* SCANORY V2 — SAMPLE STORY DATA. Replace with private server-provided per-order data.
   All names, dates, copy and images below are fictional demo content. Public static
   hosting does NOT provide privacy, access controls, or secure timed unlocks. */
window.SCANORY_STORY = {
  storyId: 'moonlit-demo', // Stable public demo identifier; production issued by backend
  // Optional editorial overrides. An asterisk pair *like this* marks italic emphasis.
  // Empty copy field keeps the existing approved V2 headline design unchanged.
  copy: {},

  recipient: 'Ana',
  invitation: { message: 'I made this little world for you, with the moments I never want us to forget.' },
  sender: 'Nikola',
  openingNote: 'A little world made from our moments, our memories, and all the things I never want to forget.',
  origin: {
    dateTime: '2022-02-14T00:00:00+01:00', // Required full ISO-8601 timestamp with timezone offset; precise ticking
    title: 'Where it all began.', date: '2022-02-14',
    caption: 'WHERE EVERYTHING CHANGED',
    intro: 'And ours began long before we knew what it would become.',
    description: 'Remember when we got completely lost looking for that little place? Best mistake we ever made.'
  },
  timeline: [
    {date:'MAY 2022',title:'That rainy Tuesday',description:'We hid under the awning of that closed bookstore. We barely spoke, but somehow I knew.',reveal:'I kept thinking about that afternoon long after it ended.'},
    {date:'AUGUST 2023',title:'Lost in Rome',description:'Missing the last train and eating cold pizza on the sidewalk. Best mistake we ever made.',reveal:'We missed the train and found something better: another memory.'},
    {date:'OCTOBER 2024',title:'The first keys',description:'Sitting on the empty floor of our new living room, eating takeout, realizing this was home.',reveal:'The room was empty. It already felt full.'}
  ],
  originImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&auto=format&fit=crop&q=80',
  memoryImage: 'https://images.unsplash.com/photo-1501901609772-df0848060b33?w=1200&auto=format&fit=crop&q=80',
  memoryNote: 'I think about this day more often than you know. Nothing extraordinary happened, and somehow it became everything.',
  gallery: [
    {caption:'THE FIRST ADVENTURE',src:'https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=900&auto=format&fit=crop&q=80'},
    {caption:'A SLOW SUNDAY',src:'https://images.unsplash.com/photo-1634268014879-ec7b2c982c5b?w=900&auto=format&fit=crop&q=80',bonus:'What I remember most is how happy we were doing absolutely nothing.'},
    {caption:'SOMEWHERE BEAUTIFUL',src:'https://images.unsplash.com/photo-1508407576665-2d9a5d638a7e?w=900&auto=format&fit=crop&q=80'},
    {caption:'OUR LITTLE WORLD',src:'https://images.unsplash.com/photo-1561132667-ab2a54ebf2dc?w=900&auto=format&fit=crop&q=80'},
    {caption:'AN ORDINARY DAY',src:'https://images.unsplash.com/photo-1671116302821-d6fc9a003505?w=900&auto=format&fit=crop&q=80'}
  ],
  reasons: [
    {hint:'SOMETHING YOU DO',title:'Your quiet resilience',text:'The way you handle the heaviest days with grace, never losing your warmth or your ability to care for others.'},
    {hint:'A MOMENT I REMEMBER',title:'The way you laugh',text:'That unfiltered laugh that completely takes over your face. It is the single purest sound in my world.'},
    {hint:'SOMETHING I NEVER TOLD YOU',title:'How safe you make me feel',text:'No matter how loud the world outside gets, coming back to you makes it feel quiet again.'}
  ],
  secretPhoto: {image:'https://images.unsplash.com/photo-1563808599481-34a342e44508?w=1200&auto=format&fit=crop&q=80', note:'I wish I could keep this day forever.'},
  promise: 'I don’t just look forward to the big moments with you. I look forward to the ordinary ones — getting lost in new cities, sharing headphones on trains, and coming home to you.',
  song: {title:'Our song',url:null},
  /* DEMO ONLY: publicly readable fictional letter for the interactive preview.
     Real private or future-locked letters must NEVER be stored here. */
  letter: {unlockLabel:'AVAILABLE NOW',state:'unlocked',message:'My dearest Ana,\n\nOf all the places life could have taken me, I am happiest it led me to you. Thank you for making the ordinary days feel extraordinary.\n\nForever yours, Nikola.'},
  finale: {heading:'In every version<br>of this life,<br><em>I’d choose you.</em>',note:'For all the days we’ve had, and all the days still waiting for us.'},
  enabled: {intro:true,origin:true,timer:true,timeline:true,memory:true,gallery:true,reasons:true,promise:true,surprises:true,scratch:true,song:true,letter:true,finale:true}
};
