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
	<ul v-if="collections && type && id" id="collection-list" class="collection-list">
		<li @click="showSelect">
			<div class="avatar">
				<span class="icon-projects icon-white" />
			</div>
			<div id="collection-select-container">
				<Multiselect ref="select" v-model="value" :options="options"
					:placeholder="placeholder" tag-placeholder="Create a new project" label="title"
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
							<Avatar v-else-if="props.option.method !== 2" :display-name="props.option.title" :allow-placeholder="true" />
							<span class="option__title">{{ props.option.title }}</span>
						</span>
					</template>
				</Multiselect>
				<p class="hint">
					{{ t('core', 'Connect items to a project to make them easier to find') }}
				</p>
			</div>
		</li>
		<transition name="fade">
			<li v-if="error" class="error">
				{{ error }}
			</li>
		</transition>
		<CollectionListItem v-for="collection in collections" :key="collection.id" :collection="collection" />
	</ul>
</template>

<style lang="scss" scoped>
	.collection-list > li {
		font-weight: 300;
		display: flex;
	}
	#collection-select-container {
		display: flex;
		flex-direction: column;
		margin-top: -5px;
	}
	.multiselect {
		width: 100%;
		margin-left: 3px;
	}
	p.hint {
		color: var(--color-text-light);
		margin-top: -15px;
		z-index: 1;
		padding: 8px 8px;
		font-size: 95%;
		line-height: normal;

	}
	.multiselect--active + p.hint {
		opacity: 0;
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
		width: 32px;
		height: 32px;
		padding: 8px;
		margin-bottom: 6px;
	}

	/** TODO provide white icon in core */
	.icon-projects {
		padding: 8px;
		display: block;
		background-repeat: no-repeat;
		background-position: center;
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

	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}

</style>
<style lang="scss">
	/** TODO check why this doesn't work when scoped */
	.collection-list .multiselect:not(.multiselect--active ) .multiselect__tags {
		border: none !important;
		input::placeholder {
			color: var(--color-main-text);
		}
	}
</style>
<script>
import Vue from 'vue'
import Vuex from 'vuex'
import debounce from 'lodash/debounce'

import CollectionListItem from '../components/CollectionListItem'
import { CollectionStoreModule } from '../collectionstore'
import Avatar from 'nextcloud-vue/dist/Components/Avatar'
import Multiselect from 'nextcloud-vue/dist/Components/Multiselect'
Vue.use(Vuex)

const store = new Vuex.Store(CollectionStoreModule)

const METHOD_CREATE_COLLECTION = 0
const METHOD_ADD_TO_COLLECTION = 1
const METHOD_HINT = 2

const _debouncedSearch = debounce(
	function(query) {
		if (query !== '') {
			this.collectionStore.dispatch('search', query).then((collections) => {
				this.searchCollections = collections
			}).catch(e => {
				console.error('Failed to search for collections', e)
			})
		}
	},
	500, {}
)

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
			searchCollections: [],
			error: null,
			collectionStore: store
		}
	},
	computed: {
		collections() {
			return this.collectionStore.getters.collectionsByResource(this.type, this.id)
		},
		placeholder() {
			return t('core', 'Add to a project')
		},
		options() {
			let options = []
			window.OCP.Collaboration.getTypes().sort().forEach((type) => {
				options.push({
					method: METHOD_CREATE_COLLECTION,
					type,
					title: window.OCP.Collaboration.getLabel(type),
					class: window.OCP.Collaboration.getIcon(type),
					action: () => window.OCP.Collaboration.trigger(type)
				})
			})
			for (let index in this.searchCollections) {
				if (this.collections.findIndex((collection) => collection.id === this.searchCollections[index].id) === -1) {
					options.push({
						method: METHOD_ADD_TO_COLLECTION,
						title: this.searchCollections[index].name,
						collectionId: this.searchCollections[index].id
					})
				}
			}
			if (this.searchCollections.length === 0) {
				options.push({
					method: METHOD_HINT,
					title: t('core', 'Type to search for existing projects')
				})
			}
			return options
		}
	},
	mounted() {
		this.collectionStore.dispatch('fetchCollectionsByResource', {
			resourceType: this.type,
			resourceId: this.id
		})
	},
	methods: {
		select(selectedOption, id) {
			if (selectedOption.method === METHOD_CREATE_COLLECTION) {
				selectedOption.action().then((id) => {
					this.collectionStore.dispatch('createCollection', {
						baseResourceType: this.type,
						baseResourceId: this.id,
						resourceType: selectedOption.type,
						resourceId: id,
						name: this.name
					}).catch((e) => {
						this.setError(t('core', 'Failed to create a project'), e)
					})
				}).catch((e) => {
					console.error('No resource selected', e)
				})
			}

			if (selectedOption.method === METHOD_ADD_TO_COLLECTION) {
				this.collectionStore.dispatch('addResourceToCollection', {
					collectionId: selectedOption.collectionId, resourceType: this.type, resourceId: this.id
				}).catch((e) => {
					this.setError(t('core', 'Failed to add the item to the project'), e)
				})
			}
		},
		search(query) {
			_debouncedSearch.bind(this)(query)
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
		},
		setError(error, e) {
			console.error(error, e)
			this.error = error
			setTimeout(() => {
				this.error = null
			}, 5000)
		}
	}
}
</script>
