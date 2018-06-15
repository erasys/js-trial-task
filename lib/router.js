
'use strict';

let _ = require('lodash');
let Router = require('express').Router;

let usersService = require('./users-service');


module.exports = new Router()
  /**
   * Usage:
   *
   * GET /search?length=10
   * GET /search?length=10&sorting=[DISTANCE|ACTIVITY]
   *
   * For paging through prior search results:
   * GET /search?cursor=__cursor__
   */
  .get('/search', (req, res) => {
    let { cursor, sorting = 'DISTANCE', length = 32 } = req.query;

    if (cursor) {
      let page = usersService.scroll(cursor);

      if (_.isUndefined(page)) {
        return res
          .status(400)
          .json({ error_code: 'ARGUMENT_INVALID', message: `Invalid parameter cursor=${cursor}` });
      }

      return res.json( page );  
    }

    if (sorting !== 'DISTANCE' && sorting !== 'ACTIVITY') {
      return res
        .status(400)
        .json({ error_code: 'ARGUMENT_INVALID', message: `Unsupported parameter sorting=${sorting}` });
    }

    res.json( usersService.search({ sorting, length }) );
  })

  /**
   * Usage:
   * 
   * GET /profiles?ids[]=...
   */
  .get('/profiles', (req, res) => {
    let { ids } = req.query;

    if (_.isUndefined(ids)) {
      return res
        .status(400)
        .json({ error_code: 'ARGUMENT_INVALID', message: 'Missing mandatory parameter: ids' });
    }

    res.json( usersService.getFullProfilesByIds(ids) );
  });
