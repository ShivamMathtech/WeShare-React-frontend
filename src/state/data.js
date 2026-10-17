// Sample content. All identities, conversations and listings are demo data.
export const people = [
  { id: 'cameron', name: 'Cameron Williamson', role: '3D artist & visual designer', avatar: 'cameron', online: true, mutual: 12 },
  { id: 'tony', name: 'Tony Torft', role: 'Product designer', avatar: 'tony', online: true, mutual: 8 },
  { id: 'roger', name: 'Roger Korsgaard', role: 'Creative developer', avatar: 'roger', online: true, mutual: 16 },
  { id: 'angel', name: 'Angel Bergson', role: 'Illustrator & maker', avatar: 'angel', online: false, mutual: 6 },
  { id: 'emerson', name: 'Emerson Gouse', role: 'Motion designer', avatar: 'emerson', online: true, mutual: 11 },
  { id: 'corey', name: 'Corey Capista', role: 'Brand designer', avatar: 'corey', online: false, mutual: 4 },
  { id: 'zain', name: 'Zain Culhane', role: 'Designing thoughtful things', avatar: 'zain', online: true, mutual: 9 },
  { id: 'randy', name: 'Randy Lipshutz', role: 'Photographer', avatar: 'roger', online: false, mutual: 3 },
  { id: 'craig', name: 'Craig Botosh', role: 'Frontend developer', avatar: 'cameron', online: false, mutual: 7 },
  { id: 'carter', name: 'Carter Vaccaro', role: 'Creative technologist', avatar: 'angel', online: false, mutual: 14 },
  { id: 'jocelyn', name: 'Jocelyn Siphon', role: 'Digital creator', avatar: 'tony', online: true, mutual: 5 },
  { id: 'gustavo', name: 'Gustavo Schlofer', role: 'Designer at Studio North', avatar: 'emerson', online: false, mutual: 10 },
];

export const communities = [
  { id: 'uiux', title: 'UI/UX Community', color: '#229be6', initials: 'UX', description: 'Share ideas, thoughtful interfaces, and the details that make products better.' },
  { id: 'web', title: 'Web Designer', color: '#8e7dd3', initials: 'W', description: 'A friendly corner for everything on the web.' },
  { id: 'dribbble', title: 'Dribbble Community', color: '#e9669c', initials: 'Dr', description: 'Show what you are working on. Discover something unexpected.' },
  { id: 'behance', title: 'Behance', color: '#176bdf', initials: 'Bē', description: 'Creative work and the people behind it.' },
];

export const videos = [
  { id: 'video-1', author: 'emerson', title: 'UI/UX inspiration — a study in color', description: 'A small exploration of playful forms, softer colors, and a little movement. Built for the joy of creating.', art: 'video-color', src: 'assets/color-study.mp4', duration: '0:12', views: 128, likes: 84, tags: '#Design #ColorStudy #MotionDesign' },
  { id: 'video-2', author: 'tony', title: 'Soft shapes. Endless possibilities.', description: 'Finding balance in a simple composition. What would you make with this palette?', art: 'video-soft', src: 'assets/soft-shapes.mp4', duration: '0:10', views: 96, likes: 42, tags: '#3D #Inspiration #CreativeProcess' },
];

export const products = [
  { id: 'p1', title: 'Desktop display · M1', price: 2304, category: 'Electronics', condition: 'New', art: 'monitor', rating: 4.9, sold: 58, location: 'Brooklyn', seller: 'cameron', verified: true, description: 'A clean desktop companion for creative work. Includes display, stand, and power cable. This is a sample listing.' },
  { id: 'p2', title: 'Classic smart watch', price: 189, category: 'Electronics', condition: 'New', art: 'watch', rating: 4.8, sold: 54, location: 'Manhattan', seller: 'roger', verified: true },
  { id: 'p3', title: 'Adventure camera drone', price: 780.56, category: 'Electronics', condition: 'Second hand', art: 'drone', rating: 4.6, sold: 12, location: 'Queens', seller: 'angel', verified: false },
  { id: 'p4', title: 'Vanilla soy candle', price: 15, category: 'Home & living', condition: 'New', art: 'candle', rating: 4.9, sold: 125, location: 'Brooklyn', seller: 'tony', verified: true },
  { id: 'p5', title: 'Wireless earbuds', price: 89, category: 'Electronics', condition: 'New', art: 'earbuds', rating: 4.8, sold: 42, location: 'Manhattan', seller: 'emerson', verified: true },
  { id: 'p6', title: 'Velvet occasional chair', price: 65, category: 'Home & living', condition: 'Second hand', art: 'chair', rating: 4.6, sold: 8, location: 'Brooklyn', seller: 'corey', verified: false },
  { id: 'p7', title: 'Wireless charging stand', price: 26, category: 'Electronics', condition: 'New', art: 'charger', rating: 4.8, sold: 21, location: 'Queens', seller: 'roger', verified: true },
  { id: 'p8', title: 'Everyday knit sneakers', price: 43.31, category: 'Fashion', condition: 'New', art: 'shoes', rating: 4.7, sold: 36, location: 'Brooklyn', seller: 'zain', verified: false },
  { id: 'p9', title: 'Arctic mini tote', price: 12.89, category: 'Fashion', condition: 'New', art: 'bag', rating: 4.6, sold: 31, location: 'Manhattan', seller: 'angel', verified: true },
  { id: 'p10', title: 'Everyday cotton cap', price: 15.69, category: 'Fashion', condition: 'New', art: 'cap', rating: 4.5, sold: 49, location: 'Queens', seller: 'tony', verified: true },
  { id: 'p11', title: 'Studio headphones', price: 105.56, category: 'Electronics', condition: 'Second hand', art: 'headphones', rating: 4.9, sold: 18, location: 'Brooklyn', seller: 'cameron', verified: true },
  { id: 'p12', title: 'Fresh moments perfume', price: 35, category: 'Beauty', condition: 'New', art: 'perfume', rating: 4.8, sold: 17, location: 'Manhattan', seller: 'corey', verified: false },
];

