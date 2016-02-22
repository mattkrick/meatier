<img src="https://cloud.githubusercontent.com/assets/5986600/12841730/d500562a-cc28-11e5-84d9-90ae6abd5486.png" width="600">

[![Join the chat at https://gitter.im/mattkrick/meatier](https://badges.gitter.im/mattkrick/meatier.svg)](https://gitter.im/mattkrick/meatier?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Meteor is awesome! But after 3 years, it's starting to show its age. This project is designed to showcase 
the exact same functionality as Meteor, *but without the monolithic structure.* 
It trades a little simplicity for a lot of flexibility.

Some of my chief complaints with Meteor
 - Built on Node 0.10, and that ain't changing anytime soon
 - Build system doesn't allow for code splitting (the opposite, in fact)
 - Global scope (namespacing doesn't count)
 - Goes Oprah-Christmas-special with websockets (not every person/page needs one)
 - Can't handle css-modules (CSS is all handled behind the scenes)
 - Tied to MongoDB for official support
 
| Problem           | Meteor's solution                                               | My solution                                                         | Result                                                              |
|-------------------|-----------------------------------------------------------------|---------------------------------------------------------------------|---------------------------------------------------------------------|
| Database          | [MongoDB](https://www.mongodb.org/)                             | [RethinkDB](https://www.rethinkdb.com/)                             | Built in reactivity, but you can use any DB you like                |
| Database schema   | [Simple Schema](https://github.com/aldeed/meteor-simple-schema) | [GraphQL](https://github.com/graphql/graphql-js)                    | Can't have a hipster webapp without GraphQL!                        |
| Client validation | [Simple Schema](https://github.com/aldeed/meteor-simple-schema) | [Joi](https://github.com/hapijs/joi)                                | Clean API for client validation, although the package is HUGE       |
| Database hooks    | [Collections2](https://github.com/aldeed/meteor-collection2)    | [GraphQL](https://github.com/graphql/graphql-js)                    | GraphQL is overkill for small apps (then again, so is meatier)      |
| Forms             | [AutoForm](https://github.com/aldeed/meteor-autoform)           | [redux-form](https://github.com/erikras/redux-form)                 | state tracking awesomeness that works beautifully with react        |
| Client-side cache | [Minimongo](https://www.meteor.com/mini-databases)              | [redux](http://redux.js.org/)                                       | Bonus logging, time traveling, and undo functionality               |
| Socket server     | [DDP-server](https://www.meteor.com/ddp)                        | [socketcluster](http://socketcluster.io/#!/)                        | super easy scaling, pubsub, auth, middleware                        |
| Authentication    | Meteor accounts                                                 | [JWTs](https://jwt.io)                                              | JWTs can also serve to authorize actions, too                       |
| Auth-transport    | [DDP](https://www.meteor.com/ddp)                               | GraphQL (via HTTP)                                                  | Don't use sockets until you need to                                 |
| Front-end         | [Blaze](https://www.meteor.com/blaze)                           | [React](https://facebook.github.io/react/)                          | Vdom, server-side rendering, async router, etc.                     |
| Build system      | meteor                                                          | [webpack](https://webpack.github.io/)                               | using webpack inside meteor is very limited                         |
| CSS               | magically bundle & serve                                        | [css-modules](https://github.com/css-modules/css-modules)           | component-scoped css with variables available in a file or embedded |
| Optimistic UI     | latency compensation                                            | [redux-optimistic-ui](https://github.com/mattkrick/redux-optimistic-ui)  | written by yours truly                                         |
| Testing           | Velocity (or nothing at all)                                    | [AVA](https://github.com/sindresorhus/ava)                          | awesome es2016 concurrent testing                                   |
| Linting           | Your choice                                                     | [xo](https://www.npmjs.com/package/xo)                              | no dotfiles, fixes errors                                           |
| Routing           | [FlowRouter](https://github.com/kadirahq/flow-router)           | [redux-simple-router](https://github.com/reactjs/react-router-redux) | stick the route in the state, react-router SSR, async routes       |
| Server            | Node 0.10.41                                                    | Node 5                                                              | Faster, maintained, not a dinosaur...                               |                             |
 
## Minimum requirements

- 64-bit architecture machine
- Mac OSX or Linux (Windows: planned)
- bash (command-line tool available on virtually all unix systems)
- Internet connection (only needed while downloading images)

## Meatier now utilizes [azk](http://www.azk.io/) orchestrated development environment!
###### Should you already have it, feel free to skip the first step. 

##### Step 1 - azk installation
###### Mac OSX:
- curl -sSL http://azk.io/install.sh | bash

###### Linux:
- wget -nv http://azk.io/install.sh -O- -t 2 -T 10 | bash

##### Step 2 - new meatier installation
- git clone git@github.com:Araphel/meatier.git
- cd meatier
- azk start

###### If you like to watch / something doesnt work
- azk start -vv && azk logs --follow


## Execution of commands
- 'azk shell meatier -- //commands//'
For example:
- 'azk shell meatier -- npm run start:dev'
- 'azk shell meatier -- npm run start'
- 'azk shell meatier -- npm run build'

#### Client-side development
- `azk shell meatier -- npm run start:dev`
- http://meatier.dev.azk.io

Rebuilds the client code in-memory & uses hot module reload so you can develop super fast!
On my 2013 MBA an initial build takes about 8 seconds and updates usually take 800ms

#### Server-side development
- `azk shell meatier -- npm run start`
- http://meatier.dev.azk.io
- If you edit any client or universal files, run `azk shell meatier -- npm run build` to rebuild & serve the bundle

This mode is great because you can make changes to the server ***without having to recompile the client code***
That means you only wait for the server to restart! GAME CHANGER!

##Database development
- You can use Azk to only start the database by `azk start rethinkdb`
- http://rethinkdb.dev.azk.io for RethinkDB
- All tables are managed in `./src/server/setupDB.js`. Just add your tables & indices to that file and rerun
- A standard ORM would check for tables & ensure indices at least once per build, doing it this way keeps your build times down
- http://meatier.dev.azk.io/graphql for testing out new queries/mutations

##Deployment
####Currently we recommend deployment on [DigitalOcean](www.digitalocean.com/?refcode=ce49c40dc881)
######By using the above referral link you are helping us run [meatier.io](http://meatier.io/)
Make sure that you have .env file in the root folder of meatier. 
The file should looks like this:
```
DEPLOY_API_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
HOST_DOMAIN=hostname.com
HOST_IP=12.34.56.78
```

##Webpack configs
####Development config
When the page is opened, a basic HTML layout is sent to the client along with a stringified redux store and a request for the common chunk of the JS.
The client then injects the redux store & router to create the page.
The redux devtools & logger are also loaded so you track your every state-changing action. 
The routes are loaded async, check your networks tab in chrome devtools and you'll see funny js files load now & again. 
If this isn't crazy amazing to you, then go away.

####Production config
Builds the website & saves it to the `build` folder.
Maps the styles to the components, but uses the prerendered CSS from the server config (below)
Separates the `vendor` packages and the `app` packages for a super quick, cachable second visit.
Creates a webpack manifest to enable longterm caching (eg can push new vendor.js without pushing a new app.js)
Optimizes the number of chunks, sometimes it's better to have the modules of 2 routes in the same chunk if they're small

####Server config
A webpack config builds the entire contents of the routes on the server side.
This is required because node doesn't know how to require `.css`.
When a request is sent to the server, react-router matches the url to the correct route & sends it to the client.
Any browser dependency is ignored & uglified away.
To test this, disable javascript in the browser. You'll see the site & css loads without a FOUC.

##How it works
When the page loads, it checks your localStorage for `Meatier.token` & will automatically log you in if the token is legit. 
If not, just head to the 'Sign up' page. The 'Sign up' page uses redux-form, which handles all errors, schema validation,
and submissions. Your credentials are set as variables in a GraphQL mutation & sent to the GraphQL endpoint and a user document (similar to Meteor's) and authToken is returned to your state.

The 'Kanban' app requires a login & websocket, so when you enter, your token will be used to authenticate a websocket.
That token is stored on the server so it is only sent during the handshake (very similar to DDP). Socket state is managed
by `redux-socket-cluster`, just clicking `socket` in the devtools let's you explore its current state. 

When you enter the route, reducers are lazily loaded to the redux store and the `redux-optimistic-ui` reducer enhancer is applied to the store to enable an optimistic UI. To work, it requires some middleware that scans each redux action for an `isOptimistic` prop and reverts actions that fail server side.

When the kanban component loads, it subscribes to `lanes` & `notes`, which starts your personalized changefeed.
When you do something that changes the persisted state (eg add a kanban lane) that action is executed
optimistically on the client & emitted to the server where it is validated & sent to the database. 
The database then emits a changefeed doc to all subscribed viewers.
Since the DB doesn't know which client made the mutation, it always sends a changefeed to the server.
The server is smart enough to ignore sending that document back to the originator, but it does send an acknowledgement.

The kanban lane titles & notes are really basic, you click them & they turn into input fields. 
The notes can be dragged from lane to lane. This is to showcase a local state change that doesn't affect the persisted state.
When the note is dropped to its new location, the change is persisted. 

##Tutorials (not for beginners...but then again, neither is meatier)
 - [A production-ready realtime SaaS with webpack](https://medium.com/@matt.krick/a-production-ready-realtime-saas-with-webpack-7b11ba2fa5b0#.bifdf5iz8)
 - [GraphQL Field Guide to Auth](https://medium.com/@matt.krick/graphql-field-guide-to-auth-ead84f657ab#.f3tg2sf3d)

##Similar Projects
 - https://github.com/erikras/react-redux-universal-hot-example (Really nice, but no auth or DB)
 - https://github.com/kriasoft/react-starter-kit (nice, I borrowed their layout, but no sockets, no DB)
 - https://github.com/GordyD/3ree (uses RethinkDB, but no optimistic UI)
 - http://survivejs.com/ (A nice alt-flux & react tutorial for a kanban)

##In Action
Check it @ [meatier.io](http://meatier.io/)
![Meatier](http://i.imgur.com/B3IErZr.gif)

##Contributing
 - Pull requests welcomed!
 - Use the gitter for any questions
 - No donations necessary (but if you know of any jobs that'll let me move back to San Diego, let me know :wink:)

##Changelog
- 0.9.5
 - Added Azk.io orchestrate development environments
 - Upgraded all dependencies
 - Resolved issue #73 : upgrade to the latest webpack 2 version
 - Resolved issue #67 : How to deploy in production?
 - Resolved issue #65 : Update `redux-simple-router` and replaced it with `react-router-redux`
 - Resolved issue #64 : Make meatier more configurable for deployment
 - Resolved issue #52 : Docker: Environment Variables rather than hardcoded localhost
 
- 0.9
 - Upgraded to `redux-simple-router@2.0.3`
 - Now you can do cool things like time travel through routes!
 
- 0.8
 - Move auth & mutations to GraphQL (changefeeds still go through WS subs)
 - Make the rest of the `state.auth` immutable
 - Add graphiql (http://localhost:3000/graphql) as a component & pattern to create an admin site
 - Break out auth, landing page, kanban page, and admin into 4 separate modules in the folder hierarchy
  
##License
MIT
