

/////////////////blog page///////////////////

const { useState: useBlogState, useEffect: useBlogEffect } = React;

const BlogList = ({ posts }) => {
    return (
        <div>
            <h1 class="text-4xl font-bold mb-8 flex justify-center">Blog</h1>
            <div class="space-y-4 max-w-2xl mx-auto">
                {posts.map(p => (
                    <a key={p.slug} href={`#/${p.slug}`} class="block">
                        <div class="bg-gray-700 border-2 border-white rounded-lg p-5 hover:border-blue-500 hover:text-blue-500 transition-all">
                            <h2 class="text-2xl font-bold">{p.title}</h2>
                            <p class="text-sm text-gray-400 mt-1">{p.date}</p>
                            <p class="mt-2">{p.excerpt}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

const BlogPost = ({ post }) => {
    const [content, setContent] = useBlogState('');
    const [error, setError] = useBlogState(false);

    useBlogEffect(() => {
        setContent('');
        setError(false);
        fetch(`./blog/posts/${post.file}`)
            .then(r => {
                if (!r.ok) throw new Error('not found');
                return r.text();
            })
            .then(t => setContent(marked.parse(t)))
            .catch(() => setError(true));
    }, [post.file]);

    return (
        <div class="max-w-3xl mx-auto">
            <a href="#/" title="Back to all posts" role="button" class="bg-gray-800 border border-white hover:bg-blue-600 rounded-sm text-white px-3 py-1">Back to all posts</a>
            <p class="text-sm text-gray-400 mt-6">{post.date}</p>
            {error ? (
                <p class="mt-4 text-red-400">Failed to load post.</p>
            ) : (
                <div class="blog-content mt-2" dangerouslySetInnerHTML={{ __html: content }} />
            )}
        </div>
    );
};

const NotFound = () => (
    <div class="max-w-2xl mx-auto text-center">
        <h1 class="text-4xl font-bold mb-4">Post not found</h1>
        <a href="#/" title="Back to all posts" role="button" class="bg-gray-800 border border-white hover:bg-blue-600 rounded-sm text-white px-3 py-1">Back to all posts</a>
    </div>
);

const BlogApp = () => {
    const [posts, setPosts] = useBlogState([]);
    const [loaded, setLoaded] = useBlogState(false);
    const [hash, setHash] = useBlogState(window.location.hash);

    useBlogEffect(() => {
        fetch('./blog/posts.json')
            .then(r => r.json())
            .then(d => {
                setPosts(d.posts);
                setLoaded(true);
            })
            .catch(err => {
                console.error('Failed to load posts:', err);
                setLoaded(true);
            });

        const onHashChange = () => {
            setHash(window.location.hash);
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const slug = hash.replace(/^#\/?/, '');
    let body;
    if (!loaded) {
        body = <p class="text-center text-gray-400">Loading...</p>;
    } else if (!slug) {
        body = <BlogList posts={posts} />;
    } else {
        const post = posts.find(p => p.slug === slug);
        body = post ? <BlogPost post={post} /> : <NotFound />;
    }

    return (
        <div class="flex-grow max-w-full mx-auto mt-32 px-4 md:max-w-4xl lg:max-w-5xl">
            {body}
        </div>
    );
};

ReactDOM.render(<BlogApp />, document.getElementById('root'));
