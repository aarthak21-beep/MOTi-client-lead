/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AgencySettings,
  AgencyTask,
  DemoTemplate,
  Lead,
  MessageTemplate,
  PaymentRecord,
  PricingPlan,
  Project,
  Quotation,
} from '../types';

export const DEFAULT_SETTINGS: AgencySettings = {
  agencyName: 'MOTI Technologies',
  tagline: 'Work Smarter. Grow Faster.',
  ownerName: 'Moti (Founder)',
  phone: '+91 98234 56789',
  whatsapp: '+91 98234 56789',
  email: 'contact@motitechnologies.com',
  address: 'Shivaji Nagar, Pune, Maharashtra 411005',
  upiId: 'moti.technologies@okhdfcbank',
  bankDetails: {
    bankName: 'HDFC Bank Ltd',
    accountNo: '50200084729103',
    ifsc: 'HDFC0001245',
    branch: 'Shivaji Nagar Branch, Pune',
  },
  currency: 'INR',
  currencySymbol: '₹',
  termsAndConditions: [
    '50% advance payment required to initiate the project.',
    'Content (text, images, logo) must be provided by client before design approval.',
    'Remaining 50% balance must be cleared before live deployment and domain pointing.',
    'Free technical support and minor bug fixes included for 30 days after handover.',
    'Annual domain and cloud hosting renewal will be billed separately after 1 year.',
  ],
  privacyMode: false,
  pinProtectionEnabled: false,
  securityPin: '1234',
};

