
const tech = [
    {
        name: "Go",
        img: "./logos/Go.png"
    },
]

const TechSection = () => {
    return (
        <div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-2">
              {tech.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col gap-1 dark:bg-neutral-950 border dark:border-neutral-900 rounded-lg aspect-square justify-center items-center"
                >
                  <img
                    src={t.img}
                    alt={t.name}
                    width="50"
                    height="50"
                  />
                </div>
              ))}
            </div>
          </div>
    )
}

const AboutMe = () => {
    return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-center relative">
        <section>
            <h2 class="text-4xl font-bold mb-4">
                About Me
            </h2>
            <p class="text-xl text-zinc-500">
        I am a software developer with a background in data and analytics. 
        I have experience in various domains such as Web/App usage, CSAT, Transportation, and Supply Chain. 
        I have a passion for building and learning new things.
        I am fascinated by how much value can be created using data and strong system design. 
        I enjoy the process of exploring new ideas and concepts around software, AI/ML, and system architecture. 
        I find building creative solutions for difficult problems extremly fulfilling. 
        My favorite projects to work on are the ones that allow me to flex my creativity as well as grow my professional skillset.
            </p>
        </section>
        <section class="my-5">
            <div>
                <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-2">
                    <TechSection />
                </div>
            </div>
        </section>
    </div>
    );
};

const Projects = () => {
    return(
        <div></div>
    );
};

const App = () => {
  return (
    <div>
        <AboutMe />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));








