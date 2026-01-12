import { motion } from 'framer-motion';

const About = () => {
  const milestones = [
    {
      year: "1996",
      title: "Foundation",
      location: "Cairo, Egypt",
      description: "Tiger Marine was founded in Cairo, Egypt, marking the beginning of our journey in inflatable boat manufacturing."
    },
    {
      year: "2005",
      title: "First Flagship",
      description: "The historic 650TL was launched, setting new standards in luxury yachting and establishing our reputation for excellence."
    },
    {
      year: "2012",
      title: "Global Expansion",
      description: "Established a full network of international dealers, bringing Tiger Marine boats to customers worldwide."
    },
    {
      year: "2018",
      title: "New Range Introduction",
      description: "A new range of boats was introduced, expanding our collection with innovative designs and advanced features."
    },
    {
      year: "2023",
      title: "10,000 Boats Delivered",
      description: "Celebrated a major milestone with the delivery of our 10,000th boat, demonstrating our commitment to quality and customer satisfaction."
    },
    {
      year: "2025",
      title: "Super Luxury Models",
      description: "Introducing a new line of super luxury models, pushing the boundaries of design and performance."
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
                  src="/api/placeholder/800/600"
                  alt="Tiger Marine History"
                  className="w-full h-full object-cover"
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
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our 25-year history of maritime excellence.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gold"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <div className="text-3xl font-bold text-gold mb-2">{milestone.year}</div>
                      <h3 className="text-2xl font-semibold text-midnight-slate mb-2">{milestone.title}</h3>
                      {milestone.location && (
                        <p className="text-sm text-gray-500 mb-3">{milestone.location}</p>
                      )}
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 bg-gold rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
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

