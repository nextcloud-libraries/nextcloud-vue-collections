/*
 * @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import Vue from 'vue'
import service from './collectionservice'

const state = Vue.observable({
	collections: []
})

const mutations = {
	addCollections(collections) {
		Vue.set(state, 'collections', collections)
	},
	addCollection(collection) {
		state.collections.push(collection)
	},
	removeCollection(collectionId) {
		Vue.set(state, 'collections', state.collections.filter(item => item.id !== collectionId))
	},
	updateCollection(collection) {
		const index = state.collections.findIndex((_item) => _item.id === collection.id)
		if (index !== -1) {
			Vue.set(state.collections, index, collection)
		} else {
			state.collections.push(collection)
		}
	}
}

const actions = {
	fetchCollectionsByResource({ resourceType, resourceId }) {
		return service.getCollectionsByResource(resourceType, resourceId).then((collections) => {
			mutations.addCollections(collections)
			return collections
		})
	},
	createCollection({ baseResourceType, baseResourceId, resourceType, resourceId, name }) {
		return service.createCollection(baseResourceType, baseResourceId, name).then((collection) => {
			mutations.addCollection(collection)
			actions.addResourceToCollection({
				collectionId: collection.id,
				resourceType,
				resourceId
			})
		})
	},
	renameCollection({ collectionId, name }) {
		return service.renameCollection(collectionId, name).then((collection) => {
			mutations.updateCollection(collection)
			return collection
		})
	},
	addResourceToCollection({ collectionId, resourceType, resourceId }) {
		return service.addResource(collectionId, resourceType, resourceId).then((collection) => {
			mutations.updateCollection(collection)
			return collection
		})
	},
	removeResource({ collectionId, resourceType, resourceId }) {
		return service.removeResource(collectionId, resourceType, resourceId).then((collection) => {
			if (collection.resources.length > 0) {
				mutations.updateCollection(collection)
			} else {
				mutations.removeCollection(collection)
			}
		})
	},
	search(query) {
		return service.search(query)
	}

}

const store = {
	actions,
	state
}
export default store
export { actions, state }
