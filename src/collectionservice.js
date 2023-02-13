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

import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'

class CollectionService {

	constructor() {
		this.http = axios
	}

	listCollection(collectionId) {
		return this.http.get(generateOcsUrl('collaboration/resources/collections/{collectionId}', { collectionId }))
	}

	renameCollection(collectionId, collectionName) {
		return this.http.put(generateOcsUrl('collaboration/resources/collections/{collectionId}', { collectionId }), {
			collectionName,
		}).then(result => {
			return result.data.ocs.data
		})
	}

	getCollectionsByResource(resourceType, resourceId) {
		return this.http.get(generateOcsUrl('collaboration/resources/{resourceType}/{resourceId}', { resourceType, resourceId }))
			.then(result => {
				return result.data.ocs.data
			})
	}

	createCollection(resourceType, resourceId, name) {
		return this.http.post(generateOcsUrl('collaboration/resources/{resourceType}/{resourceId}', { resourceType, resourceId }), {
			name,
		})
			.then((response) => {
				return response.data.ocs.data
			})
	}

	addResource(collectionId, resourceType, resourceId) {
		resourceId = '' + resourceId
		return this.http.post(generateOcsUrl('collaboration/resources/collections/{collectionId}', { collectionId }), {
			resourceType,
			resourceId,
		}).then((response) => {
			return response.data.ocs.data
		})
	}

	removeResource(collectionId, resourceType, resourceId) {
		return this.http.delete(generateOcsUrl('collaboration/resources/collections/{collectionId}', { collectionId }), { params: { resourceType, resourceId } })
			.then((response) => {
				return response.data.ocs.data
			})
	}

	search(query) {
		return this.http.get(generateOcsUrl('collaboration/resources/collections/search/{query}', { query }))
			.then((response) => {
				return response.data.ocs.data
			})
	}

}

const service = new CollectionService()

export default service
