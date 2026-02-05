
import { ExternalLinkIcon } from 'lucide-react';
export const Projects = () => {
  const projects = [
  {
    title: 'Zen Garden App',
    description:
    'A meditation and mindfulness application inspired by Japanese zen gardens.',
    image:
    'https://media.istockphoto.com/id/104665657/photo/japanese-room-with-a-view.jpg?s=612x612&w=0&k=20&c=aKlihPjrvPuwOK1Mp3RBUky2LvUF_AFJDiwnDWxHNeo=',
    tags: ['React Native', 'Firebase', 'UX Design']
  },
  {
    title: 'Wabi-Sabi Portfolio',
    description:
    'A minimalist portfolio template celebrating the beauty of imperfection.',
    image:
    'https://images.unsplash.com/photo-1616628188550-808682f3926d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    tags: ['HTML/CSS', 'JavaScript', 'Responsive']
  },
  {
    title: 'Ikigai Planner',
    description:
    'A productivity tool based on the Japanese concept of purpose and fulfillment.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    tags: ['React', 'Node.js', 'MongoDB']
  },
  {
    title: 'Shodo Learning Platform',
    description:
    'An interactive website for learning Japanese calligraphy fundamentals.',
    image:
    'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    tags: ['Next.js', 'Canvas API', 'Tailwind CSS']
  }];

  return (
    <section id="projects" className="py-16 bg-stone-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-stone-800 mb-2 inline-block border-b-2 border-red-700 pb-1">
            Projects
          </h2>
          <p className="text-sm text-stone-500">プロジェクト</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) =>
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">

              <div className="aspect-video relative overflow-hidden">
                <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <a href="#" className="text-white flex items-center">
                    View Project <ExternalLinkIcon size={16} className="ml-1" />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl text-stone-800 mb-2">{project.title}</h3>
                <p className="text-stone-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) =>
                <span
                  key={idx}
                  className="px-3 py-1 bg-indigo-900/10 text-indigo-900 text-sm rounded-full">

                      {tag}
                    </span>
                )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};