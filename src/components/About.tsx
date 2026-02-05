
export const About = () => {
  return (
    <section id="about" className="py-16 bg-stone-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light text-stone-800 mb-2 inline-block border-b-2 border-red-700 pb-1">
            About Me
          </h2>
          <p className="text-sm text-stone-500 mb-8">自己紹介</p>
          <div className="prose prose-stone lg:prose-lg max-w-none">
            <p>
              Born and raised in Kyoto, I've always been inspired by the perfect
              balance of tradition and innovation that defines Japanese culture.
              This harmony between old and new influences my approach to design
              and development.
            </p>
            <p>
              After completing my studies in Computer Science at Tokyo
              University, I worked with several technology firms in Japan before
              relocating to expand my horizons. I specialize in creating digital
              experiences that blend functionality with the aesthetic principles
              of Japanese design: simplicity, attention to detail, and
              thoughtful use of space.
            </p>
            <p>
              When I'm not coding, you might find me practicing calligraphy,
              tending to my small garden, or exploring local tea houses. I
              believe that these traditional practices inform my digital work,
              bringing a sense of mindfulness and craftsmanship to everything I
              create.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center">
              <div className="text-lg font-medium text-stone-800 sm:mr-4">
                My Philosophy:
              </div>
              <div className="mt-2 sm:mt-0 px-4 py-2 bg-indigo-900/10 border-l-4 border-indigo-900 text-stone-700 italic">
                "Simplicity is not the goal. It is the by-product of a good idea
                and modest expectations."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};