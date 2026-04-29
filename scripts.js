


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
    // {
    //     name: "JavaScript",
    //     img: "./logos/JS.png",
    // },
    {
        name: "SQL",
        img: "./logos/SQL.png",
    },
    {
        name: "Lua",
        img: "./logos/lua.png",
    },
    {
        name: "Bash",
        img: "https://skillicons.dev/icons?i=bash",
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
            <h1 class="flex justify-center text-4xl font-bold mb-6">
                Tech
            </h1>
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
        imagePath: "./projects/switchboard.png",
        name: "Switchboard",
        text: "A cloud agnostic serverless orchestration framework.",
        url: "https://github.com/osteensco/switchboard",
    },
    {
        imagePath: "./projects/echovault.png",
        name: "SugarDB",
        text: "An embeddable and distributed in-memory database.",
        url: "https://echovault.io/",
    },
    {
        imagePath: "./projects/ft.PNG",
        name: "fastTravelCLI",
        text: "A cli tool provides a superior CD experience.",
        url: "https://github.com/osteensco/fastTravelCLI",
    },
    {
        imagePath: "./projects/pytivate.png",
        name: "Pytivate",
        text: "A quality of life improvement for python's venv.",
        url: "https://github.com/osteensco/pytivate",
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
                                        class="w-full h-64 object-contain bg-gray-900"
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

                {/* Navigation Row */}
                <div class="flex items-center justify-between mt-4">
                    <button
                        onClick={prevSlide}
                        class="bg-gray-800 border border-white hover:bg-blue-600 rounded-sm text-white px-3 py-1"
                    >
                        &lt; Prev
                    </button>

                    <div class="flex space-x-2 justify-center items-center">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                class={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-gray-400' : 'bg-gray-800 hover:bg-blue-500'
                                    }`}
                            ></button>
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        class="bg-gray-800 border border-white hover:bg-blue-600 rounded-sm text-white px-3 py-1"
                    >
                        Next &gt;
                    </button>
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

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);

    const PAGE_SIZE = 3;
    const MAX_POSTS = 6;
    const CARD_REM = 7;
    const GAP_REM = 0.75;
    const containerHeightRem = PAGE_SIZE * CARD_REM + (PAGE_SIZE - 1) * GAP_REM;
    const pageStrideRem = PAGE_SIZE * (CARD_REM + GAP_REM);

    const visiblePosts = posts.slice(0, MAX_POSTS);
    const totalPages = Math.max(1, Math.ceil(visiblePosts.length / PAGE_SIZE));

    useEffect(() => {
        fetch('./blog/posts.json')
            .then(r => r.json())
            .then(d => setPosts(d.posts))
            .catch(err => console.error('Failed to load posts:', err));
    }, []);

    useEffect(() => {
        if (page >= totalPages) setPage(totalPages - 1);
    }, [totalPages]);

    useEffect(() => {
        if (totalPages <= 1) return;
        const interval = setInterval(() => {
            setPage(p => (p + 1) % totalPages);
        }, 5000);
        return () => clearInterval(interval);
    }, [totalPages]);

    return (
        <div class="items-center">
            <h1 class="flex justify-center text-4xl font-bold mb-6">
                Blog
            </h1>
            <div class="max-w-lg mx-auto">
                <div class="flex items-center">
                    <div class="overflow-hidden flex-grow" style={{ height: `${containerHeightRem}rem` }}>
                        <div
                            class="flex flex-col space-y-3 transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateY(-${page * pageStrideRem}rem)` }}
                        >
                            {visiblePosts.map(p => (
                                <a
                                    key={p.slug}
                                    href={`./blog.html#/${p.slug}`}
                                    class="block flex-shrink-0"
                                    style={{ height: `${CARD_REM}rem` }}
                                >
                                    <div class="bg-gray-700 border-2 border-white rounded-lg p-4 h-full overflow-hidden hover:border-blue-500 hover:text-blue-500 transition-all">
                                        <h2 class="text-xl font-bold truncate">{p.title}</h2>
                                        <p class="text-sm text-gray-400">{p.date}</p>
                                        <p class="mt-1 text-sm truncate">{p.excerpt}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div class="flex flex-col space-y-2 ml-3">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                class={`w-3 h-3 rounded-full ${i === page ? 'bg-gray-400' : 'bg-gray-800 hover:bg-blue-500'}`}
                            ></button>
                        ))}
                    </div>
                </div>
                <div class="flex items-center justify-center mt-4">
                    <a href="./blog.html" title="View all posts" role="button" class="bg-gray-800 border border-white hover:bg-blue-600 rounded-sm text-white px-3 py-1">View all posts</a>
                </div>
            </div>
        </div>
    );
}

const AboutMe = () => {
    return (
        <div>
            <h1 class="flex justify-center text-4xl font-bold mb-6">
                About Me
            </h1>
            <p class="text-xl">
                Hi, I'm Scott.
                I'm a software developer with a background in data and analytics.
                I have experience in various domains such as clickstream App usage, eCommerce, CSAT, Transportation, and Supply Chain.
                I have a passion for building and learning new things and I enjoy building things that stretch my skillset.
                My favorite projects to work on are the ones that allow me to flex my creativity as well as challenge my current capabilities.
            </p>
        </div>
    );
}

const Profile = () => {
    return (
        <div p-8 rounded-lg shadow-lg justify-center items-center>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start relative">
                <section class="my-5">
                    <div>
                        <AboutMe />
                    </div>
                </section>
                <section class="my-5">
                    <div>
                        <Blog />
                    </div>
                </section>
                <section class="my-5">
                    <div>
                        <TechSection />
                    </div>
                </section>
                <section class="my-5">
                    <div>
                        <Projects />
                    </div>
                </section>
            </div>
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



