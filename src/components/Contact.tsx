
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon } from 'lucide-react';
import { useState } from 'react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactMethods = [
    {
      icon: MailIcon,
      title: 'Email Us',
      value: 'support@stockfx.com',
      color: 'primary',
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      value: '+1 (555) 123-4567',
      color: 'accent',
    },
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      value: 'San Francisco, CA',
      color: 'primary',
    },
  ];

  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100/20 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-slideInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="block text-dark-950">Get In Touch</span>
            <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              We'd Love to Hear From You
            </span>
          </h2>
          <p className="text-lg text-dark-600 max-w-2xl mx-auto">
            Have a question or want to discuss partnership opportunities? 
            Reach out to us anytime and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map(({ icon: Icon, title, value, color }) => (
            <div
              key={title}
              className="group p-8 rounded-2xl border border-dark-100 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                color === 'primary' 
                  ? 'bg-primary-100 group-hover:bg-primary-600 text-primary-600 group-hover:text-white' 
                  : 'bg-accent-100 group-hover:bg-accent-600 text-accent-600 group-hover:text-white'
              }`}>
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-dark-950 mb-2">{title}</h3>
              <p className="text-dark-600 group-hover:text-dark-900 transition-colors duration-300">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-dark-100 p-8 md:p-12 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-dark-950 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 border-2 border-dark-200 rounded-xl focus:outline-none focus:border-primary-600 focus:bg-primary-50 transition-all duration-200 text-dark-950 placeholder-dark-400"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-dark-950 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 border-2 border-dark-200 rounded-xl focus:outline-none focus:border-primary-600 focus:bg-primary-50 transition-all duration-200 text-dark-950 placeholder-dark-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-dark-950 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 border-2 border-dark-200 rounded-xl focus:outline-none focus:border-primary-600 focus:bg-primary-50 transition-all duration-200 text-dark-950 placeholder-dark-400"
                  placeholder="How can we help?"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-dark-950 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-dark-200 rounded-xl focus:outline-none focus:border-primary-600 focus:bg-primary-50 transition-all duration-200 text-dark-950 placeholder-dark-400 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <SendIcon size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>

              {/* Privacy Notice */}
              <p className="text-xs text-dark-500 text-center pt-2">
                We respect your privacy. Your information will never be shared or sold.
              </p>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-primary-50 border border-primary-200 rounded-2xl text-center">
            <p className="text-dark-700">
              <span className="font-semibold">Expected Response Time:</span>{' '}
              <span className="text-primary-600">Within 24 hours</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};