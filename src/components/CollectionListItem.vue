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
	<li v-click-outside="hideDetails" class="collection-list">
		<avatar :display-name="collection.name" :allow-placeholder="true" />
		<span v-if="newName === ''" class="username" title=""
			@click="showDetails">{{ collection.name }}</span>
		<form v-else @submit.prevent="renameCollection">
			<input v-model="newName" type="text" autocomplete="off"
				autocapitalize="off">
			<input type="submit" value="" class="icon-confirm">
		</form>
		<transition name="fade">
			<div v-if="!detailsOpen" class="linked-icons">
				<a v-for="resource in collection.resources" :key="resource.id" v-tooltip="resource.name"
					:href="resource.link"><span :class="getIcon(resource)" /></a>
			</div>
		</transition>

		<span class="sharingOptionsGroup">
			<div v-click-outside="close" class="share-menu">
				<a href="#" class="icon icon-more" @click="toggle" />
				<span class="icon icon-loading-small hidden" />
				<div class="popovermenu" :class="{open: isOpen}">
					<popover-menu :menu="menu" />
				</div>
			</div>
		</span>
		<transition name="fade">
			<ul v-if="detailsOpen" class="resource-list-details">
				<li v-for="resource in collection.resources" :key="resource.id">
					<a :href="resource.link"><span :class="getIcon(resource)" /><span class="resource-name">{{ resource.name || '' }}</span></a>
					<span class="icon-close" @click="removeResource(collection, resource)" />
				</li>
			</ul>
		</transition>
	</li>
</template>

<script>
const NextcloudVue = require('nextcloud-vue');

export default {
	name: 'CollectionListItem',
	components: {
		Avatar: NextcloudVue.Avatar
	},
	props: {
		collection: {
			type: Object,
			default: null
		}
	},
	data() {
		return {
			isOpen: false,
			detailsOpen: false,
			newName: ''
		}
	},
	computed: {
		menu() {
			/* eslint-disable vue/no-side-effects-in-computed-properties */
			return [
				{
					action: () => {
						this.detailsOpen = true
						this.isOpen = false
					},
					icon: 'icon-info',
					text: t('files_sharing', 'Details')
				},
				{
					action: () => this.openRename(),
					icon: 'icon-rename',
					text: t('files_sharing', 'Rename collection')
				}
			]
		},
		getIcon() {
			return (resource) => [resource.iconClass]
		}
	},
	methods: {
		open() {
			this.isOpen = true
		},
		close() {
			this.isOpen = false
		},
		toggle() {
			this.isOpen = !this.isOpen
		},
		showDetails() {
			this.detailsOpen = true
		},
		hideDetails() {
			this.detailsOpen = false
		},
		removeResource(collection, resource) {
			this.$store.dispatch('removeResource', {
				collectionId: collection.id, resourceType: resource.type, resourceId: resource.id
			})
		},
		openRename() {
			this.newName = this.collection.name
		},
		renameCollection() {
			this.$store.dispatch('renameCollection', {
				collectionId: this.collection.id,
				name: this.newName
			}).then((collection) => {
				this.newName = ''
			})
		}
	}
}
</script>

<style scoped lang="scss">
	.fade-enter-active, .fade-leave-active {
		transition: opacity .3s ease;
	}
	.fade-enter, .fade-leave-to
		/* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
	}
	.linked-icons {
		display: flex;
		span {
			padding: 16px;
			display: block;
			background-repeat: no-repeat;
			background-position: center;
			opacity: 0.7;
			&:hover {
				opacity: 1;
			}
		}
	}
	.collection-list {
		flex-wrap: wrap;
		height: auto;

		form, .username {
			flex-basis: 10%;
			flex-grow: 1;
			display: flex;
		}
		.resource-list-details {
			flex-basis: 100%;
			width: 100%;
			li {
				display: flex;
				margin-left: 44px;
				border-radius: 3px;

				&:hover {
					background-color: var(--color-background-dark);
				}
				a {
					flex-grow: 1;
					padding: 3px;
					max-width: calc(100% - 30px);
					display: flex;
				}
			}
			span {
				display: inline-block;
				vertical-align: top;
				margin-right: 10px;
			}
			span.resource-name {
				text-overflow: ellipsis;
				overflow: hidden;
				position: relative;
				vertical-align: top;
				white-space: nowrap;
				flex-grow: 1;
			}
		}
	}
</style>
