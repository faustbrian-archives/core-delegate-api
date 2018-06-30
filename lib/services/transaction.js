'use strict'

/**
 * This file is part of Ark Core - Delegate API.
 *
 * (c) ArkX <hello@arkx.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const container = require('@arkecosystem/core-container')
const database = container.resolvePlugin('database')
const delegateService = require('./delegate')
const blockService = require('./block')

class TransactionService {
    async all (delegate) {
        delegate = delegateService.findById(delegate)

        return database.query
            .select('*')
            .from('transactions')
            .where('senderPublicKey', delegate.publicKey)
            .orWhere('recipientId', delegate.address)
            .all()
    }

    async findById (delegate, id) {
        delegate = delegateService.findById(delegate)

        return database.query
            .select('*')
            .from('transactions')
            .where('id', id)
            .where('senderPublicKey', delegate.publicKey)
            .orWhere('recipientId', delegate.address)
            .first()
    }

    async findByBlock (delegate, id) {
        delegate = delegateService.findById(delegate)

        return database.query
            .select('*')
            .from('transactions')
            .where('blockId', id)
            .andWhere('senderPublicKey', delegate.publicKey)
            .orWhere('recipientId', delegate.address)
            .all()
    }

    async findByWallet (id, delegate = false) {
        if (delegate) {
            id = delegateService.findById(id)
        }

        return database.query
            .select('*')
            .from('transactions')
            .where('senderPublicKey', id)
            .orWhere('recipientId', id)
            .all()
    }

    async findBySender (id) {
        return database.query
            .select('*')
            .from('transactions')
            .where('senderPublicKey', id)
            .all()
    }

    async findByRecipient (id) {
        return database.query
            .select('*')
            .from('transactions')
            .where('recipientId', id)
            .all()
    }

    async forged (delegate) {
        delegate = delegateService.findById(delegate)

        const ids = await blockService.ids(delegate.publicKey)

        return database.query
            .select('*')
            .from('transactions')
            .whereIn('blockId', ids)
            .all()
    }
}

module.exports = new TransactionService()