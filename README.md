<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Deprecated

**WARNING**: This package is now deprecated, the components have been merged into [`@nextcloud/vue`](https://www.npmjs.com/package/@nextcloud/vue) as of version 8.14.0.
So we recommend to migrate to using `@nextcloud/vue` directly:
```js
import NcCollectionList from '@nextcloud/vue/dist/Components/NcCollectionList.js'
```


# Nextcloud Vue component for collaboration collections
Provides a vue component for Nextcloud projects introduced in Nextcloud 16 to be integrated in apps. *Projects* is naming for user-facing elements, while collections is used internally since it was renamed afterwards.

## Installation

```sh
npm install --save nextcloud-vue-collections
```


## Usage

This library requires your app to have the following dependencies installed:

- `^1.0.0` or any compatible newer version: `vue ^3.4.29`
- `^0.12.0` or any compatible newer minor or patch version: `vue ^2.7.16`

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
