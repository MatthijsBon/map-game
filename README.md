# Interactive Map Game

I started off with a Vite + React + Typescript template for a simple application that only runs client-side.

I have some prior experience with OpenLayers, so when I read the assignment I figured I'd use that for showing the map. I liked the API of  `react-hot-toast`, but never used it, so it was a easy choice to use that for showing the toast messages. 

I have used Tailwind before, although not extensively, but I liked working with it, so I used that to style the application.

## Run the application

It's available on [`https://interactivemapgame.netlify.app`](https://interactivemapgame.netlify.app) or you can run it locally with: 
```shell
npm run dev
```
Then go to `http://localhost:5173/` to see the application. You do need to have a `.env` file to run it, with an API key to make requests to the NS Api. 

## Approach

I started of with a simple Map component that could show the OSM background layer and the provinces on top. That was not extremely hard, but I remember from experiences how annoying OpenLayers could be to integrate with React, because it's so Object-Oriented. In the end a bit of hooks and persistence got me a nice result already.

Initially I thought to fetch the `stations` as soon as the Map loaded. I don't really like the fetch in `useEffect`, so instead I used React 19's latest `use` hook directly use a promise and then show the map. Ideally we fetch this server-side, but I didn't want to use a full framework for this assignment, and I didn't have time to further investigate using a custom Express SSR solution.

## Caveats

I didn't implement the animation on clicking a province for the first time, as I ran out of time. It is also a bit finicky, because I need to be careful not to re-render the map, otherwise all the feature-state is lost. This is a bit of a downside of using OpenLayers.

It would be nice to make a nice abstraction over the integration with OpenLayers, so we don't have to bother with the 'ugly' useEffect, but instead can use a custom hook. Or, since OpenLayers can work quite independently of React, we might not even need a hook, but instead use something like a builder pattern to create a Map, in which the last step would be to assign the 'map' to the target-ref created by React.

I didn't implement any tests, as the logic for this application is limited. Where there more logic or components to test, I'd use `vitest` with `@testing-library/react` to do unit testing.

There's not much of "design" in the application right now, there isn't even a description of what the goal of this game is. I thought about the implementation a bit more than about how people would "work" with it. In future endeavours it might be good to add a bit of explanation what the goal is and what interactions are possible.