# Pod Nexus

**[Live Link](https://podcast-web-player.netlify.app/)**

This is a demo podcast web app with search and play functionality.

## Built With

- [Vue.js](https://vuejs.org/) - JavaScript framework.
- [Nuxt](https://nuxt.com) - Framework based on Vue.js.
- [Listen Notes](https://www.listennotes.com/) - Podcast API (finally, a good one!).
- [Howler.js](https://howlerjs.com/) - Audio player.
- [Tailwind CSS](https://tailwindcss.com) - CSS Framework.

## Setup

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more about general Nuxt setup.

### Create an API Key on [Listen Notes](https://www.listennotes.com/)

- Then create a <code>.env</code> file in the root directory, and assign your API key to a variable named <code>API_KEY_LISTEN_NOTES</code> (e.g. <code>API_KEY_LISTEN_NOTES="YourAPIKey"</code>).

### Install Dependencies

```
yarn install
```

### Development Server

Start the development server on `http://localhost:3000`:

```
yarn dev
```

## Production

Build the application for production:

```
yarn build
```

### Locally preview production build:

```
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
