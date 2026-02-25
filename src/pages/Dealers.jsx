import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import api from '../services/api';

// Map Component - Interactive map showing dealer locations
const DealersMap = ({ dealers }) => {
  // Create a list of all dealer addresses for the map
  const dealerAddresses = dealers
    .filter(d => d.address)
    .map(d => `${d.address}, ${d.country}`);

  // Create Google Maps search URL (works without API key for external link)
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Tiger Marine Dealers Worldwide')}`;
  
  // Create individual dealer links
  const dealerLinks = dealerAddresses.map((address, index) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    return { address, url, id: index };
  });

  return (
    <div className="w-full h-full relative bg-gray-100">
      {/* Google Maps iframe - Using search view (no API key required) */}
      <iframe
        src={`https://www.google.com/maps?q=${encodeURIComponent('Tiger Marine Dealers')}&hl=en&z=2&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
        title="Dealers Map"
      />
      
      {/* Overlay with dealer count and links */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
        <h3 className="font-semibold text-midnight-slate mb-2">Dealer Locations</h3>
        <p className="text-sm text-gray-600 mb-3">
          {dealers.length} dealer{dealers.length !== 1 ? 's' : ''} worldwide
        </p>
        <a
          href={mapSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-smoked-saffron hover:text-midnight-slate transition-colors font-medium mb-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View all locations in Google Maps
        </a>
        {dealerLinks.length > 0 && dealerLinks.length <= 5 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Quick links:</p>
            <div className="space-y-1">
              {dealerLinks.slice(0, 5).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-gray-600 hover:text-smoked-saffron transition-colors truncate"
                  title={link.address}
                >
                  {link.address.split(',')[0]}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dealers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [expandedCountries, setExpandedCountries] = useState(new Set());
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dealers from API
  useEffect(() => {
    const loadDealers = async () => {
      try {
        setLoading(true);
        const dealersData = await api.getAllDealers();
        console.log('[Dealers] Raw API response:', dealersData);
        console.log('[Dealers] Response type:', typeof dealersData);
        console.log('[Dealers] Is array:', Array.isArray(dealersData));
        console.log('[Dealers] Response stringified:', JSON.stringify(dealersData, null, 2));
        
        // Handle both array response and { data: [...] } response format
        let dealersList = [];
        if (Array.isArray(dealersData)) {
          dealersList = dealersData;
          console.log('[Dealers] Response is array, length:', dealersList.length);
        } else if (dealersData && typeof dealersData === 'object') {
          if (dealersData.data !== undefined) {
            dealersList = Array.isArray(dealersData.data) ? dealersData.data : [];
            console.log('[Dealers] Response has data property, length:', dealersList.length);
          } else if (dealersData.dealers !== undefined) {
            dealersList = Array.isArray(dealersData.dealers) ? dealersData.dealers : [];
            console.log('[Dealers] Response has dealers property, length:', dealersList.length);
          } else {
            // Single object, wrap in array
            dealersList = [dealersData];
            console.log('[Dealers] Response is single object, wrapping in array');
          }
        } else if (dealersData === null || dealersData === undefined) {
          console.warn('[Dealers] Response is null or undefined');
          dealersList = [];
        } else {
          console.warn('[Dealers] Unexpected response format:', dealersData);
          dealersList = [];
        }
        
        console.log('[Dealers] Final processed dealers list:', dealersList);
        console.log('[Dealers] Number of dealers:', dealersList.length);
        if (dealersList.length > 0) {
          console.log('[Dealers] First dealer sample:', dealersList[0]);
        }
        setDealers(dealersList);
        setError(null);
      } catch (error) {
        console.error('[Dealers] Error loading dealers:', error);
        console.error('[Dealers] Error details:', {
          message: error.message,
          stack: error.stack
        });
        setDealers([]);
        setError(error.message || 'Failed to load dealers');
      } finally {
        setLoading(false);
      }
    };

    loadDealers();
  }, []);

  // Get unique countries
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(dealers.map(d => d.country))].sort();
    return ['All', ...uniqueCountries];
  }, [dealers]);

  // Filter dealers
  const filteredDealers = useMemo(() => {
    if (!dealers || dealers.length === 0) return [];
    
    return dealers.filter(dealer => {
      // Handle search term - if empty or just whitespace, match all
      const searchLower = searchTerm.trim().toLowerCase();
      const matchesSearch = 
        !searchLower || // If no search term, show all
        dealer.company?.toLowerCase().includes(searchLower) ||
        dealer.country?.toLowerCase().includes(searchLower) ||
        dealer.address?.toLowerCase().includes(searchLower);
      
      // Handle country filter - 'All' means show all countries
      const matchesCountry = selectedCountry === 'All' || dealer.country === selectedCountry;
      
      return matchesSearch && matchesCountry;
    });
  }, [dealers, searchTerm, selectedCountry]);

  // Group dealers by country
  const dealersByCountry = useMemo(() => {
    const grouped = {};
    filteredDealers.forEach(dealer => {
      if (!grouped[dealer.country]) {
        grouped[dealer.country] = [];
      }
      grouped[dealer.country].push(dealer);
    });
    return grouped;
  }, [filteredDealers]);

  // Auto-expand all countries when filtered dealers change
  useEffect(() => {
    const countries = Object.keys(dealersByCountry);
    if (countries.length > 0) {
      setExpandedCountries(new Set(countries));
    }
  }, [dealersByCountry]);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-r from-midnight-slate to-gray-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-light mb-6"
          >
            Global Dealers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto"
          >
            Find your nearest Tiger Marine dealer and experience our luxury boats 
            with personalized service and support.
          </motion.p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by company, country, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-smoked-saffron focus:border-transparent"
              />
            </div>
            
            {/* Country Filter */}
            <div className="md:w-64">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-smoked-saffron focus:border-transparent bg-white"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <p className="text-gray-600 mb-8">
              Showing {filteredDealers.length} dealer{filteredDealers.length !== 1 ? 's' : ''} 
              {dealers.length > 0 && ` (out of ${dealers.length} total)`}
            </p>
          )}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-800">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Dealers List - New Compact Design */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smoked-saffron mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Loading dealers...</p>
            </div>
          ) : dealers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-4">No dealers found.</p>
              {error ? (
                <p className="text-red-600">Error: {error}</p>
              ) : (
                <p className="text-gray-500">Please check your backend connection.</p>
              )}
            </div>
          ) : Object.keys(dealersByCountry).length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No dealers found matching your search.</p>
              <p className="text-sm text-gray-500 mt-2">Total dealers loaded: {dealers.length}</p>
            </div>
          ) : (
              <div className="space-y-4">
              {Object.entries(dealersByCountry).map(([country, countryDealers], countryIndex) => {
                const isExpanded = expandedCountries.has(country);
                return (
                <motion.div
                  key={country}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: countryIndex * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Country Header - Clickable Dropdown */}
                  <button
                    onClick={() => {
                      const newExpanded = new Set(expandedCountries);
                      if (isExpanded) {
                        newExpanded.delete(country);
                      } else {
                        newExpanded.add(country);
                      }
                      setExpandedCountries(newExpanded);
                    }}
                    className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-midnight-slate">
                        {country}
                      </h2>
                      <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        {countryDealers.length} dealer{countryDealers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dealers Grid - Collapsible */}
                  {isExpanded && (
                    <div className="p-4">
                      <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                      >
                        {countryDealers.map((dealer, index) => (
                          <motion.div
                            key={dealer.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-smoked-saffron hover:shadow-sm transition-all duration-200"
                          >
                            <h3 className="text-sm font-semibold text-midnight-slate mb-2 line-clamp-1">
                              {dealer.company}
                            </h3>

                            <div className="space-y-1.5 text-xs">
                            {dealer.address && (
                              <div className="flex items-start gap-1.5">
                                <svg className="w-3 h-3 text-smoked-saffron mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-gray-600 leading-tight line-clamp-2">{dealer.address}</span>
                              </div>
                            )}
                          
                            {dealer.telephone && (
                              <div className="flex items-center gap-1.5">
                                <svg className="w-3 h-3 text-smoked-saffron flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href={`tel:${dealer.telephone}`} className="text-gray-600 hover:text-smoked-saffron transition-colors text-xs">
                                  {dealer.telephone}
                                </a>
                              </div>
                            )}

                            {dealer.fax && (
                              <div className="flex items-center gap-1.5">
                                <svg className="w-3 h-3 text-smoked-saffron flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                <span className="text-gray-600 text-xs">{dealer.fax}</span>
                              </div>
                            )}

                            {dealer.email && (
                              <div className="flex items-center gap-1.5">
                                <svg className="w-3 h-3 text-smoked-saffron flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href={`mailto:${dealer.email}`} className="text-gray-600 hover:text-smoked-saffron transition-colors break-all text-xs line-clamp-1">
                                  {dealer.email}
                                </a>
                              </div>
                            )}

                            {dealer.website && (
                              <div className="flex items-center gap-1.5">
                                <svg className="w-3 h-3 text-smoked-saffron flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                <a
                                  href={dealer.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 hover:text-smoked-saffron transition-colors break-all text-xs line-clamp-1"
                                >
                                  {dealer.website.replace(/^https?:\/\//, '')}
                                </a>
                              </div>
                            )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
                );
              })}
              </div>
          )}
        </div>
      </section>


      {/* Map Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Find Us Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our global presence ensures you can experience Tiger Marine luxury 
              wherever your adventures take you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="aspect-video bg-gray-100 relative">
              <DealersMap dealers={dealers} />
            </div>
          </motion.div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Click on the map markers to see dealer locations. Use the search and filter above to find specific dealers.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
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
              Dealer Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our authorized dealers provide comprehensive services to support 
              your Tiger Marine experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              {
                title: "Sales & Consultation",
                description: "Expert guidance in selecting the perfect yacht for your needs",
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              },
             {
                title: "Service & Maintenance",
                description: "Professional maintenance and repair services by certified technicians",
                icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              },
             /* {
                title: "Customization",
                description: "Personalize your yacht with custom colors, fabrics, and finishes",
                icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
              },
              {
                title: "Training & Support",
                description: "Comprehensive training programs for safe and confident operation",
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              }*/
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-midnight-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-midnight-slate mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
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
              Ready to Visit a Dealer?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Contact your nearest dealer to schedule a viewing, test drive, 
              or consultation about your next Tiger Marine boat.
            </p>
            <a
              href="/contact"
              className="btn-secondary text-lg px-8 py-4 hover:scale-105 transform transition-all duration-300"
            >
              Contact a Dealer
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Dealers;

