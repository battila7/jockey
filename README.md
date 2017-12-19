# Jockey

Just another task runner (sure, just another, but the first Dallas themed! :tv:).

This wheel's been already invented thousand times, what's the catch, chap? Jockey is the task runner of microservices. There are those times, when setting up docker containers becomes quite cumbersome...

Some of your artifacts should be checked out from feature branches, versions should be adjusted, environment parameters overridden, and so on, what a mess! And imagine that you have to pass all these settings to a colleague!

You can think of Jockey as the docker-compose of complex local deployments.

## Installation

Interested, huh? Then get your copy:

~~~~
$ npm install @jockey/jockey-cli -g
~~~~

## Lights, Dallas, rodeo!

Running Jockey is as easy as

~~~~
$ jockey-cli rodeo
~~~~

in the same directory as your jockeyfile (will talk about it soon, pinky-swear!). If you've named it `why-did-bobby.die` then use

~~~~
$ jockey-cli rodeo why-did-bobby.die
~~~~

## Tell Jockey how to rock!

Jockey can be configured by creating a `jockey.yml` file (or `rainbow-kitten-attack.yml`, whatever you want, just create a valid YAML file :rainbow:).

The jockeyfile can contain component definitions. A component can be a service, a library or some intermediary step to be performed by jockey. Who am I to tell ya, what you can do?

Let's say that we have some component, named `ewing-oil` (let's assume, you're working in the oil industry). Then you can create the following jockey-file:

~~~~YAML
components:
    - name: ewing-oil
      steps:
        - use: git
          with:
            clone: https://github.com/john-ross-ewing/ewing-oil
            directory: ewing-oil
            checkout: master
        - use: pom
          with:
            override:
                com.ewing.valve.version: 1.3.0
        - use: maven
          with:
            command: clean install
        - use: context
          with:
            env:
                OIL_PRICE: 100
        - use: maven
          with:
            command: exec:java
            define:
                exec.mainClass: com.ewing.oil.Main
            waitForCompletion: false
~~~~

Whoa, that's quite a lot even for a component like `ewing-oil`! Let's break it down a bit. You can see, that we have step definitions here that will be performed sequentially by Jockey.

Each step consists of two fields, `use` which is a plugin name and `with` that tells the plugin some nitty-gritty details on how we want it to run. Each plugin has a different set of parameters that can be defined in the `with` section.

Huh, are we there yet? Not quite. There is more, there is more, THERE IS MORE! 

### Context

Jockey casts some black voodoo spells and maintains a context between steps. That means that steps can take data from the previous step and pass data to the next one. This data is called `context`. 

Look at the previous example. How did the `pom` plugin know, where to search for the POM file? Easy, mate, it has received the directory setting from the `git` plugin and searched for `pom.xml` in that directory. Same goes for the `maven` plugins.

## Plugins

Currently all plugins are baked into Jockey, so that you can get it up and running easily. Sure thing, using JS jockeyfiles instead of YML would be easy, but we don't want anyone to write JS if they do not intend to first place.

### jockey-context

Can be used to modify the context.

Example:

~~~~YAML
    - use: context
      with:
        env: # env can be used to set environment variables by convention
            SOMEVARIABLE:abc
        directory: a/house/divided
~~~~

Also, we have operators! Well, only one at the moment, but it at least, that one works:

~~~~YAML
    - use: context
      with:
        a: [1, 2, 3]
    - use: context
      with:
        a:
          $push: [4, 5, 6]
~~~~

The value of `a` is going to be `[1, 2, 3, 4, 5, 6]`.

### jockey-git

**Note**: You must have `git` installed in order to use jockey-git.

This plugin can be used to clone a git repository and checkout a specified treelike stuff. An example usage:

~~~~YAML
    - use: git
      with:
        clone: https://github.com/john-ross-ewing/ewing-oil
        directory: ewing-oil
        checkout: ca82a6dff817ec66f44342007202690a93763949
~~~~

Using the previous definition, jockey-git will clone the specified repo and checkout the mentioned commit. If you omit the `clone` parameter then no cloning will happen.

Also, jockey-git will set the `directory` field in the context, so subsequent command can depend on it.


### jockey-maven

**Note**: You must have `maven` installed in order to use jockey-maven.

jockey-maven can be used to run maven commands (what a surprise?). Let's see an example usage:

~~~~YAML
    - use: maven
      with:
        command: spring-boot:run
        debug:
            address: 8000
        define:
            whatever:1024
        profiles: [ci]
        waitForCompletion: false
~~~~

The only thing that can be a root of some misconceptions is the `waitForCompletion` setting. By default, it's set to `true`. On the other hand, setting it to `false` will instruct Jockey to move on to the next step/component and let the `maven` plugin mind its own business.

### jockey-pom

jockey-pom simply reads the contents of a POM file and overrides/sets some properties. This can be used to override versions. Example:

~~~~YAML
    - use: pom
      with:
        file: ewing-oil/pom.xml
        override:
          com.ewing.valve.version: 1.3.0
~~~~
