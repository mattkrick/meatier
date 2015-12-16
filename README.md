# meatier
like meteor, but meatier

Meteor is awesome! But after 3 years, it's starting to show it's age. This project is designed to showcase 
the exact same functionality as Meteor, *but without the monolithic structure.* 
It trades a little simplicity for a lot of flexibility.

Some of my chief complaints with Meteor
 - Built on Node 0.10, and that ain't changing anytime soon
 - Build system doesn't allow for code splitting (the opposite, in fact)
 - Locks you in to a walled garden (npm require only gets you so far)
 - Global scope (namespacing doesn't count)
 - Goes Oprah-Christmas-special with websockets (not every person/page needs one)
 - Can't handle css-modules (CSS is all handled behind the scenes)
 - Dependent on MDG to release Meteor-specific package updates like react
 - Tied to MongoDB for official support
 
The node community has moved crazy fast to develop some really neat tools. Here's a comparison table of Meteor tools
and their npm counterparts that are used in this example:

| Atmosphere            | npm                   |
|-----------------------|-----------------------|
| SimpleSchema          | Joi                   |
| Collections2          | thinky                |
| AutoForm              | redux-form            |
| Minimongo             | redux                 |
| DDP                   | SocketCluster         |
| websocket auth        | REST auth + JWTs      |
| Blaze                 | React                 |
| Meteor's build system | webpack               |
| Mongo                 | RethinkDB             |
| global CSS            | postcss-module-values |
| latency compensation  | redux-optimist        |
| velocity              | ava                   |

That's a lot of work, so what do you get for it that Meteor doesn't provide?
###...Scaling! 
 - SocketCluster scales vertically *very* easily, and horizontal scaling isn't too hard, either
 - REST authentication means you don't have to give everyone a websocket, fewer sockets = fewer CPUs
 - JWTs allow you to store authentication as well as authorization, which can save you a hit to your DB to find permissions
 - RethinkDB changefeeds replace the mongo oplog
 - webpack to it's true potential. When used with Meteor, you still have a Meteor-sized common chunk
 - redux has undo built in, it is a debugger's dream (see the demo)
 - Modularized CSS that you don't have to namespace. Now with variables!
 
##Installation
- `brew install rethinkdb`
- `git clone` this repo
- `cd meatier`
- `npm install`
- `rethinkdb`
- `npm start` (in a second terminal window)
- http://localhost:3000

##How it works
####In development mode:
When the page is opened, a basic HTML layout is sent to the client along with a stringified redux store and a request for the common chunk of the JS.
The client then injects the redux store & router. 
The redux devtools is also loaded so you track your every state-changing action. 
The routes are loaded async, check your networks tab in chrome devtools and you'll see funny js files load now & again. 
If this isn't crazy amazing to you, then go away.

####In production mode:
A webpack config builds the entire contents of the routes on the server side.
This is required because node doesn't know how to require `.css`.
When a request is sent to the server, react-router matches the url to the correct route & sends it to the client.
To test this, disable javascript in the browser. You'll see the site & css loads without a FOUC.
NOTE: react-router doesn't return when matched to a javascript-heavy page (eg login). PRs welcomed!


When the page loads, it checks your localStorage for `Meatier.token` & will automatically log you in if the token is legit. 
If not, just head to the 'Sign up' page. The 'Sign up' page uses redux-form, which handles all errors, schema validation,
and submissions. Your credentials are sent to a REST API and a user document (similar to Meteor's) is returned to your state.

The 'Kanban' app requires a login & websocket, so when you enter, your token will be used to authenticate a websocket.
That token is stored on the server so it is only sent during the handshake (very similar to DDP). Socket state is managed
by `redux-socket-cluster`, just clicking `socket` in the devtools let's you explore its current state. 
To make this happen,  the package uses a fork of socketcluster-client (v4.0 is still in the works). 

When the component loads, it subscribes to `lanes` & `notes`, which starts your personalized changefeed.
When you do something that changes the persisted state (eg add a kanban lane) that action is executed
optimistically on the client & emitted to the server where it is validated & sent to the database. 
The database then emits a changefeed doc to all subscribed viewers.
Since the DB doesn't know which client made the mutation, it always sends a changefeed to the server.
The server is smart enough to not send that changefeed to the socket that mutated the state, simply an ack.

The kanban lane titles & notes are really basic, you click them & they turn into input fields. 
The notes can be dragged from lane to lane. This is to showcase a local state change that doesn't affect the persisted state.
When the note is dropped to its new location, the change is persisted. 


##Similar Projects
 - https://github.com/erikras/react-redux-universal-hot-example (Really nice, but no auth or DB)
 - https://github.com/kriasoft/react-starter-kit (nice, I borrowed their layout, but no sockets, no DB)
 - https://github.com/GordyD/3ree (uses RethinkDB, but no optimistic UI)
 - http://survivejs.com/ (A nice alt-flux & react tutorial for a kanban)

##In Action
I don't know of any place that hosts RethinkDB for free...so here's a gif. 
![Meatier](http://imgur.com/B3IErZr.gif)

##License
MIT




