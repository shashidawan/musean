import { Product, Stylist, ServicePackage } from './types';

// Authentic user-provided transformation photos
// @ts-ignore
import blondeTreatmentImg from './assets/images/blonde_treatment_1779722155374.png';
// @ts-ignore
import blondeResultImg from './assets/images/blonde_result_1779722175637.png';
// @ts-ignore
import caramelBalayageImg from './assets/images/caramel_balayage_1779722197229.png';
// @ts-ignore
import balayageApplicationImg from './assets/images/balayage_application_1779722223697.png';

export const KRONE_PRODUCTS: Product[] = [
  {
    id: 'prod-grow',
    name: 'Muskan Herbal Brow & Lash Oil',
    category: 'Nourish & Grow',
    description: 'An organic blend of cold-pressed castor oil, sweet almond oil, and premium rosemary extract designed to nourish hair roots and promote thick, healthy growth.',
    benefits: [
      'Deeply hydrates hair follicle roots for natural definition',
      'Stimulates micro-circulation to encourage fuller arches',
      'Non-greasy, fast-absorbing soothing recipe'
    ],
    volume: '30 ml',
    price: 25,
    rating: 4.9,
    imageAlt: 'Sleek dark glass vial with gold dropper containing herbal brow growth oil',
    shelf: 1
  },
  {
    id: 'prod-aloe',
    name: 'Muskan Soothing Aloe Recovery Gel',
    category: 'Calm & Repair',
    description: 'A calming post-treatment skincare formula infused with active cold-pressed aloe vera juice, cucumber juice, and lavender essential oils.',
    benefits: [
      'Reduces post-threading or post-waxing redness instantly',
      'Cools, hydrates, and tightens pores',
      'Creates a weightless antibacterial barrier on sensitive skin'
    ],
    volume: '150 ml',
    price: 18,
    rating: 4.8,
    imageAlt: 'Cool translucent emerald pump bottle filled with organic soothing aloe gel',
    shelf: 2
  },
  {
    id: 'prod-cleansing',
    name: 'Muskan Ayurvedic Glow Herbal Cleanser',
    category: 'Saffron Radiance',
    description: 'A skin-brightening cleansing solution rich in wild turmeric, Kashmiri saffron extract, and organic sandalwood oil.',
    benefits: [
      'Deeply purifies facial pores while preserving elasticity',
      'Exfoliates dead skin cells to reveal native bridal glow',
      'Neutralizes environmental tan and evens out tone pigment'
    ],
    volume: '200 ml',
    price: 32,
    rating: 4.9,
    imageAlt: 'Elegant matte black tube with luxury gold lettering containing saffron and sandalwood face cleanser',
    shelf: 3
  },
  {
    id: 'prod-argan',
    name: 'Muskan Intensive Argan Hair Elixir',
    category: 'Moisture Seal',
    description: 'A professional-grade Moroccan argan oil complex enriched with keratin proteins to lock in hydration and lock out humidity.',
    benefits: [
      'Delivers an instant mirror-slick gloss finish to newly colored lock-in hair',
      'Dramatically reduces frizz and flyaways for up to 72 hours',
      'Guarantees advanced heat-protection shield up to 450°F'
    ],
    volume: '100 ml',
    price: 38,
    rating: 4.7,
    imageAlt: 'Translucent amber glass pump bottle containing glossy gold nourishing hair serum',
    shelf: 4
  }
];

export const SALON_STYLISTS: Stylist[] = [
  {
    id: 'stylist-muskan',
    name: 'Muskan',
    role: 'Founder & Master Esthetician',
    experience: '10+ Years',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Precision Eyebrow Shaping, Indian Threading Art & Herbal Facial Care',
    availableDays: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    timeSlots: ['09:00 AM', '11:00 AM', '01:30 PM', '03:30 PM', '05:30 PM']
  },
  {
    id: 'stylist-aarati',
    name: 'Aarati',
    role: 'Senior Hair Artisan & Stylist',
    experience: '8 Years',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Premium Hair Colouring, Keratin Smoothening & Precision Sculpting Cuts',
    availableDays: ['Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['10:00 AM', '12:00 PM', '02:30 PM', '04:30 PM']
  },
  {
    id: 'stylist-preeti',
    name: 'Preeti',
    role: 'Beauty & Waxing Therapist',
    experience: '6 Years',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300',
    specialty: 'Pain-Free Organic Waxing, Eyebrow Tinting & Glow Facials',
    availableDays: ['Wed', 'Fri', 'Sat', 'Sun'],
    timeSlots: ['09:30 AM', '11:30 AM', '02:00 PM', '04:00 PM']
  }
];

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'pkg-ultimate-glow',
    title: 'The Ultimate Muskan Glow Special',
    duration: '90 Minutes',
    price: 120,
    description: 'Our premier all-in-one signature therapy. Indulge in an Ayurvedic herb-steamed facial, precision-mapped brow threading, customized gold tinting, and a relaxing cooling head massage.',
    includes: [
      'Ayurvedic saffron & sandalwood face steam purification',
      'Expert face-mapped eyebrow threading & chin clean',
      'Enhanced brow dye / tinting for perfect high contrast definition',
      'Extended relaxing herbal hair massage with deep scalp activation',
      'Warm custom-brewed complimentary herbal tea with organic honeys'
    ],
    isRecommended: true,
    image: blondeResultImg
  },
  {
    id: 'pkg-beauty-trio',
    title: 'Precision Brow, Tint & Hydration Trio',
    duration: '45 Minutes',
    price: 45,
    description: 'The absolute best-value deal for your monthly grooming needs. Refine your arches, boost tint pigment density, and calm the surrounding pores with active botanical remedies.',
    includes: [
      'Precision organic eyebrow threading & shaping',
      'Long-lasting tinting with custom matching pigmentation',
      'Calming post-thread cold aloe-vera jade roller massage',
      'Complimentary upper-lip or forehead threading touch'
    ],
    image: blondeTreatmentImg
  },
  {
    id: 'pkg-hair-makeover',
    title: 'Luxury Hair Smoothening & Precision Cut',
    duration: '110 Minutes',
    price: 160,
    description: 'Transformative hair treatment for dry, chemically-compromised or frizzy hair types. Enforces absolute shine, silken touch, and dynamic weightless bounce.',
    includes: [
      'Gentle herbal sulfate-free conditioning cleanse',
      'Deep-acting Moroccan argan oil hydration protein pack',
      'Custom precise hair redesign cut tailored to face shape',
      'Sleek moisture-locked hot iron seal & voluminous blowout finish'
    ],
    image: caramelBalayageImg
  }
];
