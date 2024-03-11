# Test Monorepo Versioning

A playground repo to test dependency resolution in different monorepo setups with different package managers.

Powered by
- [Nx, Smart Monorepos · Fast CI.](https://nx.dev) ✨
- [Verdaccio registry](https://verdaccio.org/)


## File structure

```shell
test-monorepo-versioning
├─ dist/packages/  # <-- packages are published from here
├─ .verdaccio
│  └─ config.yml   # <-- Verdaccio configuration
├─ monorepos       # <-- monorepos to test package installation
│  ├─ npm-v9
│  ├─ pnpm-v7
│  └─ ...
├─ packages
│  ├─ tooling  # <-- Nx generator to scaffold packages
│  └─ ...      # <-- your packages to publish here
├─ tools       # <-- scripts to run Verdaccio
├─ README.md                                  
├─ verdaccio-local-registry # <-- published packages live here
└─ tsconfig.base.json                         
```

## How to scaffold a package?

There's a custom Nx generator `./packages/tooling/src/generators/pkg-generator`.

And a shortcut to run it
```shell
npm run new-pkg
```

## How to publish a package?

```shell
npx nx <project>:publish --args='--ver X.X.X'

# example
npx nx run a:publish --args='--ver=0.0.1'

# publishing many versions in one run
# 1 - create publishMeta.json file in the package to be published
# 2 - run publishMany command
npx nx run a_b:publishMany --args='--tag=latest'
```

## How to serve Verdaccio registry locally?

```shell
npx nx run local-registry
```
