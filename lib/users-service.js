
'use strict';

let _ = require('lodash');
let moment = require('moment');
let Hashids = require('hashids/cjs');

const USERS = require('../data/users.json');
const TWO_DAYS_IN_MINUTES = 2 * 24 * 60;
// assign some reasonably recent login_time to each user
USERS.forEach(u => {
  u.last_login = moment().subtract(_.random(TWO_DAYS_IN_MINUTES), 'minutes').toISOString();
});

const USERS_BY_ID = _.keyBy(USERS, 'id');

const SORTING = ['DISTANCE', 'ACTIVITY'];

const OMITTED_FROM_SEARCH = ['headline', 'location', 'personal', 'sexual'];

const OMITTED_FROM_PROFILES = ['name', 'picture', 'online_status', 'last_login'];

class UsersService {
  constructor() {
    this._hashIds = new Hashids("pdk87v4kCU", 32);
  }

  /**
   * Returns one page of profiles and a cursor for querying the next one
   *
   * @param {String} sorting DISTANCE or ACTIVITY
   * @param {Number} length
   * @param {Number=0} offset
   *
   * @return {Object} { cursors, items, total }
   */
  search({ sorting, length, offset = 0 }) {
    // Sort by ascending distance _or_ descending login time
    let sorted = _.sortBy(USERS, (u) => {
      return sorting === "DISTANCE"
        ? u.location.distance
        : -new Date(u.last_login).getTime();
    });

    let sliced = sorted.slice(offset);
    let hasNext = sliced.length > length;

    // Omit some stats from search items!
    let items = _.take(sliced, length).map((item) =>
      _.omit(item, ...OMITTED_FROM_SEARCH)
    );

    return {
      cursors: hasNext && {
        after: this._hashIds.encode(
          offset + length,
          length,
          SORTING.indexOf(sorting)
        ),
      },
      items,
      total: USERS.length,
    };
  }

  /**
   * Decodes paging cursors and retrieves next page of results
   *
   * @param {String} cursor
   *
   * @return {Object} { cursors, items, total }
   */
  scroll(cursor) {
    let [offset, length, sortingIdx] = this._hashIds.decode(cursor);

    // Only run a search if we're able to decode cursor correctly!
    if (!_.isUndefined(offset)) {
      let sorting = SORTING[sortingIdx];

      return this.search({ sorting, length, offset });
    }
  }

  /**
   * Returns an array of full profiles matching ids
   *
   * @param {String|Array} ids
   *
   * @return {Array}
   */
  getFullProfilesByIds(ids) {
    const items = _(ids)
      .castArray()
      .map((id) => USERS_BY_ID[id])
      .compact()
      .map((item) => _.omit(item, OMITTED_FROM_PROFILES))
      .shuffle()
      .value();

      return items;
  }
}


// export a single instance :)
module.exports = new UsersService();
