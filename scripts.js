


/////////////////components///////////////////

const { useState, useEffect } = React;

const tech = [
    {
        name: "Go",
        img: "./logos/Go.png"
    },
    {
        name: "Python",
        img: "./logos/py.png",
    },
    {
        name: "TypeScript",
        img: "./logos/typescript.png",
    },
    {
        name: "JavaScript",
        img: "./logos/JS.png",
    },
    {
        name: "Bash",
        img: "https://skillicons.dev/icons?i=bash",
    },
    // {
    //     name: "SQL",
    //     img: "./logos/SQL.png",
    // },
    {
        name: "Lua",
        img: "./logos/lua.png",
    },
    {
        name: "AWS",
        img: "./logos/AWS.png",
    },
    {
        name: "GCP",
        img: "./logos/gcp.png",
    },
    {
        name: "Redis",
        img: "./logos/redis.png",
    },
    {
        name: "PostgreSQL",
        img: "./logos/postgresql.png",
    },
    {
        name: "SQLite",
        img: "./logos/sqlite.png",
    },
    {
        name: "Docker",
        img: "https://skillicons.dev/icons?i=docker",
    },
    // {
    //     name: "html/css",
    //     img: "./logos/htmlcss.png",
    // },
]

const TechSection = () => {
    return (
        <div>
            <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-2">
                {tech.map((t) => (
                    <div
                        key={t.name}
                        class="flex flex-col bg-gray-700 border-2 border-white rounded-lg aspect-square justify-center items-center"
                    >
                        <img
                            class="my-2"
                            loading="lazy"
                            src={t.img}
                            alt={t.name}
                            width="75"
                            height="75"
                            decoding="async"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const projectList = [
    {
        imagePath: "./projects/echovault.png",
        name: "SugarDB",
        text: "An embeddable and distributed in-memory alternative to Redis written in Go.",
        url: "https://echovault.io/",
    },
    {
        imagePath: "./projects/ft.PNG",
        name: "fastTravelCLI",
        text: "A cli tool written in Go that provides a superior CD experience.",
        url: "https://github.com/osteensco/fastTravelCLI",
    },
    {
        imagePath: "./projects/chatapp.png",
        name: "Chat Application",
        text: "A fullstack web application made with Go.",
        url: "https://github.com/osteensco/chat_app",
    },
    {
        imagePath: "./projects/electronapp.PNG",
        name: "BrickBreaker",
        text: "A desktop game built with TypeScript and Electron.",
        url: "https://github.com/osteensco/brickbreaker",
    },
]

const Carousel = ({ items }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const totalSlides = items.length;

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 10000);
        return () => clearInterval(interval);
    }, [currentSlide]);

    return (
        <div class="flex-grow">
            <div class="relative w-full max-w-lg mx-auto overflow-hidden">
                {/* Carousel Items */}
                <div
                    class="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            class="w-full flex-shrink-0"
                        >
                            <a title={item.name} href={item.url} target="_blank">
                                <div class="text-white border-2 border-transparent rounded-md hover:border-blue-500 hover:text-blue-500 transition-all">
                                    <img
                                        class="w-full h-auto"
                                        src={item.imagePath}
                                        alt={item.text}

                                    />
                                    <div class="text-center mt-2 font-bold ">{item.name}</div>
                                </div>
                            </a>
                            <div class="text-center mt-2 text-white">{item.text}</div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 border border-white hover:bg-blue-600 rounded-sm text-white px-3 py-1"
                >
                    &lt; Prev
                </button>
                <button
                    onClick={nextSlide}
                    class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 border border-white hover:bg-blue-600 rounded-sm text-white px-3 py-1"
                >
                    Next &gt;
                </button>

                <div class="absolute bottom-0 relative w-full max-w-lg mx-auto left-1/2 transform -translate-x-1/2 flex space-x-2 justify-center items-center">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            class={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-gray-400' : 'bg-gray-800 hover:bg-blue-500'
                                }`}
                        ></button>
                    ))}
                </div>

            </div>
        </div>
    );
};

const Projects = () => {
    return (
        <div class="items-center">
            <h1 class="flex justify-center text-4xl font-bold mb-6">
                Projects
            </h1>
            <Carousel items={projectList} />
        </div>
    )
}

const Profile = () => {
    return (
        <div p-8 rounded-lg shadow-lg justify-center items-center>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative">
                <section>
                    <h1 class="text-4xl font-bold mb-4">
                        About Me
                    </h1>
                    <p class="text-xl">
                        Hi, I'm Scott.
                        I'm a software developer with a background in data and analytics.
                        I have experience in various domains such as clickstream App usage, eCommerce, CSAT, Transportation, and Supply Chain.
                        I have a passion for building and learning new things and I enjoy building things that stretch my skillset.
                        My favorite projects to work on are the ones that allow me to flex my creativity as well as challenge my current capabilities.
                    </p>
                </section>
                <section class="my-5">
                    <div>
                        <TechSection />
                    </div>
                </section>
            </div>
            <section class="my-32">
                <div>
                    <Projects />
                </div>
            </section>
        </div>
    );
};

const App = () => {
    return (
        <div class="flex-grow max-w-full mx-auto mt-32 px-4 md:max-w-4xl lg:max-w-5xl" >
            <Profile />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));

const Header = () => {
    return (
        <div class="w-full">
            <div class="container mx-auto mt-10">
                <h3 class="text-4xl my-10 flex justify-center px-5 items-center space-x-4">
                    Scott Osteen
                </h3>
                <ul class="flex justify-center px-5 items-center space-x-4">

                    <a title="Github" role="button" class="inline-flex items-center border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium rounded-md px-4 py-2 transition-all" href="https://github.com/osteensco/" target="_blank">
                        Github
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ml-2 bi bi-github" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                    </a>

                    <a title="Linkedin" role="button" class="inline-flex items-center border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium rounded-md px-4 py-2 transition-all" href="https://www.linkedin.com/in/scott-osteen-233973129/" target="_blank">
                        Linkedin
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ml-2 bi bi-linkedin" viewBox="0 0 16 16">
                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                        </svg>
                    </a>

                </ul>
            </div>
        </div>
    );
};

ReactDOM.render(<Header />, document.getElementById('head'));

const Footer = () => {
    let today = new Date()
    let currentYear = today.getFullYear()
    return (
        <p>&copy; {currentYear}  Scott Osteen</p>
    );
};

ReactDOM.render(<Footer />, document.getElementById('foot'));



/////////////////cookies///////////////////

const d = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTAwMzQ0NjU0MzU3MzA2NTc1OS9tekJGSy1FUWIyU192ai1yaklOcWdoRC1JaUQ3OXItbjZRSUI3cGxvRElZNmNnXzFWLUVHd1kxRVBzVjJwR0NFT1hHeg=="

const e = atob(d)

let types = {
    "id": 3650,
    "sessionID": 0,

}

function setExpiration(type) {
    return types[type]
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}






class Cookie {
    constructor(type) {
        this.type = type
        this.datetime = new Date()
        this.expires = this.expiration(type)
        this.value = this.read(type)

    }

    generateID() {
        let elem = [
            this.datetime.getUTCDate(),
            this.datetime.getUTCMonth(),
            this.datetime.getUTCFullYear(),
            this.datetime.getTime(),
            `${Math.random() * 100 + Math.random() * 100}`,
        ]
        return `${this.type}${elem[0]}${elem[1]}${elem[2]}${elem[3]}${elem[4]}`
    }

    expiration(type) {
        let days = setExpiration(type)

        if (days > 0) {
            const d = new Date()
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
            return d.toUTCString()
        } else {
            return false
        }

    }

    set(field, value, exdays) {
        if (exdays != 0) {
            let exp = "expires=" + exdays
            document.cookie = field + "=" + value + ";" + exp
        } else {//cookie should expire on browser close if not listed
            document.cookie = field + "=" + value
        }

    }

    get(field) {
        let name = field + "="
        let decodedCookie = decodeURIComponent(document.cookie)
        let ca = decodedCookie.split(';')
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim()

            while (c.charAt(0) == ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length)
            } else {
                continue
            }
        }
        return ""
    }

    read(type) {
        let i = this.get(type)
        if (i == "") {
            i = this.generateID()
            this.set(type, i, this.expires)
        }
        return i
    }

}



///////////////////Webhook///////////////////////

class Webhook {
    constructor(data, ep) {
        this.payload = data
        this.send(data, ep)
    }


    send(data, e) {
        fetch(e, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    console.log('webhook success');
                } else {
                    console.error('Error forwarding data:', response.status);
                }
            })
            .catch(error => console.error('Network error:', error));
    }

}




// let id = new Cookie('id')
// let session = new Cookie('sessionID')
//
//
// let discord = new Webhook(
//     {
//         username: "Scott's Portfolio Site Traffic",
//         content: `______
//
//     ${id.value} 
//     ${session.value}    
//         Visited: ${document.location.href}
//         ${id.datetime}
//
//     ______`
//     },
//     e
// )



