## svelte-concurrency experiment

I'm using this project to build up and eventually extract `svelte-concurrency` as it own library. Here's the layout:

1. `src/concurrency.js` and `src/concurrency/**` are intended to house all of what will become svelte-concurrency
2. svelte-concurrency will use a shared concurrency lib (along with the next version of e-c). All of the shared concurrency lib stuff lives in `src/concurrency/external`
3. Every time I tweak something on the e-c extraction side of things (currently on the publicly visible `scheduler-cleanup` branch in the ember-concurrency repo), I just copy over all the changes directly into `external` via: `rsync -avu --delete ../../../ember/ember-concurrency/addon/-private/external/ src/concurrency/external/`








*Psst — looking for a shareable component template? Go here --> [sveltejs/component-template](https://github.com/sveltejs/component-template)*

---

# svelte app

This is a project template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/sveltejs/template.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sveltejs/template svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*


## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.


## Deploying to the web

### With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
now
```

As an alternative, use the [Now desktop client](https://zeit.co/download) and simply drag the unzipped project folder to the taskbar icon.

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public
```
