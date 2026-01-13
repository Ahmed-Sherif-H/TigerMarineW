import { motion } from 'framer-motion';

const About = () => {
  const milestones = [
    {
      year: "1996",
      title: "Foundation",
      description: "Founded in Cairo, Egypt as a small workshop with only 6 workers. Created a market for inflatable boats in Egypt, starting from zero market sales."
    },
    {
      year: "1997",
      title: "Production Begins",
      description: "Production began with fully inflatable boat models."
    },
    {
      year: "1998",
      title: "First Export & Expansion",
      description: "First export of boats was made. Moved to a new facility spanning 2000 Sq. meters and employing 30 workers."
    },
    {
      year: "1999",
      title: "First RIB Production",
      description: "First RIB (Rigid Inflatable Boat) production was introduced, featuring a boat of 4.8 meters."
    },
    {
      year: "2000",
      title: "European Dealer Network",
      description: "A new dealer network was established in Europe."
    },
    {
      year: "2001",
      title: "Market Leadership",
      description: "Became the number one supplier for the Navy, police, and diving market in Egypt."
    },
    {
      year: "2003",
      title: "First Best-Seller",
      description: "The first best-seller, the 650 TopLine, was introduced."
    },
    {
      year: "2004",
      title: "Hypalon Fabric Tubes",
      description: "Manufacturing of Hypalon fabric tubes commenced."
    },
    {
      year: "2005",
      title: "First Generation RIBs",
      description: "The first generation of the RIBs model range was created."
    },
    {
      year: "2006",
      title: "Dusseldorf Boat Show",
      description: "Participated for the first time in the Dusseldorf boat show."
    },
    {
      year: "2007",
      title: "European Components",
      description: "Shift towards using European components for the entire product range."
    },
    {
      year: "2008",
      title: "Larger Facility",
      description: "Moved to a new, larger facility of 5000 Sq. meters."
    },
    {
      year: "2009",
      title: "Production Milestone",
      description: "Production capacity reached 300 boats per year."
    },
    {
      year: "2010",
      title: "New Markets",
      description: "New markets were opened in Australia and Asia."
    },
    {
      year: "2011",
      title: "European Hub",
      description: "A new European hub was opened in Rotterdam, in collaboration with Tiger Marine Center."
    },
    {
      year: "2012",
      title: "Second Generation Models",
      description: "The second generation of the models range was introduced."
    },
    {
      year: "2013",
      title: "Larger Models",
      description: "New, larger models with more sophisticated designs were added."
    },
    {
      year: "2015",
      title: "28 Models in Production",
      description: "Reached 28 models in production across all model categories."
    },
    {
      year: "2016",
      title: "European Success",
      description: "Achieved more production, more export, and more success in new European markets."
    },
    {
      year: "2018",
      title: "IMCI Certification",
      description: "All models received IMCI (International Marine Certification Institute) certification with category C."
    },
    {
      year: "2019",
      title: "Fiberglass Production & Third Generation",
      description: "A new 4000 Sq. meters facility was added specifically for fiberglass production. The third generation of models was introduced."
    },
    {
      year: "2020",
      title: "Worldwide Dealer Network",
      description: "A full worldwide dealer network became operational."
    },
    {
      year: "2021",
      title: "Large Operation Facility",
      description: "Large operation facility and management were added."
    },
    {
      year: "2022",
      title: "10,000 Boats Sold",
      description: "Sales reached 10,000 boats."
    },
    {
      year: "2023",
      title: "Fourth Generation Models",
      description: "The fourth generation of models was introduced, with the existing range built in CAD 3D."
    },
    {
      year: "2024",
      title: "Growing Workforce",
      description: "The workforce reached 120 workers across both factories."
    },
    {
      year: "2025",
      title: "MAXLINE Series",
      description: "The new MAXLINE series of cabin RIBs, including a 38-footer, was introduced."
    },
    {
      year: "2026",
      title: "Full GRP Range",
      description: "The full GRP (Glass Reinforced Plastic) range was added to Tiger Marine for the first time ever."
    }
  ];

  const values = [
    {
      title: "Excellence",
      description: "We never compromise on quality, ensuring every boats meets the highest standards of craftsmanship and performance.",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      title: "Innovation",
      description: "We continuously push the boundaries of marine engineering and design to create cutting-edge boats.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z"
    },
    {
      title: "Heritage",
      description: "Our 25-year legacy of maritime excellence guides every decision and design choice we make.",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    },
    {
      title: "Service",
      description: "We provide exceptional service and support throughout the entire ownership experience.",
      icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-r from-navy to-navy-dark">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-light mb-6"
          >
            About Tiger Marine
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto"
          >
            For almost 30 years, we have been crafting the world's most luxurious boats, 
            combining traditional craftsmanship with cutting-edge technology.
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded in 1996, Tiger Marine has over two decades of expertise in inflatable boat manufacturing. Our long-standing experience is reflected in every detail — from superior performance on the water to uncompromising build quality.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Each Tiger Marine boat is engineered using only premium European components, carefully selected from the most trusted manufacturers in the industry. This commitment ensures full compliance with CE regulations and guarantees outstanding value, durability, and safety for our customers.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our commitment to excellence extends beyond the vessels we build. We 
                provide comprehensive support throughout the entire ownership experience, 
                ensuring that every Tiger Marine yacht continues to deliver exceptional 
                performance and satisfaction for years to come.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden">
                <img
                  src="/images/Factory.jpg"
                  alt="Tiger Marine Factory"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gold rounded-full opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do, from design and construction 
              to customer service and support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-midnight-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-midnight-slate mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three decades of growth, innovation, and excellence in maritime manufacturing.
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            {/* Vertical Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-smoked-saffron via-gold to-smoked-saffron"></div>
            
            {/* Group milestones by periods */}
            {[
              {
                period: "1996-2000",
                title: "Foundation Years",
                milestones: milestones.filter(m => parseInt(m.year) >= 1996 && parseInt(m.year) <= 2000)
              },
              {
                period: "2001-2010",
                title: "Growth Phase",
                milestones: milestones.filter(m => parseInt(m.year) >= 2001 && parseInt(m.year) <= 2010)
              },
              {
                period: "2011-2020",
                title: "Global Expansion",
                milestones: milestones.filter(m => parseInt(m.year) >= 2011 && parseInt(m.year) <= 2020)
              },
              {
                period: "2021-2026",
                title: "Innovation Era",
                milestones: milestones.filter(m => parseInt(m.year) >= 2021)
              }
            ].map((periodGroup, periodIndex) => (
              <div key={periodIndex} className="mb-8">
                {/* Period Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative mb-4"
                >
                  <div className="text-center mb-3">
                    <h3 className="text-xl md:text-2xl font-semibold text-midnight-slate mb-1">
                      {periodGroup.title}
                    </h3>
                    <p className="text-sm text-gray-500">{periodGroup.period}</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-12 h-12 bg-smoked-saffron rounded-full border-4 border-white shadow-lg flex items-center justify-center z-20">
                      <span className="text-white font-bold text-xs">{periodGroup.period.split('-')[0]}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Period Milestones */}
                <div className="space-y-2">
                  {periodGroup.milestones.map((milestone, index) => {
                    const globalIndex = milestones.indexOf(milestone);
                    return (
                      <motion.div
                        key={milestone.year}
                        initial={{ opacity: 0, x: globalIndex % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.03 }}
                        viewport={{ once: true }}
                        className={`relative flex items-center ${
                          globalIndex % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                        }`}
                      >
                        {/* Content Card */}
                        <div className={`w-[48%] ${globalIndex % 2 === 0 ? 'pr-6 text-right' : 'pl-6 text-left'}`}>
                          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3 border-l-2 border-smoked-saffron">
                            <div className={`flex items-center gap-2 mb-1 ${globalIndex % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs font-bold text-smoked-saffron">{milestone.year}</span>
                              <h4 className="text-xs md:text-sm font-semibold text-midnight-slate">
                                {milestone.title}
                              </h4>
                            </div>
                            <p className="text-xs text-gray-600 leading-snug">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Timeline Dot */}
                        <div className="relative z-10 flex-shrink-0 w-[4%] flex items-center justify-center">
                          <div className="w-3 h-3 bg-smoked-saffron rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        
                        {/* Empty space for alternating layout */}
                        <div className="w-[48%]"></div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our world-class team of designers, engineers, and craftsmen brings 
              decades of experience and passion to every project.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Design Excellence",
                description: "Our design team combines artistic vision with marine engineering expertise to create yachts that are both beautiful and functional."
              },
              {
                name: "Engineering Innovation",
                description: "Our engineers push the boundaries of what's possible, incorporating the latest technologies and materials into every vessel."
              },
              {
                name: "Craftsmanship",
                description: "Our skilled craftsmen bring decades of experience to every detail, ensuring the highest quality in every component."
              }
            ].map((team, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <div className="w-20 h-20 bg-gold rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-midnight-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-midnight-slate mb-4">{team.name}</h3>
                <p className="text-gray-600">{team.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-navy text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Experience Tiger Marine
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover the difference that 25 years of maritime excellence can make. 
              Contact us today to learn more about our yachts and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/models"
                className="btn-secondary text-lg px-8 py-4 hover:scale-105 transform transition-all duration-300"
              >
                View Our Models
              </a>
              <a
                href="/contact"
                className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-midnight-slate transform transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

