
import { CodeIcon, PenToolIcon, GlobeIcon, LayersIcon } from 'lucide-react';
export const Skills = () => {
  const skills = [
  {
    category: 'Frontend Development',
    icon: <CodeIcon size={24} className="text-red-700" />,
    items: [
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Next.js',
    'Responsive Design']

  },
  {
    category: 'Design',
    icon: <PenToolIcon size={24} className="text-red-700" />,
    items: [
    'UI/UX Design',
    'Figma',
    'Adobe Creative Suite',
    'Typography',
    'Color Theory']

  },
  {
    category: 'Languages',
    icon: <GlobeIcon size={24} className="text-red-700" />,
    items: [
    'Japanese (Native)',
    'English (Fluent)',
    'HTML/CSS',
    'JavaScript',
    'Python']

  },
  {
    category: 'Other Skills',
    icon: <LayersIcon size={24} className="text-red-700" />,
    items: [
    'Git & Version Control',
    'SEO Fundamentals',
    'Performance Optimization',
    'Accessibility',
    'Content Strategy']

  }];

  return (
    <section id="skills" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-stone-800 mb-2 inline-block border-b-2 border-red-700 pb-1">
            My Skills
          </h2>
          <p className="text-sm text-stone-500">スキル</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skillGroup, index) =>
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300">

              <div className="flex items-center mb-4">
                {skillGroup.icon}
                <h3 className="text-lg text-stone-800 ml-2">
                  {skillGroup.category}
                </h3>
              </div>
              <ul className="space-y-2">
                {skillGroup.items.map((skill, idx) =>
              <li key={idx} className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-900/80 rounded-full mr-2"></span>
                    <span className="text-stone-600">{skill}</span>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>);

};