# Nextcloud Vue component for collaboration collections

[![Build Status](https://img.shields.io/travis/juliushaertl/nextcloud-vue-collections.svg?style=flat-square)](https://travis-ci.org/juliushaertl/nextcloud-vue-collections) [![npm last version](https://img.shields.io/npm/v/nextcloud-vue-collections.svg?style=flat-square)](https://www.npmjs.com/package/nextcloud-vue-collections) [![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&style=flat-square&logo=dependabot)](https://dependabot.com) [![irc](https://img.shields.io/badge/IRC-%23nextcloud--dev%20on%20freenode-blue.svg?style=flat-square)](https://webchat.freenode.net/?channels=nextcloud-dev)

Provides a vue component for collections management introduced in Nextcloud 16 to be integrated in apps.

## Installation

```sh
npm install --save nextcloud-vue-collections
```


## Usage

This library requires your app to have the following dependencies installed:

- vue 2.6
- vuex 3.1
- nextcloud-vue 0.7.0
- nextcloud-axios 0.1.2
- v-tooltip 2.0.0
- v-click-outside 1.0.7

After that you can use the collection list component like this:

```vue
<template>
	<collection-list 
		v-if="resourceId" 
		type="myresourcetype" 
		:id="resourceId" 
		:name="resourceName" 
	/>
</template>

<script>
import { CollectionList } from 'nextcloud-vue-collections'

export default {
    name: 'CollectionsView',
    components: {
        CollectionList
    },
    computed: {
        resourceId() {
            return 1
        },
        resourceName() {
            return 'My resource'
        }
    }
}
</script>
```
