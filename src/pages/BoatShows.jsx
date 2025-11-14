import { motion } from 'framer-motion';

const BoatShows = () => {
  const boatShows = [
    {
      id: 1,
      name: 'Monaco Yacht Show',
      location: 'Monaco',
      date: 'September 2024',
      description: 'The world\'s most prestigious superyacht show featuring Tiger Marine\'s finest vessels.'
    },
    {
      id: 2,
      name: 'Fort Lauderdale International Boat Show',
      location: 'Fort Lauderdale, FL',
      date: 'October 2024',
      description: 'The largest in-water boat show in the world, showcasing Tiger Marine\'s complete collection.'
    },
    {
      id: 3,
      name: 'Dubai International Boat Show',
      location: 'Dubai, UAE',
      date: 'November 2024',
      description: 'Exclusive showcase of Tiger Marine\'s luxury yachts in the heart of the Middle East.'
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
            Boat Shows
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto"
          >
            Visit us at prestigious boat shows around the world.
          </motion.p>
        </div>
      </section>

      {/* Upcoming Shows */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Upcoming Boat Shows
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience Tiger Marine firsthand at these prestigious events.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boatShows.map((show, index) => (
              <motion.div
                key={show.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-midnight-slate mb-3">{show.name}</h3>
                  <p className="text-gold font-medium mb-2">{show.location}</p>
                  <p className="text-gray-600 mb-4">{show.date}</p>
                  <p className="text-gray-600 leading-relaxed">{show.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
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
              Want to Schedule a Visit?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Contact us to arrange a private viewing at an upcoming boat show.
            </p>
            <a
              href="/contact"
              className="btn-secondary text-lg px-8 py-4 hover:scale-105 transform transition-all duration-300"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BoatShows;