export function createInitialState() {
  const now = Date.now();
  const inDays = (d, hour = 15) => { const date = new Date(now + d * 86400000); date.setHours(hour, 0, 0, 0); return date.toISOString(); };
  return {
    version: 1,
    profile: { id: 'me', name: 'Jakob Botosh', handle: 'jakobbotosh', bio: 'Creating things. Connecting people. A little inspiration every day.', location: 'New York, USA', website: '', avatar: 'jakob', role: 'Product designer' },
    settings: { activityVisible: true, messageSounds: false },
    posts: [
      { id: 'post-1', author: 'cameron', text: 'A little exploration in sound & color. Which one feels more you? ✨', images: ['sound', 'bubbles'], createdAt: new Date(now - 45 * 60000).toISOString(), likes: 30, shares: 5, audience: 'Public', community: 'uiux', comments: [{ id: 'comment-1', author: 'tony', text: 'The lavender one! Such a lovely material study.', createdAt: new Date(now - 20 * 60000).toISOString() }] },
      { id: 'post-2', author: 'tony', text: 'Soft shapes, fresh perspective. A little something from this week’s creative experiments.', images: ['video-soft'], createdAt: new Date(now - 2 * 3600000).toISOString(), likes: 46, shares: 3, audience: 'Public', community: 'dribbble', comments: [] },
      { id: 'post-3', author: 'emerson', text: 'Good design starts with a conversation. What’s one thing you learned this week? #DesignCommunity', images: ['summer'], createdAt: new Date(now - 5 * 3600000).toISOString(), likes: 18, shares: 1, audience: 'Friends', community: 'web', comments: [] },
    ],
    likedPosts: [], savedPosts: [], likedVideos: [], savedVideos: [], savedProducts: [], cart: [],
    following: ['cameron', 'tony', 'emerson'], friends: ['roger', 'tony', 'angel', 'emerson', 'corey', 'zain', 'randy', 'craig'], friendRequests: ['carter', 'jocelyn', 'gustavo'], followedPages: ['uiux', 'web', 'dribbble', 'behance'],
    events: [
      { id: 'event-1', title: 'Planning Masterclass', date: inDays(7), location: '24 Royal Ln, Mesa, New Jersey', art: 'planning', description: 'Spend an afternoon with fellow creatives. Explore practical ways to turn a big idea into a clear, achievable plan.', category: 'Workshop', attendees: 28, host: 'cameron' },
      { id: 'event-2', title: 'Monumental Event Planning', date: inDays(10, 16), location: '43 Birch St, Celina, Delaware', art: 'monument', description: 'Good experiences begin with thoughtful details. Join our community to exchange ideas for events people remember.', category: 'Meetup', attendees: 34, host: 'roger' },
      { id: 'event-3', title: 'Summer Nights Concert Series', date: inDays(11, 18), location: '45 Washington Ave, Manchester', art: 'summer', description: 'An evening of independent music, creative friends, and plenty of inspiration. Bring your favorite people.', category: 'Music', attendees: 62, host: 'tony' },
      { id: 'event-4', title: 'Artisan Market and Craft Fair', date: inDays(14, 11), location: '88 Preston Rd, Inglewood, Maine', art: 'craft', description: 'Meet local makers and find something made with care. Explore ceramics, illustration, and small-batch design.', category: 'Art & design', attendees: 41, host: 'angel' },
    ],
    attending: [],
    messages: Object.fromEntries(people.slice(0, 9).map((p, i) => [p.id, [{ id: `message-${i}`, author: p.id, text: i === 0 ? 'Hey Jakob! What do you think of the new color study?' : 'Hey! Great to connect here. Hope your week is going well.', createdAt: new Date(now - (i + 1) * 3600000).toISOString() }]])),
    messageRequests: ['carter', 'gustavo'], unreadMessages: ['cameron', 'roger', 'angel'],
    notifications: [
      { id: 'n1', actor: 'corey', text: 'and 2 others liked your recent work.', target: 'profile', read: false },
      { id: 'n2', actor: 'tony', text: 'left a comment: “Always inspiring!”', target: 'feed', read: false },
      { id: 'n3', actor: 'carter', text: 'sent you a friend request.', target: 'friends', read: false },
    ],
    stories: people.slice(0, 7).map((p, i) => ({ id: `story-${i}`, author: p.id, art: ['sound', 'planning', 'bubbles', 'craft', 'summer', 'monument', 'video-soft'][i], caption: ['A little creative energy ✨', 'Something new is taking shape.', 'Playing with color today.', 'Slow mornings. Fresh ideas.', 'Make room for the unexpected.', 'A new perspective.', 'Made with curiosity.'][i], createdAt: new Date(now - i * 3600000).toISOString() })),
    photos: [
      { id: 'photo-1', art: 'sound', title: 'Sound in lavender', album: 'Inspiration' },
      { id: 'photo-2', art: 'bubbles', title: 'Blue daydream', album: 'Inspiration' },
      { id: 'photo-3', art: 'planning', title: 'Finding balance', album: 'Creative work' },
      { id: 'photo-4', art: 'monument', title: 'Playful forms', album: 'Creative work' },
      { id: 'photo-5', art: 'summer', title: 'A softer perspective', album: 'Inspiration' },
      { id: 'photo-6', art: 'craft', title: 'The maker’s corner', album: 'Creative work' },
    ],
    files: [],
  };
}
