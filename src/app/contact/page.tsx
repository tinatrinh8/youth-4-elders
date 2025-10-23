export default function Contact() {
  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">Contact Us</h1>
        
        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">How can I join Youth 4 Elders?</h3>
              <p className="text-gray-700 leading-relaxed">
                Simply reach out to us via email or Instagram! We welcome all uOttawa students who are passionate about bridging generational gaps and making a positive impact in our community.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">What activities do you organize?</h3>
              <p className="text-gray-700 leading-relaxed">
                We organize workshops, storytelling sessions, technology help sessions, craft fairs, and various intergenerational activities that bring youth and elders together.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Do I need any special skills to participate?</h3>
              <p className="text-gray-700 leading-relaxed">
                Not at all! We value enthusiasm, empathy, and a willingness to learn. Whether you&apos;re tech-savvy, crafty, or just great at listening, there&apos;s a place for you here.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">How often do you meet?</h3>
              <p className="text-gray-700 leading-relaxed">
                We organize events throughout the semester and meet regularly for planning sessions. Follow us on Instagram for the latest updates on upcoming events and meetings.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="bg-white/80 backdrop-blur-sm border border-pink-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold mb-6 text-center">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Have a question or want to collaborate? We&apos;d love to hear from you.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <a 
                  href="mailto:youth4elders@gmail.com"
                  className="text-pink-600 hover:text-pink-700 transition-colors text-lg"
                >
                  youth4elders@gmail.com
                </a>
                <p className="text-gray-600 mt-2">We typically respond within 24 hours</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
                <a 
                  href="https://www.instagram.com/youth4elders/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 transition-colors text-lg"
                >
                  @youth4elders
                </a>
                <p className="text-gray-600 mt-2">Stay updated with our latest events and activities</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
