# Nextcloud Vue component for collaboration collections

# Installation

```sh
npm install --save nextcloud-vue-collections
```

# Usage

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
	<collection-list v-if="resourceId" type="myresourcetype" :id="resourceId" :name="resourceName"></collection-list>
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
