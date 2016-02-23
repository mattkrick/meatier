systems({
  meatier: {
    docker_extra: {
      User: 'root',
    },
    depends: ["rethinkdb"],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/node"},
    // Steps to execute before running instances
    provision: [
      "npm install",
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: ["npm", "run", "start"],
    wait: {"retry": 2, "timeout": 50000},
    mounts: {
      '/azk/#{manifest.dir}': sync("."),
      '/azk/#{manifest.dir}/node_modules': persistent("./node_modules"),
    },
    scalable: {"default": 1},
    http: {
      domains: [
        "#{env.HOST_DOMAIN}",
        "#{env.HOST_IP}",
        "#{system.name}.#{azk.default_domain}"
      ]
    },
    ports: {
      // exports global variables
      http: "3000/tcp",
    },
    envs: {
      // Make sure that the PORT value is the same as the one
      // in ports/http below, and that it's also the same
      // if you're setting it in a .env file
      NODE_ENV: "development",
      PORT: "3000",
      GRAPHQL_HOST: "#{system.name}.#{azk.default_domain}"
    },
  },

  rethinkdb: {
    image: { docker: "rethinkdb" },
    // If you need to expose and bind the rethinkdb ports outside of the docker
    // enable the docker_extra setting below
    docker_extra: {
      HostConfig: {
        "PortBindings": {
          "8080/tcp": [{ "HostPort": "8080" }],
          "28015/tcp": [{ "HostPort": "28015" }],
          "29015/tcp": [{ "HostPort": "29015" }]
        },
      },
    },
    shell: '/bin/bash',
    scalable: false,
    command: "rethinkdb --bind all --direct-io --cache-size 2000 --server-name rethinkdb --directory ./rethinkdb --canonical-address rethinkdb.dev.azk.io",
    wait: {"retry": 2, "timeout": 10000},
    mounts: {
      '/rethinkdb': persistent('rethinkdb-#{manifest.dir}'),
      '/data': persistent('#{system.name}/data'),
    },
    ports: {
      http: "8080",
      data: "28015",
      cluster: "29015",
    },
    http: {
      domains: [ '#{system.name}.#{azk.default_domain}' ],
    },
    export_envs: {
      "DATABASE_HOST": '#{net.host}',
      "DATABASE_PORT": '#{net.port.data}',
      "DATABASE_URL": 'rethinkdb://#{net.host}:#{net.port.data}',
    }
  },

  deploy: {
    image: {"docker": "azukiapp/deploy-digitalocean"},
    mounts: {
      "/azk/deploy/src" :    path("."),
      "/azk/deploy/.ssh":    path("#{env.HOME}/.ssh"),
      "/azk/deploy/.config": persistent("deploy-config"),
    },
    envs: {
      REMOTE_HOST:        "45.55.18.77",
    },
    scalable: {"default": 0, "limit": 0}
  }

});