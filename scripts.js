`
<div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-center relative">
    <section><h2 class="text-4xl font-bold mb-4">About Me</h2>
    <p class="text-xl text-zinc-500">
        **********Some stuff about me.**********
    </p></section><section class="my-5">
    <div>
    <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-2">
        <div class="flex flex-col gap-1 bg-neutral-950-950 border border-neutral-900 rounded-lg aspect-square justify-center items-center">
            {{ for loop }}
            <img alt=${imageName} loading="lazy" width="50" height="50" decoding="async" data-nimg="1" src=${imagePath} style="color: transparent; --darkreader-inline-color: transparent;" data-darkreader-inline-color="">
            <span class="text-zinc-500">${imageName}</span>
        </div>
   </div>
    </div>
    </section>
    </div>
`