export const DEFAULT_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Website',
    badge: 'Fast Launch',
    price: 2999,
    deliveryDays: 3,
    description: 'Perfect for small local shops, freelancers, and single-service businesses needing an online presence.',
    features: [
      '1 Page High-Converting Landing Website',
      'Mobile & Tablet 100% Responsive',
      'Direct WhatsApp Call-to-Action Button',
      'Contact Enquiry Form with Email Alerts',
      'Google Maps Location Integration',
      'Basic On-Page SEO Setup',
      'Fast 3-Day Turnaround',
    ],
  },
  {
    id: 'business',
    name: 'Business Website',
    badge: 'Most Popular',
    popular: true,
    price: 4999,
    deliveryDays: 5,
    description: 'Ideal for established small businesses, clinics, coaching institutes, and consultancies wanting a multi-page site.',
    features: [
      'Up to 5 Custom Designed Pages (Home, About, Services, Gallery, Contact)',
      'Modern Animations & Clean Visual Layout',
      'Interactive Photo & Video Gallery',
      'Customer Testimonials & Reviews Section',
      'Social Media & WhatsApp Floating Widget',
      'Google Business Profile Map & Rich Contact Form',
      'Search Engine Optimization (SEO Ready)',
      'Delivered in 5 Days',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Corporate',
    badge: 'High Conversion',
    price: 7999,
    deliveryDays: 7,
    description: 'Designed for brands requiring bespoke design, detailed services showcase, lead capture funnels and speed optimization.',
    features: [
      'Up to 10 Pages with Custom UI/UX Design',
      'Dynamic Services & Portfolio Case Studies',
      'Lead Generation Popups & WhatsApp Chat Funnel',
      'Ultra-Fast Page Speed (< 1.5s load time)',
      'SSL Certificate & Security Hardening',
      'Google Analytics & Search Console Setup',
      '30 Days Free Maintenance & Updates Support',
      'Delivered in 7 Days',
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Online Store',
    badge: 'Revenue Ready',
    price: 12999,
    deliveryDays: 12,
    description: 'Full-featured online shop with product catalogue, cart, online payments, and WhatsApp instant ordering.',
    features: [
      'Unlimited Products Catalog Setup (Up to 50 items pre-loaded)',
      'Direct Online Payment Gateway (Razorpay/PhonePe/UPI/COD)',
      'Instant Order Confirmation on WhatsApp & Email',
      'Customer Shopping Cart & One-Click Checkout',
      'Easy Admin Panel for Inventory & Order Management',
      'Coupon Codes & Discount Engine',
      'Domain, Cloud Hosting & SSL Included (1 Year)',
      'Full Training Session on Managing Store',
    ],
  },
];

export const DEFAULT_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'intro',
    title: '1. First Introduction Message',
    englishText: `Hello {{customer_name}},

Greetings from MOTI Technologies! 🚀

I noticed that {{business_name}} has a great reputation, and a modern, fast website can help you attract 3x more local customers and enquiries directly on WhatsApp.

We design high-converting, mobile-friendly websites starting at just ₹2,999 with 3-5 days delivery.

Would you be open to seeing a 2-minute live demo of how your business website would look?

Best regards,
Moti | Founder, MOTI Technologies
📞 {{agency_phone}}
🌐 motitechnologies.com`,
    marathiText: `नमस्कार {{customer_name}} जी,

MOTI Technologies तर्फे सस्नेह नमस्कार! 🚀

तुमचा {{business_name}} हा व्यवसाय खूप छान सुरू आहे. तुमच्या व्यवसायाची एक आधुनिक आणि सुंदर वेबसाईट असल्यास गुगल आणि व्हॉट्सॲपवरून नवीन ग्राहकांच्या थेट चौकशी (Enquiries) वाढण्यास मोठी मदत होईल.

आम्ही लहान व मध्यम व्यवसायांसाठी अगदी ₹२,९९९ पासून व्यावसायिक आणि मोबाईल-फ्रेंडली वेबसाईट अवघ्या ३ ते ५ दिवसांत तयार करून देतो.

तुमच्या व्यवसायासाठी आम्ही तयार केलेला एक विनामूल्य डेमो (Demo) पाहायला आपल्याला आवडेल का?

आपला नम्र,
मोती | MOTI Technologies
📞 {{agency_phone}}
"Work Smarter. Grow Faster."`,
  },
  {
    id: 'followup',
    title: '2. Follow-Up Message',
    englishText: `Hi {{customer_name}},

Hope you're having a productive week!

Just following up on our previous conversation regarding the new website for {{business_name}}.

Right now, we are offering a complimentary Google Business profile optimization + Free WhatsApp Floating Button with our {{package_name}} website package.

Let me know if you would like me to reserve a delivery slot for you this week!

Warm regards,
MOTI Technologies
📞 {{agency_phone}}`,
    marathiText: `नमस्कार {{customer_name}} जी,

आशा आहे सर्व छान सुरू असेल!

आपल्या {{business_name}} च्या नवीन वेबसाईटबद्दल मागे झालेल्या चर्चेच्या संदर्भात हा फॉलो-अप मेसेज आहे.

या आठवड्यात बुकिंग करणाऱ्या ग्राहकांना आम्ही मोफत Google Business सेटअप आणि व्हॉट्सॲप चॅट बटण देत आहोत.

आपल्यासाठी या आठवड्यात प्रोजेक्ट सुरू करायचा का? कृपया आपल्या सोयीनुसार सांगावे.

धन्यवाद,
MOTI Technologies
📞 {{agency_phone}}`,
  },
  {
    id: 'pricing',
    title: '3. Pricing & Packages Message',
    englishText: `Hi {{customer_name}},

Here are the popular website design packages for {{business_name}}:

🌟 1. Starter Website - ₹2,999 (Delivery: 3 Days)
- 1 Page Landing Site, Mobile Responsive, WhatsApp Button, Enquiry Form, Google Maps

🚀 2. Business Website (Most Recommended) - ₹4,999 (Delivery: 5 Days)
- Up to 5 Pages, Photo Gallery, Testimonials, SEO Ready, Social Media Integration

💎 3. Premium Corporate - ₹7,999 (Delivery: 7 Days)
- Up to 10 Pages, Bespoke UI/UX, Speed Optimized, 30 Days Free Support

🛒 4. E-Commerce Store - Starting ₹12,999 (Delivery: 12 Days)
- Online Store, Payment Gateway (UPI/Cards), Product Catalog & WhatsApp Ordering

All packages include complete mobile responsiveness & testing.
Which package best aligns with your vision for {{business_name}}?

Regards,
MOTI Technologies`,
    marathiText: `नमस्कार {{customer_name}} जी,

आपल्या {{business_name}} साठीचे वेबसाईट प्लॅन्स खालीलप्रमाणे आहेत:

🌟 १. स्टार्टर वेबसाईट - ₹२,९९९ (३ दिवसांत डिलिव्हरी)
- १ पेज लँडिंग साईट, मोबाईल फ्रेंडली, व्हॉट्सॲप बटण, गुगल मॅप्स

🚀 २. बिझनेस वेबसाईट (सर्वात लोकप्रिय) - ₹४,९९९ (५ दिवसांत डिलिव्हरी)
- ५ पेजेस पर्यंत, फोटो गॅलरी, रिव्ह्यूज, एसइओ रेडी, सोशल मीडिया लिंक्स

💎 ३. प्रीमियम कॉर्पोरेट - ₹७,९९९ (७ दिवसांत डिलिव्हरी)
- १० पेजेस पर्यंत, कस्टम डिझाईन, सुपरफास्ट स्पीड, ३० दिवस मोफत सपोर्ट

🛒 ४. ई-कॉमर्स ऑनलाईन शॉप - ₹१२,९९९ पासून (१२ दिवसांत डिलिव्हरी)
- ऑनलाईन प्रॉडक्ट्स, फोनपे/गुगलपे पेमेंट गेटवे, शॉपिंग कार्ट व व्हॉट्सॲप ऑर्डरिंग

यापैकी आपल्या व्यवसायासाठी कोणता प्लॅन योग्य वाटतो?

धन्यवाद,
MOTI Technologies`,
  },
  {
    id: 'demo',
    title: '4. Demo Website Sharing Message',
    englishText: `Hi {{customer_name}},

As promised, here is the live demo website link crafted for your industry:

🔗 Live Demo: {{demo_url}}

Key highlights included in this design:
✓ Clean modern visual layout tailored for {{business_name}}
✓ Instant 1-click WhatsApp enquiry button
✓ Fast loading speed on 4G/5G mobile phones
✓ Google Map directions and photo gallery

Please click the link, explore it on your phone, and let me know your thoughts!

Best regards,
MOTI Technologies
📞 {{agency_phone}}`,
    marathiText: `नमस्कार {{customer_name}} जी,

आपल्या बोलण्यानुसार, आपल्या व्यवसायाच्या स्वरूपाचा तयार केलेला लाईव्ह डेमो खालील लिंकवर पाहू शकता:

🔗 लाईव्ह डेमो लिंक: {{demo_url}}

या वेबसाईटची खास वैशिष्ट्ये:
✓ {{business_name}} साठी अनुरूप आधुनिक आणि आकर्षक डिझाईन
✓ ग्राहकांसाठी थेट १-क्लिक व्हॉट्सॲप मेसेज बटण
✓ मोबाईलवर अतिशय जलद उघडणारी स्पीड
✓ पत्त्यासाठी गुगल मॅप आणि फोटो गॅलरी

कृपया ही लिंक आपल्या मोबाईलवर उघडून पहा आणि आपल्याला कशी वाटली ते सांगा!

धन्यवाद,
MOTI Technologies
📞 {{agency_phone}}`,
  },
  {
    id: 'payment_advance',
    title: '5. Payment Reminder (Advance / 50%)',
    englishText: `Dear {{customer_name}},

Thank you for confirming the website project for {{business_name}}! 🤝

To initiate the design and reserve your development timeline, please arrange the 50% advance payment:

📋 Project: {{project_name}} ({{package_name}})
💰 Total Project Amount: ₹{{total_amount}}
💳 50% Advance Due: ₹{{due_amount}}

Payment UPI ID: {{upi_id}}
Or pay directly via GPay / PhonePe / Paytm to: {{agency_phone}}

Once paid, please share a screenshot so our team can immediately start the design work today.

Warm regards,
MOTI Technologies`,
    marathiText: `सस्नेह नमस्कार {{customer_name}} जी,

{{business_name}} च्या वेबसाईट प्रोजेक्टला मंजुरी दिल्याबद्दल मनःपूर्वक धन्यवाद! 🤝

प्रोजेक्टचे डिझाईन सुरू करण्यासाठी आणि तुमची वेळ आरक्षित करण्यासाठी ५०% ॲडव्हान्स रक्कम पाठवण्याची विनंती:

📋 प्रोजेक्ट: {{project_name}} ({{package_name}})
💰 एकूण रक्कम: ₹{{total_amount}}
💳 ५०% ॲडव्हान्स देय: ₹{{due_amount}}

पेमेंटसाठी UPI ID: {{upi_id}}
किंवा GPay / PhonePe / Paytm: {{agency_phone}}

पेमेंट झाल्यानंतर कृपया स्क्रीनशॉट पाठवा, जेणेकरून आजच काम सुरू करता येईल.

धन्यवाद,
MOTI Technologies`,
  },
  {
    id: 'payment_final',
    title: '5b. Payment Reminder (Final Balance)',
    englishText: `Dear {{customer_name}},

Great news! The website for {{business_name}} is completed and successfully reviewed. 🎉

Before we point the domain live and hand over the administrative credentials, kindly clear the remaining balance:

📋 Project: {{project_name}}
💰 Total Amount: ₹{{total_amount}}
✅ Advance Paid: ₹{{advance_paid}}
💳 Remaining Balance Due: ₹{{due_amount}}

Payment UPI ID: {{upi_id}}
PhonePe / GPay / Paytm: {{agency_phone}}

As soon as this is cleared, we will immediately make the website 100% LIVE on your official domain!

Best regards,
MOTI Technologies`,
    marathiText: `सस्नेह नमस्कार {{customer_name}} जी,

आनंदाची बातमी! आपल्या {{business_name}} ची वेबसाईट पूर्ण तयार झाली असून फायनल रिव्ह्यू पूर्ण झाला आहे. 🎉

वेबसाईट थेट आपल्या अधिकृत डोमेनवर लाईव्ह करण्यासाठी आणि सर्व ॲडमिन पासवर्ड सुपूर्द करण्यासाठी उर्वरित रक्कम पाठवण्याची विनंती:

📋 प्रोजेक्ट: {{project_name}}
💰 एकूण बिल: ₹{{total_amount}}
✅ ॲडव्हान्स जमा: ₹{{advance_paid}}
💳 उर्वरित देय रक्कम: ₹{{due_amount}}

UPI ID: {{upi_id}}
PhonePe / GPay: {{agency_phone}}

रक्कम जमा होताच वेबसाईट सर्व ग्राहकांसाठी लगेच लाईव्ह केली जाईल!

धन्यवाद,
MOTI Technologies`,
  },
  {
    id: 'handover',
    title: '6. Project Completion & Handover Message',
    englishText: `Congratulations {{customer_name}}! 🚀

Your official website for {{business_name}} is now 100% LIVE and active on the internet!

🌐 Live Website URL: {{live_url}}
🔒 Security: SSL Certificate Activated (HTTPS)
📱 Compatibility: Tested on iPhone, Android, and Desktops
⭐ Google SEO Indexing: Submitted

Handover Details:
- Admin Dashboard URL and logins have been securely emailed.
- You have 30 days of complimentary technical support from MOTI Technologies.

It was an absolute pleasure working with you. Wishing {{business_name}} tremendous growth and success!

Warm regards,
Moti | MOTI Technologies
"Work Smarter. Grow Faster."`,
    marathiText: `अभिनंदन {{customer_name}} जी! 🚀

आपल्या {{business_name}} ची अधिकृत वेबसाईट आता इंटरनेटवर यशस्वीरित्या लाईव्ह (Live) झाली आहे!

🌐 वेबसाईट लिंक: {{live_url}}
🔒 सुरक्षितता: SSL सिक्युरिटी ॲक्टिव्हेट केली आहे (HTTPS)
📱 मोबाईल आणि कॉम्प्युटरवर पूर्णपणे टेस्ट केली आहे
⭐ गुगल सर्चसाठी सबमिट केली आहे

हँडओव्हर माहिती:
- ॲडमिन लॉगिन डिटेल्स आपल्या ईमेलवर पाठवले आहेत.
- MOTI Technologies कडून आपल्याला पुढील ३० दिवस मोफत तांत्रिक सहाय्य मिळेल.

आपल्यासोबत काम करण्याचा अनुभव खूप छान होता. आपल्या व्यवसायाची अशीच भरभराट होवो हीच सदिच्छा!

सस्नेह,
मोती | MOTI Technologies
"Work Smarter. Grow Faster."`,
  },
];

