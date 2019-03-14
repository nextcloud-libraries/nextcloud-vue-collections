<!--
  - @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
  -
  - @author Julius Härtl <jus@bitgrid.net>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<ul v-if="collections && type && id" id="shareWithList" class="shareWithList">
		<li @click="showSelect">
			<div class="avatar">
				<span class="icon-category-integration icon-white" />
			</div>
			<multiselect ref="select" v-model="value" :options="options"
				:placeholder="placeholder" tag-placeholder="Create a new collection" label="title"
				track-by="title" :reset-after="true" :limit="5"
				@select="select" @search-change="search">
				<template slot="singleLabel" slot-scope="props">
					<span class="option__desc">
						<span class="option__title">{{ props.option.title }}</span>
					</span>
				</template>
				<template slot="option" slot-scope="props">
					<span class="option__wrapper">
						<span v-if="props.option.class" :class="props.option.class" class="avatar" />
						<avatar v-else :display-name="props.option.title" :allow-placeholder="true" />
						<span class="option__title">{{ props.option.title }}</span>
					</span>
				</template>
			</multiselect>
		</li>
		<collection-list-item v-for="collection in collections" :key="collection.id" :collection="collection" />
	</ul>
</template>

<style lang="scss" scoped>
	.multiselect {
		width: 100%;
		margin-left: 3px;
	}
	span.avatar {
		padding: 16px;
		display: block;
		background-repeat: no-repeat;
		background-position: center;
		opacity: 0.7;
		&:hover {
			opacity: 1;
		}
	}

	div.avatar {
		background-color: var(--color-primary);
	}

	/** TODO provide white icon in core */
	.icon-category-integration.icon-white {
		filter: invert(100%);
		padding: 16px;
		display: block;
		background-repeat: no-repeat;
		background-position: center;
		background-image: var(--icon-integration-000);
	}

	.option__wrapper {
		display: flex;
		.avatar {
			display: block;
			background-color: var(--color-background-darker) !important;
		}
		.option__title {
			padding: 4px;
		}
	}

</style>
<style lang="scss">
	/** TODO check why this doesn't work when scoped */
	.shareWithList .multiselect:not(.multiselect--active ) .multiselect__tags {
		border: none !important;
		input::placeholder {
			color: var(--color-main-text);
		}
	}
</style>

<script>

import Vue from 'vue'
import Vuex from 'vuex'
import CollectionListItem from '../components/CollectionListItem'
import { CollectionStoreModule } from '../collectionstore'
import Avatar from 'nextcloud-vue/dist/Components/Avatar'
import Multiselect from 'nextcloud-vue/dist/Components/Multiselect'
Vue.use(Vuex)

const store = new Vuex.Store(CollectionStoreModule)

const METHOD_CREATE_COLLECTION = 0
const METHOD_ADD_TO_COLLECTION = 1
export default {
	name: 'CollectionList',
	store,
	components: {
		CollectionListItem,
		Avatar: Avatar,
		Multiselect: Multiselect
	},
	props: {
		/**
		 * Resource type identifier
		 */
		'type': {
			type: String,
			default: null
		},
		/**
		 * Unique id of the resource
		 */
		'id': {
			type: String,
			default: null
		},
		/**
		 * Name of the resource
		 */
		'name': {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			selectIsOpen: false,
			generatingCodes: false,
			codes: undefined,
			value: null,
			model: {},
			searchCollections: []
		}
	},
	computed: {
		collections() {
			return this.$store.getters.collectionsByResource(this.type, this.id)
		},
		placeholder() {
			return t('files_sharing', 'Add to a collection')
		},
		options() {
			let options = []
			let types = window.OCP.Collaboration.getTypes().sort()
			for (let type in types) {
				options.push({
					method: METHOD_CREATE_COLLECTION,
					type: types[type],
					title: window.OCP.Collaboration.getLabel(types[type]),
					class: window.OCP.Collaboration.getIcon(types[type]),
					action: () => window.OCP.Collaboration.trigger(types[type])
				})
			}
			for (let index in this.searchCollections) {
				if (this.collections.findIndex((collection) => collection.id === this.searchCollections[index].id) === -1) {
					options.push({
						method: METHOD_ADD_TO_COLLECTION,
						title: this.searchCollections[index].name,
						collectionId: this.searchCollections[index].id
					})
				}
			}
			return options
		}
	},
	mounted() {
		this.$store.dispatch('fetchCollectionsByResource', {
			resourceType: this.type,
			resourceId: this.id
		})
	},
	methods: {
		select(selectedOption, id) {
			if (selectedOption.method === METHOD_CREATE_COLLECTION) {
				selectedOption.action().then((id) => {
					this.$store.dispatch('createCollection', {
						baseResourceType: this.type,
						baseResourceId: this.id,
						resourceType: selectedOption.type,
						resourceId: id,
						name: this.name
					})
				}).catch((e) => {
					console.error('No resource selected', e)
				})
			}

			if (selectedOption.method === METHOD_ADD_TO_COLLECTION) {
				this.$store.dispatch('addResourceToCollection', {
					collectionId: selectedOption.collectionId, resourceType: this.type, resourceId: this.id
				})
			}
		},
		search(query) {
			this.$store.dispatch('search', query).then((collections) => {
				this.searchCollections = collections
			})
		},
		showSelect() {
			this.selectIsOpen = true
			this.$refs.select.$el.focus()
		},
		hideSelect() {
			this.selectIsOpen = false
		},
		isVueComponent(object) {
			return object._isVue
		}
	}
}
</script>
