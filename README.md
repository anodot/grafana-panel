# Anodot Panel Plugin

This is Anodot Panel Plugin for Grafana, which together with Anodot Datasource Plugin allows users to use Anodot data for building Grafana Dashboards. The Anodot Panel plugin supports several scenarios for displaying Anodot data from your account. The full documentation for using it can be found [here](https://support.anodot.com/hc/en-us/articles/360020696700).

Please note - You need an active Anodot account in order to use this plugin.

## What is a Grafana Panel Plugin?

Panels are the building blocks of Grafana. They allow you to visualize data in different ways. While Grafana has several types of panels already built-in, you can also build your own panel, to add support for other visualizations.

For more information about panels, refer to the documentation on [Panels](https://grafana.com/docs/grafana/latest/features/panels/panels/)

## Installation

You can get the Anodot Panel Plugin in these ways:

1. Clone this github repository, build the plugin and deploy it to your grafana deployment.
2. Unzip zip archive from this repository to your grafana-plugins folder.
3. Get it from the [Grafana plugins library](https://grafana.com/grafana/plugins/anodot-panel)
4. Use grafana-cli for installation

## Installing/Updating with grafana-cli

```
grafana-cli plugins install anodot-panel
```

or

```
grafana-cli plugins update anodot-panel
```

See more details [here](https://grafana.com/docs/grafana/latest/administration/cli/#plugins-commands).

## Getting started

1. Install dependencies

```BASH
yarn install
```

2. Build plugin in development mode or run in watch mode

```BASH
yarn dev
```

or

```BASH
yarn watch
```

3. Build plugin in production mode

```BASH
yarn build
```

## Learn more

- [Valid Time Formats](https://github.com/anodot/grafana-panel/wiki/Valid-Time-Formats)
- [Grafana documentation](https://grafana.com/docs/)