export const DEFAULT_DEMO_TEMPLATES: DemoTemplate[] = [
  {
    id: 'demo-coaching',
    title: 'Apex Coaching Institute & Classes',
    category: 'Coaching Institute',
    previewImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://preview-coaching.moti-templates.live',
    description: 'Designed for NEET, JEE, MPSC, and School coaching academies. Includes student enquiry popup, course list, batches schedule, faculty profiles and student results showcase.',
    features: ['Instant Lead Capture Form', 'Syllabus & Fee Structure Grid', 'Toppers Result Gallery', 'Direct WhatsApp Enquiry for Batches', 'Google Map for Campus'],
    tags: ['Education', 'Classes', 'Academy', 'Lead Gen'],
  },
  {
    id: 'demo-restaurant',
    title: 'Spice Garden & Cafe',
    category: 'Restaurant & Cafe',
    previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://preview-cafe.moti-templates.live',
    description: 'Sensory restaurant experience with visual digital menu card, table reservation form, chef specials, food gallery, and direct Swiggy/Zomato/WhatsApp ordering links.',
    features: ['Interactive Digital Menu with Prices', 'Table Booking Form', 'Mouth-watering Food Gallery', 'Customer Reviews Integration', 'Google Maps & Operating Hours'],
    tags: ['Food', 'Dining', 'Cafe', 'Menu'],
  },
  {
    id: 'demo-corporate',
    title: 'Vanguard Business Consultants',
    category: 'Professional Services',
    previewImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://preview-corporate.moti-templates.live',
    description: 'Authoritative, clean website for CA firms, legal advisors, architects, and IT consulting agencies. Builds trust, highlights case studies, and drives consultation bookings.',
    features: ['Professional Service Offerings', 'Client Case Studies & Logos', 'Consultation Booking Funnel', 'Team Bios & Credentials', 'FAQ Accordion'],
    tags: ['B2B', 'Agency', 'Consulting', 'Corporate'],
  },
  {
    id: 'demo-clinic',
    title: 'Sanjeevani Multispeciality Clinic',
    category: 'Healthcare & Clinic',
    previewImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://preview-clinic.moti-templates.live',
    description: 'Clean medical website for doctors, dentists, diagnostic centers, and clinics. Features appointment scheduling, doctor qualifications, clinic timings, and emergency contact button.',
    features: ['Doctor Profiles & Specializations', 'Online Appointment Request', 'Clinic Timings & Holiday Notice', 'Patient Testimonials', '1-Click Call & WhatsApp Emergency Button'],
    tags: ['Doctor', 'Healthcare', 'Dental', 'Appointments'],
  },
  {
    id: 'demo-portfolio',
    title: 'Visual Identity & Designer Portfolio',
    category: 'Portfolio / Personal',
    previewImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://preview-portfolio.moti-templates.live',
    description: 'Minimalist, high-impact personal brand website for photographers, architects, interior designers, and freelance professionals.',
    features: ['Fullscreen Visual Showcase', 'Filterable Project Case Studies', 'Client Testimonials', 'Direct Resume / Rate Card PDF Download', 'Contact & Social Links'],
    tags: ['Personal Brand', 'Freelancer', 'Creative', 'Portfolio'],
  },
  {
    id: 'demo-ecommerce',
    title: 'Urban Trendz Boutique Store',
    category: 'E-Commerce',
    previewImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://preview-store.moti-templates.live',
    description: 'High-converting online store with product category filters, mobile cart, instant WhatsApp buy button, and payment checkout.',
    features: ['Product Catalog with Size/Color Variants', 'WhatsApp Order Flow + Razorpay Gateway', 'Discount Promo Codes', 'Mobile-First Shopping Cart', 'Customer Reviews & Ratings'],
    tags: ['E-Commerce', 'Clothing', 'Retail', 'Online Shop'],
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Sachin Patil',
    businessName: 'Patil Classes & Science Academy',
    phone: '+91 98221 44550',
    whatsapp: '+91 98221 44550',
    email: 'patilclasses.pune@gmail.com',
    address: 'Kothrud, Pune',
    category: 'Coaching Institute',
    status: 'Interested',
    estimatedBudget: 4999,
    interestedPlan: 'Business Website',
    followUpDate: '2026-11-04',
    followUpTime: '11:00 AM',
    notesHistory: [
      {
        id: 'note-1',
        date: '2026-11-01',
        note: 'Sent introductory message and Coaching Academy live demo. Sachin liked the course cards and student results gallery.',
        type: 'whatsapp',
      },
      {
        id: 'note-2',
        date: '2026-11-02',
        note: 'Called to discuss requirements. Wants 5 pages with online inquiry form. Follow up on Wednesday to finalize advance payment.',
        type: 'call',
      },
    ],
    createdAt: '2026-10-30',
    updatedAt: '2026-11-02',
  },
  {
    id: 'lead-2',
    name: 'Dr. Neha Deshmukh',
    businessName: 'Deshmukh Dental Clinic & Implant Care',
    phone: '+91 94220 12345',
    whatsapp: '+91 94220 12345',
    email: 'drneha.dental@yahoo.com',
    address: 'Deccan Gymkhana, Pune',
    category: 'Healthcare & Clinic',
    status: 'Follow-up',
    estimatedBudget: 4999,
    interestedPlan: 'Business Website',
    followUpDate: '2026-11-03',
    followUpTime: '04:30 PM',
    notesHistory: [
      {
        id: 'note-3',
        date: '2026-10-28',
        note: 'Dr. Neha requested a quote for dental clinic website with appointment enquiry button.',
        type: 'meeting',
      },
      {
        id: 'note-4',
        date: '2026-10-31',
        note: 'Sent official quotation (Q-2026-003) for ₹4,999. She needs to discuss with clinic partner.',
        type: 'whatsapp',
      },
    ],
    createdAt: '2026-10-25',
    updatedAt: '2026-10-31',
  },
  {
    id: 'lead-3',
    name: 'Rohan Shinde',
    businessName: 'Shinde Caterers & Maharashtrian Thali',
    phone: '+91 98812 77889',
    whatsapp: '+91 98812 77889',
    email: 'shindecaterers@rediffmail.com',
    address: 'Sadashiv Peth, Pune',
    category: 'Restaurant & Cafe',
    status: 'New',
    estimatedBudget: 2999,
    interestedPlan: 'Starter Website',
    followUpDate: '2026-11-03',
    followUpTime: '10:00 AM',
    notesHistory: [
      {
        id: 'note-5',
        date: '2026-11-02',
        note: 'Inquiry received from Instagram DM. Need quick single page site with menu and event booking form.',
        type: 'general',
      },
    ],
    createdAt: '2026-11-02',
    updatedAt: '2026-11-02',
  },
  {
    id: 'lead-4',
    name: 'Pooja Kulkarni',
    businessName: 'Aura Silk Sarees & Boutique',
    phone: '+91 99230 88991',
    whatsapp: '+91 99230 88991',
    email: 'auraboutique.pune@gmail.com',
    address: 'FC Road, Pune',
    category: 'E-Commerce',
    status: 'Converted',
    estimatedBudget: 12999,
    interestedPlan: 'E-Commerce Online Store',
    notesHistory: [
      {
        id: 'note-6',
        date: '2026-10-20',
        note: 'Discussed boutique requirements. Approved quotation and paid ₹6,500 advance.',
        type: 'call',
      },
    ],
    createdAt: '2026-10-18',
    updatedAt: '2026-10-22',
  },
  {
    id: 'lead-5',
    name: 'Amitabh Joshi',
    businessName: 'Joshi & Associates Tax Consultants',
    phone: '+91 98223 99887',
    whatsapp: '+91 98223 99887',
    email: 'contact@joshitax.in',
    address: 'Baner, Pune',
    category: 'Professional Services',
    status: 'Contacted',
    estimatedBudget: 7999,
    interestedPlan: 'Premium Corporate',
    followUpDate: '2026-11-05',
    followUpTime: '02:00 PM',
    notesHistory: [
      {
        id: 'note-7',
        date: '2026-10-30',
        note: 'Shared Corporate template demo. Looking for GST, ITR, and audit services pages.',
        type: 'whatsapp',
      },
    ],
    createdAt: '2026-10-30',
    updatedAt: '2026-10-30',
  },
,
  {
    id: 'mh-wa-green-leaves-001',
    name: 'Green Leaves Beauty Parlour',
    businessName: 'Green Leaves Beauty Parlour',
    phone: '+91 93246 43117',
    whatsapp: '+91 93246 43117',
    email: '',
    address: 'Taloja Sector 14, Panvel, Maharashtra',
    category: 'Salon & Beauty',
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-green-001',
      date: '2026-11-03',
      note: 'Public directory profile provides a WhatsApp contact. No independent business website is linked on that profile; website absence still needs direct verification. Source: ConnectTo business profile.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'mh-wa-mount-forest-002',
    name: 'Mount Forest Resort',
    businessName: 'Mount Forest Resort',
    phone: '+91 86690 27477',
    whatsapp: '+91 86690 27477',
    email: '',
    address: 'Chaul, Alibag, Maharashtra',
    category: 'Other',
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-mount-002',
      date: '2026-11-03',
      note: 'Public directory profile provides WhatsApp contact. No independent business website is linked on that profile; website absence still needs direct verification. Source: ConnectTo business profile.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'mh-wa-rv-enterprises-003',
    name: 'RV Enterprises',
    businessName: 'Kimia Dates Bulk Supplier (RV Enterprises)',
    phone: '+91 93218 57444',
    whatsapp: '+91 93218 57444',
    email: '',
    address: 'Pune, Maharashtra',
    category: 'Retail & Shop',
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-rv-003',
      date: '2026-11-03',
      note: 'Public directory profile provides WhatsApp contact. No independent business website is linked on that profile; website absence still needs direct verification. Source: ConnectTo business profile.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
,
  {
    id: 'mh-wa-hair-wig-mumbai',
    name: "Hair Wig for Cancer Patients / Advance Hair Extensions",
    businessName: "Advance Hair Extensions",
    phone: "+91 77770 14022",
    whatsapp: "+91 77770 14022",
    email: '',
    address: "Mumbai, Maharashtra",
    category: "Salon & Beauty",
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-hair-wig-mumbai',
      date: '2026-11-03',
      note: 'ConnectTo public business profile lists a WhatsApp contact. No independent website link is shown on that profile; website absence has not been independently confirmed. Verify before outreach. Source: ConnectTo directory.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'mh-wa-body-massage-roadpali',
    name: "Body Massage Roadpali",
    businessName: "Body Massage Service",
    phone: "+91 91372 87807",
    whatsapp: "+91 91372 87807",
    email: '',
    address: "Roadpali, Kalamboli, Navi Mumbai, Maharashtra",
    category: "Other",
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-body-massage-roadpali',
      date: '2026-11-03',
      note: 'ConnectTo public business profile lists a WhatsApp contact. No independent website link is shown on that profile; website absence has not been independently confirmed. Verify before outreach. Source: ConnectTo directory.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'mh-wa-dr-jayanti-kharghar',
    name: "Dr Jayanti Ayurvedic Doctor",
    businessName: "Dr Jayanti Ayurvedic Clinic",
    phone: "+91 83569 29725",
    whatsapp: "+91 83569 29725",
    email: '',
    address: "Kharghar, Navi Mumbai, Maharashtra",
    category: "Healthcare & Clinic",
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-dr-jayanti-kharghar',
      date: '2026-11-03',
      note: 'ConnectTo public business profile lists a WhatsApp contact. No independent website link is shown on that profile; website absence has not been independently confirmed. Verify before outreach. Source: ConnectTo directory.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'mh-wa-moto-shed-nerul',
    name: "The Moto Shed",
    businessName: "The Moto Shed",
    phone: "+91 98202 29093",
    whatsapp: "+91 98202 29093",
    email: '',
    address: "Nerul, Navi Mumbai, Maharashtra",
    category: "Other",
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-moto-shed-nerul',
      date: '2026-11-03',
      note: 'ConnectTo public business profile lists a WhatsApp contact. No independent website link is shown on that profile; website absence has not been independently confirmed. Verify before outreach. Source: ConnectTo directory.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'mh-wa-jjs-intimates-kamothe',
    name: "JJs Women’s Intimates",
    businessName: "JJs Women’s Intimates",
    phone: "+91 77383 96533",
    whatsapp: "+91 77383 96533",
    email: '',
    address: "Kamothe, Navi Mumbai, Maharashtra",
    category: "Retail & Shop",
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-jjs-intimates-kamothe',
      date: '2026-11-03',
      note: 'ConnectTo public business profile lists a WhatsApp contact. No independent website link is shown on that profile; website absence has not been independently confirmed. Verify before outreach. Source: ConnectTo directory.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'mh-wa-esha-boutique-kharghar',
    name: "Esha Ladies Boutique",
    businessName: "Esha Ladies Boutique",
    phone: "+91 90823 65153",
    whatsapp: "+91 90823 65153",
    email: '',
    address: "Kharghar, Navi Mumbai, Maharashtra",
    category: "Retail & Shop",
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-esha-boutique-kharghar',
      date: '2026-11-03',
      note: 'ConnectTo public business profile lists a WhatsApp contact. No independent website link is shown on that profile; website absence has not been independently confirmed. Verify before outreach. Source: ConnectTo directory.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'mh-wa-as-tyres-kharghar',
    name: "A.S Tyres & Batteries",
    businessName: "A.S Tyres & Batteries",
    phone: "+91 87887 32847",
    whatsapp: "+91 87887 32847",
    email: '',
    address: "Kharghar, Navi Mumbai, Maharashtra",
    category: "Other",
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-as-tyres-kharghar',
      date: '2026-11-03',
      note: 'ConnectTo public business profile lists a WhatsApp contact. No independent website link is shown on that profile; website absence has not been independently confirmed. Verify before outreach. Source: ConnectTo directory.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'mh-wa-r2-salon-kamothe',
    name: "R2 Unisex Salon",
    businessName: "R2 Unisex Salon",
    phone: "+91 91521 75718",
    whatsapp: "+91 91521 75718",
    email: '',
    address: "Kamothe, Navi Mumbai, Maharashtra",
    category: "Salon & Beauty",
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-r2-salon-kamothe',
      date: '2026-11-03',
      note: 'ConnectTo public business profile lists a WhatsApp contact. No independent website link is shown on that profile; website absence has not been independently confirmed. Verify before outreach. Source: ConnectTo directory.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'mh-wa-gurudev-motors-nerul',
    name: "Gurudev Motors",
    businessName: "Gurudev Motors",
    phone: "+91 98200 61272",
    whatsapp: "+91 98200 61272",
    email: '',
    address: "Nerul, Navi Mumbai, Maharashtra",
    category: "Other",
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-gurudev-motors-nerul',
      date: '2026-11-03',
      note: 'ConnectTo public business profile lists a WhatsApp contact. No independent website link is shown on that profile; website absence has not been independently confirmed. Verify before outreach. Source: ConnectTo directory.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'mh-wa-dry-cleaning-vashi',
    name: "Dry Cleaning Vashi",
    businessName: "Dry Cleaning Service",
    phone: "+91 91376 80914",
    whatsapp: "+91 91376 80914",
    email: '',
    address: "Vashi, Navi Mumbai, Maharashtra",
    category: "Other",
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-dry-cleaning-vashi',
      date: '2026-11-03',
      note: 'ConnectTo public business profile lists a WhatsApp contact. No independent website link is shown on that profile; website absence has not been independently confirmed. Verify before outreach. Source: ConnectTo directory.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'mh-wa-spice-garden-kamothe',
    name: "The Spice Garden Restaurant",
    businessName: "The Spice Garden Restaurant",
    phone: "+91 86520 77077",
    whatsapp: "+91 86520 77077",
    email: '',
    address: "Kamothe, Navi Mumbai, Maharashtra",
    category: "Restaurant & Cafe",
    status: 'New',
    notesHistory: [{
      id: 'mh-wa-note-spice-garden-kamothe',
      date: '2026-11-03',
      note: 'ConnectTo public business profile lists a WhatsApp contact. No independent website link is shown on that profile; website absence has not been independently confirmed. Verify before outreach. Source: ConnectTo directory.',
      type: 'general',
    }],
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    clientName: 'Pooja Kulkarni',
    clientBusiness: 'Aura Silk Sarees & Boutique',
    clientPhone: '+91 99230 88991',
    clientEmail: 'auraboutique.pune@gmail.com',
    leadId: 'lead-4',
    projectName: 'Aura Silk Online Saree Store',
    selectedPackage: 'E-Commerce Online Store',
    startDate: '2026-10-22',
    deadline: '2026-11-06',
    stage: 'Development',
    progress: 75,
    totalAmount: 13999,
    advancePaid: 7000,
    remainingAmount: 6999,
    notes: 'Products catalog uploaded. Razorpay test mode working. Currently configuring shipping rates.',
    domainInfo: 'aurasilks.in (GoDaddy)',
    hostingPlatform: 'Vercel / Cloudflare',
    handoverStatus: 'Pending',
    liveUrl: 'https://aurasilks-preview.vercel.app',
    tasks: [
      { id: 'pt-1', title: 'Content & saree photos collection', completed: true },
      { id: 'pt-2', title: 'Catalog design & layout approval', completed: true },
      { id: 'pt-3', title: 'Payment gateway integration', completed: true },
      { id: 'pt-4', title: 'WhatsApp order notifications setup', completed: false },
      { id: 'pt-5', title: 'Final testing & client walkthrough', completed: false },
    ],
    createdAt: '2026-10-22',
    updatedAt: '2026-11-02',
  },
  {
    id: 'proj-2',
    clientName: 'Vikram Gaikwad',
    clientBusiness: 'Gaikwad Fitness Hub & Gym',
    clientPhone: '+91 97654 33221',
    clientEmail: 'vikram.gaikwad@fitnesshub.com',
    projectName: 'Gaikwad Fitness 5-Page Website',
    selectedPackage: 'Business Website',
    startDate: '2026-10-28',
    deadline: '2026-11-04',
    stage: 'Client Review',
    progress: 90,
    totalAmount: 4999,
    advancePaid: 2500,
    remainingAmount: 2499,
    notes: 'Draft shared with client. Vikram requested adding trainer certifications on about page.',
    domainInfo: 'gaikwadfitnesshub.com (Hostinger)',
    hostingPlatform: 'Hostinger Cloud',
    handoverStatus: 'Pending',
    liveUrl: 'https://gaikwadfitness.moti-preview.com',
    tasks: [
      { id: 'pt-6', title: 'Initial briefing & gym photos', completed: true },
      { id: 'pt-7', title: 'Membership plans table layout', completed: true },
      { id: 'pt-8', title: 'Trainer bio section updates', completed: true },
      { id: 'pt-9', title: 'Client final approval & signoff', completed: false },
      { id: 'pt-10', title: 'Final balance payment receipt', completed: false },
    ],
    createdAt: '2026-10-28',
    updatedAt: '2026-11-02',
  },
  {
    id: 'proj-3',
    clientName: 'Adv. Rameshwar Jagtap',
    clientBusiness: 'Jagtap Law Chambers',
    clientPhone: '+91 98229 11223',
    clientEmail: 'advocate.jagtap@gmail.com',
    projectName: 'Jagtap Law Firm Website',
    selectedPackage: 'Starter Website',
    startDate: '2026-10-15',
    deadline: '2026-10-20',
    stage: 'Delivered',
    progress: 100,
    totalAmount: 3499,
    advancePaid: 3499,
    remainingAmount: 0,
    notes: 'Delivered on time. Full payment received via UPI. Client gave 5-star review on Google.',
    domainInfo: 'jagtaplawchambers.in',
    hostingPlatform: 'Hostinger Shared Hosting',
    handoverStatus: 'Delivered',
    deliveryDate: '2026-10-20',
    supportNotes: 'Annual renewal due in October 2027.',
    liveUrl: 'https://jagtaplawchambers.in',
    tasks: [
      { id: 'pt-11', title: 'Practice areas writeup', completed: true },
      { id: 'pt-12', title: 'Single page design & layout', completed: true },
      { id: 'pt-13', title: 'Legal disclaimer & contact form', completed: true },
      { id: 'pt-14', title: 'Domain DNS pointing & SSL', completed: true },
      { id: 'pt-15', title: 'Credentials handover & tutorial', completed: true },
    ],
    createdAt: '2026-10-15',
    updatedAt: '2026-10-20',
  },
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'quote-1',
    quoteNumber: 'Q-2026-001',
    leadId: 'lead-2',
    clientName: 'Dr. Neha Deshmukh',
    clientBusiness: 'Deshmukh Dental Clinic & Implant Care',
    clientPhone: '+91 94220 12345',
    clientEmail: 'drneha.dental@yahoo.com',
    clientAddress: 'Deccan Gymkhana, Pune',
    planId: 'business',
    planName: 'Business Website Package',
    basePrice: 4999,
    addons: [
      { id: 'addon-seo', name: 'Google Business Profile Local SEO Setup', price: 999, selected: true },
      { id: 'addon-wa', name: 'WhatsApp Appointment Booking Bot', price: 500, selected: true },
    ],
    discount: 500,
    finalPrice: 5998,
    advanceAmount: 2999,
    remainingAmount: 2999,
    timeline: '5 Business Days from advance receipt',
    deliverables: [
      '5 Custom Designed Pages (Home, About Doctors, Dental Treatments, Clinic Gallery, Contact)',
      '1-Click WhatsApp Dental Appointment Booking Form',
      'Doctor Timings & Holiday Notice Board',
      'Google Maps Directions & Reviews Widget',
      'Mobile Responsive & Fast Load Time Guarantee',
      '1 Month Free Technical Support & Minor Tweaks',
    ],
    terms: [
      '50% advance (₹2,999) to initiate design and reserve development schedule.',
      'Remaining 50% (₹2,999) due upon client review approval prior to domain pointing.',
      'Content, doctor photos, and clinic address to be provided by client.',
      'Domain and hosting renewal costs apply after 1 year.',
    ],
    status: 'Sent',
    createdAt: '2026-10-31',
    validUntil: '2026-11-14',
  },
  {
    id: 'quote-2',
    quoteNumber: 'Q-2026-002',
    clientName: 'Sunil Jagdale',
    clientBusiness: 'Jagdale Sweet Mart & Bakers',
    clientPhone: '+91 98224 66778',
    clientEmail: 'jagdale.sweets@gmail.com',
    clientAddress: 'Hadapsar, Pune',
    planId: 'starter',
    planName: 'Starter Website Package',
    basePrice: 2999,
    addons: [],
    discount: 0,
    finalPrice: 2999,
    advanceAmount: 1500,
    remainingAmount: 1499,
    timeline: '3 Days from content receipt',
    deliverables: [
      'Single Page High-Converting Food & Sweet Mart Landing Website',
      'Digital Sweet & Snack Price Menu',
      'WhatsApp Order Placement Button',
      'Google Map Location & Call Us Action',
    ],
    terms: [
      '50% advance to start.',
      'Delivery within 3 working days.',
    ],
    status: 'Draft',
    createdAt: '2026-11-01',
    validUntil: '2026-11-15',
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    projectId: 'proj-1',
    clientName: 'Pooja Kulkarni',
    projectName: 'Aura Silk Online Saree Store',
    amount: 7000,
    paymentType: 'Advance',
    paymentMethod: 'UPI',
    paymentDate: '2026-10-22',
    utrOrRef: 'UPI/429810398412',
    notes: '50% project advance received via GPay.',
    createdAt: '2026-10-22',
  },
  {
    id: 'pay-2',
    projectId: 'proj-2',
    clientName: 'Vikram Gaikwad',
    projectName: 'Gaikwad Fitness 5-Page Website',
    amount: 2500,
    paymentType: 'Advance',
    paymentMethod: 'UPI',
    paymentDate: '2026-10-28',
    utrOrRef: 'UPI/430198442119',
    notes: 'Advance 50% received via PhonePe.',
    createdAt: '2026-10-28',
  },
  {
    id: 'pay-3',
    projectId: 'proj-3',
    clientName: 'Adv. Rameshwar Jagtap',
    projectName: 'Jagtap Law Firm Website',
    amount: 1750,
    paymentType: 'Advance',
    paymentMethod: 'Bank Transfer',
    paymentDate: '2026-10-15',
    utrOrRef: 'IMPS/NEFT00881923',
    notes: 'Initial deposit.',
    createdAt: '2026-10-15',
  },
  {
    id: 'pay-4',
    projectId: 'proj-3',
    clientName: 'Adv. Rameshwar Jagtap',
    projectName: 'Jagtap Law Firm Website',
    amount: 1749,
    paymentType: 'Remaining',
    paymentMethod: 'UPI',
    paymentDate: '2026-10-20',
    utrOrRef: 'UPI/429400291844',
    notes: 'Final balance paid upon delivery & handover.',
    createdAt: '2026-10-20',
  },
];

