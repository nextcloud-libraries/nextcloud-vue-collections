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
				<span class="icon-projects" />
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
<script>
import debounce from 'lodash/debounce'

import CollectionListItem from '../components/CollectionListItem'
import Avatar from '@nextcloud/vue/dist/Components/Avatar'
import Multiselect from '@nextcloud/vue/dist/Components/Multiselect'

import { state, actions } from '../collectionstore'

const METHOD_CREATE_COLLECTION = 0
const METHOD_ADD_TO_COLLECTION = 1
const METHOD_HINT = 2

const _debouncedSearch = debounce(
	function(query) {
		if (query !== '') {
			actions.search(query).then((collections) => {
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
	components: {
		CollectionListItem,
		Avatar: Avatar,
		Multiselect: Multiselect
	},
	props: {
		/**
		 * Resource type identifier
		 */
		type: {
			type: String,
			default: null
		},
		/**
		 * Unique id of the resource
		 */
		id: {
			type: String,
			default: null
		},
		/**
		 * Name of the resource
		 */
		name: {
			type: String,
			default: ''
		},
		isActive: {
			type: Boolean,
			default: true
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
			state: state
		}
	},
	computed: {
		collections() {
			return this.state.collections.filter((collection) => {
				return typeof collection.resources.find((resource) => resource && resource.id === '' + this.id && resource.type === this.type) !== 'undefined'
			})
		},
		placeholder() {
			return t('core', 'Add to a project')
		},
		options() {
			const options = []
			window.OCP.Collaboration.getTypes().sort().forEach((type) => {
				options.push({
					method: METHOD_CREATE_COLLECTION,
					type,
					title: window.OCP.Collaboration.getLabel(type),
					class: window.OCP.Collaboration.getIcon(type),
					action: () => window.OCP.Collaboration.trigger(type)
				})
			})
			for (const index in this.searchCollections) {
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

	watch: {
		type() {
			if (this.isActive) {
				actions.fetchCollectionsByResource({
					resourceType: this.type,
					resourceId: this.id
				})
			}
		},
		id() {
			if (this.isActive) {
				actions.fetchCollectionsByResource({
					resourceType: this.type,
					resourceId: this.id
				})
			}
		},
		isActive(isActive) {
			if (isActive) {
				actions.fetchCollectionsByResource({
					resourceType: this.type,
					resourceId: this.id
				})
			}
		}
	},

	mounted() {
		actions.fetchCollectionsByResource({
			resourceType: this.type,
			resourceId: this.id
		})
	},

	methods: {
		select(selectedOption, id) {
			if (selectedOption.method === METHOD_CREATE_COLLECTION) {
				selectedOption.action().then((id) => {
					actions.createCollection({
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
				actions.addResourceToCollection({
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

<style lang="scss" scoped>
	.collection-list * {
		box-sizing: border-box;
	}
	.collection-list > li {
		display: flex;
		align-items: start;

		& > .avatar {
			margin-top: 5px;
		}
	}
	#collection-select-container {
		display: flex;
		flex-direction: column;
		margin-top: -5px;
	}
	.multiselect {
		z-index: 2;
		width: 100%;
		margin-left: 3px;
		background-color: transparent;
		&::v-deep {
			&:not(.multiselect--active) .multiselect__tags {
				border: none !important;
				input::placeholder {
					color: var(--color-main-text);
				}
			}
			.multiselect__input {
				background-color: transparent;
			}
		}
		// avatar in the dropdown
		span.avatar {
			display: block;
			padding: 16px;
			opacity: .7;
			background-repeat: no-repeat;
			background-position: center;
			&:hover {
				opacity: 1;
			}
		}
		// hide text when opened multiselect
		&.multiselect--active + p.hint {
			opacity: 0;
		}
	}

	p.hint {
		z-index: 1;
		// fix alignment
		margin-top: -16px;
		padding: 8px 8px;
		color: var(--color-text-maxcontrast);
		line-height: normal;
	}

	div.avatar {
		width: 32px;
		height: 32px;
		margin: 0;
		padding: 8px;
		background-color: var(--color-background-dark);
		margin-top: 30px;
	}

	/** TODO provide white icon in core */
	.icon-projects {
		display: block;
		padding: 8px;
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