export const INITIAL_TASKS: AgencyTask[] = [
  {
    id: 'task-1',
    title: 'Call Dr. Neha Deshmukh for Dental Quotation follow-up',
    description: 'Discuss Quotation Q-2026-001 and answer questions regarding Google Local SEO addon.',
    dueDate: '2026-11-03',
    dueTime: '04:30 PM',
    priority: 'High',
    relatedClientId: 'lead-2',
    relatedClientName: 'Dr. Neha Deshmukh',
    status: 'Pending',
    createdAt: '2026-10-31',
  },
  {
    id: 'task-2',
    title: 'Send WhatsApp reminder for Patil Classes advance payment',
    description: 'Use the Marathi payment advance template to confirm booking for Wednesday start.',
    dueDate: '2026-11-04',
    dueTime: '11:00 AM',
    priority: 'Medium',
    relatedClientId: 'lead-1',
    relatedClientName: 'Sachin Patil',
    status: 'Pending',
    createdAt: '2026-11-01',
  },
  {
    id: 'task-3',
    title: 'Complete payment gateway test on Aura Silk Store',
    description: 'Run test transaction with Razorpay test keys and check mobile cart checkout flow.',
    dueDate: '2026-11-03',
    dueTime: '06:00 PM',
    priority: 'High',
    relatedProjectId: 'proj-1',
    relatedClientName: 'Pooja Kulkarni',
    status: 'Pending',
    createdAt: '2026-11-02',
  },
  {
    id: 'task-4',
    title: 'Send final approval draft to Vikram Gaikwad (Fitness Hub)',
    description: 'Collect trainer bio photos and finalize remaining balance invoice.',
    dueDate: '2026-11-04',
    dueTime: '01:00 PM',
    priority: 'Medium',
    relatedProjectId: 'proj-2',
    relatedClientName: 'Vikram Gaikwad',
    status: 'Pending',
    createdAt: '2026-11-02',
  },
  {
    id: 'task-5',
    title: 'Review Google Search Console indexing for Jagtap Law Chambers',
    description: 'Confirm sitemap is submitted and green on Google Search Console.',
    dueDate: '2026-11-02',
    dueTime: '08:00 PM',
    priority: 'Low',
    relatedProjectId: 'proj-3',
    relatedClientName: 'Adv. Rameshwar Jagtap',
    status: 'Completed',
    createdAt: '2026-10-21',
  },
];
